const inputs = document.querySelectorAll(".otp-box input");
inputs.forEach((input, index) => {
  input.dataset.index = index;
  input.addEventListener("paste", handleotppaste);
  input.addEventListener("keyup", handleotp);
});
function handleotppaste(e) {
  const data = e.clipboardData.getData("text");
  const value = data.split("");
  if (value.length === inputs.length) {
    inputs.forEach((input, index) => (input.value = value[index]));
    Submit();
  }
}
function handleotp(e) {
  const input = e.target;
  let value = input.value;
  input.value = "";
  input.value = value ? value[0] : "";

  let fieldIndex = input.dataset.index;
  if (value.length > 0 && fieldIndex < inputs.length - 1) {
    input.nextElementSibling.focus();
  }
  if (e.key === "Backspace" && fieldIndex > 0) {
    input.previousElementSibling.focus();
  }
  if (fieldIndex === input.length - 1) {
    submit();
  }
}
function submit() {
  console.log("submiting ... ! ");
  let otp = "";
  inputs.forEach((input) => {
    otp += input.value;
    input.disabled = true;
    input.classList.add("disabled");
  });
  console.log(otp);
}
let timeLeft = 60;
let timerInterval;
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
function updateTimer() {
  const timerDisplay = document.getElementById("timer");
  const resendLink = document.getElementById("resend-link");

  if (timeLeft > 0) {
      timerDisplay.innerHTML = `زمان باقیمانده تا ارسال مجدد کد <strong >${formatTime(timeLeft)}</strong> `;
      timeLeft--;
  } else {
      timerDisplay.innerHTML = "<span style='color: red'></span>";
      clearInterval(timerInterval);
      resendLink.style.display = "block";
  }
}
function resendOTP() {
    clearInterval(timerInterval);
    timeLeft = 60; 
    document.getElementById("resend-link").style.display = "none";
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000); 
}
document.getElementById("resend-link").style.display = "none";
timerInterval = setInterval(updateTimer, 1000);