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
            const modal = new bootstrap.Modal(document.getElementById('InformationProfessor'));
            modal.show();
        });
}
document.addEventListener('DOMContentLoaded', function () {

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/StatusHub")
        .build();

    connection.on("UpdateRoomStatus", (roomId, status) => {
        const room = document.getElementById(`room-${roomId}`);
        if (room) {
            room.className = `room status-${status}`;
        }

    });

    connection.start().catch(err => console.error(err.toString()));

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

});