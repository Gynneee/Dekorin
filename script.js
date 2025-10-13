document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const sliderWrapper = document.querySelector('.slider-wrapper');
    
    if (slides.length === 0) return;

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            const slide = slides[idx];
            sliderWrapper.scrollTo({
                left: slide.offsetLeft,
                behavior: 'smooth'
            });
        });
    });

    sliderWrapper.addEventListener('scroll', () => {
    let closestIdx = 0;
    let closestDist = Math.abs(sliderWrapper.scrollLeft - slides[0].offsetLeft);

    slides.forEach((slide, idx) => {
        const dist = Math.abs(sliderWrapper.scrollLeft - slide.offsetLeft);
        if (dist < closestDist) {
            closestDist = dist;
            closestIdx = idx;
        }
    });

    dots.forEach(dot => dot.classList.remove('active'));
    dots[closestIdx].classList.add('active');

    slides.forEach(slide => slide.classList.remove('active'));
    slides[closestIdx].classList.add('active');
});

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[0]) dots[0].classList.add('active');

    const navButton = document.querySelector('.nav-button');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    const mainContent = document.querySelector('.main-content');
    const body = document.body;

    function openMenu() {
        sideMenu.classList.add('open');
        body.classList.add('no-scroll');
    }

    function closeMenuFunc() {
        sideMenu.classList.remove('open');
        body.classList.remove('no-scroll');
    }

    if (navButton && sideMenu && closeMenu) {
        navButton.addEventListener('click', openMenu);

        closeMenu.addEventListener('click', closeMenuFunc);

        document.addEventListener('click', (e) => {
            if (!sideMenu.contains(e.target) && !navButton.contains(e.target)) {
                closeMenuFunc();
            }
        });
    }

    const menuItems = document.querySelectorAll('.menu-list li');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

});