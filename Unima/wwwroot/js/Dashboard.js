$(document).ready(function () {
    const START_HOUR = 6,
        END_HOUR = 22;
    const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;

    const now = new Date();
    const currentHour = String(now.getHours()).padStart(2, "0");
    const currentMinute = String(now.getMinutes()).padStart(2, "0");
    const currentTimeStr = `${currentHour}:${currentMinute}`;

    //let events = [
    //    { time: "08:30", title: "قهوه و برنامه‌ریزی روز" },
    //    { time: "10:00", title: "جلسه بازبینی پروژه" },
    //    { time: "13:00", title: "ناهار" },
    //    { time: "15:15", title: "تماس با تیم فنی" },
    //    { time: "18:00", title: "ورزش" },
    //];
    const $eventForm = $("#event-form");

    const timeToPercentage = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        return (((h - START_HOUR) * 60 + m) / TOTAL_MINUTES) * 100;
    };

    function createCallout(event, timelineContainer) {
        const percentage = timeToPercentage(event.time);
        const $callout = $(`
                    <div class="event-callout">
                        <div class="callout-header">
                            <i class="fas fa-clock"></i>
                            <span class="callout-time">${event.time}</span>
                        </div>
                        <div class="callout-body">
                            <span class="callout-title">${event.title}</span>
                        </div>
                    </div>
                `);
        $callout.css("left", `${percentage}%`);
        timelineContainer.append($callout);
        return $callout;
    }

    async function renderTimeline() {
        const response = await fetch("/User/Dashboard/GetTimelineData");
        if (!response.ok) throw new Error("خطا در دریافت داده‌ها");
        const events = await response.json();

        for (i = 0; i < 7; i++) {
            var day = "";
            switch (i) {
                case 0:
                    day = "sat";
                    break;
                case 1:
                    day = "sun";
                    break;
                case 2:
                    day = "mon";
                    break;
                case 3:
                    day = "tue";
                    break;
                case 4:
                    day = "wed";
                    break;
                case 5:
                    day = "thu";
                    break;
                case 6:
                    day = "fri";
                    break;
            }

            const timelineContainer = $(`#timeline-container-${day}`);
            timelineContainer.empty();

            for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
                const hourStr = String(hour).padStart(2, "0");
                const percentage = timeToPercentage(`${hourStr}:00`);
                const $hourTick = $(`<div class="tick tick-hour"></div>`);
                $hourTick.css("left", `${percentage}%`);
                timelineContainer.append($hourTick);
                if (hour < END_HOUR) {
                    for (let minute = 30; minute < 60; minute += 30) {
                        const minPercentage = timeToPercentage(
                            `${hourStr}:${String(minute).padStart(2, "0")}`
                        );
                        const $minTick = $(`<div class="tick tick-minute"></div>`);
                        $minTick.css("left", `${minPercentage}%`);
                        timelineContainer.append($minTick);
                    }
                }
            }

            const currentTimePercentage = timeToPercentage(currentTimeStr);
            const $currentTimeMarker = $(`<div id="current-time-marker"></div>`);
            $currentTimeMarker.css("left", `calc(${currentTimePercentage}% - 1px)`);

            const todayEvents = events.filter((s) => s.dayOfWeek === i);

            todayEvents.sort((a, b) => a.time.localeCompare(b.time));
            const nextEvent = todayEvents.find(
                (event) => event.time > currentTimeStr
            );

            todayEvents.forEach((event) => {
                const percentage = timeToPercentage(event.time);
                if (percentage < 0 || percentage > 100) return;

                let barClass = "event-bar";
                if (event.time < currentTimeStr) barClass += " past";
                else barClass += " future";
                if (event === nextEvent) barClass += " next-event-marker";

                const $bar = $(`<div class="${barClass}"></div>`);
                $bar.css("left", `calc(${percentage}% - 9px)`);

                const $callout = createCallout(event, timelineContainer);
                if (event === nextEvent) {
                    $callout.addClass("visible next-event-card z-n1");
                }
                $bar.data("callout", $callout);
                timelineContainer.append($bar);
            });

            timelineContainer.append($currentTimeMarker);

            timelineContainer.on("mouseenter", ".event-bar", function () {
                $(this).data("callout").addClass("visible");
            });

            timelineContainer.on("mouseleave", ".event-bar", function () {
                const $callout = $(this).data("callout");
                if (!$callout.hasClass("next-event-card")) {
                    $callout.removeClass("visible");
                }
            });
        }
    }
    renderTimeline();
});

async function ChangeOfficeStatus() {
    const select = document.getElementById("OfficeStatus");
    const officeStatus = select.value;

    const response = await fetch(
        `/User/Dashboard/UpdateOfficeStatus/${officeStatus}`,
        {
            method: "POST",
        }
    );

    if (!response.ok) {
        return;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const options = [
        { text: "در دسترس", class: "status-Available", value: 1 },
        { text: "مشغول", class: "status-Busy", value: 2 },
        { text: "بزودی بر میگردم", class: "status-BeRightBack", value: 4 },
        { text: "آفلاین", class: "status-Offline", value: 5 }
    ];
    let currentIndex = 0;

    const cyclerElement = document.getElementById("value-cycler");
    const valueElement = document.getElementById("cycler-value");

    function clearStatusClasses() {
        options.forEach((option) => {
            cyclerElement.classList.remove(option.class);
        });
    }

    function updateValue() {
        valueElement.classList.add("fade-out");

        const currentStatus = valueElement.dataset.currentStatus;
        const currentIndex = (options.findIndex(option => option.value == currentStatus) + 1) % options.length;
        const newStatus = options[currentIndex];

        if (newStatus) {
            fetch(`/User/Dashboard/UpdateOfficeStatus/${newStatus.value}`, {
                method: 'POST'
            })
                .then(data => {
                    setTimeout(() => {

                        valueElement.textContent = newStatus.text;

                        clearStatusClasses();
                        cyclerElement.classList.add(newStatus.class);
                        valueElement.dataset.currentStatus = newStatus.value;

                        valueElement.classList.remove("fade-out");
                    }, 150);
                })
                .catch(error => console.error("Error:", error));
        }
    }

    cyclerElement.addEventListener("click", updateValue);
    cyclerElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {

            updateValue();
        }
    });

    //const initialStatus = options[currentIndex];
    //valueElement.textContent = initialStatus.text;
    //cyclerElement.classList.add(initialStatus.class);
});

function showCards(dayId) {
    document.querySelectorAll(".day-cards").forEach((el) => {
        el.classList.add("d-none");
        el.classList.remove("animate__fadeIn");
    });
    const target = document.getElementById(`card-${dayId}`);
    target.classList.remove("d-none");
    target.classList.add("animate__fadeIn");
}

function backToTodayTimeline(dayOfWeek) {
    const map = {
        0: "sat",
        1: "sun",
        2: "mon",
        3: "tue",
        4: "wed",
        5: "thu",
        6: "fri"
    };

    document.querySelectorAll(".day-cards").forEach((el) => {
        el.classList.add("d-none");
        el.classList.remove("animate__fadeIn");
    });

    document.querySelectorAll(".nav-link").forEach((el) => {
        el.classList.remove("active");
    });

    var todayKey = map[dayOfWeek];

    var tab = document.getElementById(`tab-${todayKey}`);
    if (tab) {
        tab.classList.add("active");
    }

    const todayCard = document.getElementById(`card-${todayKey}`);
    if (todayCard) {
        todayCard.classList.remove("d-none");
        todayCard.classList.add("animate__fadeIn");
    }
}