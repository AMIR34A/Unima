$(document).ready(function () {
    const $fullName = $('#Fullname');
    const $submitBtnName = $('#submitBtnName');
    const $nameError = $('#nameError');
    const $phoneError = $('#phoneError');
    const $email = $('#email');
    const $submitBtnEmail = $('#submitBtnEmail');
    const $emailError = $('#emailError');
    const $submitBtnCode = $('#submitBtncode');

    const $editPhoneModal = $('#editphone');
    if (!$editPhoneModal.length) {
        return;
    }

    const $step1Form = $('#step-1');
    const $step2Form = $('#step-2');
    const $step3Form = $('#step-3');

    const $stepIndicator1 = $('#step-indicator-1');
    const $stepIndicator2 = $('#step-indicator-2');
    const $stepIndicator3 = $('#step-indicator-3');

    const $phoneInput = $('#phone');
    const $sendCodeBtn = $('#sendCodeBtn');

    const $phoneDisplay = $('#phoneDisplay');
    const $countdownSpan = $('#countdown');
    const $verificationCodeInput = $('#verificationCode');
    const $verificationCodeError = $('#verificationCodeError');
    const $verifyCodeBtn = $('#verifyCodeBtn');
    const $resendCodeLink = $('#resendCode');

    const $finalPhoneDisplay = $('#finalPhoneDisplay');

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
            $('#editname').modal('hide');
        }
    });

    $fullName.on('input', function () {
        $nameError.hide();
    });

    $submitBtnEmail.on('click', function () {
        if (validateEmail()) {
            $('#editemail').modal('hide');
        }
    });

    $submitBtnCode.on('click', function () {
        $('#editemail').modal('hide');
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

    //Call the fuctions here that need to executen when page is loaded.
    getGenderData();
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