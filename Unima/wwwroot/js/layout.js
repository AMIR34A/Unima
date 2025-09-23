
document.addEventListener('DOMContentLoaded', function(){
    const profileTrigger = document.getElementById('profileTrigger');
    const dropdownProfile = document.querySelector('.dropdownProfile');

    profileTrigger.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdownProfile.classList.toggle('show');
    });

    window.addEventListener('click', function() {
        if (dropdownProfile.classList.contains('show')) {
            dropdownProfile.classList.remove('show');
        }
    });
            const navItems = document.querySelectorAll('.nav-bar .nav-item');
        const currentPath = window.location.pathname;
        navItems.forEach(item => item.classList.remove('active'));

        navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        if (link) {
            const linkPath = new URL(link.href).pathname;
            const isFirstNavItem = item === navItems[0]; 

            if (currentPath === linkPath && !isFirstNavItem) {
                item.classList.add('active');
            }
        }
        });
        const allPaths = document.querySelectorAll('.main-path');
        allPaths.forEach(path => {
            const length = path.getTotalLength();
                
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
                
            path.classList.add('is-drawing');
        });
});