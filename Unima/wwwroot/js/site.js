const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignupBtn = document.getElementById("showSignup");
const showLoginBtn = document.getElementById("showLogin");

showSignupBtn.addEventListener("click", (event) => {
  event.preventDefault();
  setTimeout(() => {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    signupForm.querySelector("input").focus();
  }, 0);
});

showLoginBtn.addEventListener("click", (event) => {
  event.preventDefault();
  setTimeout(() => {
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    loginForm.querySelector("input").focus();
  }, 0);
});
const nameInput = document.getElementById("karbari");

nameInput.addEventListener("invalid", function () {
  if (nameInput.value === "") {
    nameInput.setCustomValidity(" لطفا نام کاربری تان را وارد کنید");
  } else {
    nameInput.setCustomValidity("");
  }
});

nameInput.addEventListener("input", function () {
  nameInput.setCustomValidity("");
});

const passInput = document.getElementById("password1");

passInput.addEventListener("invalid", function () {
  if (passInput.value === "") {
    passInput.setCustomValidity(" لطفا   رمز عبور خود را وارد کنید");
  } else {
    passInput.setCustomValidity("");
  }
});

passInput.addEventListener("input", function () {
  passInput.setCustomValidity("");
});

const signupInput = document.getElementById("signup-karbari");

signupInput.addEventListener("invalid", function () {
  if (signupInput.value === "") {
    signupInput.setCustomValidity("     شماره دانشجویی خود را وارد کنید");
  } else {
    signupInput.setCustomValidity("");
  }
});

signupInput.addEventListener("input", function () {
  signupInput.setCustomValidity("");
});

const phoneinput = document.getElementById("phonenumber");

phoneinput.addEventListener("invalid", function () {
  if (phoneinput.value === "") {
    phoneinput.setCustomValidity("       شماره همراه تان را وارد کنید ");
  } else {
    phoneinput.setCustomValidity("");
  }
});

phoneinput.addEventListener("input", function () {
  phoneinput.setCustomValidity("");
});

function togglePassword() {
  var passwordField = document.getElementById("password1");
  var eyeIcon = document.getElementById("eyeIcon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");   
  } else {
    passwordField.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");     
  }
}
function checkPasswordMatch() {
  var password = document.querySelector("[asp-for='UserRegisterModel.SignUpPassword']").value;
  var confirmPassword = document.querySelector("[asp-for='UserRegisterModel.SignUpConfirmPassword']").value;
  var errorMessage = document.getElementById("error-message");

  if (password !== confirmPassword && confirmPassword.length > 0) {
      errorMessage.style.display = "block";
  } else {
      errorMessage.style.display = "none";
  }
}
