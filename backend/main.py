# from fastapi import FastAPI, UploadFile, File
# from pydantic import BaseModel
# from models.image_model import predict_image
# from models.numeric_model import predict_numeric
# from PIL import Image
# import io

# app = FastAPI()

# # ---------------------------
# # Image API (already done)
# # ---------------------------
# @app.post("/predict/image")
# async def image_api(file: UploadFile = File(...)):
#     content = await file.read()
#     image = Image.open(io.BytesIO(content)).convert("RGB")
#     result = predict_image(image)
#     return {"prediction": result}


# # ---------------------------
# # Numeric API (WHO Z-Scores + MUAC)
# # ---------------------------

# class NumericInput(BaseModel):
#     age_months: int
#     gender: str
#     height_cm: float
#     weight_kg: float
#     muac_cm: float


# @app.post("/predict/numeric")
# async def numeric_api(data: NumericInput):
#     result = predict_numeric(
#         age_months=data.age_months,
#         gender=data.gender,
#         height_cm=data.height_cm,
#         weight_kg=data.weight_kg,
#         muac_cm=data.muac_cm
#     )
#     return result


from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from models.image_model import predict_image
from models.numeric_model import predict_numeric
from PIL import Image
import io

app = FastAPI()

# ---------------------------
# Image API
# ---------------------------
@app.post("/predict/image")
async def image_api(file: UploadFile = File(...)):
    content = await file.read()
    image = Image.open(io.BytesIO(content)).convert("RGB")
    result = predict_image(image)
    return {"prediction": result}


# ---------------------------
# Numeric API (Improved Schema)
# ---------------------------
class NumericInput(BaseModel):
    age_months: int = Field(..., ge=0, le=60, example=24)
    gender: str = Field(..., example="female")
    height_cm: float = Field(..., gt=0, example=78.5)
    weight_kg: float = Field(..., gt=0, example=9.2)
    muac_cm: Optional[float] = Field(None, gt=0, example=12.3)


@app.post("/predict/numeric")
async def numeric_api(data: NumericInput):
    try:
        return predict_numeric(
            age_months=data.age_months,
            gender=data.gender,
            height_cm=data.height_cm,
            weight_kg=data.weight_kg,
            muac_cm=data.muac_cm
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
