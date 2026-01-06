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
    uploadArea.style.borderColor = "var(--primary-teal)"
    uploadArea.style.backgroundColor = "rgba(27, 156, 252, 0.05)"
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

  // Show home section by default
  showSection("home")
})

function displayImagePreview(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const previewDiv = document.getElementById("imagePreview")
    const previewImg = document.getElementById("previewImg")
    const uploadLabel = document.getElementById("uploadLabel")
    const uploadArea = document.getElementById("uploadArea")

    previewImg.src = e.target.result
    previewDiv.style.display = "block"
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

// IMAGE PREDICTION
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
      document.getElementById("numericSection").scrollIntoView({ behavior: "smooth" })
    } else {
      resultEl.textContent = "✓ Visual assessment shows no obvious signs of malnutrition. No further evaluation needed."
      resultEl.className = "result-message success"
    }
  } catch (error) {
    resultEl.textContent = "Error analyzing image. Please try again."
    resultEl.className = "result-message error"
    console.error(error)
  }
}

// NUMERIC PREDICTION
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

    // Display results
    displayResults(data)
    document.getElementById("resultSection").style.display = "block"
    document.getElementById("resultSection").scrollIntoView({ behavior: "smooth" })
  } catch (error) {
    alert("Error processing assessment. Please try again.")
    console.error(error)
  }
}

function displayResults(data) {
  // Metric cards
  document.getElementById("finalStatus").textContent = data.Primary_condition || "Unknown"
  document.getElementById("severity").textContent = data.Severity || "N/A"
  document.getElementById("bmi").textContent = data.BMI || "N/A"

  // Clinical findings
  document.getElementById("wasting").textContent = data.Details?.Wasting || "N/A"
  document.getElementById("stunting").textContent = data.Details?.Stunting || "N/A"
  document.getElementById("underweight").textContent = data.Details?.Underweight || "N/A"
  document.getElementById("muacStatus").textContent = data.Details?.MUAC || "N/A"

  // Recommendations
  const recList = document.getElementById("recommendations")
  recList.innerHTML = ""
  if (data.Recommendations && Array.isArray(data.Recommendations)) {
    data.Recommendations.forEach((r) => {
      const li = document.createElement("li")
      li.textContent = r
      recList.appendChild(li)
    })
  }

  // Populate hidden report template
  document.getElementById("reportPrimaryCondition").textContent = data.Primary_condition || "Unknown"
  document.getElementById("reportSeverity").textContent = data.Severity || "N/A"
  document.getElementById("reportBMI").textContent = data.BMI || "N/A"
  document.getElementById("reportWasting").textContent = data.Details?.Wasting || "N/A"
  document.getElementById("reportStunting").textContent = data.Details?.Stunting || "N/A"
  document.getElementById("reportUnderweight").textContent = data.Details?.Underweight || "N/A"
  document.getElementById("reportMUAC").textContent = data.Details?.MUAC || "N/A"

  const reportRecList = document.getElementById("reportRecommendations")
  reportRecList.innerHTML = ""
  if (data.Recommendations && Array.isArray(data.Recommendations)) {
    data.Recommendations.forEach((r) => {
      const li = document.createElement("li")
      li.textContent = r
      reportRecList.appendChild(li)
    })
  }
}

// DOWNLOAD PDF REPORT
function downloadReportPDF() {
  if (!assessmentData) return

  // Create a new document element for PDF to ensure proper rendering
  const reportDoc = document.createElement("div")
  reportDoc.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px solid #1b9cfc; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 28px; margin: 0 0 10px 0; color: #1b9cfc;">Malnutrition Assessment Report</h1>
        <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">NutriScan - Intelligent Detection System</p>
        <p style="margin: 0; color: #999; font-size: 12px;">Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
      </div>

      <!-- Executive Summary -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #1b9cfc; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Executive Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="padding: 12px; background-color: #f5f7fa; border-radius: 8px; display: flex; justify-content: space-between;">
            <span style="font-weight: 600; color: #718096;">Primary Condition</span>
            <span style="font-weight: 700; color: #1a202c;">${assessmentData.Primary_condition || "Unknown"}</span>
          </div>
          <div style="padding: 12px; background-color: #f5f7fa; border-radius: 8px; display: flex; justify-content: space-between;">
            <span style="font-weight: 600; color: #718096;">Severity Level</span>
            <span style="font-weight: 700; color: #1a202c;">${assessmentData.Severity || "N/A"}</span>
          </div>
        </div>
      </div>

      <!-- Patient Information -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #1b9cfc; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Patient Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 8px; font-weight: 600; width: 40%; color: #718096;">Age</td>
            <td style="padding: 12px 8px; color: #1a202c;">${document.getElementById("age").value || "-"} months</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 8px; font-weight: 600; color: #718096;">Gender</td>
            <td style="padding: 12px 8px; color: #1a202c;">${document.getElementById("gender").value.charAt(0).toUpperCase() + document.getElementById("gender").value.slice(1) || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 8px; font-weight: 600; color: #718096;">Height</td>
            <td style="padding: 12px 8px; color: #1a202c;">${document.getElementById("height").value || "-"} cm</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 8px; font-weight: 600; color: #718096;">Weight</td>
            <td style="padding: 12px 8px; color: #1a202c;">${document.getElementById("weight").value || "-"} kg</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 8px; font-weight: 600; color: #718096;">MUAC</td>
            <td style="padding: 12px 8px; color: #1a202c;">${document.getElementById("muac").value || "Not provided"} cm</td>
          </tr>
        </table>
      </div>

      <!-- Clinical Measurements -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #1b9cfc; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Clinical Measurements</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 8px; font-weight: 600; width: 40%; color: #718096;">BMI</td>
            <td style="padding: 12px 8px; color: #1a202c;">${assessmentData.BMI || "N/A"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 8px; font-weight: 600; color: #718096;">Wasting</td>
            <td style="padding: 12px 8px; color: #1a202c;">${assessmentData.Details?.Wasting || "N/A"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 8px; font-weight: 600; color: #718096;">Stunting</td>
            <td style="padding: 12px 8px; color: #1a202c;">${assessmentData.Details?.Stunting || "N/A"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 8px; font-weight: 600; color: #718096;">Underweight</td>
            <td style="padding: 12px 8px; color: #1a202c;">${assessmentData.Details?.Underweight || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; font-weight: 600; color: #718096;">MUAC Status</td>
            <td style="padding: 12px 8px; color: #1a202c;">${assessmentData.Details?.MUAC || "N/A"}</td>
          </tr>
        </table>
      </div>

      <!-- Clinical Recommendations -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #1b9cfc; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Clinical Recommendations</h2>
        <ol style="margin: 0; padding-left: 20px; list-style: decimal;">
          ${(assessmentData.Recommendations || []).map((r) => `<li style="margin-bottom: 8px; font-size: 14px; line-height: 1.6;">${r}</li>`).join("")}
        </ol>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #718096; font-size: 12px;">
        <p style="margin: 0 0 8px 0;">This report should be reviewed by a qualified healthcare professional.</p>
        <p style="margin: 0; color: #999;">NutriScan v1.0 | Intelligent Malnutrition Detection System</p>
      </div>
    </div>
  `

  // Generate PDF with proper options
  const opt = {
    margin: 10,
    filename: `NutriScan_Report_${new Date().getTime()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, allowTaint: true, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  }

  window.html2pdf().set(opt).from(reportDoc).save()
}

// RESET FORM
function resetForm() {
  document.getElementById("childImage").value = ""
  document.getElementById("age").value = ""
  document.getElementById("gender").value = "male"
  document.getElementById("height").value = ""
  document.getElementById("weight").value = ""
  document.getElementById("muac").value = ""
  document.getElementById("imageResult").textContent = ""
  document.getElementById("imageResult").className = "result-message"

  document.getElementById("imageSection").style.display = "block"
  document.getElementById("numericSection").style.display = "none"
  document.getElementById("resultSection").style.display = "none"

  assessmentData = null
  window.scrollTo({ top: 0, behavior: "smooth" })
}
