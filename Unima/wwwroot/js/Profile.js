$(document).ready(function() {
    const $fullName = $('#Fullname');
    const $submitBtnName = $('#submitBtnName');
    const $nameError = $('#nameError');
    const $email = $('#email');
    const $submitBtnEmail = $('#submitBtnEmail');
    const $emailError = $('#emailError');
    const $submitBtnCode = $('#submitBtncode');

    // Name Validation
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

    $submitBtnName.on('click', function() {
        validateName() && $('#editname').modal('hide');
    });

    $fullName.on('input', function() {
        $nameError.hide();
    });

    $submitBtnEmail.on('click', function() {
        if (validateEmail()) {
            alert(`ایمیل با موفقیت ثبت شد:\n${$email.val()}`);
            $('#editemail').modal('hide');
        }
    });

    $submitBtnCode.on('click', function() {
        $('#editemail').modal('hide');
    });

    $email.on('input', function() {
        $emailError.hide();
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