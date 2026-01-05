const BACKEND_URL = "https://YOUR-BACKEND-URL"; // <-- CHANGE THIS

const studentId = localStorage.getItem("student_id");

// UI elements
const registerBox = document.getElementById("registerBox");
const attendanceBox = document.getElementById("attendanceBox");
const regError = document.getElementById("regError");
const attError = document.getElementById("attError");
const attSuccess = document.getElementById("attSuccess");

// Decide screen on load
if (!studentId) {
  registerBox.classList.remove("hidden");
} else {
  attendanceBox.classList.remove("hidden");
}

// -------- REGISTER STUDENT --------
function registerStudent() {
  regError.innerText = "";

  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const dept = document.getElementById("dept").value;

  if (!name || !roll || !dept) {
    regError.innerText = "All fields are required";
    return;
  }

  fetch(`${BACKEND_URL}/api/students/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      roll_no: roll,
      department: dept
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.student_id) {
      localStorage.setItem("student_id", data.student_id);
      location.reload();
    } else {
      regError.innerText = data.error || "Registration failed";
    }
  })
  .catch(() => {
    regError.innerText = "Server error";
  });
}

// -------- MARK ATTENDANCE --------
function markAttendance() {
  attError.innerText = "";
  attSuccess.innerText = "";

  fetch(`${BACKEND_URL}/api/attendance/mark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: localStorage.getItem("student_id")
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.message) {
      attSuccess.innerText = data.message;
    } else {
      attError.innerText = data.error || "Attendance failed";
    }
  })
  .catch(() => {
    attError.innerText = "Server error";
  });
}
