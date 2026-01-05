def predict_numeric(age, height, weight, muac):

    height_m = height / 100
    bmi = round(weight / (height_m * height_m), 1)

    if bmi < 14:
        bmi_status = "Severely Underweight"
    elif bmi < 16:
        bmi_status = "Underweight"
    elif bmi < 18.5:
        bmi_status = "Normal"
    else:
        bmi_status = "Overweight"

    height_status = "Stunted" if height < (age * 7 + 60) else "Normal"
    weight_status = "Underweight" if weight < (age * 1.5 + 4) else "Normal"

    if bmi_status in ["Severely Underweight", "Underweight"] or height_status == "Stunted":
        final_status = "Malnourished"
    else:
        final_status = "Healthy"

    recommendations = [
        "Provide protein-rich foods.",
        "Give fruits, vegetables daily.",
        "Consult pediatric doctor.",
        "Monitor child growth regularly."
    ]

    return {
        "BMI": bmi,
        "BMI_status": bmi_status,
        "Height_status": height_status,
        "Weight_status": weight_status,
        "Final_status": final_status,
        "Recommendations": recommendations
    }
