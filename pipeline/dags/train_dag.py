from datetime import datetime

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.models import Variable

import mlflow

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.datasets import load_iris


IP_MLFLOW = Variable.get("IP_MLFLOW")


def train_model():
    mlflow.set_tracking_uri(f"http://{IP_MLFLOW}:80")
    mlflow.set_experiment("my_first_airflow_experiment")

    X, y = load_iris(return_X_y=True, as_frame=True)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    model = LogisticRegression()
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    with mlflow.start_run() as run:
        mlflow.log_metric("accuracy", accuracy)
        mlflow.sklearn.log_model(model, "model")

        registered_model_name = "iris_logistic_regression"
        model_uri = f"runs:/{run.info.run_id}/model"

        mlflow.register_model(model_uri=model_uri, name=registered_model_name)


with DAG(
    "train_iris", start_date=datetime(2024, 11, 15), schedule_interval=None
) as dag:
    train_task = PythonOperator(
        task_id="train_model", python_callable=train_model
    )
