#!/bin/bash

# Variables pour le compte de service Cloud SQL Auth proxy
export CLOUDSQL_SA_NAME="mlflow-cloudsql-sa"
export CLOUDSQL_SA_KEY_FILE="cloudsql-sa-key.json"

# Namespace Kubernetes (doit correspondre au namespace utilisé lors de l'installation)
export K8S_NAMESPACE="default"

# Fonction pour supprimer le bucket GCS
delete_gcs_bucket() {
  echo "Suppression du bucket Google Cloud Storage..."
  if gsutil ls -b "gs://$GCP_BUCKET_NAME" &> /dev/null; then
    # Supprimer tous les objets dans le bucket
    gsutil -m rm -r "gs://$GCP_BUCKET_NAME/**"
    # Supprimer le bucket
    gsutil rb "gs://$GCP_BUCKET_NAME"
    echo "Le bucket $GCP_BUCKET_NAME a été supprimé."
  else
    echo "Le bucket $GCP_BUCKET_NAME n'existe pas ou a déjà été supprimé."
  fi
}

# Fonction pour supprimer l'instance Cloud SQL PostgreSQL
delete_cloudsql_postgres() {
  echo "Suppression de l'instance Cloud SQL PostgreSQL..."
  if gcloud sql instances describe $DB_INSTANCE_NAME &> /dev/null; then
    gcloud sql instances delete $DB_INSTANCE_NAME --quiet
    echo "L'instance Cloud SQL $DB_INSTANCE_NAME a été supprimée."
  else
    echo "L'instance Cloud SQL $DB_INSTANCE_NAME n'existe pas ou a déjà été supprimée."
  fi
}

# Fonction pour supprimer le compte de service Cloud SQL Auth proxy
delete_cloudsql_service_account() {
  echo "Suppression du compte de service Cloud SQL Auth proxy..."
  SA_EMAIL="$CLOUDSQL_SA_NAME@$GCP_PROJECT_ID.iam.gserviceaccount.com"
  if gcloud iam service-accounts describe $SA_EMAIL &> /dev/null; then
    # Supprimer les clés du compte de service
    KEYS=$(gcloud iam service-accounts keys list --iam-account $SA_EMAIL --format="value(name)")
    for KEY in $KEYS; do
      gcloud iam service-accounts keys delete $KEY --iam-account $SA_EMAIL --quiet
    done
    # Supprimer le compte de service
    gcloud iam service-accounts delete $SA_EMAIL --quiet
    echo "Le compte de service $CLOUDSQL_SA_NAME a été supprimé."
  else
    echo "Le compte de service $CLOUDSQL_SA_NAME n'existe pas ou a déjà été supprimé."
  fi
  # Supprimer le fichier de clé local s'il existe
  if [ -f "$CLOUDSQL_SA_KEY_FILE" ]; then
    rm -f "$CLOUDSQL_SA_KEY_FILE"
    echo "Le fichier de clé $CLOUDSQL_SA_KEY_FILE a été supprimé."
  fi
}

# Fonction pour supprimer les secrets Kubernetes
delete_k8s_secrets() {
  echo "Suppression des secrets Kubernetes..."
  # Liste des secrets à supprimer
  SECRETS=(
    "gcs-credentials"
    "$CLOUDSQL_K8S_SECRET_NAME"
    "$EXISTING_SECRET"
  )
  for SECRET in "${SECRETS[@]}"; do
    if kubectl get secret $SECRET --namespace $K8S_NAMESPACE &> /dev/null; then
      kubectl delete secret $SECRET --namespace $K8S_NAMESPACE
      echo "Le secret $SECRET a été supprimé du namespace $K8S_NAMESPACE."
    else
      echo "Le secret $SECRET n'existe pas ou a déjà été supprimé du namespace $K8S_NAMESPACE."
    fi
  done
}

# Fonction pour supprimer le namespace Kubernetes (optionnel)
delete_k8s_namespace() {
  echo "Suppression du namespace Kubernetes $K8S_NAMESPACE..."
  if kubectl get namespace $K8S_NAMESPACE &> /dev/null; then
    kubectl delete namespace $K8S_NAMESPACE
    echo "Le namespace $K8S_NAMESPACE a été supprimé."
  else
    echo "Le namespace $K8S_NAMESPACE n'existe pas ou a déjà été supprimé."
  fi
}

# Fonction pour supprimer le projet GCP (optionnel)
delete_gcp_project() {
  echo "ATTENTION : Vous êtes sur le point de supprimer le projet GCP $GCP_PROJECT_ID."
  echo "Cette action est irréversible et entraînera la suppression de toutes les ressources associées."
  read -p "Voulez-vous vraiment continuer ? (oui/non) : " CONFIRM
  if [ "$CONFIRM" = "oui" ]; then
    gcloud projects delete $GCP_PROJECT_ID --quiet
    echo "Le projet $GCP_PROJECT_ID a été supprimé."
  else
    echo "Suppression du projet annulée."
  fi
}

# === Exécution des fonctions ===

# Configurer le projet GCP
gcloud config set project $GCP_PROJECT_ID

# Suppression des ressources
delete_k8s_secrets
delete_cloudsql_postgres
delete_cloudsql_service_account
delete_gcs_bucket
# delete_k8s_namespace  # Décommentez cette ligne si vous souhaitez supprimer le namespace Kubernetes
# delete_gcp_project    # Décommentez cette ligne si vous souhaitez supprimer le projet GCP

echo "Toutes les ressources ont été supprimées avec succès."
