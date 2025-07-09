const chatBtn = document.getElementById("chatToggle");
const panel = document.getElementById("supportPanel");
const closeBtn = document.getElementById("closePanel");
const supportContent = document.querySelector('.support-content');
const accordionButtons = document.querySelectorAll('.accordion-button::after'); 

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
        if (!panel.contains(e.target) && !chatBtn.contains(e.target) && !chatBtn.contains(e.target)) {
            panel.classList.remove("open");
            chatBtn.classList.remove("d-none");
        }
    });

supportContent.addEventListener('scroll', () => {
  if (supportContent.scrollTop > 0) {
    // وقتی اسکرول خورده
    document.querySelectorAll('.accordion-button').forEach(btn => {
      btn.style.setProperty('--after-left', '-1.2rem'); 
      // یا کلاس اضافه کن
      btn.classList.add('scrolled');
    });
  } else {
    // وقتی اسکرول به بالا برگشت
    document.querySelectorAll('.accordion-button').forEach(btn => {
      btn.style.setProperty('--after-left', '-0.5rem');
      btn.classList.remove('scrolled');
    });
  }
});