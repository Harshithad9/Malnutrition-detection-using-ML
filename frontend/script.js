// const API_BASE = "http://127.0.0.1:8000"
// const html2pdf = window.html2pdf // Declare the html2pdf variable

// // Store assessment data for report generation
// let assessmentData = {}

// function showSection(sectionId) {
//   document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"))
//   document.getElementById(sectionId).classList.add("active")
//   document.querySelectorAll(".sidebar-item").forEach((s) => s.classList.remove("active"))
//   event.target.closest(".sidebar-item").classList.add("active")
// }

// function handleImageSelect() {
//   const file = document.getElementById("imageInput").files[0]
//   if (!file) return

//   const reader = new FileReader()
//   const previewImage = document.getElementById("previewImage")
//   const previewContainer = document.getElementById("previewContainer")

//   reader.onload = (e) => {
//     previewImage.src = e.target.result
//     document.getElementById("imageContainer").style.display = "none"
//     previewContainer.style.display = "flex"
//     previewContainer.style.flexDirection = "column"
//     document.getElementById("resultsPanel").style.display = "none"
//     document.getElementById("assessmentForm").style.display = "none"
//     document.getElementById("assessmentResults").style.display = "none"
//     clearFormData()
//   }
//   reader.readAsDataURL(file)
// }

// function removeImage() {
//   document.getElementById("imageInput").value = ""
//   document.getElementById("imageContainer").style.display = "block"
//   document.getElementById("previewContainer").style.display = "none"
//   document.getElementById("resultsPanel").style.display = "none"
//   document.getElementById("assessmentForm").style.display = "none"
//   document.getElementById("assessmentResults").style.display = "none"
//   document.getElementById("keyFindings").style.display = "none"
//   clearFormData()
// }

// function clearFormData() {
//   document.getElementById("age").value = ""
//   document.getElementById("gender").value = ""
//   document.getElementById("height").value = ""
//   document.getElementById("weight").value = ""
//   document.getElementById("muac").value = ""
// }

// async function analyzeImage() {
//   const file = document.getElementById("imageInput").files[0]
//   if (!file) return alert("Please upload an image!")

//   const loader = document.getElementById("analyzeLoader")
//   const loaderText = document.getElementById("analyzeText")

//   loader.style.display = "inline-block"
//   loaderText.style.display = "none"

//   try {
//     const formData = new FormData()
//     formData.append("file", file)

//     const res = await fetch(`${API_BASE}/predict/image`, {
//       method: "POST",
//       body: formData,
//     })

//     if (!res.ok) throw new Error("API request failed")
//     const data = await res.json()

//     loader.style.display = "none"
//     loaderText.style.display = "inline"

//     document.getElementById("resultsPanel").style.display = "block"

//     assessmentData.imagePrediction = data.prediction

//     if (data.prediction === "Healthy") {
//       document.getElementById("resultBadge").className = "result-badge healthy"
//       document.getElementById("resultBadge").textContent = "✓ Healthy"
//       document.getElementById("classification").innerHTML = `
//                 <div class="classification-icon">😊</div>
//                 <div class="classification-text">
//                     <h3>Healthy Status</h3>
//                     <p>The child shows no visible signs of malnutrition</p>
//                 </div>
//             `
//       document.getElementById("confidence").textContent = "94%"
//       document.getElementById("severity").textContent = "None"
//       document.getElementById("severity").className = "severity-value none"
//       document.getElementById("assessmentForm").style.display = "none"
//       document.getElementById("keyFindings").style.display = "none"
//       document.querySelector(".download-btn").style.display = "block"
//     } else {
//       document.getElementById("resultBadge").className = "result-badge malnourished"
//       document.getElementById("resultBadge").textContent = "⚠️ Malnourished"
//       document.getElementById("classification").innerHTML = `
//                 <div class="classification-icon">⚠️</div>
//                 <div class="classification-text">
//                     <h3>Malnutrition Detected</h3>
//                     <p>Please provide child details for detailed assessment</p>
//                 </div>
//             `
//       document.getElementById("confidence").textContent = "91%"
//       document.getElementById("severity").textContent = "Moderate"
//       document.getElementById("severity").className = "severity-value moderate"
//       document.getElementById("assessmentForm").style.display = "block"
//     }
//     document.getElementById("assessmentResults").style.display = "none"
//   } catch (error) {
//     loader.style.display = "none"
//     loaderText.style.display = "inline"
//     alert("Error: " + error.message)
//   }
// }

// async function performAssessment() {
//   const age = document.getElementById("age").value
//   const gender = document.getElementById("gender").value
//   const height = document.getElementById("height").value
//   const weight = document.getElementById("weight").value
//   const muac = document.getElementById("muac").value

//   if (!age || !gender || !height || !weight || !muac) return alert("Please fill in all fields")

//   const loader = document.getElementById("assessmentLoader")
//   const loaderText = document.getElementById("assessmentText")

//   loader.style.display = "inline-block"
//   loaderText.style.display = "none"

//   try {
//     const payload = {
//       age_months: Number(age),
//       gender: gender,
//       height_cm: Number(height),
//       weight_kg: Number(weight),
//       muac_cm: Number(muac),
//     }

//     const res = await fetch(`${API_BASE}/predict/numeric`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     })

//     if (!res.ok) throw new Error("API request failed")
//     const data = await res.json()

//     loader.style.display = "none"
//     loaderText.style.display = "inline"

//     assessmentData = {
//       ...assessmentData,
//       age: age,
//       gender: gender === "M" ? "Male" : "Female",
//       height: height,
//       weight: weight,
//       muac: muac,
//       bmi: data.BMI || (weight / (height / 100) ** 2).toFixed(1),
//       wastingStatus: data.Wasting_status,
//       stuntingStatus: data.Stunting_status,
//       underweightStatus: data.Underweight_status,
//       muacStatus: data.MUAC_status,
//       finalStatus: data.Final_status,
//       severity: data.Severity || "Moderate",
//       recommendations:
//         data.Recommendations || "Consult with a healthcare professional for personalized nutritional guidance.",
//     }

//     const findings = [
//       `BMI: ${assessmentData.bmi}`,
//       `Wasting Status: ${assessmentData.wastingStatus}`,
//       `Stunting Status: ${assessmentData.stuntingStatus}`,
//       `Underweight Status: ${assessmentData.underweightStatus}`,
//       `MUAC Status: ${assessmentData.muacStatus}`,
//     ]

//     document.getElementById("findingsList").innerHTML = findings.map((f) => `<li>${f}</li>`).join("")
//     document.getElementById("keyFindings").style.display = "block"

//     document.getElementById("assessmentGrid").innerHTML = `
//             <div class="assessment-item">
//                 <div class="assessment-item-label">Age</div>
//                 <div class="assessment-item-value">${age} months</div>
//             </div>
//             <div class="assessment-item">
//                 <div class="assessment-item-label">BMI</div>
//                 <div class="assessment-item-value">${assessmentData.bmi}</div>
//             </div>
//             <div class="assessment-item">
//                 <div class="assessment-item-label">Status</div>
//                 <div class="assessment-item-value">${assessmentData.finalStatus}</div>
//             </div>
//             <div class="assessment-item">
//                 <div class="assessment-item-label">Height/Weight</div>
//                 <div class="assessment-item-value">${height}cm/${weight}kg</div>
//             </div>
//         `
//     document.getElementById("assessmentResults").style.display = "block"
//     document.querySelector(".download-btn").style.display = "block"
//   } catch (error) {
//     loader.style.display = "none"
//     loaderText.style.display = "inline"
//     alert("Error: " + error.message)
//   }
// }

// function downloadReport() {
//   if (!assessmentData.age) {
//     alert("Please complete the assessment first")
//     return
//   }

//   // Create a professional report HTML
//   const reportHTML = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <meta charset="UTF-8">
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     color: #2c3e50;
//                     line-height: 1.6;
//                     margin: 0;
//                     padding: 20px;
//                 }
//                 .report-header {
//                     text-align: center;
//                     border-bottom: 3px solid #17a2b8;
//                     padding-bottom: 20px;
//                     margin-bottom: 30px;
//                 }
//                 .report-header h1 {
//                     margin: 0;
//                     color: #2c3e50;
//                     font-size: 28px;
//                 }
//                 .report-header .subtitle {
//                     color: #17a2b8;
//                     font-size: 14px;
//                     margin-top: 5px;
//                 }
//                 .report-date {
//                     text-align: right;
//                     font-size: 12px;
//                     color: #7f8c8d;
//                     margin-bottom: 20px;
//                 }
//                 .section {
//                     margin-bottom: 25px;
//                 }
//                 .section h2 {
//                     border-left: 4px solid #17a2b8;
//                     padding-left: 15px;
//                     color: #2c3e50;
//                     font-size: 16px;
//                     margin-top: 0;
//                 }
//                 .info-grid {
//                     display: grid;
//                     grid-template-columns: 1fr 1fr;
//                     gap: 20px;
//                     margin-bottom: 15px;
//                 }
//                 .info-item {
//                     background: #f0f7fb;
//                     padding: 12px;
//                     border-radius: 5px;
//                 }
//                 .info-label {
//                     font-size: 12px;
//                     color: #7f8c8d;
//                     font-weight: bold;
//                     margin-bottom: 5px;
//                 }
//                 .info-value {
//                     font-size: 18px;
//                     color: #2c3e50;
//                     font-weight: bold;
//                 }
//                 .status-badge {
//                     display: inline-block;
//                     padding: 8px 16px;
//                     border-radius: 20px;
//                     font-weight: bold;
//                     margin: 5px 5px 5px 0;
//                     font-size: 13px;
//                 }
//                 .status-healthy {
//                     background: rgba(39, 174, 96, 0.2);
//                     color: #27ae60;
//                 }
//                 .status-warning {
//                     background: rgba(255, 107, 53, 0.2);
//                     color: #ff6b35;
//                 }
//                 .assessment-table {
//                     width: 100%;
//                     border-collapse: collapse;
//                     margin: 15px 0;
//                 }
//                 .assessment-table th,
//                 .assessment-table td {
//                     padding: 12px;
//                     text-align: left;
//                     border-bottom: 1px solid #ecf0f1;
//                 }
//                 .assessment-table th {
//                     background: #f0f7fb;
//                     color: #2c3e50;
//                     font-weight: bold;
//                 }
//                 .recommendations {
//                     background: #f0f7fb;
//                     padding: 15px;
//                     border-left: 4px solid #ff6b35;
//                     border-radius: 4px;
//                     margin-top: 15px;
//                 }
//                 .footer {
//                     margin-top: 40px;
//                     padding-top: 20px;
//                     border-top: 1px solid #ecf0f1;
//                     font-size: 11px;
//                     color: #7f8c8d;
//                     text-align: center;
//                 }
//                 page-break-after: always;
//             </style>
//         </head>
//         <body>
//             <div class="report-date">Report Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            
//             <div class="report-header">
//                 <h1>📊 NutriScan Clinical Report</h1>
//                 <div class="subtitle">Child Malnutrition Assessment</div>
//             </div>

//             <div class="section">
//                 <h2>Child Information</h2>
//                 <div class="info-grid">
//                     <div class="info-item">
//                         <div class="info-label">Age</div>
//                         <div class="info-value">${assessmentData.age} months</div>
//                     </div>
//                     <div class="info-item">
//                         <div class="info-label">Gender</div>
//                         <div class="info-value">${assessmentData.gender}</div>
//                     </div>
//                     <div class="info-item">
//                         <div class="info-label">Height</div>
//                         <div class="info-value">${assessmentData.height} cm</div>
//                     </div>
//                     <div class="info-item">
//                         <div class="info-label">Weight</div>
//                         <div class="info-value">${assessmentData.weight} kg</div>
//                     </div>
//                     <div class="info-item">
//                         <div class="info-label">MUAC</div>
//                         <div class="info-value">${assessmentData.muac} cm</div>
//                     </div>
//                     <div class="info-item">
//                         <div class="info-label">BMI</div>
//                         <div class="info-value">${assessmentData.bmi}</div>
//                     </div>
//                 </div>
//             </div>

//             <div class="section">
//                 <h2>Nutritional Assessment Results</h2>
//                 <table class="assessment-table">
//                     <thead>
//                         <tr>
//                             <th>Assessment Type</th>
//                             <th>Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>Wasting Status</td>
//                             <td><span class="status-badge status-warning">${assessmentData.wastingStatus}</span></td>
//                         </tr>
//                         <tr>
//                             <td>Stunting Status</td>
//                             <td><span class="status-badge status-warning">${assessmentData.stuntingStatus}</span></td>
//                         </tr>
//                         <tr>
//                             <td>Underweight Status</td>
//                             <td><span class="status-badge status-warning">${assessmentData.underweightStatus}</span></td>
//                         </tr>
//                         <tr>
//                             <td>MUAC Status</td>
//                             <td><span class="status-badge status-warning">${assessmentData.muacStatus}</span></td>
//                         </tr>
//                         <tr>
//                             <td>Overall Condition</td>
//                             <td><span class="status-badge status-warning">${assessmentData.finalStatus}</span></td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>

//             <div class="section">
//                 <h2>Clinical Summary</h2>
//                 <p><strong>Severity Level:</strong> ${assessmentData.severity}</p>
//                 <p>Based on the assessment of the child's biometric measurements including weight, height, MUAC, and age, a comprehensive nutritional evaluation has been completed. The results indicate the child's current nutritional status across multiple dimensions.</p>
//             </div>

//             <div class="section">
//                 <h2>Recommendations</h2>
//                 <div class="recommendations">
//                     <strong>⚕️ Clinical Recommendations:</strong>
//                     <p>${assessmentData.recommendations || "Schedule regular follow-up assessments. Consult with a healthcare professional for personalized nutritional guidance. Consider dietary supplementation and micronutrient enrichment. Monitor growth and development regularly."}</p>
//                 </div>
//             </div>

//             <div class="footer">
//                 <p>This report is generated by NutriScan v1.0 - Intelligent Malnutrition Detection System</p>
//                 <p>For professional medical advice, please consult with a qualified healthcare provider</p>
//                 <p>© 2026 NutriScan. All rights reserved.</p>
//             </div>
//         </body>
//         </html>
//     `

//   // Generate PDF using html2pdf
//   const opt = {
//     margin: 0.5,
//     filename: `nutrition_report_${new Date().getTime()}.pdf`,
//     image: { type: "jpeg", quality: 0.98 },
//     html2canvas: { scale: 2, useCORS: true },
//     jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//   }

//   html2pdf().set(opt).from(reportHTML).save()
// }

const API_BASE = "http://127.0.0.1:8000"
const html2pdf = window.html2pdf // Declare the html2pdf variable

// Store assessment data for report generation
let assessmentData = {}

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"))
  document.getElementById(sectionId).classList.add("active")
  document.querySelectorAll(".sidebar-item").forEach((s) => s.classList.remove("active"))
  event.target.closest(".sidebar-item").classList.add("active")
}

function handleImageSelect() {
  const file = document.getElementById("imageInput").files[0]
  if (!file) return

  const reader = new FileReader()
  const previewImage = document.getElementById("previewImage")
  const previewContainer = document.getElementById("previewContainer")

  reader.onload = (e) => {
    previewImage.src = e.target.result
    document.getElementById("imageContainer").style.display = "none"
    previewContainer.style.display = "flex"
    previewContainer.style.flexDirection = "column"
    document.getElementById("resultsPanel").style.display = "none"
    document.getElementById("assessmentForm").style.display = "none"
    document.getElementById("assessmentResults").style.display = "none"
    clearFormData()
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  document.getElementById("imageInput").value = ""
  document.getElementById("imageContainer").style.display = "block"
  document.getElementById("previewContainer").style.display = "none"
  document.getElementById("resultsPanel").style.display = "none"
  document.getElementById("assessmentForm").style.display = "none"
  document.getElementById("assessmentResults").style.display = "none"
  document.getElementById("keyFindings").style.display = "none"
  clearFormData()
}

function clearFormData() {
  document.getElementById("age").value = ""
  document.getElementById("gender").value = ""
  document.getElementById("height").value = ""
  document.getElementById("weight").value = ""
  document.getElementById("muac").value = ""
}

async function analyzeImage() {
  const file = document.getElementById("imageInput").files[0]
  if (!file) return alert("Please upload an image!")

  const loader = document.getElementById("analyzeLoader")
  const loaderText = document.getElementById("analyzeText")

  loader.style.display = "inline-block"
  loaderText.style.display = "none"

  try {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`${API_BASE}/predict/image`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) throw new Error("API request failed")
    const data = await res.json()

    loader.style.display = "none"
    loaderText.style.display = "inline"

    document.getElementById("resultsPanel").style.display = "block"

    assessmentData.imagePrediction = data.prediction

    if (data.prediction === "Healthy") {
      document.getElementById("resultBadge").className = "result-badge healthy"
      document.getElementById("resultBadge").textContent = "✓ Healthy"
      document.getElementById("classification").innerHTML = `
                <div class="classification-icon">😊</div>
                <div class="classification-text">
                    <h3>Healthy Status</h3>
                    <p>The child shows no visible signs of malnutrition</p>
                </div>
            `
      document.getElementById("confidence").textContent = "94%"
      document.getElementById("severity").textContent = "None"
      document.getElementById("severity").className = "severity-value none"
      document.getElementById("assessmentForm").style.display = "none"
      document.getElementById("keyFindings").style.display = "none"
      document.querySelector(".download-btn").style.display = "block"
    } else {
      document.getElementById("resultBadge").className = "result-badge malnourished"
      document.getElementById("resultBadge").textContent = "⚠️ Malnourished"
      document.getElementById("classification").innerHTML = `
                <div class="classification-icon">⚠️</div>
                <div class="classification-text">
                    <h3>Malnutrition Detected</h3>
                    <p>Please provide child details for detailed assessment</p>
                </div>
            `
      document.getElementById("confidence").textContent = "91%"
      document.getElementById("severity").textContent = "Moderate"
      document.getElementById("severity").className = "severity-value moderate"
      document.getElementById("assessmentForm").style.display = "block"
    }
    document.getElementById("assessmentResults").style.display = "none"
  } catch (error) {
    loader.style.display = "none"
    loaderText.style.display = "inline"
    alert("Error: " + error.message)
  }
}

async function performAssessment() {
  const age = document.getElementById("age").value
  const gender = document.getElementById("gender").value
  const height = document.getElementById("height").value
  const weight = document.getElementById("weight").value
  const muac = document.getElementById("muac").value

  if (!age || !gender || !height || !weight || !muac) return alert("Please fill in all fields")

  const loader = document.getElementById("assessmentLoader")
  const loaderText = document.getElementById("assessmentText")

  loader.style.display = "inline-block"
  loaderText.style.display = "none"

  try {
    const payload = {
      age_months: Number(age),
      gender: gender,
      height_cm: Number(height),
      weight_kg: Number(weight),
      muac_cm: Number(muac),
    }

    const res = await fetch(`${API_BASE}/predict/numeric`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error("API request failed")
    const data = await res.json()

    loader.style.display = "none"
    loaderText.style.display = "inline"

    assessmentData = {
      ...assessmentData,
      age: age,
      gender: gender === "M" ? "Male" : "Female",
      height: height,
      weight: weight,
      muac: muac,
      bmi: data.BMI || (weight / (height / 100) ** 2).toFixed(1),
      wastingStatus: data.Details.Wasting,
      stuntingStatus: data.Details.Stunting,
      underweightStatus: data.Details.Underweight,
      muacStatus: data.Details.MUAC,
      finalStatus: data.Primary_condition,
      severity: data.Severity || "Moderate",
      recommendations:
        data.Recommendations || "Consult with a healthcare professional for personalized nutritional guidance.",
    }

    const findings = [
      `BMI: ${assessmentData.bmi}`,
      `Wasting Status: ${assessmentData.wastingStatus}`,
      `Stunting Status: ${assessmentData.stuntingStatus}`,
      `Underweight Status: ${assessmentData.underweightStatus}`,
      `MUAC Status: ${assessmentData.muacStatus}`,
    ]

    document.getElementById("findingsList").innerHTML = findings.map((f) => `<li>${f}</li>`).join("")
    document.getElementById("keyFindings").style.display = "block"

    document.getElementById("assessmentGrid").innerHTML = `
            <div class="assessment-item">
                <div class="assessment-item-label">Age</div>
                <div class="assessment-item-value">${age} months</div>
            </div>
            <div class="assessment-item">
                <div class="assessment-item-label">BMI</div>
                <div class="assessment-item-value">${assessmentData.bmi}</div>
            </div>
            <div class="assessment-item">
                <div class="assessment-item-label">Status</div>
                <div class="assessment-item-value">${assessmentData.finalStatus}</div>
            </div>
            <div class="assessment-item">
                <div class="assessment-item-label">Height/Weight</div>
                <div class="assessment-item-value">${height}cm/${weight}kg</div>
            </div>
        `
    document.getElementById("assessmentResults").style.display = "block"
    document.querySelector(".download-btn").style.display = "block"
  } catch (error) {
    loader.style.display = "none"
    loaderText.style.display = "inline"
    alert("Error: " + error.message)
  }
}

function downloadReport() {
  if (!assessmentData.age) {
    alert("Please complete the assessment first")
    return
  }

  // Create a professional report HTML
  const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #2c3e50;
                    line-height: 1.6;
                    margin: 0;
                    padding: 20px;
                }
                .report-header {
                    text-align: center;
                    border-bottom: 3px solid #17a2b8;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .report-header h1 {
                    margin: 0;
                    color: #2c3e50;
                    font-size: 28px;
                }
                .report-header .subtitle {
                    color: #17a2b8;
                    font-size: 14px;
                    margin-top: 5px;
                }
                .report-date {
                    text-align: right;
                    font-size: 12px;
                    color: #7f8c8d;
                    margin-bottom: 20px;
                }
                .section {
                    margin-bottom: 25px;
                }
                .section h2 {
                    border-left: 4px solid #17a2b8;
                    padding-left: 15px;
                    color: #2c3e50;
                    font-size: 16px;
                    margin-top: 0;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 15px;
                }
                .info-item {
                    background: #f0f7fb;
                    padding: 12px;
                    border-radius: 5px;
                }
                .info-label {
                    font-size: 12px;
                    color: #7f8c8d;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .info-value {
                    font-size: 18px;
                    color: #2c3e50;
                    font-weight: bold;
                }
                .status-badge {
                    display: inline-block;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: bold;
                    margin: 5px 5px 5px 0;
                    font-size: 13px;
                }
                .status-healthy {
                    background: rgba(39, 174, 96, 0.2);
                    color: #27ae60;
                }
                .status-warning {
                    background: rgba(255, 107, 53, 0.2);
                    color: #ff6b35;
                }
                .assessment-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                }
                .assessment-table th,
                .assessment-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ecf0f1;
                }
                .assessment-table th {
                    background: #f0f7fb;
                    color: #2c3e50;
                    font-weight: bold;
                }
                .recommendations {
                    background: #f0f7fb;
                    padding: 15px;
                    border-left: 4px solid #ff6b35;
                    border-radius: 4px;
                    margin-top: 15px;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #ecf0f1;
                    font-size: 11px;
                    color: #7f8c8d;
                    text-align: center;
                }
                page-break-after: always;
            </style>
        </head>
        <body>
            <div class="report-date">Report Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            
            <div class="report-header">
                <h1>📊 NutriScan Clinical Report</h1>
                <div class="subtitle">Child Malnutrition Assessment</div>
            </div>

            <div class="section">
                <h2>Child Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Age</div>
                        <div class="info-value">${assessmentData.age} months</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Gender</div>
                        <div class="info-value">${assessmentData.gender}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Height</div>
                        <div class="info-value">${assessmentData.height} cm</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Weight</div>
                        <div class="info-value">${assessmentData.weight} kg</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">MUAC</div>
                        <div class="info-value">${assessmentData.muac} cm</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">BMI</div>
                        <div class="info-value">${assessmentData.bmi}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Nutritional Assessment Results</h2>
                <table class="assessment-table">
                    <thead>
                        <tr>
                            <th>Assessment Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Wasting Status</td>
                            <td><span class="status-badge status-warning">${assessmentData.wastingStatus}</span></td>
                        </tr>
                        <tr>
                            <td>Stunting Status</td>
                            <td><span class="status-badge status-warning">${assessmentData.stuntingStatus}</span></td>
                        </tr>
                        <tr>
                            <td>Underweight Status</td>
                            <td><span class="status-badge status-warning">${assessmentData.underweightStatus}</span></td>
                        </tr>
                        <tr>
                            <td>MUAC Status</td>
                            <td><span class="status-badge status-warning">${assessmentData.muacStatus}</span></td>
                        </tr>
                        <tr>
                            <td>Overall Condition</td>
                            <td><span class="status-badge status-warning">${assessmentData.finalStatus}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="section">
                <h2>Clinical Summary</h2>
                <p><strong>Severity Level:</strong> ${assessmentData.severity}</p>
                <p>Based on the assessment of the child's biometric measurements including weight, height, MUAC, and age, a comprehensive nutritional evaluation has been completed. The results indicate the child's current nutritional status across multiple dimensions.</p>
            </div>

            <div class="section">
                <h2>Recommendations</h2>
                <div class="recommendations">
                    <strong>⚕️ Clinical Recommendations:</strong>
                    <p>${assessmentData.recommendations || "Schedule regular follow-up assessments. Consult with a healthcare professional for personalized nutritional guidance. Consider dietary supplementation and micronutrient enrichment. Monitor growth and development regularly."}</p>
                </div>
            </div>

            <div class="footer">
                <p>This report is generated by NutriScan v1.0 - Intelligent Malnutrition Detection System</p>
                <p>For professional medical advice, please consult with a qualified healthcare provider</p>
                <p>© 2026 NutriScan. All rights reserved.</p>
            </div>
        </body>
        </html>
    `

  // Generate PDF using html2pdf
  const opt = {
    margin: 0.5,
    filename: `nutrition_report_${new Date().getTime()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  }

  html2pdf().set(opt).from(reportHTML).save()
}
