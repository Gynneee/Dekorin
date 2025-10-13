document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const sliderWrapper = document.querySelector('.slider-wrapper');
    
    if (slides.length === 0) return;

    const totalSlides = slides.length;
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(slideIndex) {
        sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[slideIndex].classList.add('active');
        currentSlide = slideIndex;
    }

    function nextSlide() {
        const nextSlideIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextSlideIndex);
    }
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.dataset.slide);
            goToSlide(slideIndex);
            
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 4000);
        });
    });

    function startSlideShow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
    }

    goToSlide(0);
    startSlideShow();

const navButton = document.querySelector('.nav-button');
const sideMenu = document.getElementById('sideMenu');
const closeMenu = document.getElementById('closeMenu');

if (navButton && sideMenu && closeMenu) {
  navButton.addEventListener('click', () => {
    sideMenu.classList.add('open');
  });

  closeMenu.addEventListener('click', () => {
    sideMenu.classList.remove('open');
  });

  document.addEventListener('click', (e) => {
    if (!sideMenu.contains(e.target) && !navButton.contains(e.target)) {
      sideMenu.classList.remove('open');
    }
  });
}

const menuItems = document.querySelectorAll('.menu-list li');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    console.log(`${item.textContent.trim()} clicked`);
  });
});


});