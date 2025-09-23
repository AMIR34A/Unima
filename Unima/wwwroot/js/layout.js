document.addEventListener("DOMContentLoaded", function () {
  const notificationTrigger = document.getElementById("notificationTrigger");
  const dropdownNotification = document.querySelector(".dropdownNotification");

  const profileTrigger = document.getElementById("profileTrigger");
  const dropdownProfile = document.querySelector(".dropdownProfile");

  const chatToggle = document.querySelector('#chatToggle');
  const supportPanel = document.querySelector('#supportPanel');
  const closePanel = document.querySelector('#closePanel');

  function closeAllDropdowns() {
    dropdownNotification.classList.remove("show");
    dropdownProfile.classList.remove("show");
  }

  function closeSupportPanel() {
    supportPanel.classList.remove('open');
    chatToggle.style.display = 'flex';
  }

  notificationTrigger.addEventListener('click', function (event) {
    event.stopPropagation();
    dropdownProfile.classList.remove("show");
    closeSupportPanel();
    dropdownNotification.classList.toggle("show");
  });

  profileTrigger.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdownNotification.classList.remove("show");
    closeSupportPanel();
    dropdownProfile.classList.toggle("show");
  });

  chatToggle.addEventListener('click', function (event) {
    event.stopPropagation();
    closeAllDropdowns();
    supportPanel.classList.add('open');
    chatToggle.style.display = 'none';
  });

  closePanel.addEventListener('click', function () {
    closeSupportPanel();
  });

  window.addEventListener('click', function (event) {
    if (!notificationTrigger.contains(event.target) && !dropdownNotification.contains(event.target)) {
      dropdownNotification.classList.remove('show');
    }
    if (!profileTrigger.contains(event.target) && !dropdownProfile.contains(event.target)) {
      dropdownProfile.classList.remove("show");
    }
    if (supportPanel.classList.contains('open') && !supportPanel.contains(event.target) && !chatToggle.contains(event.target)) {
      closeSupportPanel();
    }
  });

  const navItems = document.querySelectorAll(".nav-bar .nav-item");
  const currentPath = window.location.pathname;
  navItems.forEach((item) => item.classList.remove("active"));

  navItems.forEach((item) => {
    const link = item.querySelector(".nav-link");
    if (link) {
      const linkPath = new URL(link.href).pathname;
      const isFirstNavItem = item === navItems[0];

      if (currentPath === linkPath && !isFirstNavItem) {
        item.classList.add("active");
      }
    }
  });

  const allPaths = document.querySelectorAll(".main-path");
  allPaths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.classList.add("is-drawing");
  });
});