document.addEventListener("DOMContentLoaded", function () {

  const sliderWrapper = document.querySelector(".slider-wrapper");
  if (sliderWrapper) {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

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
  let currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "" || currentPage === "/") currentPage = "index.html";

  const allLinks = document.querySelectorAll(".menu-list a");
  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    const parentLi = link.closest("li");
    if (linkHref && currentPage.includes(linkHref)) {
      parentLi.classList.add("active");
      const subMenu = parentLi.closest(".sub-menu");
      if (subMenu) {
        const mainParentLi = subMenu.closest(".has-sub");
        if (mainParentLi) mainParentLi.classList.add("active-sub");
      }
    }
  });

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (item.classList.contains("has-sub")) {
        if (e.target.closest(".sub-menu")) return;
        item.classList.toggle("active-sub");
        menuItems.forEach((i) => {
          if (i !== item && i.classList.contains("has-sub")) i.classList.remove("active-sub");
        });
      } else {
        menuItems.forEach((i) => {
          i.classList.remove("active");
          i.classList.remove("active-sub");
        });
        item.classList.add("active");
        const link = item.querySelector("a");
        if (link) localStorage.setItem("activePage", link.getAttribute("href"));
        if (sideMenu && body) {
          sideMenu.classList.remove("open");
          body.classList.remove("no-scroll");
        }
      }
    });
  });

  const savedPage = localStorage.getItem("activePage");
  if (savedPage) {
    allLinks.forEach((link) => {
      if (link.getAttribute("href") === savedPage) {
        const parentLi = link.closest("li");
        parentLi.classList.add("active");
        const subMenu = parentLi.closest(".sub-menu");
        if (subMenu) {
          const mainParentLi = subMenu.closest(".has-sub");
          if (mainParentLi) mainParentLi.classList.add("active-sub");
        }
      }
    });
  }

  const cards = document.querySelectorAll(".article-card");
  let activeCard = null;
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (activeCard === card) {
        const link = card.getAttribute("data-link");
        window.location.href = link;
        return;
      }
      cards.forEach((c) => c.classList.remove("active"));
      activeCard = card;
      card.classList.add("active");
    });
  });

  const navLinks = document.querySelectorAll("nav a, .navbar a");
  if (navLinks.length > 0) {
    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "" || currentPage === "/") currentPage = "index.html";
    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");
      if (linkHref && currentPage.includes(linkHref)) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
});


