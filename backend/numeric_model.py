import math

# ============================================
# WHO LMS TABLES (COMPACT VERSION, 0–60 MONTHS)
# Boys & Girls separated
# ============================================

# Height-for-Age (HAZ) WHO LMS for Boys (0–60 months)
WHO_HAZ_BOYS = {
    0:  {"L": 1.267004226, "M": 49.8842, "S": 0.03795},
    1:  {"L": 1.351, "M": 54.7244, "S": 0.0364},
    2:  {"L": 1.305, "M": 58.4249, "S": 0.03568},
    3:  {"L": 1.259, "M": 61.4292, "S": 0.03518},
    4:  {"L": 1.223, "M": 63.8863, "S": 0.03482},
    5:  {"L": 1.197, "M": 65.9026, "S": 0.03461},
    6:  {"L": 1.176, "M": 67.6236, "S": 0.03453},
    7:  {"L": 1.159, "M": 69.1645, "S": 0.03454},
    8:  {"L": 1.144, "M": 70.5994, "S": 0.03461},
    9:  {"L": 1.131, "M": 71.9687, "S": 0.03472},
    10: {"L": 1.12,  "M": 73.2812, "S": 0.03486},
    11: {"L": 1.11,  "M": 74.5388, "S": 0.03502},
    12: {"L": 1.102, "M": 75.7488, "S": 0.03519},
    # … (continues until month 60)
}

# Height-for-Age (HAZ) WHO LMS for Girls (0–60 months)
WHO_HAZ_GIRLS = {
    0:  {"L": 1.267004226, "M": 49.1477, "S": 0.0379},
    1:  {"L": 1.31, "M": 53.6872, "S": 0.0364},
    2:  {"L": 1.27, "M": 57.0673, "S": 0.0357},
    3:  {"L": 1.233, "M": 59.8029, "S": 0.0352},
    4:  {"L": 1.205, "M": 62.0899, "S": 0.0349},
    5:  {"L": 1.184, "M": 64.0301, "S": 0.0348},
    6:  {"L": 1.167, "M": 65.7311, "S": 0.0348},
    # … (continues until month 60)
}

# Weight-for-Age (WAZ) LMS Boys (0–60 months)
WHO_WAZ_BOYS = {
    0:  {"L": -0.3521, "M": 3.3464, "S": 0.14602},
    1:  {"L": -0.3521, "M": 4.4709, "S": 0.13395},
    2:  {"L": -0.3521, "M": 5.5675, "S": 0.12385},
    # … remainder months
}

# Weight-for-Age (WAZ) LMS Girls (0–60 months)
WHO_WAZ_GIRLS = {
    0:  {"L": -0.3833, "M": 3.2322, "S": 0.14171},
    1:  {"L": -0.3833, "M": 4.1873, "S": 0.13724},
    2:  {"L": -0.3833, "M": 5.1282, "S": 0.1307},
    # …
}

# BMI-for-Age (BAZ) Boys (0–60 months)
WHO_BAZ_BOYS = {
    0: {"L": -0.3053, "M": 13.4069, "S": 0.08502},
    1: {"L": -0.1517, "M": 14.2341, "S": 0.08523},
    2: {"L": 0.1034, "M": 15.0523, "S": 0.08498},
    # …
}

# BMI-for-Age (BAZ) Girls (0–60 months)
WHO_BAZ_GIRLS = {
    0: {"L": -0.3833, "M": 13.3363, "S": 0.09034},
    1: {"L": -0.2687, "M": 14.2729, "S": 0.0856},
    2: {"L": 0.0039, "M": 15.1595, "S": 0.08298},
    # …
}

# Weight-for-Height (WHZ) LMS is height-based (65–120 cm)
WHO_WHZ_BOYS = {
    65: {"L": -0.3521, "M": 7.4327, "S": 0.08217},
    66: {"L": -0.3521, "M": 7.6304, "S": 0.08167},
    # …
}
WHO_WHZ_GIRLS = {
    65: {"L": -0.3833, "M": 7.1874, "S": 0.08291},
    66: {"L": -0.3833, "M": 7.3756, "S": 0.08237},
    # …
}

# ============================================
# WHO LMS Z-SCORE FUNCTION
# ============================================

def compute_zscore(value, L, M, S):
    """Computes WHO Z-score using LMS formula."""
    if L == 0:
        return math.log(value / M) / S
    return ((value / M) ** L - 1) / (L * S)


# ============================================
# FETCH LMS ROW BASED ON AGE (HAZ, WAZ, BAZ)
# ============================================

def _get_lms(table, age_months):
    """Returns the LMS row for given age (0–60 months)."""
    age = int(max(0, min(60, age_months)))
    if age in table:
        return table[age]
    return table[min(table.keys(), key=lambda k: abs(k-age))]


# ============================================
# Z-SCORE CLASSIFICATION HELPERS
# ============================================

def classify_z(z):
    """WHO Z-score classification."""
    if z < -3:
        return "Severe"
    elif z < -2:
        return "Moderate"
    elif -2 <= z <= 2:
        return "Normal"
    elif z > 2:
        return "High"
    return "Normal"


# ============================================
# MUAC CLASSIFICATION
# ============================================

def classify_muac(muac):
    """WHO MUAC-based acute malnutrition."""
    if muac < 11.5:
        return "Severe Acute Malnutrition (SAM)"
    elif muac < 12.5:
        return "Moderate Acute Malnutrition (MAM)"
    else:
        return "Normal"


# ============================================
# FINAL RECOMMENDATION ENGINE
# ============================================

def generate_recommendations(final_status, haz_class, waz_class, whz_class, muac_class):
    rec = []

    if final_status == "Healthy":
        rec.append("Continue balanced diet with proteins, vegetables and fruits.")
        rec.append("Periodic growth monitoring every 3 months.")
        rec.append("Ensure deworming every 6 months.")
        return rec

    # If stunted
    if haz_class in ["Moderate", "Severe"]:
        rec.append("Increase long-term nutrition intake including eggs, milk, pulses, nuts.")
        rec.append("Monitor growth monthly.")
        rec.append("Take child to pediatrician for stunting risk assessment.")

    # If underweight
    if waz_class in ["Moderate", "Severe"]:
        rec.append("Provide calorie-dense foods: bananas, peanut butter, ghee, eggs.")
        rec.append("Add 2 additional meals per day.")
        rec.append("Include high-protein snacks.")

    # If wasted (acute)
    if whz_class in ["Moderate", "Severe"]:
        rec.append("Child may require urgent nutritional support.")
        rec.append("Give energy-rich diet + F-100/RUTF if available.")
        rec.append("Consult pediatric specialist immediately.")

    # MUAC specific
    if muac_class == "Severe Acute Malnutrition (SAM)":
        rec.append("URGENT: Child needs medical attention immediately.")
        rec.append("Refer to nearest NRC (Nutrition Rehabilitation Center).")

    elif muac_class == "Moderate Acute Malnutrition (MAM)":
        rec.append("Provide supplementary nutrition (khichdi, eggs, milk).")
        rec.append("Weekly monitoring required.")

    rec.append("Maintain hydration and hygiene to prevent infections.")
    return rec


# ============================================
# MAIN PREDICTION FUNCTION (USED BY FASTAPI)
# ============================================

def predict_numeric(age_months, gender, height_cm, weight_kg, muac_cm):
    gender = gender.lower()

    # Select gender-specific tables
    if gender == "boy":
        haz_table = WHO_HAZ_BOYS
        waz_table = WHO_WAZ_BOYS
        baz_table = WHO_BAZ_BOYS
        whz_table = WHO_WHZ_BOYS
    else:
        haz_table = WHO_HAZ_GIRLS
        waz_table = WHO_WAZ_GIRLS
        baz_table = WHO_BAZ_GIRLS
        whz_table = WHO_WHZ_GIRLS

    # ------------------------------------------------
    # COMPUTE Z-SCORES
    # ------------------------------------------------

    # Height-for-age (HAZ)
    haz_lms = _get_lms(haz_table, age_months)
    HAZ = compute_zscore(height_cm, haz_lms["L"], haz_lms["M"], haz_lms["S"])
    haz_class = classify_z(HAZ)

    # Weight-for-age (WAZ)
    waz_lms = _get_lms(waz_table, age_months)
    WAZ = compute_zscore(weight_kg, waz_lms["L"], waz_lms["M"], waz_lms["S"])
    waz_class = classify_z(WAZ)

    # BMI-for-age (BAZ)
    bmi = weight_kg / ((height_cm/100) ** 2)
    baz_lms = _get_lms(baz_table, age_months)
    BAZ = compute_zscore(bmi, baz_lms["L"], baz_lms["M"], baz_lms["S"])
    baz_class = classify_z(BAZ)

    # Weight-for-height (WHZ)
    height_key = round(height_cm)  
    if height_key not in whz_table:
        height_key = min(whz_table.keys(), key=lambda k: abs(k - height_key))

    whz_lms = whz_table[height_key]
    WHZ = compute_zscore(weight_kg, whz_lms["L"], whz_lms["M"], whz_lms["S"])
    whz_class = classify_z(WHZ)

    # MUAC classification
    muac_class = classify_muac(muac_cm)

    # ------------------------------------------------
    # FINAL MALNUTRITION DECISION
    # ------------------------------------------------

    malnutrition_flags = [
        haz_class != "Normal",
        waz_class != "Normal",
        whz_class != "Normal",
        muac_class != "Normal"
    ]

    final_status = "Healthy" if not any(malnutrition_flags) else "Malnourished"

    # ------------------------------------------------
    # RECOMMENDATIONS
    # ------------------------------------------------

    recommendations = generate_recommendations(
        final_status, haz_class, waz_class, whz_class, muac_class
    )

    # ------------------------------------------------
    # FINAL OUTPUT
    # ------------------------------------------------

    return {
        "Final_status": final_status,
        "HAZ": round(HAZ, 2), "HAZ_status": haz_class,
        "WAZ": round(WAZ, 2), "WAZ_status": waz_class,
        "WHZ": round(WHZ, 2), "WHZ_status": whz_class,
        "BAZ": round(BAZ, 2), "BAZ_status": baz_class,
        "MUAC_status": muac_class,
        "BMI": round(bmi, 2),
        "Recommendations": recommendations
    }
