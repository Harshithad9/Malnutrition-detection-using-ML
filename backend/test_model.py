import tensorflow as tf

model = tf.keras.models.load_model("saved_model/best_model.keras")
model.save("saved_model/best_model_tf", save_format="tf")

print("MODEL CONVERTED SUCCESSFULLY")
