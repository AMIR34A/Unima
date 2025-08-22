function loadProfessorData(officeNo) {
    fetch(`/Professor/Status/GetProfessorInformation/${officeNo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('FullName').textContent = data.fullName;
            document.getElementById('ProfilePhoto').src = data.profilePhotoUrl;
            document.getElementById('Department').textContent = data.department;
            document.getElementById('Bio').textContent = data.bio;
            document.getElementById('Email').textContent = data.email;
            document.getElementById('Address').textContent = data.address;
            document.getElementById('Description').textContent = data.description;
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
            const modalElement = document.getElementById('InformationProfessor');
            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
            modal.show();
        });
}
document.addEventListener('DOMContentLoaded', function () {

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/StatusHub")
        .build();

    connection.on("UpdateOfficeStatus", (officeNo, status) => {
        const room = document.getElementById(`room-${officeNo}`);
        if (room) {
            room.className = `room status-${status}`;
        }
    });

    connection.start().catch(err => console.error(err.toString()));

    const infoModalEl = document.getElementById('InformationProfessor');
    let triggerButton = null;

    if (infoModalEl) {
        infoModalEl.addEventListener('show.bs.modal', function (event) {
            triggerButton = event.relatedTarget;
        });
        infoModalEl.addEventListener('hide.bs.modal', function () {
            if (triggerButton) {
                triggerButton.focus();
            }
        });
        infoModalEl.addEventListener('hidden.bs.modal', function () {
            resetInformationProfessorModal();
        })
    }

    function resetInformationProfessorModal() {


        const tabs = infoModalEl.querySelectorAll('.tab');
        const panes = infoModalEl.querySelectorAll('.tab-pane');

        tabs.forEach(tab => tab.classList.remove('active'));
        panes.forEach(pane => pane.classList.remove('active', 'show'));

        infoModalEl.querySelector('.tab[data-tab="bio"]').classList.add('active');
        infoModalEl.querySelector('#bio').classList.add('active', 'show');

        const fieldToClear = ['FullName', 'Department', 'Bio', 'Email', 'Address', 'Description'];
        fieldToClear.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '';
            }
        });

        const scheduleCells = infoModalEl.querySelectorAll('.scheduleTable tbody td');
        scheduleCells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('busy');
        })

        const reservationForm = document.getElementById('ReservationForm');
        reservationForm.reset();

        const invalidInputs = reservationForm.querySelectorAll('.is-invalid');
        invalidInputs.forEach(input => {
            input.classList.remove('is-invalid');
        });

        const filePreview = document.getElementById('filePreview');
        if (filePreview) {
            filePreview.textContent = 'فایل انتخاب نشده است.';
        }

    }



    const mapContainer = document.getElementById('mapContainer');
    const mapWrapper = document.getElementById('mapWrapper');
    const rooms = document.querySelectorAll('.room');
    let expandedRoom = null;

    function fitMapToContent() {
        const roomWrappers = mapWrapper.querySelectorAll('.room-wrapper');
        let maxRight = 0;
        let maxBottom = 0;

        roomWrappers.forEach(wrapper => {
            const right = wrapper.offsetLeft + wrapper.offsetWidth;
            const bottom = wrapper.offsetTop + wrapper.offsetHeight;
            if (right > maxRight) maxRight = right;
            if (bottom > maxBottom) maxBottom = bottom;
        });

        mapWrapper.style.width = (maxRight + 285) + 'px';
        mapWrapper.style.height = (maxBottom + 285) + 'px';
    }
    fitMapToContent();

    const panzoomInstance = Panzoom(document.getElementById('mapWrapper'), {
        maxScale: 3,
        minScale: 0.5,
        contain: 'outside',
    });
    mapContainer.addEventListener('wheel', panzoomInstance.zoomWithWheel);

    rooms.forEach(room => {
        room.addEventListener('click', (e) => {
            if (e.target.closest('a, button')) {
                return;
            }

            if (expandedRoom && expandedRoom !== room) {
                collapseRoom(expandedRoom);
            }
            room.classList.toggle('expanded');
            expandedRoom = room.classList.contains('expanded') ? room : null;
            clearPath();
        });

        const directionLink = room.querySelector('.direction-link');
        if (directionLink) {
            directionLink.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                drawPathToRoom(room);
            });
        }
    });

    function collapseRoom(room) {
        room.classList.remove('expanded');
        if (expandedRoom === room) {
            expandedRoom = null;
        }
    }

    function drawPathToRoom(room) {
        clearPath();
        panzoomInstance.reset({ animate: true });

        setTimeout(() => {
            const entrance = document.getElementById('entrance');
            const mapRect = mapWrapper.getBoundingClientRect();
            const entranceRect = entrance.getBoundingClientRect();
            const roomRect = room.getBoundingClientRect();

            const start = {
                x: entranceRect.left + entranceRect.width / 2 - mapRect.left,
                y: entranceRect.top + entranceRect.height / 2 - mapRect.top
            };

            const wrapper = room.closest('.room-wrapper');
            const isLeft = wrapper.classList.contains('left-room');

            const end = {
                x: isLeft ? roomRect.left - mapRect.left : roomRect.right - mapRect.left,
                y: roomRect.top + roomRect.height / 2 - mapRect.top
            };

            const mid = { x: start.x, y: end.y };
            const ctx = getOrCreateCanvasCtx();
            animatePath(ctx, [start, mid, end], 800);
        }, 300);
    }

    function animatePath(ctx, points, duration = 600) {
        const [start, mid, end] = points;
        const startTime = performance.now();

        function draw(currentTime) {
            const elapsed = currentTime - startTime;
            const t = Math.min(elapsed / duration, 1);

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);

            if (t < 0.5) {
                const y = start.y + (mid.y - start.y) * (t / 0.5);
                ctx.lineTo(start.x, y);
            } else {
                ctx.lineTo(start.x, mid.y);
                const x = mid.x + (end.x - mid.x) * ((t - 0.5) / 0.5);
                ctx.lineTo(x, mid.y);
            }

            ctx.strokeStyle = '#1976d2';
            ctx.lineWidth = 4;
            ctx.setLineDash([6, 4]);
            ctx.stroke();

            if (t < 1) {
                requestAnimationFrame(draw);
            }
        }
        requestAnimationFrame(draw);
    }

    function getOrCreateCanvasCtx() {
        let canvas = document.getElementById('routeCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'routeCanvas';
            canvas.style.position = 'absolute';
            canvas.style.top = 0;
            canvas.style.left = 0;
            canvas.style.pointerEvents = 'none';
            mapWrapper.appendChild(canvas);
        }
        canvas.width = mapWrapper.clientWidth;
        canvas.height = mapWrapper.clientHeight;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return ctx;
    }

    function clearPath() {
        const canvas = document.getElementById('routeCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    const searchInput = document.getElementById('teacherSearchInput');
    const searchButton = document.getElementById('searchButton');

    function searchAndFocus() {
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) return;

        let foundRoom = null;
        const normalizedSearchTerm = searchTerm.replace(/ /g, '');

        rooms.forEach(room => {
            const teacherName = room.dataset.teacher || '';
            const normalizedTeacherName = teacherName.replace(/ /g, '');
            if (normalizedTeacherName.includes(normalizedSearchTerm)) {
                foundRoom = room;
            }
        });

        if (foundRoom) {
            if (expandedRoom && expandedRoom !== foundRoom) {
                collapseRoom(expandedRoom);
            }
            if (!foundRoom.classList.contains('expanded')) {
                foundRoom.classList.add('expanded');
                expandedRoom = foundRoom;
            }
            clearPath();
            focusOnElement(foundRoom);
        } else {
            alert('استادی با این نام پیدا نشد.');
        }
    }

    function focusOnElement(element) {
        const targetScale = 1.4;
        const roomWrapper = element.closest('.room-wrapper');
        const roomCenterX = roomWrapper.offsetLeft + roomWrapper.offsetWidth / 2;
        const roomCenterY = roomWrapper.offsetTop + roomWrapper.offsetHeight / 2;

        panzoomInstance.zoom(targetScale, {
            animate: true,
            focal: { x: roomCenterX, y: roomCenterY }
        });
    }

    searchButton.addEventListener('click', searchAndFocus);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchAndFocus();
        }
    });

    document.getElementById('zoomIn').addEventListener('click', () => panzoomInstance.zoomIn());
    document.getElementById('zoomOut').addEventListener('click', () => panzoomInstance.zoomOut());


    const tabs = document.querySelectorAll('#InformationProfessor .tab');
    const panes = document.querySelectorAll('#InformationProfessor .tab-pane');
    const modalDialog = document.querySelector('#InformationProfessor .modal-dialog');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.dataset.tab;

            tabs.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            panes.forEach(pane => {
                if (pane.id === tabId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });

            if (tabId === 'schedule') {
                modalDialog.classList.add('modal-dialog-wide');
            } else {
                modalDialog.classList.remove('modal-dialog-wide');
            }
        });
    });
    new mds.MdsPersianDateTimePicker(
        document.getElementById("calenderTriger"),
        {
            targetTextSelector: '#date-input',
            targetDateSelector: '#hidden-date',
            isGregorian: false,
            enableTimePicker: false,
            textFormat: 'yyyy/MM/dd',
            disableBeforeToday: true
        }
    );

    const uploadContainer = document.getElementById('upload-container');
    if (uploadContainer) {
        uploadContainer.classList.add('feature-disabled');
    }

    function validateReservationForm() {
        const form = document.getElementById('ReservationForm');
        const subject = document.getElementById('subject');
        const location = document.getElementById('location');
        const description = document.getElementById('description');
        const dateInput = document.getElementById('date-input');
        const hiddenDate = document.getElementById('hidden-date');
        const timepickerContainer = document.getElementById('my-inline-timepicker');
        const timepickerInstance = timepickerContainer._flatpickr;
        const duration = document.getElementById('duration');

        let isvalid = true;

        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        if (subject.value.trim().length < 4) {
            subject.classList.add('is-invalid');
            isvalid = false;
        }
        if (location.value === "") {
            location.classList.add("is-invalid");
            isvalid = false;
        }
        if (description.value.trim().length < 10) {
            description.classList.add('is-invalid');
            isvalid = false;
        }
        if (!hiddenDate.value) {
            dateInput.classList.add('is-invalid');
            isvalid = false;
        }
        if (timepickerInstance.selectedDates.length === 0) {
            timepickerContainer.classList.add('is-invalid');
            isvalid = false;
        }
        if (!duration.checkValidity()) {
            duration.classList.add('is-invalid');
            isvalid = false;
        }

        return isvalid;

    }

    const submitBtn = document.getElementById('submitReservationBtn');
    const infoModalElement = document.getElementById('InformationProfessor');

    if (submitBtn && infoModalElement) {
        let reservationSubmitted = false;
        const infoModal = bootstrap.Modal.getOrCreateInstance(infoModalElement);

        infoModalElement.addEventListener('hidden.bs.modal', function () {

            if (reservationSubmitted) {
                showFailModal();
                reservationSubmitted = false;
            }
            resetInformationProfessorModal();
        });

        submitBtn.addEventListener('click', function (event) {
            event.preventDefault();

            if (!validateReservationForm()) {
                return;
            }
            reservationSubmitted = true;
            submitBtn.disabled = true;
            submitBtn.innerText = 'در حال پردازش...';

            setTimeout(() => {
                infoModal.hide();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'ثبت نهایی رزرو';
                }, 500);
            }, 3000);
        });
    }
});

flatpickr("#my-inline-timepicker", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",

    inline: true,
    minTime: "07:30",
    maxTime: "18:00",
    defaultDate: "08:00",
    time_24hr: true
});

function showSuccessModal() {
    Swal.fire({
        title: 'انجام شد!',
        text: 'رزرو شما با موفقیت ثبت شد.',
        icon: 'success',
        confirmButtonText: 'تایید',
        confirmButtonColor: '#dda853'

    });
}
function showFailModal() {
    Swal.fire({
        title: 'دقایقی دیگر امتحان کنید',
        text: 'رزرو شما بنا به دلایلی انجام نشد.',
        icon: 'error',
        confirmButtonText: 'تایید',
        confirmButtonColor: '#dda853'

    });
}