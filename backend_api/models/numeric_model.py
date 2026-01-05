# def predict_numeric(age_months, gender, height_cm, weight_kg, muac_cm):

#     # ------------------ BMI ------------------
#     height_m = height_cm / 100
#     bmi = round(weight_kg / (height_m * height_m), 1)

#     # ---- WASTING / OVERWEIGHT using BMI (Weight-for-height) ----
#     if bmi < 14:
#         wasting_status = "Severe Wasting"
#     elif bmi < 16:
#         wasting_status = "Moderate Wasting"
#     elif bmi > 18.5:
#         wasting_status = "Overweight"
#     else:
#         wasting_status = "Normal"

#     # ------------------ STUNTING (Height-for-age) ------------------
#     expected_height = (age_months * 0.54) + 65
#     if height_cm < expected_height - 5:
#         stunting_status = "Stunted"
#     else:
#         stunting_status = "Normal"

#     # ------------------ UNDERWEIGHT (Weight-for-age) ------------------
#     expected_weight = (age_months * 0.25) + 7
#     if weight_kg < expected_weight - 2:
#         underweight_status = "Underweight"
#     else:
#         underweight_status = "Normal"

#     # ------------------ MUAC (Acute Malnutrition) ------------------
#     if muac_cm < 11.5:
#         muac_status = "Severe Acute Malnutrition (SAM)"
#     elif muac_cm < 12.5:
#         muac_status = "Moderate Acute Malnutrition (MAM)"
#     else:
#         muac_status = "Normal"

#     # ------------------ Final Condition ------------------
#     conditions = []

#     if stunting_status != "Normal":
#         conditions.append(stunting_status)

#     if wasting_status != "Normal":
#         conditions.append(wasting_status)

#     if underweight_status != "Normal":
#         conditions.append(underweight_status)

#     if muac_status != "Normal":
#         conditions.append(muac_status)

#     if len(conditions) == 0:
#         final_status = "Healthy"
#         final_condition = "No Malnutrition"
#     else:
#         final_status = "Malnourished"
#         final_condition = " + ".join(conditions)

#     # ------------------ Recommendations ------------------
#     if final_status == "Healthy":
#         recommendations = [
#             "Continue balanced diet.",
#             "Encourage outdoor play.",
#             "Monitor growth every 3 months."
#         ]
#     else:
#         recommendations = [
#             "Increase protein intake (egg, dal, milk).",
#             "Add calorie-dense foods (banana, groundnut).",
#             "Provide green leafy vegetables.",
#             "Give ORS if weakness appears.",
#             "Consult a pediatric nutritionist."
#         ]

#     # ------------------ Return Response ------------------
#     return {
#         "BMI": bmi,
#         "Wasting_status": wasting_status,
#         "Stunting_status": stunting_status,
#         "Underweight_status": underweight_status,
#         "MUAC_status": muac_status,
#         "Final_condition": final_condition,
#         "Final_status": final_status,
#         "Recommendations": recommendations
#     }


import math

# --------------------------------------------------
# Z-score calculation (WHO LMS method)
# --------------------------------------------------
def calculate_zscore(value, L, M, S):
    if L == 0:
        return math.log(value / M) / S
    return ((value / M) ** L - 1) / (L * S)


# --------------------------------------------------
# Z-score classification
# --------------------------------------------------
def classify_zscore(z):
    if z < -3:
        return "Severe"
    elif z < -2:
        return "Moderate"
    elif z < -1:
        return "Mild"
    else:
        return "Normal"


# --------------------------------------------------
# MUAC classification (OPTIONAL)
# --------------------------------------------------
def classify_muac(muac):
    if muac is None:
        return "Not Provided"
    if muac < 11.5:
        return "Severe"
    elif muac < 12.5:
        return "Moderate"
    else:
        return "Normal"


# --------------------------------------------------
# Detect TYPE of malnutrition (project-aligned)
# --------------------------------------------------
def detect_primary_condition(haz, waz, whz, baz):
    conditions = []

    if haz < -2:
        conditions.append("Stunted")
    if whz < -2:
        conditions.append("Wasted")
    if waz < -2:
        conditions.append("Underweight")
    if baz > 2:
        conditions.append("Overweight")

    if not conditions:
        return "Normal Growth"

    return " and ".join(conditions)


# --------------------------------------------------
# Determine overall SEVERITY (secondary output)
# --------------------------------------------------
def derive_severity(haz, waz, whz, muac):
    severities = []

    for z in [haz, waz, whz]:
        if z < -3:
            severities.append("Severe")
        elif z < -2:
            severities.append("Moderate")
        elif z < -1:
            severities.append("Mild")

    if muac is not None:
        if muac < 11.5:
            severities.append("Severe")
        elif muac < 12.5:
            severities.append("Moderate")

    if "Severe" in severities:
        return "Severe"
    elif "Moderate" in severities:
        return "Moderate"
    elif "Mild" in severities:
        return "Mild"
    else:
        return "Normal"


# --------------------------------------------------
# MAIN NUMERIC PREDICTION FUNCTION
# --------------------------------------------------
def predict_numeric(age_months, gender, height_cm, weight_kg, muac_cm=None):
    """
    Numeric diagnosis model
    Called ONLY if image model says 'Malnourished'
    MUAC is optional
    """

    # ---------------------------
    # INPUT VALIDATION (IMPORTANT)
    # ---------------------------
    if age_months < 0:
        raise ValueError("Age must be zero or greater")

    if height_cm <= 0:
        raise ValueError("Height must be greater than 0 cm")

    if weight_kg <= 0:
        raise ValueError("Weight must be greater than 0 kg")

    # ---------------------------
    # WHO LMS VALUES (PLACEHOLDERS)
    # Replace with real WHO tables if available
    # ---------------------------
    HAZ_L, HAZ_M, HAZ_S = 1, 85, 0.04
    WAZ_L, WAZ_M, WAZ_S = 1, 12, 0.08
    WHZ_L, WHZ_M, WHZ_S = 1, 0.09, 0.09
    BAZ_L, BAZ_M, BAZ_S = 1, 16, 0.1

    # ---------------------------
    # Z-score calculations
    # ---------------------------
    HAZ = calculate_zscore(height_cm, HAZ_L, HAZ_M, HAZ_S)
    WAZ = calculate_zscore(weight_kg, WAZ_L, WAZ_M, WAZ_S)
    WHZ = calculate_zscore(weight_kg / height_cm, WHZ_L, WHZ_M, WHZ_S)

    height_m = height_cm / 100
    bmi = round(weight_kg / (height_m ** 2), 2)

    BAZ = calculate_zscore(bmi, BAZ_L, BAZ_M, BAZ_S)

    # ---------------------------
    # Classifications
    # ---------------------------
    haz_status = classify_zscore(HAZ)
    waz_status = classify_zscore(WAZ)
    whz_status = classify_zscore(WHZ)
    baz_status = classify_zscore(BAZ)
    muac_status = classify_muac(muac_cm)

    # ---------------------------
    # PRIMARY CONDITION (USER-FACING)
    # ---------------------------
    primary_condition = detect_primary_condition(HAZ, WAZ, WHZ, BAZ)

    # ---------------------------
    # SEVERITY (SECONDARY)
    # ---------------------------
    severity = derive_severity(HAZ, WAZ, WHZ, muac_cm)

    # ---------------------------
    # RECOMMENDATIONS
    # ---------------------------
    recommendations = []

    if primary_condition == "Normal Growth":
        recommendations.extend([
            "Continue a balanced diet including cereals, pulses, fruits, and vegetables.",
            "Ensure age-appropriate meal frequency and portion sizes.",
            "Monitor the child’s growth regularly using height and weight charts."
        ])

    if "Stunted" in primary_condition:
        recommendations.extend([
            "Improve long-term nutrition with protein-rich foods such as eggs, milk, and pulses.",
            "Ensure adequate micronutrients like iron, zinc, and calcium.",
            "Maintain consistent nutritious meals to support height growth."
        ])

    if "Wasted" in primary_condition:
        recommendations.extend([
            "Increase calorie intake using energy-dense foods such as porridge with oil or peanut paste.",
            "Provide frequent small meals throughout the day.",
            "Monitor weight regularly to track recovery."
        ])

    if "Underweight" in primary_condition:
        recommendations.extend([
            "Ensure the child receives three main meals and two healthy snacks daily.",
            "Include nutrient-rich foods such as milk, eggs, and legumes.",
            "Reduce illness exposure by maintaining hygiene and safe drinking water."
        ])

    if "Overweight" in primary_condition:
        recommendations.extend([
            "Encourage balanced meals with fruits and vegetables.",
            "Limit sugary and processed foods.",
            "Promote regular physical activity appropriate for the child’s age."
        ])

    if muac_cm is not None and muac_status in ["Moderate", "Severe"]:
        recommendations.append(
            "MUAC indicates acute malnutrition; medical evaluation is strongly recommended."
        )

    # ---------------------------
    # FINAL RESPONSE (HYBRID MODEL)
    # ---------------------------
    return {
        "Primary_condition": primary_condition,
        "Severity": severity,

        "Details": {
            "Stunting": haz_status,
            "Wasting": whz_status,
            "Underweight": waz_status,
            "Overweight": baz_status,
            "MUAC": muac_status
        },

        "BMI": bmi,
        "Recommendations": recommendations
    }
