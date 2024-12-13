from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.dates import days_ago
from google.cloud import storage


def upload_to_gcs(
    file_path: str, bucket_name: str, destination_blob_name: str
) -> None:
    """
    Uploads a file to Google Cloud Storage.

    Parameters
    ----------
    file_path : str
        Path to the file that needs to be uploaded.
    bucket_name : str
        Name of the GCS bucket where the file will be uploaded.
    destination_blob_name : str
        Destination path in the GCS bucket.

    Raises
    ------
    google.cloud.exceptions.GoogleCloudError
        If there is an issue with the GCS operation.
    """
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(file_path)
    print(f"Uploaded {file_path} to {bucket_name}/{destination_blob_name}")


with DAG(
    dag_id="updateDataset",
    start_date=days_ago(0),  # Dynamically trigger the DAG as soon as it's added
    schedule_interval=None,  # Manual trigger or API trigger only
    catchup=False,  # Do not backfill
) as dag:
    upload_task = PythonOperator(
        task_id="upload_to_gcs",
        python_callable=upload_to_gcs,
        op_args=[
            "path_to_iris_dataset/iris.csv",
            "bucket-video-storage",
            "iris/iris.csv",
        ],
    )
