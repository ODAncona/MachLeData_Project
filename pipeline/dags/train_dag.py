from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
import mlflow
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score


def train_model():
    mlflow.set_tracking_uri("http://my-mlflow-tracking:80")
    mlflow.set_experiment("iris_experiment")

    data = pd.read_csv("gs://your-bucket-name/iris.csv")
    X = data.drop("species", axis=1)
    y = data["species"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    model = LogisticRegression()
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    with mlflow.start_run():
        mlflow.log_metric("accuracy", accuracy)
        mlflow.sklearn.log_model(model, "model")


with DAG(
    "train", start_date=datetime(2024, 11, 15), schedule_interval=None
) as dag:
    train_task = PythonOperator(
        task_id="train_model", python_callable=train_model
    )
