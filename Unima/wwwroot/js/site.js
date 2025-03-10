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
8605030085911335
var nameInput = document.getElementById("UserLogInModel_Username");
nameInput.addEventListener("input", function () {
    if (!nameInput.value) {
        nameInput.setCustomValidity("لطفا نام کاربری خود را وارد کنید");
    } else {
        nameInput.setCustomValidity("");
    }
});
nameInput.addEventListener("input", function () {
    nameInput.setCustomValidity("");
});
const passInput = document.getElementById("UserLogInModel_Password");
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
    var confirmPassword = document.getElementById("UserRegisterModel_ConfirmPassword").value;

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