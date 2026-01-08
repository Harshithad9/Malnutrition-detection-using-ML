const IMAGE_API = "http://127.0.0.1:8000/predict/image"
const NUMERIC_API = "http://127.0.0.1:8000/predict/numeric"

let assessmentData = null

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  document.getElementById("reportDate").textContent = today
  document.getElementById("reportFooterDate").textContent = today

  // Setup drag and drop
  const uploadArea = document.getElementById("uploadArea")
  const fileInput = document.getElementById("childImage")

  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = "var(--primary-light)"
    uploadArea.style.backgroundColor = "rgba(20, 184, 166, 0.05)"
  })

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "var(--border-color)"
    uploadArea.style.backgroundColor = "#FAFBFC"
  })

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = "var(--border-color)"
    uploadArea.style.backgroundColor = "#FAFBFC"
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files
      displayImagePreview(e.dataTransfer.files[0])
    }
  })

  fileInput.addEventListener("change", function (e) {
    if (this.files.length > 0) {
      displayImagePreview(this.files[0])
    }
  })

  showSection("home")

  const modal = document.getElementById("malnutritionModal")
  if (modal) {
    const overlay = modal.querySelector(".modal-overlay")
    if (overlay) {
      overlay.addEventListener("click", closeMalnutritionModal)
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMalnutritionModal()
    }
  })
})

function displayImagePreview(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const previewDiv = document.getElementById("imagePreview")
    const previewImg = document.getElementById("previewImg")
    const uploadLabel = document.getElementById("uploadLabel")
    const uploadArea = document.getElementById("uploadArea")

    previewImg.src = e.target.result
    previewDiv.style.display = "flex"
    uploadLabel.style.display = "none"
    uploadArea.classList.add("has-image")
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  document.getElementById("childImage").value = ""
  document.getElementById("imagePreview").style.display = "none"
  document.getElementById("uploadLabel").style.display = "flex"
  document.getElementById("uploadArea").classList.remove("has-image")
}

function showSection(section) {
  const sections = document.querySelectorAll(".content-section")
  sections.forEach((s) => s.classList.remove("active"))

  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => item.classList.remove("active"))

  if (section === "home") {
    document.getElementById("home-section").classList.add("active")
    navItems[0].classList.add("active")
  } else if (section === "analyze") {
    document.getElementById("analyze-section").classList.add("active")
    navItems[1].classList.add("active")
  } else if (section === "about") {
    document.getElementById("about-section").classList.add("active")
    navItems[2].classList.add("active")
  }
}

async function predictImage() {
  const fileInput = document.getElementById("childImage")
  const resultEl = document.getElementById("imageResult")

  if (!fileInput.files.length) {
    resultEl.textContent = "Please upload an image"
    resultEl.className = "result-message error"
    return
  }

  const formData = new FormData()
  formData.append("file", fileInput.files[0])

  try {
    resultEl.textContent = "Analyzing image..."
    resultEl.className = "result-message"

    const res = await fetch(IMAGE_API, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      throw new Error("Failed to analyze image")
    }

    const data = await res.json()

    if (data.prediction === "Malnourished") {
      resultEl.textContent =
        "⚠️ Visual assessment indicates potential malnutrition. Please proceed to detailed measurements."
      resultEl.className = "result-message error"
      document.getElementById("numericSection").style.display = "block"
      document.getElementById("healthySection").style.display = "none"
      document.getElementById("numericSection").scrollIntoView({ behavior: "smooth" })
    } else {
      resultEl.textContent = ""
      resultEl.className = "result-message success"
      document.getElementById("numericSection").style.display = "none"
      document.getElementById("healthySection").style.display = "block"
      document.getElementById("healthySection").scrollIntoView({ behavior: "smooth" })
    }
  } catch (error) {
    resultEl.textContent = "Error analyzing image. Please try again."
    resultEl.className = "result-message error"
    console.error(error)
  }
}

async function predictNumeric() {
  const age = document.getElementById("age").value
  const height = document.getElementById("height").value
  const weight = document.getElementById("weight").value

  if (!age || !height || !weight) {
    alert("Please fill in all required fields (Age, Height, Weight)")
    return
  }

  const payload = {
    age_months: Number(age),
    gender: document.getElementById("gender").value,
    height_cm: Number(height),
    weight_kg: Number(weight),
    muac_cm: document.getElementById("muac").value ? Number(document.getElementById("muac").value) : null,
  }

  try {
    const res = await fetch(NUMERIC_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      throw new Error("Failed to process assessment")
    }

    const data = await res.json()
    assessmentData = data

    displayResults(data)
    document.getElementById("resultSection").style.display = "block"
    document.getElementById("healthySection").style.display = "none"
    document.getElementById("resultSection").scrollIntoView({ behavior: "smooth" })
  } catch (error) {
    alert("Error processing assessment. Please try again.")
    console.error(error)
  }
}

function displayResults(data) {
  document.getElementById("finalStatus").textContent = data.Primary_condition || "Unknown"
  document.getElementById("severity").textContent = data.Severity || "N/A"
  document.getElementById("bmi").textContent = data.BMI || "N/A"
  document.getElementById("wasting").textContent = data.Wasting_Status || "N/A"
  document.getElementById("stunting").textContent = data.Stunting_Status || "N/A"
  document.getElementById("underweight").textContent = data.Underweight_Status || "N/A"
  document.getElementById("muacStatus").textContent = data.MUAC_Status || "N/A"

  const recommendationsList = document.getElementById("recommendations")
  recommendationsList.innerHTML = ""

  if (data.Recommendations && Array.isArray(data.Recommendations)) {
    data.Recommendations.forEach((rec) => {
      const li = document.createElement("li")
      li.textContent = rec
      recommendationsList.appendChild(li)
    })
  }
}

function resetForm() {
  // Clear all form inputs
  document.getElementById("childImage").value = ""
  document.getElementById("age").value = ""
  document.getElementById("gender").value = "male"
  document.getElementById("height").value = ""
  document.getElementById("weight").value = ""
  document.getElementById("muac").value = ""
  document.getElementById("imageResult").textContent = ""
  document.getElementById("imageResult").className = "result-message"

  // Hide all result sections
  document.getElementById("uploadCard").style.display = "block"
  document.getElementById("numericSection").style.display = "none"
  document.getElementById("healthySection").style.display = "none"
  document.getElementById("resultSection").style.display = "none"

  // Reset image preview
  document.getElementById("imagePreview").style.display = "none"
  document.getElementById("uploadLabel").style.display = "flex"
  document.getElementById("uploadArea").classList.remove("has-image")

  // Scroll to top
  document.getElementById("uploadCard").scrollIntoView({ behavior: "smooth" })
}

function downloadReportPDF() {
  if (!assessmentData) {
    alert("No assessment data available for report generation")
    return
  }

  const element = document.createElement("div")
  element.style.padding = "20px"
  element.style.fontFamily = "Arial, sans-serif"
  element.style.lineHeight = "1.6"

  element.innerHTML = `
    <h1 style="text-align: center; color: #0f766e; margin-bottom: 10px;">NutriScan Assessment Report</h1>
    <p style="text-align: center; color: #666; margin-bottom: 30px;">Intelligent Malnutrition Detection System</p>

    <div style="border-bottom: 2px solid #0f766e; padding-bottom: 20px; margin-bottom: 20px;">
      <h2 style="color: #0f766e; font-size: 16px; margin-bottom: 15px;">Assessment Results</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 50%;">Primary Condition</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${assessmentData.Primary_condition || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Severity Level</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${assessmentData.Severity || "N/A"}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">BMI</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${assessmentData.BMI || "N/A"}</td>
        </tr>
      </table>

      <h2 style="color: #0f766e; font-size: 16px; margin-bottom: 15px;">Clinical Findings</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 50%;">Wasting Status</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${assessmentData.Wasting_Status || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Stunting Status</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${assessmentData.Stunting_Status || "N/A"}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Underweight Status</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${assessmentData.Underweight_Status || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">MUAC Status</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${assessmentData.MUAC_Status || "N/A"}</td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #0f766e; font-size: 16px; margin-bottom: 15px;">Clinical Recommendations</h2>
      <ol style="padding-left: 20px;">
        ${
          assessmentData.Recommendations && Array.isArray(assessmentData.Recommendations)
            ? assessmentData.Recommendations.map((rec) => `<li style="margin-bottom: 8px;">${rec}</li>`).join("")
            : "<li>No recommendations available</li>"
        }
      </ol>
    </div>

    <div style="border-top: 2px solid #0f766e; padding-top: 20px; margin-top: 30px; color: #666; font-size: 12px;">
      <p style="margin: 5px 0;"><strong>Report Generated:</strong> <span id="reportDate"></span></p>
      <p style="margin: 5px 0;"><strong>System:</strong> NutriScan v1.0 - Intelligent Malnutrition Detection System</p>
      <p style="margin: 5px 0; font-style: italic;">This report is for clinical reference only. Professional medical evaluation is recommended for diagnosis and treatment.</p>
    </div>
  `

  const opt = {
    margin: 10,
    filename: `NutriScan_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
  }

  window.html2pdf().set(opt).from(element).save()
}

function openMalnutritionModal() {
  document.getElementById("malnutritionModal").style.display = "flex"
  document.body.style.overflow = "hidden"
}

function closeMalnutritionModal() {
  document.getElementById("malnutritionModal").style.display = "none"
  document.body.style.overflow = "auto"
}
