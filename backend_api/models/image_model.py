# import tensorflow as tf
# from tensorflow.keras.applications.efficientnet import preprocess_input
# from tensorflow.keras.preprocessing.image import img_to_array
import tensorflow as tf
from keras.applications.efficientnet import preprocess_input
from keras.utils import img_to_array

from PIL import Image
import numpy as np

# Load trained model
model = tf.keras.models.load_model("saved_model/best_model_tf")

IMG_SIZE = 224

def predict_image(image: Image.Image):
    # Resize image
    print(">>> USING CORRECT IMAGE MODEL <<<")
    image = image.resize((IMG_SIZE, IMG_SIZE))
    img_array = img_to_array(image)
    img_array = preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    # Prediction
    pred = model.predict(img_array)[0][0]

    # FIXED MAPPING (based on your reversed output)
    if pred < 0.5:
        return "Healthy"
    else:
        return "Malnourished"

