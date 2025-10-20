document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const sliderWrapper = document.querySelector(".slider-wrapper");

  if (slides.length > 0) {
    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        sliderWrapper.scrollTo({
          left: slides[idx].offsetLeft,
          behavior: "smooth",
        });
      });
    });

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const visibleSlide = entry.target;
          const index = Array.from(slides).indexOf(visibleSlide);

          dots.forEach((d) => d.classList.remove("active"));
          slides.forEach((s) => s.classList.remove("active"));

          if (dots[index]) {
            dots[index].classList.add("active");
          }
          visibleSlide.classList.add("active");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: sliderWrapper,
      rootMargin: "0px",
      threshold: 0.5,
    });

    slides.forEach((slide) => observer.observe(slide));
  }

  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const body = document.body;

  function openMenu() {
    sideMenu.classList.add("open");
    body.classList.add("no-scroll");
  }

  function closeMenu() {
    sideMenu.classList.remove("open");
    body.classList.remove("no-scroll");
  }

  if (navButton && sideMenu && closeMenuBtn) {
    navButton.addEventListener("click", openMenu);
    closeMenuBtn.addEventListener("click", closeMenu);

    document.addEventListener("click", (e) => {
      if (!sideMenu.contains(e.target) && !navButton.contains(e.target)) {
        closeMenu();
      }
    });
  }

  const menuItems = document.querySelectorAll(".menu-list > li");

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (item.classList.contains("has-sub")) {
        if (e.target.closest("span")) {
          menuItems.forEach(i => {
              if (!i.classList.contains('has-sub')) {
                  i.classList.remove('active');
              }
          });

          item.classList.toggle("active-sub");

          menuItems.forEach((i) => {
            if (i !== item && i.classList.contains("has-sub")) {
              i.classList.remove("active-sub");
            }
          });
        }
      } 
      else {
        menuItems.forEach((i) => {
            i.classList.remove("active");
            i.classList.remove("active-sub");
        });
        item.classList.add("active");
      }
    });
  });
});