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
});