document.addEventListener("DOMContentLoaded", () => {
  // --- Part 1: Side Menu Logic ---
  const openMenuBtn = document.getElementById("openMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const sideMenu = document.getElementById("sideMenu");
  const subMenuToggles = document.querySelectorAll(".menu-list .has-sub > span");
  let activeSubMenu = null;

  if (openMenuBtn && sideMenu) {
    openMenuBtn.addEventListener("click", () => {
      sideMenu.classList.add("open");
      document.body.classList.add("no-scroll");
    });
  }

  if (closeMenuBtn && sideMenu) {
    closeMenuBtn.addEventListener("click", () => {
      sideMenu.classList.remove("open");
      document.body.classList.remove("no-scroll");
      if (activeSubMenu) {
        activeSubMenu.classList.remove("active-sub");
        activeSubMenu = null;
      }
    });
  }

  subMenuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const parentLi = toggle.closest(".has-sub");
      if (!parentLi) return;

      if (parentLi.classList.contains("active-sub")) {
        parentLi.classList.remove("active-sub");
        activeSubMenu = null;
      } else {
        if (activeSubMenu) {
          activeSubMenu.classList.remove("active-sub");
        }
        parentLi.classList.add("active-sub");
        activeSubMenu = parentLi;
      }
    });
  });

  // --- Part 2: Reveal-on-Scroll Logic (Makes text appear) ---
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // --- Part 3: Parallax-on-Scroll Logic (Lando Norris effect) ---
  const heroImage = document.querySelector(".hero-image");
  const parallaxElements = document.querySelectorAll(".parallax-element");
  const viewportCenterY = window.innerHeight / 2;

  // A function to apply parallax to elements in the main viewport
  const applyViewportParallax = () => {
    parallaxElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elCenterY = rect.top + rect.height / 2;

      // Calculate the element's distance from the viewport center
      const distanceFromCenter = elCenterY - viewportCenterY;
      
      // We apply a "slower" speed. You can change -0.08
      const move = distanceFromCenter * -0.08;

      el.style.transform = `translateY(${move}px)`;
    });
  };

  // A function for the hero image's "slower scroll" effect
  const applyHeroParallax = (scrollPos) => {
    if (heroImage) {
      // Moves the image down at 40% of the scroll speed
      heroImage.style.transform = `translateY(${scrollPos * 0.4}px)`;
    }
  };

  // Run all parallax logic on every scroll event
  window.addEventListener("scroll", () => {
    let scrollPos = window.scrollY;
    
    window.requestAnimationFrame(() => {
      applyHeroParallax(scrollPos);
      applyViewportParallax();
    });
  });

  // Run it once on load to set initial positions
  applyViewportParallax();
});