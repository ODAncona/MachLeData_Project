import librosa
import numpy as np
import tensorflow as tf
import cv2
import moviepy.editor as mp
import os

# Définition des chemins
caracterizer_path = 'weights and id/Caracterizer.keras' # Path to the caracterizer model
video_path = 'data\Jean_Bon\WhatsApp Video 2024-12-02 at 11.46.35.mp4' # Path to the input video
output_path = 'output/user_vector.npy' # Path to the output user vector

# Prétraitement de l'audio
# max_length : longueur maximale des MFCCs, correspond à 2 secondes d'audio
def preprocess_audio(video, n_mfcc=40, max_length=173):
    """Split the audio from the video, extract the MFCCs and pad them to max_length"""
    # Charger l'audio
    audio = video.audio
    # Si l'audio est trop court, le remplir avec du silence
    if audio.duration < 2:
        audio = audio.set_duration(2)
    # Si l'audio est plus long que 2 secondes, ne garder que les 2 premières secondes
    else:
        audio = audio.subclip(0, 2)
    # Manipulation temporaire pour sauvegarder l'audio en .wav, obligatoire pour pouvoir charger avec librosa et extraire les MFCCs
    audio.write_audiofile("temp_audio.wav", logger=None)
    y, sr = librosa.load("temp_audio.wav")
    os.remove("temp_audio.wav")
    # Extraire les MFCCs
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    # Transposer pour avoir la forme (timesteps, features)
    mfccs = mfccs.T
    # Troncature ou padding pour uniformiser la longueur
    if mfccs.shape[0] > max_length:
        mfccs = mfccs[:max_length, :]
    else:
        padding = max_length - mfccs.shape[0]
        mfccs = np.pad(mfccs, ((0, padding), (0, 0)), mode='constant')
    return mfccs
    # La sortie doit être de forme (None, timesteps, features)
    # return mfccs[np.newaxis, ...]

# Prétraitement des frames
def preprocess_frame(video, target_size=(224, 224)):
    """Split the video to only keep the frame after 1sec and return it as an object variable"""
    # If the file is too short, only keep the first frame
    if video.duration < 1:
        frame = video.get_frame(0)
    else:
        # Only keep the frame after 1 second
        frame = video.get_frame(1)
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    # Convert it to the right color space
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    # Redimensionner l'image
    frame = cv2.resize(frame, target_size)
    # Normalisation pour ResNet
    frame = tf.keras.applications.resnet.preprocess_input(frame)
    return frame

# Load the caracterizer and the weights

caracterizer = tf.keras.models.load_model(caracterizer_path)
caracterizer.summary()

# Load the video
video = mp.VideoFileClip(video_path)

# Preprocess the frame and the audio
mfccs = preprocess_audio(video)
# Preprocess the frame
frame = preprocess_frame(video)

# Make the prediction
mfccs = mfccs[np.newaxis, ...]
frame = frame[np.newaxis, ...]
user_vector = caracterizer.predict([mfccs, frame])
print(user_vector)

# Save the user vector in output path
np.save(output_path, user_vector)
print(f"User vector saved at {output_path}")
