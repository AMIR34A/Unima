$(document).ready(function () {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/ProfessorHub")
        .build();

    connection.on("UpdateOfficeStatus", (professorId, status) => {
        const professor = document.getElementById(`Professor-Status-${professorId}`);
        if (professor) {
            professor.className = `profile-img-wrapper ${status}`;
        }
    });
    connection.start().catch(err => console.error(err.toString()));
});


const UPLOAD_URL = '/upload'; 
const CHUNK_SIZE = 512 * 1024; 

const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const fileList = document.getElementById('fileList');

let filesState = [];

// helper icons
function setPauseResumeIcon(btnEl, name) {
  if (!btnEl) return;
  let svg = '';
  if (name === 'pause') {
    svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"></rect><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"></rect></svg>`;
    btnEl.title = 'توقف';
  } else if (name === 'play') {
    svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 3v18l15-9L5 3z" fill="currentColor"></path></svg>`;
    btnEl.title = 'ادامه';
  } else if (name === 'done') {
    svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
    btnEl.title = 'آپلود شده';
  } else {
    btnEl.textContent = '';
    return;
  }
  btnEl.innerHTML = svg;
}

function formatBytes(n){
  if(n<1024) return n+' B';
  if(n<1024*1024) return (n/1024).toFixed(1)+' KB';
  if(n<1024*1024*1024) return (n/1024/1024).toFixed(2)+' MB';
  return (n/1024/1024/1024).toFixed(2)+' GB';
}
function readableSpeed(bps){
  if(!isFinite(bps)) return '0 B';
  const n = Math.round(bps);
  if(n < 1024) return n + ' B';
  if(n < 1024*1024) return (n/1024).toFixed(1) + ' KB';
  if(n < 1024*1024*1024) return (n/1024/1024).toFixed(2) + ' MB';
  return (n/1024/1024/1024).toFixed(2) + ' GB';
}
function readableTime(s){
  if(!isFinite(s)) return '—';
  s = Math.max(0, Math.round(s));
  if(s < 60) return s + ' ثانیه';
  const m = Math.floor(s/60);
  const sec = s % 60;
  return m + ' دقیقه ' + sec + ' ثانیه';
}

/* UI */
function createFileCard(fileObj){
  dropArea.style.display = 'none';

  const el = document.createElement('div');
  el.className = 'file';
  el.innerHTML = `
    <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(180deg,#fafbff,#f3f5ff);display:flex;align-items:center;justify-content:center;font-weight:600">
      ${fileObj.file.name.split('.').pop().slice(0,3).toUpperCase()}
    </div>
    <div class="info">
      <strong>${fileObj.file.name}</strong>
      <div class="meta">${formatBytes(fileObj.size)}</div>
      <div class="progress-wrap">
        <div class="progress"><i style="width:0%"></i></div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;align-items:center">
          <div class="small state-text">آماده</div>
          <div class="meta-stats"><b class="speed">0 B/s</b><span class="eta">—</span></div>
          <div class="small"><span class="percent">0%</span></div>
        </div>
      </div>
    </div>
    <div class="controls">
      <button class="btn" data-action="pauseResume" title="Pause / Resume"></button>
      <button class="btn danger" data-action="cancel" title="لغو">✕</button>
    </div>
  `;
  fileObj.el = el;
  fileObj.progressBar = el.querySelector('.progress i');
  fileObj.percentText = el.querySelector('.percent');
  fileObj.stateText = el.querySelector('.state-text');
  fileObj.speedText = el.querySelector('.speed');
  fileObj.etaText = el.querySelector('.eta');

  fileList.appendChild(el);

  const prBtn = el.querySelector('[data-action="pauseResume"]');
  setPauseResumeIcon(prBtn, 'play');

  prBtn.addEventListener('click', ()=>{
    if(fileObj.state === 'uploading') pauseFile(fileObj.id);
    else resumeFile(fileObj.id);
  });

  el.querySelector('[data-action="cancel"]').addEventListener('click', ()=> cancelFile(fileObj.id));
}

/* مدیریت فایل‌ها */
function addFiles(files){
  if(!files || files.length === 0) return;
  const f = files[0];

  // ignore if identical file already present
  if(filesState.some(x=>x.file.name === f.name && x.size === f.size)) return;

  // remove previous
  filesState.forEach(x => {
    if(x.el && x.el.parentNode) x.el.parentNode.removeChild(x.el);
    if(x.controller && x.controller.xhr) try{ x.controller.xhr.abort(); }catch(e){}
    if(x._simTimer) { clearInterval(x._simTimer); x._simTimer = null; } // just in case leftover
  });
  filesState = [];

  const id = Math.random().toString(36).slice(2,9);
  const fileObj = {
    id,
    file: f,
    size: f.size,
    uploaded: 0,
    state: 'ready',
    controller: null,
    el: null,
    progressBar: null,
    percentText: null,
    stateText: null,
    speedText: null,
    etaText: null,
    lastTickTime: 0,
    lastTickLoaded: 0,
    speedEMA: 0,
    _simTimer: null
  };
  filesState.push(fileObj);
  createFileCard(fileObj);

  // auto-start
  resumeFile(id);
}

function resumeFile(id){
  const fileObj = filesState.find(x=>x.id===id);
  if(!fileObj) return;
  if(fileObj.state === 'finished' || fileObj.state === 'uploading') return;

  fileObj.state = 'uploading';
  fileObj.stateText.textContent = 'در حال آپلود';
  fileObj.lastTickTime = Date.now();
  fileObj.lastTickLoaded = fileObj.uploaded;
  fileObj.speedEMA = fileObj.speedEMA || 0;

  const btn = fileObj.el && fileObj.el.querySelector('[data-action="pauseResume"]');
  setPauseResumeIcon(btn, 'pause'); 
  uploadNextChunk(fileObj);
}

function pauseFile(id){
  const fileObj = filesState.find(x=>x.id===id);
  if(!fileObj) return;
  // abort current xhr
  if(fileObj.controller && fileObj.controller.xhr){
    try{ fileObj.controller.xhr.abort(); }catch(e){}
  }
  fileObj.controller = null;
  fileObj.state = 'paused';
  fileObj.stateText.textContent = 'متوقف شد';
  const btn = fileObj.el && fileObj.el.querySelector('[data-action="pauseResume"]');
  setPauseResumeIcon(btn, 'play'); 
}

function cancelFile(id){
  const idx = filesState.findIndex(x=>x.id===id);
  if(idx === -1) return;
  const fileObj = filesState[idx];
  if(fileObj.controller && fileObj.controller.xhr) try{ fileObj.controller.xhr.abort(); }catch(e){}
  if(fileObj._simTimer) { clearInterval(fileObj._simTimer); fileObj._simTimer = null; }
  if(fileObj.el && fileObj.el.parentNode) fileObj.el.parentNode.removeChild(fileObj.el);
  filesState.splice(idx,1);
  if(filesState.length === 0) dropArea.style.display = 'flex';
}

/* ========== Core: upload chunks via XHR ========== */
function uploadNextChunk(fileObj){
  const file = fileObj.file;
  const start = fileObj.uploaded;
  if(start >= file.size){
    // finished
    fileObj.state = 'finished';
    fileObj.stateText.textContent = 'آپلود شد';
    if(fileObj.progressBar) fileObj.progressBar.style.width = '100%';
    if(fileObj.percentText) fileObj.percentText.textContent = '100%';
    if(fileObj.speedText) fileObj.speedText.textContent = '0 B/s';
    if(fileObj.etaText) fileObj.etaText.textContent = '—';
    const btnDone = fileObj.el && fileObj.el.querySelector('[data-action="pauseResume"]');
    setPauseResumeIcon(btnDone, 'done');
    if(btnDone) btnDone.disabled = true;
    return;
  }

  const end = Math.min(start + CHUNK_SIZE, file.size);
  const chunk = file.slice(start, end);

  // create XHR
  const xhr = new XMLHttpRequest();
  fileObj.controller = { type: 'xhr', xhr };

  xhr.open('POST', UPLOAD_URL, true);

  // set headers server can use
  xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name));
  xhr.setRequestHeader('X-Start-Byte', String(start));
  xhr.setRequestHeader('X-Total-Size', String(file.size));
  xhr.setRequestHeader('Content-Range', `bytes ${start}-${end-1}/${file.size}`);

  // progress handler (per chunk)
  xhr.upload.onprogress = function(evt){
    if(!evt.lengthComputable) return;

    const now = Date.now();
    const deltaTime = (now - fileObj.lastTickTime) / 1000 || 1;
    const deltaLoaded = evt.loaded - fileObj.lastTickLoaded;
    const instSpeed = deltaLoaded / deltaTime; // bytes/sec

    const alpha = 0.3;
    fileObj.speedEMA = fileObj.speedEMA === 0 ? instSpeed : (alpha * instSpeed + (1 - alpha) * fileObj.speedEMA);

    const overallPercent = Math.floor(((start + evt.loaded) / file.size) * 100);
    if(fileObj.progressBar) fileObj.progressBar.style.width = overallPercent + '%';
    if(fileObj.percentText) fileObj.percentText.textContent = overallPercent + '%';

    if(fileObj.speedText) fileObj.speedText.textContent = readableSpeed(fileObj.speedEMA) + '/s';
    const remaining = file.size - (start + evt.loaded);
    const etaSec = fileObj.speedEMA > 0 ? remaining / fileObj.speedEMA : Infinity;
    if(fileObj.etaText) fileObj.etaText.textContent = readableTime(etaSec);

    fileObj.lastTickTime = now;
    fileObj.lastTickLoaded = evt.loaded;
  };

  xhr.onload = function(){
    const btn = fileObj.el && fileObj.el.querySelector('[data-action="pauseResume"]');
    if(xhr.status >= 200 && xhr.status < 300){
      // accepted
      const loadedBytes = end - start;
      fileObj.uploaded += loadedBytes;

      // reset per-chunk tick
      fileObj.lastTickTime = Date.now();
      fileObj.lastTickLoaded = 0;

      // continue next chunk
      setTimeout(()=> {
        if(fileObj.state === 'uploading') uploadNextChunk(fileObj);
      }, 120);
    } else {
      // server error
      fileObj.state = 'error';
      fileObj.stateText.textContent = 'خطا در سرور: ' + xhr.status;
      console.error('Chunk upload failed', xhr.status, xhr.responseText);
    }

    // when chunk accepted and if finished, on next loop finished handler will run
    // but if server returns success we don't immediately disable button here
  };

  xhr.onerror = function(){
    fileObj.state = 'paused';
    fileObj.stateText.textContent = 'خطا در شبکه';
    console.error('Network error during upload');
  };

  xhr.onabort = function(){
    // aborted by pause/cancel — state handled elsewhere
  };

  const form = new FormData();
  form.append('file', chunk, file.name);
  xhr.send(form);
}

dropArea.addEventListener('click', (e)=>{
  fileInput.value = '';
  fileInput.click();
});

fileInput.addEventListener('change', (e)=>{
  if(e.target.files && e.target.files.length) addFiles(e.target.files);
  fileInput.value = '';
});

dropArea.addEventListener('dragover', (e)=>{ e.preventDefault(); dropArea.classList.add('dragover'); });
dropArea.addEventListener('dragleave', (e)=>{ dropArea.classList.remove('dragover'); });
dropArea.addEventListener('drop', (e)=>{ e.preventDefault(); dropArea.classList.remove('dragover'); if(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files); });

dropArea.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.value=''; fileInput.click(); } });


function showSuccessModal() {
    Swal.fire({
        title: "انجام شد!",
        text: "رزرو شما با موفقیت ثبت شد.",
        icon: "success",
        confirmButtonText: "تایید",
        confirmButtonColor: "var(--primary-unima)",
    });
}

function showFailModal() {
    Swal.fire({
        title: "دقایقی دیگر امتحان کنید",
        text: "رزرو شما بنا به دلایلی انجام نشد.",
        icon: "error",
        confirmButtonText: "تایید",
        confirmButtonColor: "var(--primary-unima)",
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

    //if (subject.value.trim().length == 0) {
    //    subject.classList.add("is-invalid");
    //    isvalid = false;
    //}
    if (locations.value === "" || locations.value === '0') {
        locations.classList.add("is-invalid");
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

            const errorDiv = document.getElementById('AppointmentError');


            const response = await fetch("/Faculty/Professors/SetAppointment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appointmentModel)
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = extractFirstModelError(errorData);
                errorDiv.textContent = errorMessage || "خطا در ارسال اطلاعات";
                errorDiv.style.display = "block";
                return;
            }

            const reservationModal = bootstrap.Modal.getInstance(modal);
            reservationModal.hide();
            showSuccessModal();
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

function extractFirstModelError(errorObj) {
    if (!errorObj || typeof errorObj !== 'object') return null;

    const errors = Object.values(errorObj);

    if (!errors || errors.length === 0) return null;

    const firstArray = errors[0];
    return Array.isArray(firstArray) && firstArray.length > 0 ? firstArray[0] : null;
}