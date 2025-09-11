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
  const location = document.getElementById("location");
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

  if (subject.value.trim().length < 4) {
    subject.classList.add("is-invalid");
    isvalid = false;
  }
  if (location.value === "") {
    location.classList.add("is-invalid");
    isvalid = false;
  }
  if (description.value.trim().length < 10) {
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

$(document).ready(function () {
  $(".professor-card-wrapper").on("click", function (e) {
    if (
      $(e.target).is("a, button, .close-btn") ||
      $(e.target).closest("a, button").length
    ) {
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
    card
      .addClass("is-open")
      .removeClass("col-lg-3 col-md-6")
      .addClass("col-12");
  }

  function closeCard(card) {
    $("#professors-list .professor-card-wrapper")
      .not(card)
      .removeClass("fading-out");
    card
      .removeClass("is-open")
      .removeClass("col-12")
      .addClass("col-lg-3 col-md-6");
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
    var value = $(this).val().toLowerCase();
    var found = false;
    if ($(".professor-card-wrapper.is-open").length) {
      closeCard($(".professor-card-wrapper.is-open"));
    }
    $("#professors-list .professor-card-wrapper").filter(function () {
      var cardText = $(this).text().toLowerCase();
      var isVisible = cardText.indexOf(value) > -1;
      $(this).toggle(isVisible);
      if (isVisible) {
        found = true;
      }
    });
    if (found) {
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
  const scheduleModalElement = document.getElementById("scheduleModal");

  if (submitBtn && scheduleModalElement) {
    let reservationSubmitted = false;
    const infoModal = bootstrap.Modal.getOrCreateInstance(scheduleModalElement);

    scheduleModalElement.addEventListener("hidden.bs.modal", function () {
      if (reservationSubmitted) {
        showFailModal();
        reservationSubmitted = false;
      }
      document.getElementById("ReservationForm").reset();
    });

    submitBtn.addEventListener("click", function (event) {
      event.preventDefault();

      if (!validateReservationForm()) {
        return;
      }

      reservationSubmitted = true;
      submitBtn.disabled = true;
      submitBtn.innerText = "در حال پردازش...";

      setTimeout(() => {
        infoModal.hide();
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = "رزرو";
        }, 500);
      }, 3000);
    });
  }

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
