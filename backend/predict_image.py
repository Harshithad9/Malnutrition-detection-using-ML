# from tensorflow.keras.models import load_model
# import numpy as np
# import cv2

# MODEL = load_model("saved_model/best_model.keras")

# def predict_image(image_path):
#     img = cv2.imread(image_path)

#     if img is None:
#         return "Error: Image not found"

#     img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#     img = cv2.resize(img, (224, 224))
#     img = img.astype("float32") / 255.0
#     img = np.expand_dims(img, axis=0)

#     pred = MODEL.predict(img)[0][0]
#     print("Raw Prediction Score =", pred)

#     if pred >= 0.5:
#         return "Malnourished"
#     else:
#         return "Healthy"
import numpy as np
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input

MODEL = load_model("saved_model/best_model.keras")

def predict_image(image_path):

    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    x = np.expand_dims(img, axis=0)
    x = preprocess_input(x)

    score = MODEL.predict(x)[0][0]

    print("Raw Prediction Score =", score)

    if score >= 0.55:      # <-- slightly increased threshold for better accuracy
        return "Malnourished"
    else:
        return "Healthy"