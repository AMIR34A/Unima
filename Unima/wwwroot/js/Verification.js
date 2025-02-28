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
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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

function concatInputs() {
    var number1 = document.getElementById("number1").value,
        number2 = document.getElementById("number2").value,
        number3 = document.getElementById("number3").value,
        number4 = document.getElementById("number4").value,
        number5 = document.getElementById("number5").value,
        number6 = document.getElementById("number6").value;


document.querySelector("#submitButton").addEventListener("submit" , (e)=>{

  let input1=document.getElementById("input1").value
  let input2=document.getElementById("input1").value
  let input3=document.getElementById("input1").value
  let input4=document.getElementById("input1").value
  let input5=document.getElementById("input1").value
  let input6=document.getElementById("input1").value
  let tokenInput=document.getElementById("Token").value
  tokenInput=`${input1}${input2}${input3}${input4}${input5}${input6}`
})