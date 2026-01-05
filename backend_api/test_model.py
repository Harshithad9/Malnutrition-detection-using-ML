# import tensorflow as tf

# model = tf.keras.models.load_model("saved_model/best_model.keras")
# model.save("saved_model/best_model_tf", save_format="tf")

# print("MODEL LOADED SUCCESSFULLY")



import tensorflow as tf

print("TensorFlow imported successfully!")

model = tf.keras.models.load_model("saved_model/best_model_tf")
print("MODEL LOADED SUCCESSFULLY")
