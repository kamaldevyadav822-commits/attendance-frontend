console.log("App JS loaded");

const BACKEND_URL = "    https://attendance-backend-5f7f.onrender.com"; // CHANGE IF NEEDED

const registerBox = document.getElementById("registerBox");
const attendanceBox = document.getElementById("attendanceBox");
const qrBox = document.getElementById("qrBox");

const regError = document.getElementById("regError");
const attError = document.getElementById("attError");
const attSuccess = document.getElementById("attSuccess");

let qrScanner = null;

// ---------- INITIAL STATE ----------
const studentId = localStorage.getItem("student_id");

if (!studentId) {
  registerBox.classList.remove("hidden");
} else {
  attendanceBox.classList.remove("hidden");
}

// ---------- REGISTER ----------
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

// ---------- QR SCANNER ----------
function startScanner() {
  attError.innerText = "";
  attSuccess.innerText = "";

  attendanceBox.classList.add("hidden");
  qrBox.classList.remove("hidden");

  qrScanner = new Html5Qrcode("qr-reader");

  qrScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    () => {
      stopScanner();
      markAttendance();
    },
    () => {}
  );
}

function stopScanner() {
  if (qrScanner) {
    qrScanner.stop().then(() => qrScanner.clear());
  }
  qrBox.classList.add("hidden");
  attendanceBox.classList.remove("hidden");
}

// ---------- MARK ATTENDANCE ----------
function markAttendance() {
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
