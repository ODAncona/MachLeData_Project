import numpy as np
import tensorflow as tf
import json

# Définition des chemins
decoder_path = 'weights and id/Decoder.keras' # Path to the decoder model
user_vector_path = 'output/user_vector.npy' # Path to the user vector
dict_path = 'weights and id\id_to_user.json' # Path to the dictionary to convert the user id to the user name

# Load the model and the weights
decoder = tf.keras.models.load_model(decoder_path)
decoder.summary()

# Load the dictionary to convert the user id to the user name
with open(dict_path) as f:
    id_to_user = json.load(f)
print("id_to_user:", id_to_user)

# Load the user_vector
user_vector = np.load(user_vector_path)

prediction = decoder.predict(user_vector)
print(prediction)
# Get the user from the embeddings
user = id_to_user[str(np.argmax(prediction))]
print("User:", user)

