$(document).ready(function () {
    const $fullName = $('#FullName');
    const $submitBtnName = $('#SubmitBtnName');
    const $nameError = $('#FullNameError');
    const $phoneError = $('#PhoneNumberError');
    const $email = $('#Email');
    const $submitBtnEmail = $('#SubmitBtnEmail');
    const $emailError = $('#EmailError');
    const $submitStudentInformation = $('#submitStudentInformation');

    const $editPhoneModal = $('#UpdatePhoneNumber');

    const $changePasswordForm = $('#ChangePasswordForm');
    const $currentPassword = $('#CurrentPassword');
    const $newPassword = $('#NewPassword');
    const $confirmPassword = $('#ConfirmPassword');
    const $savePasswordBtn = $('#UpdatePassword .btn-danger');
    const $passwordToggles = $('.toggle-password');


    if (!$editPhoneModal.length) {
        return;
    }

    const $step1Form = $('#step-1');
    const $step2Form = $('#step-2');
    const $step3Form = $('#step-3');

    const $stepIndicator1 = $('#step-indicator-1');
    const $stepIndicator2 = $('#step-indicator-2');
    const $stepIndicator3 = $('#step-indicator-3');

    const $phoneInput = $('#PhoneNumber');
    const $sendCodeBtn = $('#sendCodeBtn');

    const $phoneDisplay = $('#PhoneNumberDisplay');
    const $countdownSpan = $('#countdown');
    const $verificationCodeInput = $('#VerificationCode');
    const $verificationCodeError = $('#VerificationCodeError');
    const $verifyCodeBtn = $('#VerifyCodeBtn');
    const $resendCodeLink = $('#ResendCode');

    const $finalPhoneDisplay = $('#FinalPhoneDisplay');

    const $closeButtons = $editPhoneModal.find('[data-bs-dismiss="modal"]');

    let countdownInterval;
    const initialCountdownTime = 120;
    let currentCountdownTime = initialCountdownTime;

    function showStep($formToShow, indicatorNumber) {
        $step1Form.hide();
        $step2Form.hide();
        $step3Form.hide();

        $formToShow.show();

        $stepIndicator1.removeClass('active');
        $stepIndicator2.removeClass('active');
        $stepIndicator3.removeClass('active');

        if (indicatorNumber === 1) $stepIndicator1.addClass('active');
        if (indicatorNumber === 2) $stepIndicator2.addClass('active');
        if (indicatorNumber === 3) $stepIndicator3.addClass('active');
    }

    function startCountdown() {
        clearInterval(countdownInterval);
        currentCountdownTime = initialCountdownTime;
        $resendCodeLink.hide();
        updateCountdownDisplay();

        countdownInterval = setInterval(() => {
            currentCountdownTime--;
            updateCountdownDisplay();
            if (currentCountdownTime <= 0) {
                clearInterval(countdownInterval);
                $resendCodeLink.show();
                $countdownSpan.text('00:00');
            }
        }, 1000);
    }

    function updateCountdownDisplay() {
        const minutes = Math.floor(currentCountdownTime / 60);
        const seconds = currentCountdownTime % 60;
        $countdownSpan.text(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }

    function validateName() {
        const name = $fullName.val().trim();
        $nameError.hide();

        if (!name) {
            $nameError.text('لطفا نام و نام‌خانوادگی را وارد کنید.').show();
            return false;
        }

        const nameParts = name.split(/\s+/).filter(part => part.length > 0);

        if (nameParts.length < 2) {
            $nameError.text('لطفا نام و نام‌خانوادگی خود را کامل وارد کنید.').show();
            return false;
        }

        return true;
    }

    function validateEmail() {
        const email = $email.val().trim();
        $emailError.hide();

        if (!email) {
            $emailError.text('لطفا ایمیل را وارد کنید.').show();
            return false;
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regex.test(email)) {
            $emailError.text('لطفا ایمیل معتبر وارد کنید.').show();
            return false;
        }

        return true;
    }

    $submitBtnName.on('click', function () {
        if (validateName()) {
            modalId = this.getAttribute("data-modal-id");
            submitModalData(modalId);
        }
    });

    $fullName.on('input', function () {
        $nameError.hide();
    });

    $submitBtnEmail.on('click', function () {
        if (validateEmail()) {
            modalId = this.getAttribute("data-modal-id");
            submitModalData(modalId);
        }
    });

    $submitStudentInformation.on('click', function () {
        modalId = this.getAttribute("data-modal-id");
        submitModalData(modalId);
    });

    $email.on('input', function () {
        $emailError.hide();
    });

    $verificationCodeInput.on('input', function () {
        $verificationCodeError.hide();
    });

    $phoneInput.on('input', function () {
        $phoneError.hide();
    });

    $editPhoneModal.on('show.bs.modal', function () {
        showStep($step1Form, 1);
        $phoneInput.val('');
        $verificationCodeInput.val('');
        clearInterval(countdownInterval);
        $resendCodeLink.hide();
    });

    $sendCodeBtn.on('click', function (event) {
        event.preventDefault();

        const phoneNumber = $phoneInput.val().trim();
        if (phoneNumber && phoneNumber.length === 11 && phoneNumber.startsWith('09') && /^\d+$/.test(phoneNumber)) {
            $phoneDisplay.text(phoneNumber);
            showStep($step2Form, 2);
            startCountdown();
        } else {
            $phoneError.text('لطفاً یک شماره همراه معتبر 11 رقمی وارد کنید (شروع با 09 و فقط اعداد).').show();
        }
    });

    $verifyCodeBtn.on('click', function (event) {
        event.preventDefault();

        const verificationCode = $verificationCodeInput.val().trim();
        if (verificationCode && verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
            clearInterval(countdownInterval);
            $finalPhoneDisplay.text($phoneInput.val().trim());
            showStep($step3Form, 3);
        } else {
            $verificationCodeError.text('لطفاً کد تأیید 6 رقمی را به درستی وارد کنید.').show();
        }
    });

    $resendCodeLink.on('click', function (event) {
        event.preventDefault();
        $verificationCodeError.text('کد تایید مجددا ارسال شد.').show();
        startCountdown();
    });

    $closeButtons.on('click', function () {
        clearInterval(countdownInterval);
    });

    function getGenderData() {
        const gender = document.getElementById('gender')?.value || '';

        fetch(`/User/Profile/GetGenderData`)
            .then(res => res.json())
            .then(data => {
                const select = document.getElementById('gender');

                select.innerHTML = '';
                data.gender.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.value;
                    option.text = item.text;
                    option.selected = item.selected;
                    select.appendChild(option);
                });
                getSelfLocationData();
            });
    }

    $passwordToggles.on('click', function () {
        const targetId = $(this).data('target');
        const $input = $('#' + targetId);
        const type = $input.attr('type') === 'password' ? 'text' : 'password';
        $input.attr('type', type);

        $(this)
            .toggleClass('fa-eye fa-eye-slash');
    });

    $savePasswordBtn.on('click', function () {
        let isValid = true;
        $changePasswordForm.find('.invalid-feedback').hide();
        $changePasswordForm.find('.form-control').removeClass('is-invalid');

        const currentVal = $currentPassword.val().trim();
        const newVal = $newPassword.val().trim();
        const confirmVal = $confirmPassword.val().trim();

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(newVal)) {
            showError($newPassword, 'رمز باید حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک و عدد باشد.');
            isValid = false;
        }

        if (currentVal === newVal) {
            showError($newPassword, 'رمز جدید نباید با رمز فعلی یکسان باشد.');
            isValid = false;
        }

        if (newVal !== confirmVal) {
            showError($confirmPassword, 'رمزهای جدید با هم مطابقت ندارند.');
            isValid = false;
        }

        if (isValid) {
            $changePasswordForm[0].reset();
            $('#UpdatePassword').modal('hide');
        }
    });

    function showError($input, message) {
        const $feedback = $('.invalid-feedback');

        $feedback.text(message).show();
        $input.removeClass('is-invalid');
    }
    $('#UpdatePassword').on('hidden.bs.modal', function () {
    const $form = $('#ChangePasswordForm');
    $form[0].reset();

    $form.find('.form-control').removeClass('is-invalid border-danger');
    $form.find('.invalid-feedback').hide();
    });


    //Call the fuctions here that need to executen when page is loaded.
    getGenderData();

        const genderOptions = document.querySelectorAll('.gender-option');
    const maleSelfContainer = document.getElementById('MaleSelfContainer');
    const femaleSelfContainer = document.getElementById('FemaleSelfContainer');
    const allSelfOptions = document.querySelectorAll('.self-option');
    const saveButton = document.getElementById('SubmitBtnGender');

    function hideAllSelfContainers() {
      maleSelfContainer.classList.add('d-none');
      femaleSelfContainer.classList.add('d-none');
    }

    function deselectAllSelfOptions() {
      allSelfOptions.forEach(opt => opt.classList.remove('selected'));
    }

    genderOptions.forEach(option => {
      option.addEventListener('click', () => {
        genderOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        option.querySelector('input[type="radio"]').checked = true;

        hideAllSelfContainers();
        deselectAllSelfOptions();

        const selectedGender = option.querySelector('input[type="radio"]').value;
        if (selectedGender === 'Male') {
          maleSelfContainer.classList.remove('d-none');
        } else {
          femaleSelfContainer.classList.remove('d-none');
        }
      });
    });

    allSelfOptions.forEach(option => {
      option.addEventListener('click', () => {
        const parent = option.closest('.d-flex');
        parent.querySelectorAll('.self-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
      });
    });

    saveButton.addEventListener('click', () => {
      const selectedGenderInput = document.querySelector('.gender-option.selected input[type="radio"]');
      const selectedGender = selectedGenderInput ? selectedGenderInput.value : null;
      let selectedSelf = null;

      if (selectedGender === 'Male') {
        const sel = maleSelfContainer.querySelector('.self-option.selected');
        selectedSelf = sel ? sel.dataset.value : null;
      } else if (selectedGender === 'Female') {
        const sel = femaleSelfContainer.querySelector('.self-option.selected');
        selectedSelf = sel ? sel.dataset.value : null;
      }

      if (selectedGender && selectedSelf) {
        alert(`جنسیت انتخاب شده: ${selectedGender === 'Male' ? 'مرد' : 'زن'}\nسلف انتخاب شده: ${selectedSelf}`);
        const modal = bootstrap.Modal.getInstance(document.getElementById('UpdateGender'));
        modal.hide(); // بستن مودال بعد از ذخیره
      } else if (selectedGender) {
        alert('لطفا سلف را انتخاب کنید.');
      } else {
        alert('لطفا جنسیت را انتخاب کنید.');
      }
    });

    // ریست در هنگام باز شدن مودال
    document.getElementById('UpdateGender').addEventListener('show.bs.modal', () => {
      genderOptions.forEach(opt => opt.classList.remove('selected'));
      hideAllSelfContainers();
      deselectAllSelfOptions();
    });
});


function getSelfLocationData() {
    const genderId = document.getElementById('gender')?.value || '';

    fetch(`/User/Profile/GetSelfLocationsData?genderId=${genderId}`)
        .then(res => res.json())
        .then(data => {
            populateSelectsFromBackendData(data);
        })
        .catch(err => {
            console.error('Error loading data:', err);
        });
}

function populateSelectsFromBackendData(data) {
    Object.entries(data).forEach(([key, items]) => {
        const select = document.getElementById(key);
        if (!select || !Array.isArray(items)) return;

        select.innerHTML = '';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.text = item.text;
            option.selected = item.selected;
            select.appendChild(option);
        });
    });
}

async function submitModalData(modalId) {
    const modal = document.getElementById(`Update${modalId}`);

    const inputs = modal.querySelectorAll('input, select, textarea');
    const errorDiv = modal.querySelector(`[id$="${modalId}Error"]`);

    if (errorDiv) {
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
    }

    const formData = new FormData();

    inputs.forEach(input => {
        const id = input.id;
        const value = input.value.trim();

        if (id) {
            formData.append(id, value);
        }
    });

    var url = `/Users/Profile/Update${modalId}`;

    const response = await fetch(url, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = extractFirstModelError(errorData);
        errorDiv.textContent = errorMessage || "خطا در ارسال اطلاعات";
        errorDiv.style.display = "block";
        return;
    }

    inputs.forEach(input => {
        const id = input.id;
        const value = input.value.trim();

        if (id) {
            var span = document.getElementById(`${id}Span`);
            span.textContent = value;
        }
    });
    $(`#Update${modalId}`).modal('hide');
}

function extractFirstModelError(errorObj) {
    if (!errorObj || typeof errorObj !== 'object') return null;

    const errors = Object.values(errorObj);

    if (!errors || errors.length === 0) return null;

    const firstArray = errors[0];
    return Array.isArray(firstArray) && firstArray.length > 0 ? firstArray[0] : null;
}