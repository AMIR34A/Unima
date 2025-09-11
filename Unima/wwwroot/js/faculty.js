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

  // بستن فقط با دکمه ضربدر
  $(".close-btn").on("click", function (e) {
    e.stopPropagation();
    closeCard($(this).closest(".professor-card-wrapper"));
  });

  function openCard(card) {
    card
      .addClass("is-open")
      .removeClass("col-lg-3 col-md-6")
      .addClass("col-12");
  }
  function closeCard(card) {
    const lastAnimatedElement = card.find(".profile-img");

    card.addClass("is-closing");

    lastAnimatedElement.one("animationend", function () {
      card
        .removeClass("is-open")
        .removeClass("is-closing")
        .removeClass("col-12")
        .addClass("col-lg-3 col-md-6");
    });
  }

  $(".action-btn-wrapper button").on("click", function () {
    var professorName = $(this)
      .closest(".professor-card")
      .find(".card-title")
      .first()
      .text();
    var modalId = $(this).data("bs-target");
    $(modalId)
      .find(".modal-title")
      .text("اطلاعات مربوط به " + professorName);
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
});
