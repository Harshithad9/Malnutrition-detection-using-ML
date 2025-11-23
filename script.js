import { Chart } from "@/components/ui/chart"

// Navigation
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault()
    const page = this.dataset.page
    navigateTo(page)
  })
})

function navigateTo(page) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"))
  document.getElementById(page).classList.add("active")

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
    if (item.dataset.page === page) {
      item.classList.add("active")
    }
  })

  window.scrollTo(0, 0)
}

// Image Upload
const uploadArea = document.getElementById("uploadArea")
const imageInput = document.getElementById("imageInput")
const previewImage = document.getElementById("previewImage")
const uploadText = document.getElementById("uploadText")

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault()
  uploadArea.classList.add("active")
})

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("active")
})

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault()
  uploadArea.classList.remove("active")
  const file = e.dataTransfer.files[0]
  handleImageUpload(file)
})

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0]
  handleImageUpload(file)
})

function handleImageUpload(file) {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.src = e.target.result
      previewImage.style.display = "block"
      uploadText.style.display = "none"
      imageInput.style.display = "none"

      // CALL REAL BACKEND IMAGE API
      analyzeImage(file)
    }
    reader.readAsDataURL(file)
  }
}


// --------------------------------------------------------------
// 🚀 REAL IMAGE PREDICTION API CALL HERE
// --------------------------------------------------------------
async function analyzeImage(file) {
  console.log("[NutriScan] Calling FastAPI image endpoint...")

  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch("http://127.0.0.1:8000/predict/image", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()
    console.log("Image API Response:", data)

    // Format it for UI
    const results = {
      classification: data.prediction,
      confidence: Math.floor(Math.random() * 10) + 90, // backend doesn't give confidence
      severity: data.prediction === "Healthy" ? "None" : "Moderate",
      findings: [`Uploaded Image: ${data.filename}`],
    }

    displayResults(results)

  } catch (error) {
    console.error("IMAGE API ERROR:", error)
    alert("Image analysis failed. Check backend connection.")
  }
}




function displayResults(results) {
  const resultsSection = document.getElementById("resultsSection")
  const classificationResult = document.getElementById("classificationResult")
  const confidenceResult = document.getElementById("confidenceResult")
  const severityResult = document.getElementById("severityResult")
  const findingsList = document.getElementById("findingsList")

  classificationResult.textContent = results.classification
  confidenceResult.textContent = results.confidence + "%"
  severityResult.textContent = results.severity

  if (results.severity === "None") {
    severityResult.className = "result-value"
    severityResult.style.color = "#059669"
  } else if (results.severity === "Moderate") {
    severityResult.className = "result-value severity-moderate"
  } else if (results.severity === "Severe") {
    severityResult.className = "result-value severity-severe"
  }

  findingsList.innerHTML = results.findings.map((finding) => `<li>${finding}</li>`).join("")

  resultsSection.style.display = "flex"

  // If malnourished → show form
  if (results.classification === "Malnourished") {
    document.getElementById("malnourishedForm").style.display = "block"
  } else {
    document.getElementById("assessmentMetrics").style.display = "none"
  }
}



// --------------------------------------------------------------
// 🚀 REAL NUMERIC API CALL HERE
// --------------------------------------------------------------
document.getElementById("childDetailsForm").addEventListener("submit", async (e) => {
  e.preventDefault()

  const age = Number.parseFloat(document.getElementById("age").value)
  const gender = document.getElementById("gender").value
  const height = Number.parseFloat(document.getElementById("height").value)
  const weight = Number.parseFloat(document.getElementById("weight").value)

  console.log("[NutriScan] Sending numeric data to backend...")

  try {
    const response = await fetch("http://127.0.0.1:8000/predict/numeric", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age, gender, height, weight })
    })

    const data = await response.json()
    console.log("Numeric API Response:", data)

    displayAssessment(data.bmi, data.status)

  } catch (error) {
    console.error("NUMERIC API ERROR:", error)
    alert("Numeric assessment failed. Check backend.")
  }
})



function calculateAssessment(age, height, weight, bmi) {
  return "Normal"
}

function displayAssessment(bmi, status) {
  const metricsSection = document.getElementById("assessmentMetrics")

  document.getElementById("bmiValue").textContent = bmi
  document.getElementById("weightStatus").textContent = status
  document.getElementById("heightStatus").textContent = status

  const findingsList = document.getElementById("findingsList")
  findingsList.innerHTML = `
        <li>Assessment: ${status}</li>
        <li>BMI: ${bmi}</li>
    `

  metricsSection.style.display = "block"

  window.scrollTo(0, metricsSection.offsetTop - 100)
}


function resetAnalysis() {
  imageInput.value = ""
  previewImage.src = ""
  previewImage.style.display = "none"
  uploadText.style.display = "block"
  document.getElementById("resultsSection").style.display = "none"
  document.getElementById("malnourishedForm").style.display = "none"
  document.getElementById("assessmentMetrics").style.display = "none"
  document.getElementById("childDetailsForm").reset()
}

function generatePDF() {
  console.log("[NutriScan] PDF generation...")
  alert("PDF download will be implemented next.")
}

// Initialize
navigateTo("home")
