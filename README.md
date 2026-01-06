# 🧒 Child Malnutrition Detection System

A machine learning–based web application that helps identify **child malnutrition** using a **two-step screening process**:  
1. **Image-based analysis**  
2. **Numeric health assessment (WHO-based indicators)**  

Designed for children **below 5 years of age**, this system assists parents and healthcare workers in early malnutrition screening.

---

## 📌 Problem Statement

Child malnutrition is one of the leading causes of poor health and development in children.  
In many cases, early signs go unnoticed due to lack of access to medical screening tools.

This project aims to provide a **simple, accessible, and automated solution** that performs **early malnutrition screening** using computer vision and numeric indicators.

---

## 💡 Solution Overview

The system follows a **conditional clinical workflow**:

### 🔹 Step 1: Image Screening
- User uploads an image of the child
- A trained deep learning model predicts:
  - **Healthy** → No further action required
  - **Malnourished** → Proceed to numeric assessment

### 🔹 Step 2: Numeric Assessment
If malnourished, the user enters:
- Age (in months)
- Gender
- Height (cm)
- Weight (kg)
- MUAC (optional)

The system evaluates:
- **Stunting**
- **Wasting**
- **Underweight / Overweight**
- **Acute malnutrition (MUAC)**

and provides:
- Primary condition
- Severity level
- BMI
- Personalized recommendations
- Downloadable clinical report

---

## 🛠️ Tech Stack

### Backend
- Python
- FastAPI
- TensorFlow / Keras
- NumPy
- Pydantic

### Frontend
- HTML
- CSS
- JavaScript

### Machine Learning
- Image classification using EfficientNet
- Rule-based numeric assessment aligned with WHO guidelines

---

## 🔄 Application Workflow
Image Upload
↓
Image Prediction
↓
Healthy → Stop
Malnourished → Numeric Input
↓
Numeric Assessment
↓
Results + Recommendations + Report


> ⚠️ Datasets, trained models, and virtual environments are excluded from this repository.

---

## 🚀 How to Run the Project

### 1️⃣ Backend API

```bash
cd backend_api
python -m venv clean_backend
clean_backend\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
