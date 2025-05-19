function showCards(dayId) {
  document.querySelectorAll(".day-cards").forEach((el) => {
    el.classList.add("d-none");
    el.classList.remove("animate__fadeIn");
  });
  const target = document.getElementById(`card-${dayId}`);
  target.classList.remove("d-none");
  target.classList.add("animate__fadeIn");
}
