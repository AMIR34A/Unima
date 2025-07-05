$(document).ready(function () {
    const modalIds = ['UpdateFullName', 'UpdatePhoneNumber', 'UpdatePassword', 'UpdateGender', 'UpdateInformation'];

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

    const genderOptions = document.querySelectorAll('.gender-option');
    const maleSelfContainer = document.getElementById('MaleSelfContainer');
    const femaleSelfContainer = document.getElementById('FemaleSelfContainer');
    const allSelfOptions = document.querySelectorAll('.self-option');
    const saveButton = document.getElementById('SubmitBtnGender');
    const $ErrorGender = $('#ErrorGender');


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

    $sendCodeBtn.on('click', async function (event) {
        event.preventDefault();

        const phoneNumber = $phoneInput.val().trim();
        if (phoneNumber && phoneNumber.length === 11 && phoneNumber.startsWith('09') && /^\d+$/.test(phoneNumber)) {
            const formData = new FormData();
            formData.append('PhoneNumber', phoneNumber);

            var url = '/Users/Profile/UpdatePhoneNumber';

            const response = await fetch(url, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                var errorMessage = extractFirstModelError(errorData) || 'خطایی رخ داد';
                $phoneError.text(errorMessage).show();
                return;
            }

            $phoneDisplay.text(phoneNumber);
            showStep($step2Form, 2);
            startCountdown();
        }
        else {
            $phoneError.text('لطفاً یک شماره همراه معتبر 11 رقمی وارد کنید (شروع با 09 و فقط اعداد).').show();
        }
    });

    $verifyCodeBtn.on('click', async function (event) {
        event.preventDefault();

        const phoneNumber = $phoneInput.val().trim();
        const verificationCode = $verificationCodeInput.val().trim();
        if (phoneNumber && verificationCode && verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
            clearInterval(countdownInterval);

            const formData = new FormData();
            formData.append('PhoneNumber', phoneNumber);
            formData.append('Token', verificationCode);

            var url = '/Users/Profile/VerifyPhoneNumber';

            const response = await fetch(url, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                var errorMessage = extractFirstModelError(errorData) || 'خطایی رخ داد';
                $verificationCodeError.text(errorMessage).show();
                return;
            }

            $finalPhoneDisplay.text(phoneNumber);
            var span = document.getElementById('PhoneNumberSpan');
            span.textContent = phoneNumber;
            showStep($step3Form, 3);
        }
        else {
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

    //gender

    function hideAllSelfContainers() {
        maleSelfContainer.classList.add('d-none');
        femaleSelfContainer.classList.add('d-none');
    }

    function deselectAllSelfOptions() {
        document.querySelectorAll('.self-option').forEach(opt => opt.classList.remove('selected'));
    }

    document.getElementById('GenderContainer').addEventListener('click', function (e) {
        const option = e.target.closest('.gender-option');
        if (!option) return;

        document.querySelectorAll('.gender-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        const input = option.querySelector('input[type="radio"]');
        input.checked = true;

        hideAllSelfContainers();
        deselectAllSelfOptions();

        const selectedGender = input.value;
        if (selectedGender === '1') {
            maleSelfContainer.classList.remove('d-none');
        } else {
            femaleSelfContainer.classList.remove('d-none');
        }

        $ErrorGender.addClass('d-none').text('');
    });


    document.addEventListener('click', function (e) {
        const selfOption = e.target.closest('.self-option');
        if (!selfOption) return;

        const parent = selfOption.closest('.d-flex');
        if (!parent) return;

        parent.querySelectorAll('.self-option').forEach(opt => opt.classList.remove('selected'));
        selfOption.classList.add('selected');

        $ErrorGender.addClass('d-none').text('');
    });


    saveButton.addEventListener('click', () => {
        $ErrorGender.addClass('d-none').text('');

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
            const modal = bootstrap.Modal.getInstance(document.getElementById('UpdateGender'));
            modal.hide();
        } else {
            if (!selectedGender) {
                $ErrorGender.removeClass('d-none').text('لطفا جنسیت خود را وارد کنید.');
            } else {
                $ErrorGender.removeClass('d-none').text('لطفا سلف پیش‌فرض خود را وارد کنید.');
            }
        }
    });

    document.getElementById('UpdateGender').addEventListener('show.bs.modal', () => {
        //genderOptions.forEach(opt => opt.classList.remove('selected'));
        //hideAllSelfContainers();
        //deselectAllSelfOptions();
        $ErrorGender.addClass('d-none').text('');
    });

    modalIds.forEach(function (modalId) {
        $('#' + modalId).on('hide.bs.modal', function () {
            document.activeElement.blur();
            $('body').focus();
        });
    });

    //Call the fuctions here that need to executen when page is loaded.
    getGenderData();
});


$(function () {
    $('#submitStudentInformation').on('click', function (e) {
        e.preventDefault();

        const studentcode = $('#StudentCode').val().trim();
        const selfPassword = $('#SelfPassword').val().trim();

        $('#ErrorStudentCode').hide();

        if (!/^\d{10}$/.test(studentcode)) {
            $('#ErrorStudentCode').text('کد دانشجویی باید دقیقاً ۱۰ رقم باشد.').show();
            return;
        }
        if (selfPassword === '') {
            $('#ErrorStudentCode').text('رمز سلف خود را وارد کنید.').show();
            return;
        }
        $('#StudentForm').submit();
    });
});

function getGenderData() {
    fetch(`/User/Profile/GetGenderData`)
        .then(res => res.json())
        .then(data => {
            const genderOptionsData = data.gender;
            const genderContainer = document.getElementById('GenderContainer');

            // Remove old options (except the title)
            const children = Array.from(genderContainer.children).slice(1);
            children.forEach(child => child.remove());

            genderOptionsData.forEach(item => {
                const id = item.value === "1" ? "Male" : "Female";
                const icon = item.value === "1" ? "👨🏻" : "👩🏻";

                const col = document.createElement('div');
                col.className = 'col-5 col-sm-4 col-md-3';

                const genderOption = document.createElement('div');
                genderOption.className = `gender-option border rounded p-3 ${item.selected ? 'selected' : ''}`;
                genderOption.id = `${id}Option`;

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'gender';
                input.id = id;
                input.value = item.value;
                input.className = 'd-none w-100 h-100';
                if (item.selected) input.checked = true;

                const iconDiv = document.createElement('div');
                iconDiv.className = 'gender-icon';
                iconDiv.textContent = icon;

                const label = document.createElement('label');
                label.htmlFor = id;
                label.className = 'fw-bold d-block mt-2';
                label.textContent = item.text;

                genderOption.appendChild(input);
                genderOption.appendChild(iconDiv);
                genderOption.appendChild(label);
                col.appendChild(genderOption);
                genderContainer.appendChild(col);
            });

            getSelfLocationData();
        });
}

function getSelfLocationData() {
    fetch('/User/Profile/GetSelfLocationsData')
        .then(res => res.json())
        .then(data => {
            populateSelfOptions("Male", data.maleSelfLocations);
            populateSelfOptions("Female", data.femaleSelfLocations);
        });
}

function populateSelfOptions(gender, options) {
    const container = document.getElementById(`${gender}SelfContainer`);
    const selfOption = document.getElementById(`${gender}SelfOption`);
    selfOption.innerHTML = '';
    container.classList.add('d-none');

    options.forEach(option => {
        const div = document.createElement('div');
        div.className = 'border rounded p-2 px-4 self-option';
        div.dataset.value = option.value;
        div.textContent = option.text;

        if (option.selected) {
            div.classList.add('selected');
            container.classList.remove('d-none');
        }

        selfOption.appendChild(div);
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