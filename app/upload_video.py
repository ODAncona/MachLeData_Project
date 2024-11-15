import os
import subprocess
import argparse
from google.cloud import storage
from tqdm import tqdm
import sys

DEFAULT_BUCKET_NAME = "bucket-video-storage"  # Définir le bucket par défaut


def convert_to_mp4(input_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created output directory: {output_dir}")
    else:
        print(f"Output directory already exists: {output_dir}")

    converted_files = []
    for filename in os.listdir(input_dir):
        input_path = os.path.join(input_dir, filename)
        if filename.lower().endswith(".mp4"):
            # Déplacer directement les fichiers MP4 dans le dossier de sortie
            output_path = os.path.join(output_dir, filename)
            if not os.path.exists(output_path):
                print(f"Copying {filename} to output directory...")
                os.system(f"cp '{input_path}' '{output_path}'")
            else:
                print(f"{filename} already exists in output directory.")
            converted_files.append(output_path)
        elif filename.lower().endswith(
            (".avi", ".mov", ".mkv", ".wmv", ".flv", ".mpg", ".mpeg")
        ):
            output_filename = os.path.splitext(filename)[0] + ".mp4"
            output_path = os.path.join(output_dir, output_filename)

            print(
                f"Converting {filename} to MP4 with separate audio and video tracks..."
            )
            subprocess.run(
                [
                    "ffmpeg",
                    "-i",
                    input_path,
                    "-map",
                    "0:v:0",
                    "-map",
                    "0:a:0",
                    "-c:v",
                    "libx264",
                    "-crf",
                    "23",
                    "-preset",
                    "medium",
                    "-c:a",
                    "aac",
                    "-strict",
                    "experimental",
                    output_path,
                ],
                check=True,
            )
            converted_files.append(output_path)
        else:
            print(f"Skipping {filename}: Not a valid video file.")

    if not converted_files:
        print("No valid video files found for conversion or upload.")
    else:
        print("All videos processed.")
    return converted_files


def upload_to_gcs(bucket_name, files, name):
    if not files:
        print("No MP4 files to upload.")
        return

    client = storage.Client()
    bucket = client.bucket(bucket_name)

    for file_path in tqdm(files):
        filename = os.path.basename(file_path)
        # Organize files under name/videos/
        blob = bucket.blob(f"{name}/{filename}")
        print(
            f"Uploading {filename} to GCS bucket {bucket_name} at {name}/videos/..."
        )
        blob.upload_from_filename(file_path)

    print("All MP4 files uploaded to GCS.")


def main():
    parser = argparse.ArgumentParser(
        description="Convert videos to MP4 and upload to GCS."
    )
    parser.add_argument(
        "--input-dir",
        required=True,
        help="Directory containing videos to convert or upload.",
    )
    parser.add_argument(
        "--output-dir",
        required=True,
        help="Directory to save processed MP4 videos.",
    )
    parser.add_argument(
        "--bucket-name",
        help="Google Cloud Storage bucket name. Defaults to 'bucket-video-storage'.",
        default=DEFAULT_BUCKET_NAME,
    )
    parser.add_argument(
        "--name",
        required=True,
        help="Name of the folder inside the bucket to organize videos.",
    )

    args = parser.parse_args()

    input_dir = args.input_dir
    output_dir = args.output_dir
    name = args.name

    if not os.path.exists(input_dir):
        sys.exit(
            "ELLES SONT OU LES VIDEOS? Vérifiez que le répertoire d'entrée existe."
        )

    converted_files = convert_to_mp4(input_dir, output_dir)
    upload_to_gcs(args.bucket_name, converted_files, name)


if __name__ == "__main__":
    main()
