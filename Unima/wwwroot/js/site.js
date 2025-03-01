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
// Input's Validations
//Login's Validations
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
// End Of Login's Validations

//SignUp's Validations
const signupInput = document.getElementById("UserRegisterModel_FullName");
signupInput.addEventListener("invalid", function () {
  if (signupInput.value === "") {
    signupInput.setCustomValidity("نام و نام خانوادگی خود را وارد کنید");
  } else {
    signupInput.setCustomValidity("");
  }
});
signupInput.addEventListener("input", function () {
  signupInput.setCustomValidity("");
});
const phoneNumberInput = document.getElementById(
  "UserRegisterModel_PhoneNumber"
);
phoneNumberInput.addEventListener("invalid", function () {
  if (phoneNumberInput.value === "") {
    phoneNumberInput.setCustomValidity("شماره تلفن همراه خود را وارد کنید ");
  } else {
    phoneNumberInput.setCustomValidity("");
  }
});
phoneNumberInput.addEventListener("input", function () {
  phoneNumberInput.setCustomValidity("");
});
const studentNumber = document.getElementById("UserRegisterModel_Username");
studentNumber.addEventListener("invalid", function () {
  if (studentNumber.value === "") {
    studentNumber.setCustomValidity("شماره دانشجویی خود را وارد کنید ");
  } else {
    studentNumber.setCustomValidity("");
  }
});
studentNumber.addEventListener("input", function () {
  studentNumber.setCustomValidity("");
});
const PrivacyAndPolicy = document.getElementById(
  "UserRegisterModel_IsAcceptedRule"
);
PrivacyAndPolicy.addEventListener("invalid", function () {
  if (!PrivacyAndPolicy.checked) {
    PrivacyAndPolicy.setCustomValidity("تیک پذیرش شرایط و قوانین را بزنید!");
  } else {
    PrivacyAndPolicy.setCustomValidity("");
  }
});
const signUp_password = document.getElementById("UserRegisterModel_Password");
signUp_password.addEventListener("invalid", function () {
  if (signUp_password.value === "") {
    signUp_password.setCustomValidity("کلمه عبور را وارد کنید ");
  } else {
    signUp_password.setCustomValidity("");
  }
});
signUp_password.addEventListener("input", function () {
  signUp_password.setCustomValidity("");
});
const signUp_ConfirmPassword = document.getElementById(
  "UserRegisterModel_ConfirmPassword"
);
signUp_ConfirmPassword.addEventListener("invalid", function () {
  if (signUp_ConfirmPassword.value === "") {
    signUp_ConfirmPassword.setCustomValidity("تکرار کلمه عبور را وارد کنید");
  } else {
    signUp_ConfirmPassword.setCustomValidity("");
  }
});
signUp_ConfirmPassword.addEventListener("input", function () {
  signUp_ConfirmPassword.setCustomValidity("");
});
//End Of SignUp's Validations
//End Of Validations

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
  var password = document.getElementById("UserRegisterModel_Password").value;
  var confirmPassword = document.getElementById(
    "UserRegisterModel_ConfirmPassword"
  ).value;
  var errorMessage = document.getElementById("error-message");
  if (
    password !== confirmPassword &&
    confirmPassword.length > 0 &&
    password.length > 0
  ) {
    errorMessage.style.display = "block";
  } else {
    errorMessage.style.display = "none";
  }
}
document.getElementById("Paragraphs").addEventListener("copy", (e) => {
  e.preventDefault();
});
