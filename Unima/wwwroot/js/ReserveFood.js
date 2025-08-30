 document.addEventListener("DOMContentLoaded", function () {
    const tabContent = document.getElementById("pills-tabContent");
    const dayTemplate = document.getElementById("day-template");
    const days = [
      "saturday",
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ];
    const cafeteriaModalEl = document.getElementById("cafeteriaModal");
    const saveCafeteriaBtn = document.getElementById("saveCafeteria");

    days.forEach((day, index) => {
      const dayDiv = document.createElement("div");
      dayDiv.className = `tab-pane fade ${index === 0 ? "show active" : ""}`;
      dayDiv.id = `day-${day}`;
      dayDiv.role = "tabpanel";
      dayDiv.innerHTML = dayTemplate.innerHTML;
      tabContent.appendChild(dayDiv);
    });

    function updateCafeteriaDisplay(mealSlot) {
      const cafeteriaValue = mealSlot.dataset.cafeteria;
      const cafeteriaDisplay = mealSlot.querySelector(".selected-cafeteria");
      const cafeteriaRadio = document.querySelector(
        `input[name="cafeteria-option"][value="${cafeteriaValue}"]`
      );

      if (cafeteriaRadio) {
        const cafeteriaName = document.querySelector(
          `label[for="${cafeteriaRadio.id}"]`
        ).textContent;
        cafeteriaDisplay.innerHTML = `<i class="fa-solid fa-utensils fa-xs"></i> ${cafeteriaName}`;
        cafeteriaDisplay.classList.add("visible");
      }
    }

    cafeteriaModalEl.addEventListener("show.bs.modal", function (event) {
      const triggerButton = event.relatedTarget;
      const mealSlot = triggerButton.closest(".meal-slot");
      const mealTitle = mealSlot
        .querySelector(".meal-title")
        .textContent.trim();
      const currentCafeteria = mealSlot.dataset.cafeteria || "main";

      cafeteriaModalEl.querySelector(
        ".modal-title"
      ).textContent = `تنظیمات سلف برای ${mealTitle}`;
      cafeteriaModalEl.dataset.currentMeal = `${
        mealSlot.closest(".tab-pane").id
      }-${mealSlot.dataset.meal}`;

      const radioToCheck = cafeteriaModalEl.querySelector(
        `input[value="${currentCafeteria}"]`
      );
      if (radioToCheck) radioToCheck.checked = true;
    });

    saveCafeteriaBtn.addEventListener("click", function () {
      const mealIdentifier = cafeteriaModalEl.dataset.currentMeal;
      const selectedRadio = cafeteriaModalEl.querySelector(
        'input[name="cafeteria-option"]:checked'
      );

      if (mealIdentifier && selectedRadio) {
        const [tabId, mealType] = mealIdentifier.split("-");
        const mealSlotToUpdate = document.querySelector(
          `#${tabId} .meal-slot[data-meal="${mealType}"]`
        );

        mealSlotToUpdate.dataset.cafeteria = selectedRadio.value;
        updateCafeteriaDisplay(mealSlotToUpdate);

        mealSlotToUpdate
          .querySelector(".cafeteria-btn")
          .classList.add("active");
        bootstrap.Modal.getInstance(cafeteriaModalEl).hide();
      }
    });

    document.querySelectorAll(".meal-slot").forEach((slot) => {
      const header = slot.querySelector(".meal-header");
      const selectedMealText = slot.querySelector(".selected-meal");
      const lockBtn = slot.querySelector(".lock-btn");

      updateCafeteriaDisplay(slot);

      header.addEventListener("click", (e) => {
        if (slot.classList.contains("locked")) return;
        if (e.target.closest(".meal-actions")) return;

        const isActive = slot.classList.contains("active");
        const currentTab = slot.closest(".tab-pane");
        currentTab
          .querySelectorAll(".meal-slot")
          .forEach((s) => s.classList.remove("active"));
        if (!isActive) slot.classList.add("active");
      });

      slot.addEventListener("click", (e) => {
        if (
          slot.classList.contains("locked") &&
          !e.target.closest(".meal-header")
        ) {
          lockBtn.click();
        }
      });

      slot.querySelectorAll(".meal-option-btn").forEach((button) => {
        button.addEventListener("click", () => {
          selectedMealText.textContent = button.dataset.value;
          selectedMealText.classList.add("is-selected");
          selectedMealText.classList.remove("pulse-animation");
          void selectedMealText.offsetWidth;
          selectedMealText.classList.add("pulse-animation");

          slot
            .querySelectorAll(".meal-option-btn")
            .forEach((btn) => btn.classList.remove("selected"));
          button.classList.add("selected");
          slot.classList.remove("active");
        });
      });
      if (lockBtn) {
          lockBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isLocking = !slot.classList.contains("locked");
            if (isLocking) {
              slot.classList.add("locked");
              setTimeout(() => slot.classList.add("show-lock-icon"), 10);
            } else {
              slot.classList.remove("show-lock-icon");
              setTimeout(() => slot.classList.remove("locked"), 300);
            }
            e.currentTarget.classList.toggle("active");
          });  
      }
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".meal-slot")) {
        document.querySelectorAll(".meal-slot.active").forEach((slot) => {
          slot.classList.remove("active");
        });
      }
    });
  });