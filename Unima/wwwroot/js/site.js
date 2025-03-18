const logInPanel = document.getElementById("logInPanel");
const registerPanel = document.getElementById("registerPanel");
const showSignupBtn = document.getElementById("showSignup");
const showLoginBtn = document.getElementById("showLogin");

showSignupBtn.addEventListener("click", (event) => {
    event.preventDefault();
    setTimeout(() => {
        logInPanel.classList.add("hidden");
        registerPanel.classList.remove("hidden");
        setupValidations();
    }, 0);
});
showLoginBtn.addEventListener("click", (event) => {
    event.preventDefault();
    setTimeout(() => {
        registerPanel.classList.add("hidden");
        logInPanel.classList.remove("hidden");
        setupValidations();
    }, 0);
});
// Input's Validations
//Login's Validations

function setupValidations() {
    logInPanel.querySelectorAll("input").forEach(input => input.focus());
    registerPanel.querySelectorAll("input").forEach(input => input.focus());
}

const nameInput = document.getElementById("UserLogInModel_Username");
nameInput.addEventListener("blur", function () {
    if (!nameInput.value.trim()) {
        nameInput.setCustomValidity("وارد نمودن شماره دانشجویی الزامی است");
    } else {
        nameInput.setCustomValidity("");
    }
});

nameInput.addEventListener("input", function () {
    nameInput.setCustomValidity("");
});
const passInput = document.getElementById("UserLogInModel_Password");
passInput.addEventListener("blur", function () {
    if (!passInput.value.trim()) {
        passInput.setCustomValidity("وارد نمودن کلمه عبور الزامی است");
    } else passInput.setCustomValidity("");
});
passInput.addEventListener("input", () => {
    passInput.setCustomValidity("");
});
// End Of Login's Validations

//SignUp's Validations
const fullName = document.getElementById("UserRegisterModel_FullName");
fullName.addEventListener("blur", function () {
    if (!fullName.value.trim()) {
        fullName.setCustomValidity("وارد نمودن نام و نام‌خانوادگی الزامی است");
    } else fullName.setCustomValidity("");
});
fullName.addEventListener("input", () => {
    fullName.setCustomValidity("");
});

const phoneNumber = document.getElementById("UserRegisterModel_PhoneNumber");
phoneNumber.addEventListener("blur", function () {
    if (!phoneNumber.value.trim()) {
        phoneNumber.setCustomValidity("وارد نمودن تلفن همراه الزامی است");
    } else {
        phoneNumber.setCustomValidity("");
    }
});
phoneNumber.addEventListener("input", () => {
    phoneNumber.setCustomValidity("");
});

const studentNumber = document.getElementById("UserRegisterModel_Username");
studentNumber.addEventListener("blur", function () {
    if (!studentNumber.value.trim()) {
        studentNumber.setCustomValidity("وارد نمودن شماره دانشجویی الزامی است");
    } else {
        studentNumber.setCustomValidity("");
    }
});
studentNumber.addEventListener("input", () => {
    studentNumber.setCustomValidity("");
});

const password = document.getElementById("UserRegisterModel_Password");
password.addEventListener("blur", function () {
    if (!password.value.trim()) {
        password.setCustomValidity("وارد نمودن کلمه عبور الزامی است");
    } else {
        password.setCustomValidity("");
    }
});
password.addEventListener("input", () => {
    password.setCustomValidity("");
});

const confirmPassword = document.getElementById(
    "UserRegisterModel_ConfirmPassword"
);
confirmPassword.addEventListener("blur", function () {
    if (!confirmPassword.value.trim()) {
        confirmPassword.setCustomValidity("وارد نمودن تکرار کلمه عبور الزامی است");
    } else {
        confirmPassword.setCustomValidity("");
    }
});
confirmPassword.addEventListener("input", () => {
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

function toggleSignUpPassword() {
    var signUpPasswordField = document.getElementById(
        "UserRegisterModel_Password"
    );
    var signUpConfirmPasswordField = document.getElementById(
        "UserRegisterModel_ConfirmPassword"
    );
    var signUpEyeIcon = document.getElementById("signUpEyeIcon");

    if (signUpPasswordField.type === "text") {
        signUpPasswordField.type = "password";
        signUpConfirmPasswordField.type = "password";
        signUpEyeIcon.classList.remove("fa-eye-slash");
        signUpEyeIcon.classList.add("fa-eye");
    } else {
        signUpPasswordField.type = "text";
        signUpConfirmPasswordField.type = "text";
        signUpEyeIcon.classList.remove("fa-eye");
        signUpEyeIcon.classList.add("fa-eye-slash");
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

function loadingAnimation() {
    const loginBtn = document.getElementById("loginBtn");
    const signUpBtn = document.getElementById("signUpBtn");
    const loginLoader = document.getElementById("loginLoading");
    const signUpLoader = document.getElementById("signUpLoading");
    loginLoader.classList.remove("d-none");
    signUpLoader.classList.remove("d-none");
    loginBtn.firstChild.nodeValue = "";
    signUpBtn.firstChild.nodeValue = "";
    loginBtn.disabled = "true";
    signUpBtn.disabled = "true";
}

function setupGoogleCaptcha() {
    var logInForm = document.getElementById("logInForm");
    var registerForm = document.getElementById("registerForm");

    logInForm.addEventListener("submit", function (event) {
        event.preventDefault();

        grecaptcha.ready(function () {
            grecaptcha.execute('6Lfud-sqAAAAAJhCHcjpYSLRi3ZC1o41i2mWoYYj', { action: 'submit' })
                .then(function (token) {
                    if (token) {
                        document.getElementById("UserLogInModel_GoogleCaptchaResponse").value = token;
                        logInForm.submit()
                    }
                });
        });
    });

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        grecaptcha.ready(function () {
            grecaptcha.execute('6Lfud-sqAAAAAJhCHcjpYSLRi3ZC1o41i2mWoYYj', { action: 'submit' })
                .then(function (token) {
                    if (token) {
                        document.getElementById("UserRegisterModel_GoogleCaptchaResponse").value = token;
                        registerForm.submit()
                    }
                });
        });
    });
}