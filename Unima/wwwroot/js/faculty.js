function showSuccessModal() {
    Swal.fire({
        title: "انجام شد!",
        text: "رزرو شما با موفقیت ثبت شد.",
        icon: "success",
        confirmButtonText: "تایید",
        confirmButtonColor: "#dda853",
    });
}

function showFailModal() {
    Swal.fire({
        title: "دقایقی دیگر امتحان کنید",
        text: "رزرو شما بنا به دلایلی انجام نشد.",
        icon: "error",
        confirmButtonText: "تایید",
        confirmButtonColor: "#dda853",
    });
}

function validateReservationForm() {
    const form = document.getElementById("ReservationForm");
    const subject = document.getElementById("subject");
    const locations = document.getElementById("locations");
    const description = document.getElementById("description");
    const dateInput = document.getElementById("date-input");
    const hiddenDate = document.getElementById("hidden-date");
    const timepickerContainer = document.getElementById("my-inline-timepicker");
    const timepickerInstance = timepickerContainer._flatpickr;
    const duration = document.getElementById("duration");
    let isvalid = true;

    form
        .querySelectorAll(".is-invalid")
        .forEach((el) => el.classList.remove("is-invalid"));

    if (subject.value.trim().length == 0) {
        subject.classList.add("is-invalid");
        isvalid = false;
    }
    if (locations.value === "" || locations.value === '0') {
        locations.classList.add("is-invalid");
        isvalid = false;
    }
    if (description.value.trim().length == 0) {
        description.classList.add("is-invalid");
        isvalid = false;
    }
    if (!hiddenDate.value) {
        dateInput.classList.add("is-invalid");
        isvalid = false;
    }
    if (timepickerInstance.selectedDates.length === 0) {
        timepickerContainer.classList.add("is-invalid");
        isvalid = false;
    }
    if (!duration.checkValidity()) {
        duration.classList.add("is-invalid");
        isvalid = false;
    }
    return isvalid;
}

flatpickr("#my-inline-timepicker", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    inline: true,
    minTime: "07:30",
    maxTime: "18:00",
    defaultDate: "08:00",
    time_24hr: true,
});
let isdragging = false;
$(document).ready(function () {
    new mds.MdsPersianDateTimePicker(
        $("#calenderTriger")[0],
        {
            targetTextSelector: "#date-input",
            targetDateSelector: "#hidden-date",
            isGregorian: false,
            enableTimePicker: false,
            textFormat: "yyyy/MM/dd",
            disableBeforeToday: true
        }
    );
    $(".professor-card-wrapper").on("click", function (e) {
        if (
            $(e.target).is("a, button, .close-btn") ||
            $(e.target).closest("a, button").length
        ) {
            return;
        }
        if (isdragging) {
            isdragging = false;
            return;
        }

        const thisCard = $(this);
        if (thisCard.hasClass("is-open")) {
            return;
        }
        if ($(".professor-card-wrapper.is-open").length) {
            closeCard($(".professor-card-wrapper.is-open"));
        }
        openCard(thisCard);
    });

    $(".close-btn").on("click", function (e) {
        e.stopPropagation();
        closeCard($(this).closest(".professor-card-wrapper"));
    });

    function openCard(card) {
        $("#professors-list .professor-card-wrapper")
            .not(card)
            .addClass("fading-out");
        $(".category-title").addClass("fading-out");
        $(".faculty-category").addClass("fading-out-category");
        document.body.classList.remove("is-dragging");
        card.addClass("is-open").addClass("col-12");
    }
    function closeCard(card) {
        $("#professors-list .professor-card-wrapper")
            .not(card)
            .removeClass("fading-out");
        document.body.classList.add("is-dragging");
        $(".category-title").removeClass("fading-out");
        $(".faculty-category").removeClass("fading-out-category");
        card.removeClass("is-open").removeClass("col-12");
    }

    $(".action-btn-wrapper button").on("click", function () {
        var professorName = $(this)
            .closest(".professor-card")
            .find(".card-title")
            .first()
            .text();
        var modalId = $(this).data("bs-target");
        $(modalId)
            .find(".modal-header-content span")
            .text("اطلاعات مربوط به " + professorName);

        const targetTabId = $(this).data("tab-target");

        if (targetTabId) {
            const modal = $(modalId);

            const targetTab = modal.find('.tab[data-tab="' + targetTabId + '"]');
            const targetPane = modal.find(".tab-pane#" + targetTabId);

            modal.find(".tab").removeClass("active");
            modal.find(".tab-pane").removeClass("active");

            targetTab.addClass("active");
            targetPane.addClass("active");

            const modalDialog = modal.find(".modal-dialog");
            modalDialog.toggleClass("modal-dialog-wide", targetTabId === "schedule");
        }
    });

    $("#searchInput").on("keyup", function () {
        const value = $(this).val().toLowerCase();
        let anyProfFound = false;

        if ($(".professor-card-wrapper.is-open").length) {
            closeCard($(".professor-card-wrapper.is-open"));
        }

        $(".faculty-category").each(function () {
            const category = $(this);
            let foundInCategory = false;

            category.find(".professor-card-wrapper").each(function () {
                const card = $(this);
                const cardText = card.find(".card-title").text().toLowerCase();

                if (cardText.indexOf(value) > -1) {
                    card.show();
                    foundInCategory = true;
                } else {
                    card.hide();
                }
            });

            if (foundInCategory) {
                category.show();
                anyProfFound = true;
            } else {
                category.hide();
            }
        });

        if (anyProfFound) {
            $("#no-result").hide();
        } else {
            $("#no-result").show();
        }
    });

    const tabs = document.querySelectorAll("#scheduleModal .tab");
    const panes = document.querySelectorAll("#scheduleModal .tab-pane");
    const modalDialog = document.querySelector("#scheduleModal .modal-dialog");

    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            const tabId = this.dataset.tab;
            tabs.forEach((item) => item.classList.remove("active"));
            this.classList.add("active");
            panes.forEach((pane) => {
                pane.classList.toggle("active", pane.id === tabId);
            });
            modalDialog.classList.toggle("modal-dialog-wide", tabId === "schedule");
        });
    });

    const submitBtn = document.getElementById("submitReservationBtn");
    //const scheduleModalElement = document.getElementById("scheduleModal");

    //if (submitBtn && scheduleModalElement) {
    //    let reservationSubmitted = false;
    //    const infoModal = bootstrap.Modal.getOrCreateInstance(scheduleModalElement);

    //    scheduleModalElement.addEventListener("hidden.bs.modal", function () {
    //        if (reservationSubmitted) {
    //            showFailModal();
    //            reservationSubmitted = false;
    //        }
    //        document.getElementById("ReservationForm").reset();
    //    });
    //}

    submitBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        if (!validateReservationForm()) {
            return;
        }

        const modal = document.getElementById('scheduleModal');
        var professorId = modal.dataset.professorId;

        if (professorId) {
            const timepickerContainer = document.getElementById("my-inline-timepicker");
            const timepickerInstance = timepickerContainer._flatpickr;
            var date = document.getElementById("hidden-date").value;

            const [year, month, day] = date.split("/").map(Number);
            const [hours, minutes] = timepickerInstance.input.value.split(":").map(Number);
            const reservedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

            const appointmentModel = {
                ProfessorId: professorId,
                Topic: document.getElementById("subject").value,
                LocationId: document.getElementById("locations").value,
                Description: document.getElementById("description").value,
                ReservedDateTime: reservedDate.toISOString(),
                Duration: parseInt(document.getElementById("duration").value, 10)
            };

            try {
                const res = await fetch("/Faculty/Professors/SetAppointment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(appointmentModel)
                });

                if (!res.ok) throw new Error("Server error");

                const data = await res.json();

            } catch (err) {

            }
            //reservationSubmitted = true;
            //submitBtn.disabled = true;
            //submitBtn.innerText = "در حال پردازش...";

            //setTimeout(() => {
            //    infoModal.hide();
            //    setTimeout(() => {
            //        submitBtn.disabled = false;
            //        submitBtn.innerText = "رزرو";
            //    }, 500);
            //}, 3000);
        }
    });

    function filterSchedule() {
        const showEven = $("#evenWeekCheck").is(":checked");
        const showOdd = $("#oddWeekCheck").is(":checked");
        const scheduleItems = $(".schedule-item");

        if (showEven && showOdd) {
            scheduleItems.show();
            return;
        }
        if (!showEven && !showOdd) {
            scheduleItems.hide();
            $(".week-fixed").show();
            return;
        }

        scheduleItems.hide();

        if (showEven) {
            $(".week-even, .week-fixed").show();
        }
        if (showOdd) {
            $(".week-odd, .week-fixed").show();
        }
    }

    $(".schedule-filter").on("change", function () {
        filterSchedule();
    });

    $("#InformationProfessor").on("shown.bs.modal", function () {
        $("#evenWeekCheck").prop("checked", true);
        $("#oddWeekCheck").prop("checked", true);
        filterSchedule();
    });
});
const scrollWrappers = document.querySelectorAll(".horizontal-scroll-wrapper");
scrollWrappers.forEach((wrapper) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    wrapper.addEventListener("mousedown", (e) => {
        document.body.classList.add("is-dragging");
        if (e.target.closest("a, button, .close-btn")) {
            return;
        }
        isDown = true;
        wrapper.classList.add("active-drag");
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
        isdragging = false;
    });

    wrapper.addEventListener("mouseleave", () => {
        isDown = false;
        wrapper.classList.remove("active-drag");
        setTimeout(() => {
            isdragging = false;
        }, 50);
    });

    wrapper.addEventListener("mouseup", () => {
        isDown = false;
        wrapper.classList.remove("active-drag");
        setTimeout(() => {
            isdragging = false;
            document.body.classList.remove("is-dragging");
        }, 50);
    });

    wrapper.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = x - startX;
        if (Math.abs(walk) > 5) {
            isdragging = true;
        }
        wrapper.scrollLeft = scrollLeft - walk;
    });
});

function loadProfessorData(professorId) {
    fetch(`/Faculty/Professor/GetData/${professorId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            const tbody = document.getElementById("schedule-body");
            tbody.innerHTML = '';
            for (i = 0; i < 7; i++) {
                var tr = document.createElement("tr");
                var th = document.createElement("th");

                var dayTitle = '';
                switch (i) {
                    case 0:
                        dayTitle = 'شنبه';
                        break;
                    case 1:
                        dayTitle = 'یکشبه';
                        break;
                    case 2:
                        dayTitle = 'دوشنبه';
                        break;
                    case 3:
                        dayTitle = 'سه‌شنبه';
                        break;
                    case 4:
                        dayTitle = 'چهارشنبه';
                        break;
                    case 5:
                        dayTitle = 'پنجشنبه';
                        break;
                    case 6:
                        dayTitle = 'جمعه';
                        break;
                }
                th.textContent = dayTitle;
                tr.appendChild(th);
                var cells = Array.from({ length: 8 }, () => {
                    var td = document.createElement("td");
                    tr.appendChild(td);
                    return td;
                });

                const periodSchedules = data.schedules.filter(s => s.dayOfWeek === i);
                if (periodSchedules.length > 0) {
                    periodSchedules.forEach((schedule) => {

                        var div = document.createElement("div");
                        var weekType = schedule.weekStatus == 0 ? 'week-fixed' : schedule.weekStatus == 1 ? 'week-even' : 'week-odd';
                        div.className = `schedule-item ${weekType}`;
                        div.innerHTML = `${schedule.lessonTitle}${schedule.weekStatus === 1 ? ' (زوج)' : schedule.weekStatus === 2 ? ' (فرد)' : ''}<br><small class="text-muted">کلاس ${schedule.roomNo}</small>`;
                        cells[schedule.period].appendChild(div);
                    });
                }
                tbody.appendChild(tr);
            }

            const select = document.getElementById('locations');
            select.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '0';
            defaultOption.textContent = 'انتخاب کنید...';
            defaultOption.selected = true;
            defaultOption.disabled = true;
            select.appendChild(defaultOption);

            data.locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location.id;
                option.textContent = location.title;
                select.appendChild(option);
            });
        });


    const modal = document.getElementById('scheduleModal');
    modal.dataset.professorId = professorId;
}