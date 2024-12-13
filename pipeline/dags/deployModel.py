from datetime import datetime
from airflow import DAG
from airflow.models import Variable
from airflow.operators.python import PythonOperator
from mlflow.tracking.client import MlflowClient
from kubernetes import client, config

MODEL_NAME = "iris-logistic-regression"
K8S_NAMESPACE = "mlflow-kserve"
K8S_DEPLOYMENT_NAME = "iris-logistic-regression-inference"

IP_MLFLOW = Variable.get("IP_MLFLOW")


def deploy_model_to_k8s():
    # Charger la configuration Kubernetes depuis le cluster
    config.load_incluster_config()

    # Récupérer la dernière version du modèle depuis le Model Registry MLflow
    mlflow_client = MlflowClient(tracking_uri=IP_MLFLOW)
    latest_version = mlflow_client.get_latest_versions(
        MODEL_NAME, stages=["Production"]
    )[-1]
    model_version = latest_version.version

    # Obtenir l'URI du modèle (doit être un storageUri accessible par Kubernetes)
    model_uri = mlflow_client.get_model_version_download_uri(
        MODEL_NAME, model_version
    )
    print(f"Latest model URI: {model_uri}")

    # Configurer le client Kubernetes pour modifier ou créer le déploiement
    apps_v1 = client.AppsV1Api()

    # Définir ou mettre à jour le déploiement Kubernetes
    deployment = {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {"name": K8S_DEPLOYMENT_NAME, "namespace": K8S_NAMESPACE},
        "spec": {
            "replicas": 3,  # Nombre de pods pour servir l'inférence
            "selector": {"matchLabels": {"app": K8S_DEPLOYMENT_NAME}},
            "template": {
                "metadata": {"labels": {"app": K8S_DEPLOYMENT_NAME}},
                "spec": {
                    "containers": [
                        {
                            "name": "inference",
                            "image": "ghcr.io/seldonio/mlserver:latest",  # Utilise MLServer comme serveur
                            "args": [
                                "--model-uri",
                                model_uri,
                                "--protocol",
                                "v2",
                            ],
                            "ports": [{"containerPort": 8080}],
                        }
                    ]
                },
            },
        },
    }

    # Appliquer ou mettre à jour le déploiement
    try:
        existing_deployment = apps_v1.read_namespaced_deployment(
            name=K8S_DEPLOYMENT_NAME, namespace=K8S_NAMESPACE
        )
        apps_v1.patch_namespaced_deployment(
            name=K8S_DEPLOYMENT_NAME, namespace=K8S_NAMESPACE, body=deployment
        )
        print(f"Deployment {K8S_DEPLOYMENT_NAME} updated successfully.")
    except client.exceptions.ApiException as e:
        if e.status == 404:
            apps_v1.create_namespaced_deployment(
                namespace=K8S_NAMESPACE, body=deployment
            )
            print(f"Deployment {K8S_DEPLOYMENT_NAME} created successfully.")
        else:
            raise


with DAG(
    "deploy_model_inference",
    start_date=datetime(2024, 12, 1),
    schedule_interval=None,
) as dag:
    deploy_task = PythonOperator(
        task_id="deploy_model_to_k8s",
        python_callable=deploy_model_to_k8s,
    )
