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

const nameInput = document.getElementById("UserLogInModel_Username");
nameInput.addEventListener("blur", function () {
  if (!nameInput.value.trim()) {
    nameInput.setCustomValidity("لطفا نام کاربری خود را وارد کنید ");
  } else {
    nameInput.setCustomValidity("");
  }
});

nameInput.addEventListener("input", function () {
  nameInput.setCustomValidity("");
});
const passInput = document.getElementById("UserLogInModel_Password");
passInput.addEventListener("blur", function(){
    if (!passInput.value.trim()){
        passInput.setCustomValidity("لطفا رمز عبور خود را وارد کنید")
    }else passInput.setCustomValidity("");
})
passInput.addEventListener("input" , ()=>{
    passInput.setCustomValidity("");
})
// End Of Login's Validations

//SignUp's Validations
const fullName = document.getElementById("UserRegisterModel_FullName");
fullName.addEventListener("blur", function(){
    if (!fullName.value.trim()){
        fullName.setCustomValidity("لطفا نام و نام خانوادگی خود را وارد کنید ")
    }else fullName.setCustomValidity("");
})
fullName.addEventListener("input" , ()=>{
    fullName.setCustomValidity("");
})

const phoneNumber = document.getElementById("UserRegisterModel_PhoneNumber");
phoneNumber.addEventListener("blur", function () {
  if (!phoneNumber.value.trim()) {
    phoneNumber.setCustomValidity("شماره همراه خود را وارد کنید ");
  } else {
    phoneNumber.setCustomValidity("");
  }
});
phoneNumber.addEventListener("input", ()=> {
  phoneNumber.setCustomValidity("");
});

const studentNumber = document.getElementById("UserRegisterModel_Username");
studentNumber.addEventListener("blur", function () {
  if (!studentNumber.value.trim()) {
    studentNumber.setCustomValidity("شماره دانشجویی خود را وارد کنید ");
  } else {
    studentNumber.setCustomValidity("");
  }
});
studentNumber.addEventListener("input", ()=> {
  studentNumber.setCustomValidity("");
});

const password = document.getElementById("UserRegisterModel_Password");
password.addEventListener("blur", function () {
  if (!password.value.trim()) {
    password.setCustomValidity("کلمه عبور خود را وارد کنید ");
  } else {
    password.setCustomValidity("");
  }
});
password.addEventListener("input", ()=> {
  password.setCustomValidity("");
});

const confirmPassword = document.getElementById("UserRegisterModel_ConfirmPassword");
confirmPassword.addEventListener("blur", function () {
  if (!confirmPassword.value.trim()) {
    confirmPassword.setCustomValidity("کلمه عبور را مجددا وارد کنید ");
  } else {
    confirmPassword.setCustomValidity("");
  }
});
confirmPassword.addEventListener("input", ()=> {
  confirmPassword.setCustomValidity("");
});

//End Of SignUp's Validations
//End Of Validations

function toggleLogInPassword() {
  var passwordField = document.getElementById("UserLogInModel_Password");
  var eyeIcon = document.getElementById("logInEyeIcon");

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
  if (password !== confirmPassword) {
    errorMessage.style.display = "block";
  } else {
    errorMessage.style.display = "none";
  }
}
document.getElementById("Paragraphs").addEventListener("copy", (e) => {
  e.preventDefault();
});
