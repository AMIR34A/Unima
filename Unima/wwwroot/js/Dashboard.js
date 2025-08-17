const chatBtn = document.getElementById("chatToggle");
const panel = document.getElementById("supportPanel");
const closeBtn = document.getElementById("closePanel");
const supportContent = document.querySelector(".support-content");
const accordionButtons = document.querySelectorAll(".accordion-button::after");

function showCards(dayId) {
  document.querySelectorAll(".day-cards").forEach((el) => {
    el.classList.add("d-none");
    el.classList.remove("animate__fadeIn");
  });
  const target = document.getElementById(`card-${dayId}`);
  target.classList.remove("d-none");
  target.classList.add("animate__fadeIn");
}

chatBtn.addEventListener("click", () => {
  panel.classList.add("open");
  chatBtn.classList.add("d-none");
});

closeBtn.addEventListener("click", () => {
  panel.classList.remove("open");
  chatBtn.classList.remove("d-none");
});

document.addEventListener("click", (e) => {
  if (
    !panel.contains(e.target) &&
    !chatBtn.contains(e.target) &&
    !chatBtn.contains(e.target)
  ) {
    panel.classList.remove("open");
    chatBtn.classList.remove("d-none");
  }
});

supportContent.addEventListener("scroll", () => {
  if (supportContent.scrollTop > 0) {
    // وقتی اسکرول خورده
    document.querySelectorAll(".accordion-button").forEach((btn) => {
      btn.style.setProperty("--after-left", "-1.2rem");
      // یا کلاس اضافه کن
      btn.classList.add("scrolled");
    });
  } else {
    // وقتی اسکرول به بالا برگشت
    document.querySelectorAll(".accordion-button").forEach((btn) => {
      btn.style.setProperty("--after-left", "-0.5rem");
      btn.classList.remove("scrolled");
    });
  }
});
$(document).ready(function () {
  const START_HOUR = 7,
    END_HOUR = 20;
  const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
  const currentTimeStr = "11:00"; // می‌توانید این را با تابع زمان حال جایگزین کنید

  let events = [
    { time: "08:30", title: "قهوه و برنامه‌ریزی روز" },
    { time: "10:00", title: "جلسه بازبینی پروژه" },
    { time: "13:00", title: "ناهار" },
    { time: "15:15", title: "تماس با تیم فنی" },
    { time: "18:00", title: "ورزش" },
  ];

  const $timelineContainer = $("#timeline-container");
  const $eventForm = $("#event-form");

  const timeToPercentage = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return (((h - START_HOUR) * 60 + m) / TOTAL_MINUTES) * 100;
  };

  function createCallout(event) {
    const percentage = timeToPercentage(event.time);
    const $callout = $(
      `<div class="event-callout"><span class="callout-time">${event.time}</span><span class="callout-title">${event.title}</span></div>`
    );
    $callout.css("left", `${percentage}%`);
    $timelineContainer.append($callout);
    return $callout;
  }

  function renderTimeline() {
    $timelineContainer.empty();

    const currentTimePercentage = timeToPercentage(currentTimeStr);
    const $currentTimeMarker = $(`<div id="current-time-marker"></div>`);
    $currentTimeMarker.css("left", `calc(${currentTimePercentage}% - 1px)`);

    events.sort((a, b) => a.time.localeCompare(b.time));
    const nextEvent = events.find((event) => event.time > currentTimeStr);

    events.forEach((event) => {
      const percentage = timeToPercentage(event.time);
      if (percentage < 0 || percentage > 100) return;

      let barClass = "event-bar";
      if (event.time < currentTimeStr) barClass += " past";
      else barClass += " future";
      if (event === nextEvent) barClass += " next-event-marker";

      const $bar = $(`<div class="${barClass}"></div>`);
      $bar.css("left", `calc(${percentage}% - 6px)`);

      const $callout = createCallout(event);
      if (event === nextEvent) {
        $callout.addClass("visible");
      }
      $bar.data("callout", $callout);
      $timelineContainer.append($bar);
    });

    $timelineContainer.append($currentTimeMarker);
  }

  $timelineContainer.on("mouseenter", ".event-bar", function () {
    $(this).data("callout").addClass("visible");
  });

  $timelineContainer.on("mouseleave", ".event-bar", function () {
    const $callout = $(this).data("callout");
    // اگر رویداد بعدی نبود، کارت را مخفی کن
    const nextEvent = events.find((e) => e.time > currentTimeStr);
    if ($(this).data("event") !== nextEvent) {
      $callout.removeClass("visible");
    }
  });

  $eventForm.on("submit", function (e) {
    e.preventDefault();
    const time = $("#event-time").val();
    const title = $("#event-title").val();

    if (time && title) {
      const hour = parseInt(time.split(":")[0]);
      if (hour < START_HOUR || hour > END_HOUR) {
        alert(`زمان وارد شده خارج از محدوده است.`);
        return;
      }
      events.push({ time, title });
      renderTimeline();
      $eventForm[0].reset();
      const collapseElement = document.getElementById("collapseOne");
      const bsCollapse = bootstrap.Collapse.getInstance(collapseElement);
      if (bsCollapse) bsCollapse.hide();
    }
  });

  renderTimeline();
});
