function showCards(dayId) {
  document.querySelectorAll(".day-cards").forEach((el) => {
    el.classList.add("d-none");
    el.classList.remove("animate__fadeIn");
  });
  const target = document.getElementById(`card-${dayId}`);
  target.classList.remove("d-none");
  target.classList.add("animate__fadeIn");
}
const chatBtn = document.getElementById("chatToggle");
const panel = document.getElementById("supportPanel");
const closeBtn = document.getElementById("closePanel");

    chatBtn.addEventListener("click", () => {
        panel.classList.add("open");
        chatBtn.classList.add("d-none");
    });

    closeBtn.addEventListener("click", () => {
        panel.classList.remove("open");
        chatBtn.classList.remove("d-none");
    });

    document.addEventListener("click", (e) => {
        if (!panel.contains(e.target) && !chatBtn.contains(e.target) && !chatBtn.contains(e.target)) {
            panel.classList.remove("open");
            chatBtn.classList.remove("d-none");
        }
    });