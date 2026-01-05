import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.efficientnet import EfficientNetB0, preprocess_input
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from sklearn.utils.class_weight import compute_class_weight
import numpy as np
import os

IMG_SIZE = 224
BATCH_SIZE = 16
EPOCHS = 20

train_path = "dataset/train"
val_path   = "dataset/val"

train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    rotation_range=25,
    zoom_range=0.25,
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input
)

train_gen = train_datagen.flow_from_directory(
    train_path,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="binary"
)

val_gen = val_datagen.flow_from_directory(
    val_path,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="binary"
)

print("Class Indices:", train_gen.class_indices)

# Compute class weights
labels = train_gen.classes
class_weights = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(labels),
    y=labels
)
class_weights = {i: w for i, w in enumerate(class_weights)}
print("Class Weights:", class_weights)

# Build model
base = EfficientNetB0(
    weights='imagenet',
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

base.trainable = False

x = GlobalAveragePooling2D()(base.output)
x = Dropout(0.4)(x)
output = Dense(1, activation="sigmoid")(x)

model = Model(inputs=base.input, outputs=output)

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-3),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

print("\n🚀 Training Model (Stage 1)...")
model.fit(
    train_gen,
    epochs=10,
    validation_data=val_gen,
    class_weight=class_weights
)

# Fine-tune deeper layers
base.trainable = True
for layer in base.layers[:-20]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-5),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

print("\n🔥 Fine-tuning Model (Stage 2)...")
model.fit(
    train_gen,
    epochs=10,
    validation_data=val_gen,
    class_weight=class_weights
)

# Save model
os.makedirs("saved_model", exist_ok=True)
model.save("saved_model/best_model_tf", save_format="tf")
model.save("saved_model/best_model.keras", save_format="keras")

print("\n🎉 Model saved successfully in both TF and Keras formats!")
