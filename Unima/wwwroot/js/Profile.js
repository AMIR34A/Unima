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
    const $confirmNewPassword = $('#ConfirmNewPassword');
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
    const initialCountdownTime = 60;
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
            $nameError.text(' نام و نام‌خانوادگی را وارد کنید.').show();
            return false;
        }

        const nameParts = name.split(/\s+/).filter(part => part.length > 0);

        if (nameParts.length < 2) {
            $nameError.text(' نام و نام‌خانوادگی خود را کامل وارد کنید.').show();
            return false;
        }

        return true;
    }

    function validateEmail() {
        const email = $email.val().trim();
        $emailError.hide();

        if (!email) {
            $emailError.text(' ایمیل را وارد کنید.').show();
            return false;
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regex.test(email)) {
            $emailError.text(' ایمیل معتبر وارد کنید.').show();
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
            $phoneError.text('ً یک شماره همراه معتبر 11 رقمی وارد کنید (شروع با 09 و فقط اعداد).').show();
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
            $verificationCodeError.text('ً کد تأیید 6 رقمی را به درستی وارد کنید.').show();
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
        const confirmVal = $confirmNewPassword.val().trim();

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
            showError($confirmNewPassword, 'رمزهای جدید با هم مطابقت ندارند.');
            isValid = false;
        }

        if (isValid) {
            modalId = this.getAttribute("data-modal-id");
            submitModalData(modalId, false, false);
            $changePasswordForm[0].reset();
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

        const input = document.getElementById('Gender');
        input.value = option.getAttribute('data-GenderId');
        input.setAttribute('data-TextValue', option.getAttribute('data-TextValue'));

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

        const defaultSelfLocationInput = document.getElementById('DefaultSelfLocation');
        defaultSelfLocationInput.value = selfOption.getAttribute('data-DefaultSelfLocationId');
        defaultSelfLocationInput.setAttribute('data-TextValue', selfOption.getAttribute('data-TextValue'));

        const parent = selfOption.closest('.d-flex');
        if (!parent) return;

        parent.querySelectorAll('.self-option').forEach(opt => opt.classList.remove('selected'));
        selfOption.classList.add('selected');

        $ErrorGender.addClass('d-none').text('');
    });


    saveButton.addEventListener('click', () => {
        $ErrorGender.addClass('d-none').text('');

        const selectedGenderInput = document.getElementById('Gender');
        const selectedGender = selectedGenderInput ? selectedGenderInput.value : null;
        let selectedSelf = null;

        if (selectedGender === '1') {
            const sel = maleSelfContainer.querySelector('.self-option.selected');
            selectedSelf = sel ? sel.dataset.value : null;
        } else if (selectedGender === '2') {
            const sel = femaleSelfContainer.querySelector('.self-option.selected');
            selectedSelf = sel ? sel.dataset.value : null;
        }

        if (selectedGender && selectedSelf) {
            submitModalData('PersonalInformation', true);
        } else {
            if (!selectedGender) {
                $ErrorGender.removeClass('d-none').text(' جنسیت خود را وارد کنید.');
            } else {
                $ErrorGender.removeClass('d-none').text(' سلف پیش‌فرض خود را وارد کنید.');
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
    $('#submitStudentInformation').on('click', function (SubmitInformation) {
        SubmitInformation.preventDefault();

        const username = $('#Username').val().trim();
        const selfPassword = $('#SelfPassword').val().trim();

        $('#ErrorStudentCode').hide();

        if (!/^\d{10}$/.test(username)) {
            $('#ErrorStudentCode').text('کد دانشجویی باید دقیقاً ۱۰ رقم باشد.').show();
            return;
        }
        if (selfPassword === '') {
            $('#ErrorStudentCode').text('رمز سلف خود را وارد کنید.').show();
            return;
        }

        modalId = this.getAttribute("data-modal-id");
        submitModalData(modalI);
    });
});

function getGenderData() {
    fetch(`/User/Profile/GetGenderData`)
        .then(res => res.json())
        .then(data => {
            const genderOptionsData = data.gender;
            const genderContainer = document.getElementById('GenderContainer');

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
                genderOption.setAttribute('data-GenderId', item.value);
                genderOption.setAttribute('data-TextValue', item.text);

                const iconDiv = document.createElement('div');
                iconDiv.className = 'gender-icon';
                iconDiv.textContent = icon;

                const label = document.createElement('label');
                label.htmlFor = id;
                label.className = 'fw-bold d-block mt-2';
                label.textContent = item.text;

                genderOption.appendChild(iconDiv);
                genderOption.appendChild(label);
                col.appendChild(genderOption);
                genderContainer.appendChild(col);

                if (item.selected) {
                    const genderInput = document.getElementById('Gender');
                    genderInput.value = item.value;
                    genderInput.setAttribute('data-TextValue', item.text);
                }
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
        div.setAttribute('data-DefaultSelfLocationId', option.value);
        div.setAttribute('data-TextValue', option.text);
        div.dataset.value = option.value;
        div.textContent = option.text;

        if (option.selected) {
            div.classList.add('selected');
            container.classList.remove('d-none');

            const defaultSelfLocationInput = document.getElementById('DefaultSelfLocation');
            defaultSelfLocationInput.value = option.value;
            defaultSelfLocationInput.setAttribute('data-TextValue', option.text);
        }

        selfOption.appendChild(div);
    });
}


async function submitModalData(modalId, isSetTextValue = false, updateTheSpan = true) {
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

    if (modalId == 'Password') {
        window.location.replace('/Account/Index');
    }

    inputs.forEach(input => {
        const id = input.id;
        const value = input.value.trim();
        const textValue = input.getAttribute('data-TextValue');
        if (updateTheSpan && id) {
            var span = document.getElementById(`${id}Span`);
            span.textContent = isSetTextValue ? textValue : value;
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

document.addEventListener('DOMContentLoaded', function () {
    var fillInputLink = document.getElementById('FillInput');
    var studentCodeSpan = document.querySelector('.StudentCodeNumber');
    var usernameInput = document.getElementById('Username');

    const updateInformationModal = document.getElementById('UpdateInformation');

    if (fillInputLink && studentCodeSpan && usernameInput) {
        fillInputLink.addEventListener('click', function () {
            var username = studentCodeSpan.textContent;
            usernameInput.value = username;
        });
    }

    if (updateInformationModal) {
        updateInformationModal.addEventListener('hidden.bs.modal', function () {
            const textInputs = this.querySelectorAll('input, textarea');

            textInputs.forEach(input => {
                input.value = '';
            });
        });
    }

    const scheduleModalEl = document.getElementById('scheduleModal');
    const classFormModalEl = document.getElementById('classFormModal');
    const classForm = document.getElementById('classForm');
    const classFormModalTitle = document.getElementById('classFormModalLabel');
    const deleteClassBtn = document.getElementById('deleteClassBtn');
    const scheduleTableBody = scheduleModalEl.querySelector('tbody');

    const scheduleModal = new bootstrap.Modal(scheduleModalEl);
    const classFormModal = new bootstrap.Modal(classFormModalEl);

    let currentCell = null;
    let currentScheduleItem = null;

    const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه"];
    const times = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"];

    const facultyMap = {
        'ریاضی عمومی ۱': 'علوم پایه',
        'برنامه نویسی پیشرفته': 'فنی و مهندسی',
        'ساختمان داده': 'فنی و مهندسی',
        'سیستم عامل': 'فنی و مهندسی',
    };
    const weekTypeClasses = { 'ثابت': 'week-fixed', 'زوج': 'week-even', 'فرد': 'week-odd' };

    function initializeSelect2() {
        $('#classFormModal select').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#classFormModal'),
            language: "fa",
            placeholder: "انتخاب کنید...",
            allowClear: true
        });
    }

    function hasConflict(data) {
        const allItemsInCell = Array.from(currentCell.querySelectorAll('.schedule-item'));
        const otherItems = allItemsInCell.filter(item => item !== currentScheduleItem);
        const otherWeekTypes = otherItems.map(item => item.dataset.weekType);

        if (otherWeekTypes.includes('ثابت') || (data.weekType === 'ثابت' && otherItems.length > 0) || otherWeekTypes.includes(data.weekType)) {
            return true;
        }
        return false;
    }

    function createScheduleItemElement(data) {
        const item = document.createElement('div');
        item.className = `schedule-item ${weekTypeClasses[data.weekType]}`;
        item.dataset.weekType = data.weekType;
        item.innerHTML = `
                <p class="mb-0" data-course-name="${data.courseName}"><strong>${data.courseName}</strong></p>
                <p class="mb-0 small text-muted">گروه: ${data.groupNumber} | کلاس: ${data.classNumber}</p>
            `;
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.title = 'ویرایش';
        editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
        editBtn.onclick = (e) => handleEditClick(e, item);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'حذف';
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        deleteBtn.onclick = (e) => handleDeleteClick(e, item);

        actionButtons.append(editBtn, deleteBtn);
        item.appendChild(actionButtons);
        return item;
    }

    function updateActionButtonsInCell(cell) {
        if (!cell) return;
        const items = Array.from(cell.querySelectorAll('.schedule-item'));
        const weekTypes = items.map(item => item.dataset.weekType);
        const hasOdd = weekTypes.includes('فرد');
        const hasEven = weekTypes.includes('زوج');

        items.forEach(item => {
            const actionButtons = item.querySelector('.action-buttons');
            let addBtn = item.querySelector('.add-other-week-btn');
            const itemWeekType = item.dataset.weekType;

            if (addBtn) addBtn.remove();

            if ((itemWeekType === 'فرد' && !hasEven) || (itemWeekType === 'زوج' && !hasOdd)) {
                const otherWeekType = itemWeekType === 'فرد' ? 'زوج' : 'فرد';
                addBtn = document.createElement('button');
                addBtn.className = 'add-other-week-btn';
                addBtn.title = `افزودن هفته ${otherWeekType}`;
                addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
                addBtn.onclick = (e) => {
                    e.stopPropagation();
                    currentCell = cell;
                    currentScheduleItem = null;
                    openFormModal(null, otherWeekType);
                };
                actionButtons.appendChild(addBtn);
            }
        });
    }

    function updateCellPlaceholder(cell) {
        if (!cell) return;
        const container = cell.querySelector('.schedule-item-container');
        if (!container || container.children.length === 0) {
            cell.innerHTML = '<div class="cell-actions"><button class="add-btn"><i class="fa-solid fa-plus"></i></button></div>';
        }
    }

    function handleAddClick(cell) {
        currentCell = cell;
        currentScheduleItem = null;
        openFormModal();
    }

    function handleEditClick(e, item) {
        e.stopPropagation();
        currentCell = item.closest('td');
        currentScheduleItem = item;
        openFormModal(item);
    }

    function handleDeleteClick(e, item) {
        e.stopPropagation();
        const cell = item.closest('td');
        item.remove();
        updateCellPlaceholder(cell);
        updateActionButtonsInCell(cell);
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        const select = document.getElementById('course-name');
        const selectedValue = select.value;
        const selectedText = select.options[select.selectedIndex].text;
        const selectedNo = select.options[select.selectedIndex].dataset.no;
        const formData = {
            courseName: selectedText,
            groupNumber: selectedNo,
            classNumber: $('#class-number').val(),
            weekType: $('#week-type').val()
        };

        if (!formData.courseName || !formData.classNumber) {
            alert('لطفاً تمام فیلدها را پر کنید.');
            return;
        }
        if (hasConflict(formData)) {
            alert('تداخل زمانی وجود دارد. امکان ثبت این کلاس وجود ندارد.');
            return;
        }

        url = `/User/Profile/AddSchedule/${selectedValue}`;

        var scheduleModel = {
            RoomNo: 1,
            DayOfWeek: currentCell.dataset.dayindex,
            WeekStatus: $('#week-type').val() == "ثابت" ? 0 : $('#week-type').val() == "زوج" ? 1 : 2,
            Period: currentCell.dataset.period,
        }
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(scheduleModel)
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = extractFirstModelError(errorData);
            errorDiv.textContent = errorMessage || "خطا در ارسال اطلاعات";
            errorDiv.style.display = "block";
            return;
        }
        const newItem = createScheduleItemElement(formData);
        if (currentScheduleItem) {
            currentScheduleItem.replaceWith(newItem);
        } else {
            let container = currentCell.querySelector('.schedule-item-container');
            if (!container) {
                currentCell.innerHTML = '';
                container = document.createElement('div');
                container.className = 'schedule-item-container';
                currentCell.appendChild(container);
            }
            container.appendChild(newItem);
        }
        updateActionButtonsInCell(currentCell);
        classFormModal.hide();
    }

    function openFormModal(itemToEdit = null, preselectedWeekType = null) {
        classForm.reset();
        $('#classFormModal select').val(null).trigger('change');

        const day = currentCell.dataset.day;
        const time = currentCell.dataset.time;
        classFormModalTitle.innerHTML = `کلاس برای: <small class="text-black-50">${day}، ${time}</small>`;

        fetch(`/User/Profile/GetLessons`)
            .then(res => res.json())
            .then(data => {
                const select = document.getElementById('course-name');
                select.innerHTML = '';

                data.forEach(lesson => {
                    const option = document.createElement('option');
                    option.value = lesson.id;
                    option.textContent = lesson.value;
                    option.dataset.no = lesson.no;
                    select.appendChild(option);
                });
            });
        if (itemToEdit) {
            const textContent = itemToEdit.querySelector('.small.text-muted').innerText;
            const data = {
                courseName: itemToEdit.querySelector('[data-course-name]').dataset.courseName,
                groupNumber: textContent.match(/گروه: (\d+)/)[1],
                classNumber: textContent.match(/کلاس: (\d+)/)[1],
                weekType: itemToEdit.dataset.weekType,
            };

            $('#course-name').val(data.courseName).trigger('change');
            $('#group-number').val(data.groupNumber).trigger('change');
            $('#faculty').val(facultyMap[data.courseName] || '').trigger('change');
            $('#class-number').val(data.classNumber).trigger('change');
            $('#week-type').val(data.weekType).trigger('change');
            $('#week-type').prop('disabled', false);
            deleteClassBtn.style.display = 'block';

        } else {
            $('#week-type').val(preselectedWeekType || 'ثابت').trigger('change');
            $('#week-type').prop('disabled', !!preselectedWeekType);
            deleteClassBtn.style.display = 'none';
        }
        classFormModal.show();
    }

    function initializeTable() {
        scheduleTableBody.innerHTML = '';
        days.forEach(day => {
            const row = document.createElement('tr');
            row.innerHTML = `<th>${day}</th>` + times.map(time =>
                `<td data-day="${day}" data-time="${time}">
                        <div class="cell-actions"><button class="add-btn"><i class="fa-solid fa-plus"></i></button></div>
                    </td>`
            ).join('');
            scheduleTableBody.appendChild(row);
        });
    }

    function initializeApp() {
        //initializeTable();
        scheduleTableBody.addEventListener('click', (e) => {
            const target = e.target;
            const cell = target.closest('td[data-day]');
            if (cell && target.closest('.add-btn')) {
                handleAddClick(cell);
            }
        });
        classForm.addEventListener('submit', onFormSubmit);
        deleteClassBtn.addEventListener('click', () => {
            if (currentScheduleItem) {
                handleDeleteClick(new Event('click'), currentScheduleItem);
                classFormModal.hide();
            }
        });
        classFormModalEl.addEventListener('shown.bs.modal', initializeSelect2);
    }
    initializeApp();


    const addCourseBtn = document.getElementById('addCourseBtn');
    const courseForm = document.getElementById('courseForm');
    const saveCourseBtn = document.getElementById('saveCourseBtn');
    const coursesTableBody = document.getElementById('coursesTableBody');
    const courseModalTitle = document.getElementById('courseModalTitle');
    const courseIdInput = document.getElementById('courseId');
    const courseNameInput = document.getElementById('courseName');
    const courseCodeInput = document.getElementById('courseCode');
    const courseGroupInput = document.getElementById('courseGroup');
    const courseFormModal = new bootstrap.Modal(document.getElementById('courseFormModal'));
    const coursesListModal = new bootstrap.Modal(document.getElementById('coursesListModal'));

    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', () => {
            courseForm.reset();
            courseIdInput.value = '';
            courseCodeInput.disabled = false;
            courseGroupInput.disabled = false;
            courseForm.classList.remove('was-validated');

            courseModalTitle.textContent = 'افزودن درس جدید';
            saveCourseBtn.textContent = 'ذخیره';
            saveCourseBtn.className = 'btn btn-danger';

            coursesListModal.hide();
            courseFormModal.show();
        });
    }

    if (saveCourseBtn) {
        saveCourseBtn.addEventListener('click', async function () {
            if (!courseForm.checkValidity()) {
                courseForm.classList.add('was-validated');
                return;
            }
            const courseId = courseIdInput.value;
            var url = '';

            var lessonModel =
            {
                Title: courseNameInput.value,
                No: courseCodeInput.value,
                GroupNo: courseGroupInput.value
            };


            if (courseId) {
                url = `/User/Profile/UpdateLesson/${courseId}`;

                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(lessonModel)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = extractFirstModelError(errorData);
                    errorDiv.textContent = errorMessage || "خطا در ارسال اطلاعات";
                    errorDiv.style.display = "block";
                    return;
                }

                updateCourse(courseId);
            } else {
                url = '/User/Profile/AddLesson';

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(lessonModel)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = extractFirstModelError(errorData);
                    errorDiv.textContent = errorMessage || "خطا در ارسال اطلاعات";
                    errorDiv.style.display = "block";
                    return;
                }

                addNewCourse();
            }
            courseFormModal.hide();
            coursesListModal.show();
        });
    }

    if (coursesTableBody) {
        coursesTableBody.addEventListener('click', async function (event) {
            const target = event.target;
            const link = target.closest('a');
            if (!link) return;

            const row = target.closest('tr');
            const courseId = row.dataset.courseId;

            if (link.classList.contains('delete-btn')) {
                url = `/User/Profile/DeleteLesson/${courseId}`;

                const response = await fetch(url, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = extractFirstModelError(errorData);
                    errorDiv.textContent = errorMessage || "خطا در ارسال اطلاعات";
                    errorDiv.style.display = "block";
                    return;
                }
                row.remove();
            } else if (link.classList.contains('edit-btn')) {
                prepareCourseEditForm(row);
            }
        });
    }

    function addNewCourse() {
        const newRow = document.createElement('tr');
        const courseCode = courseCodeInput.value;
        newRow.dataset.courseId = courseCode + courseGroupInput.value;
        newRow.innerHTML = `
            <td>${courseNameInput.value}</td>
            <td>${courseCode}</td>
            <td>${courseGroupInput.value}</td>
            <td class="text-center">
                <a href="#" class="text-primary mx-2 edit-btn" title="ویرایش"><i class="fa-solid fa-pen-to-square"></i></a>
                <a href="#" class="text-danger mx-2 delete-btn" title="حذف"><i class="fa-solid fa-trash-can"></i></a>
            </td>`;
        coursesTableBody.appendChild(newRow);
    }

    async function updateCourse(courseId) {
        const rowToUpdate = coursesTableBody.querySelector(`tr[data-course-id="${courseId}"]`);
        if (rowToUpdate) {
            rowToUpdate.children[0].textContent = courseNameInput.value;
            //rowToUpdate.children[1].textContent = courseCodeInput.value;
            //rowToUpdate.children[2].textContent = courseGroupInput.value;
        }
    }

    function prepareCourseEditForm(row) {
        const courseId = row.dataset.courseId;
        const courseName = row.children[0].textContent;
        const courseCode = row.children[1].textContent;
        const courseGroup = row.children[2].textContent;

        courseForm.reset();
        courseForm.classList.remove('was-validated');
        courseIdInput.value = courseId;
        courseNameInput.value = courseName;
        courseCodeInput.value = courseCode;
        courseGroupInput.value = courseGroup;
        courseCodeInput.disabled = true;
        courseGroupInput.disabled = true;
        courseModalTitle.textContent = 'ویرایش درس';
        saveCourseBtn.textContent = 'بروزرسانی';
        saveCourseBtn.className = 'btn btn-danger';

        coursesListModal.hide();
        courseFormModal.show();
    }
    const addLocationBtn = document.getElementById('addLocationBtn');
    const locationForm = document.getElementById('locationForm');
    const saveLocationBtn = document.getElementById('saveLocationBtn');
    const locationsTableBody = document.getElementById('locationsTableBody');
    const locationModalTitle = document.getElementById('locationModalTitle');
    const locationIdInput = document.getElementById('locationId');
    const locationNameInput = document.getElementById('locationName');
    const locationAddressInput = document.getElementById('locationAddress');
    const locationMapInput = document.getElementById('locationMap');
    const locationFormModal = new bootstrap.Modal(document.getElementById('locationFormModal'));
    const locationsListModal = new bootstrap.Modal(document.getElementById('locationsListModal'));

    if (addLocationBtn) {
        addLocationBtn.addEventListener('click', () => {
            locationForm.reset();
            locationIdInput.value = '';
            locationNameInput.disabled = false;
            locationForm.classList.remove('was-validated');

            locationModalTitle.textContent = 'افزودن مکان جدید';
            saveLocationBtn.textContent = 'ذخیره';
            saveLocationBtn.className = 'btn btn-danger';

            locationsListModal.hide();
            locationFormModal.show();
        });
    }

    if (saveLocationBtn) {
        saveLocationBtn.addEventListener('click', async function () {
            if (!locationForm.checkValidity()) {
                locationForm.classList.add('was-validated');
                return;
            }

            var locationModel =
            {
                Title: locationNameInput.value,
                Address: locationAddressInput.value,
                GoogleMapLink: locationMapInput.value
            };

            const locationId = locationIdInput.value;
            var url = '';
            if (locationId) {
                url = '/User/Profile/UpdateLocation'
                locationModel.Id = locationId;
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(locationModel)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = extractFirstModelError(errorData);
                    errorDiv.textContent = errorMessage || "خطا در ارسال اطلاعات";
                    errorDiv.style.display = "block";
                    return;
                }
                updateLocation(locationId);
            } else {
                url = '/User/Profile/AddLocation';

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(locationModel)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = extractFirstModelError(errorData);
                    errorDiv.textContent = errorMessage || "خطا در ارسال اطلاعات";
                    errorDiv.style.display = "block";
                    return;
                }
                const data = await response.json();

                addNewLocation(data.id);
            }
            locationFormModal.hide();
            locationsListModal.show();
        });
    }

    if (locationsTableBody) {
        locationsTableBody.addEventListener('click', async function (event) {
            const target = event.target;
            const link = target.closest('a');
            if (!link) return;

            const row = target.closest('tr');
            const locationId = row.dataset.locationId;

            if (link.classList.contains('delete-btn')) {
                url = `/User/Profile/DeleteLocation/${locationId}`;

                const response = await fetch(url, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = extractFirstModelError(errorData);
                    errorDiv.textContent = errorMessage || "خطا در ارسال اطلاعات";
                    errorDiv.style.display = "block";
                    return;
                }
                row.remove();
            } else if (link.classList.contains('edit-btn')) {
                prepareLocationEditForm(row);
            }
        });
    }

    function createLocationTableRow(name, address, mapLink) {
        const mapIcon = mapLink ?
            `<a href="${mapLink}" target="_blank" class="text-success mx-2" title="نمایش در نقشه"><i class="fa-solid fa-map-marked-alt"></i></a>` : '';
        return `
            <td>${name}</td>
            <td>${address}</td>
            <td class="text-center">
                ${mapIcon}
                <a href="#" class="text-primary mx-2 edit-btn" title="ویرایش"><i class="fa-solid fa-pen-to-square"></i></a>
                <a href="#" class="text-danger mx-2 delete-btn" title="حذف"><i class="fa-solid fa-trash-can"></i></a>
            </td>`;
    }

    function addNewLocation(locationId) {
        const newRow = document.createElement('tr');
        const locationName = locationNameInput.value;
        newRow.dataset.locationId = locationId;
        newRow.innerHTML = createLocationTableRow(locationName, locationAddressInput.value, locationMapInput.value);
        locationsTableBody.appendChild(newRow);
    }

    function updateLocation(locationId) {
        const rowToUpdate = locationsTableBody.querySelector(`tr[data-location-id="${locationId}"]`);
        if (rowToUpdate) {
            rowToUpdate.innerHTML = createLocationTableRow(locationNameInput.value, locationAddressInput.value, locationMapInput.value);
        }
    }

    function prepareLocationEditForm(row) {
        const locationId = row.dataset.locationId;
        const locationName = row.children[0].textContent;
        const locationAddress = row.children[1].textContent;
        const mapLinkElement = row.querySelector('a[href*="google.com"], a[href*="maps"]');
        const locationMap = mapLinkElement ? mapLinkElement.href : '';

        locationForm.reset();
        locationForm.classList.remove('was-validated');
        locationIdInput.value = locationId;
        locationNameInput.value = locationName;
        locationAddressInput.value = locationAddress;
        locationMapInput.value = locationMap;

        locationModalTitle.textContent = 'ویرایش مکان';
        saveLocationBtn.textContent = 'بروزرسانی';
        saveLocationBtn.className = 'btn btn-danger';

        locationsListModal.hide();
        locationFormModal.show();
    }

    //document.getElementById("exportPngBtn").addEventListener("click", function () {
    //    const table = document.getElementById("scheduleTable");
    //    html2canvas(table, { scale: 2}).then(canvas => {
    //        const link = document.createElement("a");
    //        link.download = "table.png";
    //        link.href = canvas.toDataURL("image/png");
    //        link.click();
    //    });
    //});
});

function downlaodPng() {
    const table = document.getElementById("scheduleTable");
    htmlToImage.toPng(table, { pixelRatio: 2 })
        .then(function (dataUrl) {
            const link = document.createElement("a");
            link.download = 'table.png';
            link.href = dataUrl;
            link.click();
        });
}

async function downloadPdf() {
    const table = document.getElementById("scheduleTable");
    const dataUrl = await htmlToImage.toPng(table, { pixelRatio: 2 });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    // A4 size in mm
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Convert image size to fit A4 (keeping aspect ratio)
    const img = new Image();
    img.src = dataUrl;
    img.onload = function () {
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Scale to fit A4 width (max 180mm with margins)
        const scale = Math.min(180 / imgWidth, 260 / imgHeight);
        const finalWidth = imgWidth * scale;
        const finalHeight = imgHeight * scale;

        // Center positions
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        pdf.addImage(dataUrl, "PNG", x, y, finalWidth, finalHeight);
        pdf.save("table.pdf");
    };
}

async function loadSchedule() {
    const tableBody = document.getElementById('scheduleTableBody');

    try {
        const response = await fetch("/User/Profile/GetSchedule");
        if (!response.ok) throw new Error("خطا در دریافت داده‌ها");

        const schedules = await response.json();
        renderSchedule(schedules, tableBody);
    } catch (err) {
        console.error("Load failed:", err);
    }
}

function renderSchedule(schedules, tableBody) {
    const periods = [
        "08:00 - 10:00",
        "10:00 - 12:00",
        "12:00 - 14:00",
        "14:00 - 16:00",
        "16:00 - 18:00",
        "18:00 - 20:00"
    ];

    const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

    tableBody.innerHTML = ""; // clear old

    for (let i = 0; i < days.length; i++) {
        const tr = document.createElement("tr");

        const th = document.createElement("th");
        th.textContent = days[i];
        tr.appendChild(th);

        for (let j = 0; j < periods.length; j++) {
            const td = document.createElement("td");
            td.dataset.day = days[i];
            td.dataset.time = periods[j];
            td.dataset.dayindex = i;
            td.dataset.period = j;

            const periodSchedules = schedules.filter(s => s.dayOfWeek === i && s.period === j);

            if (periodSchedules.length === 0) {
                td.innerHTML = `
          <div class="cell-actions">
            <button class="add-btn"><i class="fa-solid fa-plus"></i></button>
          </div>`;
            } else {
                const container = document.createElement("div");
                container.className = "schedule-item-container";

                periodSchedules.forEach(schedule => {
                    const weekClass = schedule.weekStatus === 0 ? "fixed" :
                        schedule.weekStatus === 1 ? "even" : "odd";
                    const weekType = schedule.weekStatus === 0 ? "ثابت" :
                        schedule.weekStatus === 1 ? "زوج" : "فرد";

                    const div = document.createElement("div");
                    div.className = `schedule-item week-${weekClass}`;
                    div.dataset.weekType = weekType;

                    div.innerHTML = `
            <p class="mb-0" data-course-name="${schedule.lessonTitle}">
              <strong>${schedule.lessonTitle}</strong>
            </p>
            <p class="mb-0 small text-muted">
              گروه: ${schedule.groupNo} | کلاس: ${schedule.roomNo}
            </p>
            <div class="action-buttons">
              <button class="edit-btn" title="ویرایش"><i class="fa-solid fa-pencil"></i></button>
              <button class="delete-btn" title="حذف"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          `;
                    container.appendChild(div);
                });

                td.appendChild(container);
            }

            tr.appendChild(td);
        }

        tableBody.appendChild(tr);
    }
}
