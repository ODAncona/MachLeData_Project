from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
import mlflow


def save_new_model():
    # Logic to fetch models and compare metrics
    pass


with DAG(
    "saveNewModel", start_date=datetime(2024, 11, 15), schedule_interval=None
) as dag:
    save_model_task = PythonOperator(
        task_id="save_new_model", python_callable=save_new_model
    )
