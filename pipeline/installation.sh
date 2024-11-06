#!/bin/bash

# Variables pour le compte de service Cloud SQL Auth proxy
export CLOUDSQL_SA_NAME="mlflow-cloudsql-sa"
export CLOUDSQL_SA_KEY_FILE="cloudsql-sa-key.json"
export CLOUDSQL_K8S_SECRET_NAME="cloudsql-instance-credentials"

# Emplacement des credentials par défaut
CREDENTIALS_PATH="${HOME}/.config/gcloud/application_default_credentials.json"

# Vérifier et configurer les credentials
configure_gcloud_credentials() {
  if [ ! -f "$CREDENTIALS_PATH" ]; then
    echo "Authentification requise. Veuillez vous connecter..."
    gcloud auth application-default login
  else
    echo "Fichier de credentials trouvé à $CREDENTIALS_PATH"
  fi
}

# Check account permissions
check_account_permissions() {
  echo "Vérification des permissions du compte sur le projet..."
  ACCOUNT=$(gcloud config get-value account)
  PROJECT_ROLES=$(gcloud projects get-iam-policy $GCP_PROJECT_ID \
    --flatten="bindings[].members" \
    --format='table(bindings.role)' \
    --filter="bindings.members:$ACCOUNT")
  echo "Rôles du compte $ACCOUNT sur le projet $GCP_PROJECT_ID :"
  echo "$PROJECT_ROLES"
}

# Création et configuration du projet GCP
setup_gcp_project() {
  echo "Création du projet GCP et configuration initiale..."
  if ! gcloud projects describe $GCP_PROJECT_ID &> /dev/null; then
    gcloud projects create $GCP_PROJECT_ID
    gcloud config set project $GCP_PROJECT_ID
    echo "Liaison du projet au compte de facturation..."
    gcloud beta billing projects link $GCP_PROJECT_ID --billing-account $GCP_BILLING_ACCOUNT_ID
  else
    echo "Le projet $GCP_PROJECT_ID existe déjà."
    gcloud config set project $GCP_PROJECT_ID
  fi
}

# Création du compte de service pour le Cloud SQL Auth proxy
create_cloudsql_service_account() {
  echo "Création du compte de service pour le Cloud SQL Auth proxy..."
  if ! gcloud iam service-accounts describe $CLOUDSQL_SA_NAME@$GCP_PROJECT_ID.iam.gserviceaccount.com &> /dev/null; then
    gcloud iam service-accounts create $CLOUDSQL_SA_NAME \
      --display-name "Service Account for Cloud SQL Auth Proxy"
    echo "Attribution du rôle 'Cloud SQL Client' au compte de service..."
    gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
      --member "serviceAccount:$CLOUDSQL_SA_NAME@$GCP_PROJECT_ID.iam.gserviceaccount.com" \
      --role "roles/cloudsql.client"
    echo "Téléchargement de la clé du compte de service..."
    gcloud iam service-accounts keys create $CLOUDSQL_SA_KEY_FILE \
      --iam-account $CLOUDSQL_SA_NAME@$GCP_PROJECT_ID.iam.gserviceaccount.com
  else
    echo "Le compte de service $CLOUDSQL_SA_NAME existe déjà."
    if [ ! -f "$CLOUDSQL_SA_KEY_FILE" ]; then
      echo "Téléchargement de la clé du compte de service..."
      gcloud iam service-accounts keys create $CLOUDSQL_SA_KEY_FILE \
        --iam-account $CLOUDSQL_SA_NAME@$GCP_PROJECT_ID.iam.gserviceaccount.com
    else
      echo "La clé du compte de service existe déjà."
    fi
  fi
}

# Configuration de Google Cloud Storage (GCS)
setup_gcs_bucket() {
  echo "Configuration de Google Cloud Storage..."
  if ! gsutil ls -b "gs://$GCP_BUCKET_NAME" &> /dev/null; then
    gsutil mb -l $GCP_BUCKET_LOCATION gs://$GCP_BUCKET_NAME
  else
    echo "Le bucket $GCP_BUCKET_NAME existe déjà."
  fi
}

# Création de la base de données PostgreSQL sur Cloud SQL
setup_cloudsql_postgres() {
  echo "Création de la base de données PostgreSQL sur Google Cloud SQL..."
  if ! gcloud sql instances describe $DB_INSTANCE_NAME &> /dev/null; then
    gcloud sql instances create $DB_INSTANCE_NAME \
      --database-version=POSTGRES_13 \
      --cpu=2 --memory=4096MB \
      --region=$GCP_BUCKET_LOCATION
  else
    echo "L'instance Cloud SQL $DB_INSTANCE_NAME existe déjà."
  fi

  # Configuration de l'utilisateur et de la base de données
  gcloud sql users set-password $DB_USER \
    --instance=$DB_INSTANCE_NAME --password=$DB_PASSWORD

  if ! gcloud sql databases describe $DB_NAME --instance=$DB_INSTANCE_NAME &> /dev/null; then
    gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE_NAME
  else
    echo "La base de données $DB_NAME existe déjà dans l'instance $DB_INSTANCE_NAME."
  fi
}

# Création des secrets Kubernetes
setup_k8s_secrets() {
  echo "Création des secrets Kubernetes pour GCS et la base de données..."

  # Secret pour GCS
  if ! kubectl get secret gcs-credentials &> /dev/null; then
    kubectl create secret generic gcs-credentials \
      --from-file=credentials.json=$CREDENTIALS_PATH
  else
    echo "Le secret Kubernetes gcs-credentials existe déjà."
  fi

  # Secret pour le Cloud SQL Auth proxy
  if ! kubectl get secret $CLOUDSQL_K8S_SECRET_NAME &> /dev/null; then
    kubectl create secret generic $CLOUDSQL_K8S_SECRET_NAME \
      --from-file=credentials.json=$CLOUDSQL_SA_KEY_FILE
  else
    echo "Le secret Kubernetes $CLOUDSQL_K8S_SECRET_NAME existe déjà."
  fi

  # Secret pour les identifiants de la base de données
  if ! kubectl get secret $EXISTING_SECRET &> /dev/null; then
    kubectl create secret generic $EXISTING_SECRET \
      --from-literal=$EXISTING_SECRET_PASSWORD_KEY=$DB_PASSWORD
  else
    echo "Le secret Kubernetes $EXISTING_SECRET existe déjà."
  fi
}

# === Exécution des fonctions ===

# Vérifier et configurer les credentials pour GCS
configure_gcloud_credentials

# Création et configuration du projet et des ressources
setup_gcp_project
check_account_permissions
create_cloudsql_service_account
setup_gcs_bucket
setup_cloudsql_postgres
setup_k8s_secrets

echo "Toutes les ressources ont été créées avec succès."
