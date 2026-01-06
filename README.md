\# 🧒 Malnutrition Detection System using Image \& Numeric Analysis



A machine-learning–based application that helps parents and healthcare workers \*\*identify child malnutrition early\*\* using a combination of \*\*image analysis\*\* and \*\*numeric health indicators\*\*.



The system is designed for children \*\*below 5 years of age\*\* and follows a \*\*two-step clinical workflow\*\*.



---



\## 📌 Project Overview



Malnutrition in children often goes undetected until it becomes severe.  

This project provides a \*\*simple, accessible, and automated solution\*\* to assist in early screening.



\### 🔹 Key Idea

1\. \*\*Image-based screening\*\* identifies whether a child appears \*Healthy\* or \*Malnourished\*

2\. \*\*Numeric assessment\*\* (only if malnourished) classifies the condition as:

&nbsp;  - Stunted

&nbsp;  - Wasted

&nbsp;  - Underweight

&nbsp;  - Overweight

&nbsp;  - Acute malnutrition (MUAC-based)



---



\## 🛠️ Tech Stack



\### Backend

\- \*\*Python\*\*

\- \*\*FastAPI\*\*

\- \*\*TensorFlow / Keras\*\*

\- \*\*NumPy\*\*

\- \*\*Pydantic\*\*



\### Frontend

\- \*\*HTML\*\*

\- \*\*CSS\*\*

\- \*\*JavaScript\*\*



\### Machine Learning

\- Image classification using \*\*EfficientNet\*\*

\- Numeric assessment using \*\*WHO-based rules (BMI, height-for-age, weight-for-age, MUAC)\*\*



---



\## 🔄 System Workflow



\### Step 1: Image Prediction

\- User uploads an image of the child

\- ML model predicts:

&nbsp; - \*\*Healthy\*\* → process ends

&nbsp; - \*\*Malnourished\*\* → numeric input form appears



\### Step 2: Numeric Assessment

User enters:

\- Age (months)

\- Gender

\- Height (cm)

\- Weight (kg)

\- MUAC (optional)



The system outputs:

\- Primary nutritional condition

\- Severity (Normal / Moderate / Severe)

\- BMI

\- Detailed breakdown

\- Personalized health recommendations



---





> ⚠️ Datasets, trained models, and virtual environments are intentionally excluded from GitHub.



---



\## 🚀 How to Run the Project



\### 1️⃣ Backend API



```bash

cd backend\_api

python -m venv clean\_backend

clean\_backend\\Scripts\\activate

pip install -r requirements.txt

uvicorn main:app --reload







