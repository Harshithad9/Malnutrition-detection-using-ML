from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models.image_model import predict_image
from models.numeric_model import predict_numeric
from PIL import Image
import io

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all origins
    allow_credentials=True,
    allow_methods=["*"],   # allow all methods
    allow_headers=["*"],   # allow all headers
)


# ---------------------------
# Image API (already done)
# ---------------------------
@app.post("/predict/image")
async def image_api(file: UploadFile = File(...)):
    content = await file.read()
    image = Image.open(io.BytesIO(content)).convert("RGB")
    result = predict_image(image)
    return {"prediction": result}


# ---------------------------
# Numeric API (WHO Z-Scores + MUAC)
# ---------------------------

class NumericInput(BaseModel):
    age_months: int
    gender: str
    height_cm: float
    weight_kg: float
    muac_cm: float


@app.post("/predict/numeric")
async def numeric_api(data: NumericInput):
    result = predict_numeric(
        age_months=data.age_months,
        gender=data.gender,
        height_cm=data.height_cm,
        weight_kg=data.weight_kg,
        muac_cm=data.muac_cm
    )
    return result
