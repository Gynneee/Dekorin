document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // ===== ELEMENT SELECTORS =====
  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  // ===== MENU CONTROL =====
  const openMainMenu = () => {
    sideMenu?.classList.add("open");
    menuOverlay?.classList.add("open");
    body.classList.add("no-scroll");
  };

  const openProfileMenu = () => {
    profileMenu?.classList.add("open");
    menuOverlay?.classList.add("open");
    body.classList.add("no-scroll");
  };

  const closeAllMenus = () => {
    sideMenu?.classList.remove("open");
    profileMenu?.classList.remove("open");
    menuOverlay?.classList.remove("open");
    body.classList.remove("no-scroll");
  };

  navButton?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (profileMenu?.classList.contains("open")) closeAllMenus();
    openMainMenu();
  });

  profileBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (sideMenu?.classList.contains("open")) closeAllMenus();
    openProfileMenu();
  });

  closeMenuBtn?.addEventListener("click", closeAllMenus);
  menuOverlay?.addEventListener("click", (e) => {
    if (e.target === menuOverlay) closeAllMenus();
  });

  // ===== ACTIVE MENU HIGHLIGHT =====
  const menuItems = document.querySelectorAll(".menu-list > li");
  const allLinks = document.querySelectorAll(".menu-list a");
  let currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Highlight the correct menu based on the current page
  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    const parentLi = link.closest("li");

    // Avoid false matches (e.g., 'invision.html' triggering 'index.html')
    if (linkHref && currentPage === linkHref) {
      parentLi?.classList.add("active");

      const subMenu = parentLi?.closest(".sub-menu");
      const mainParentLi = subMenu?.closest(".has-sub");
      if (mainParentLi) mainParentLi.classList.add("active-sub");
    } else {
      parentLi?.classList.remove("active");
    }
  });

  // Handle submenu toggle
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (item.classList.contains("has-sub")) {
        if (e.target.closest(".sub-menu")) return;
        item.classList.toggle("active-sub");
        menuItems.forEach((i) => {
          if (i !== item && i.classList.contains("has-sub")) i.classList.remove("active-sub");
        });
      } else {
        menuItems.forEach((i) => i.classList.remove("active", "active-sub"));
        item.classList.add("active");
        closeAllMenus();
      }
    });
  });

  // ===== SLIDER CONTROL =====
  const sliderWrapper = document.querySelector(".slider-wrapper");
  if (sliderWrapper) {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        sliderWrapper.scrollTo({
          left: slides[idx].offsetLeft,
          behavior: "smooth",
        });
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const visibleSlide = entry.target;
            const index = Array.from(slides).indexOf(visibleSlide);
            dots.forEach((d) => d.classList.remove("active"));
            slides.forEach((s) => s.classList.remove("active"));
            dots[index]?.classList.add("active");
            visibleSlide.classList.add("active");
          }
        });
      },
      { root: sliderWrapper, threshold: 0.5 }
    );

    slides.forEach((slide) => observer.observe(slide));
  }

  // ===== LOGOUT POPUP =====
  const logoutLink = document.querySelector(".profile-menu-list a i.fa-sign-out-alt");
  const logoutPopup = document.getElementById("logoutPopup");
  const logoutOverlay = document.getElementById("logoutOverlay");
  const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
  const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
  const signOutAnchor = logoutLink?.closest("a");

  const showLogoutPopup = () => {
    logoutOverlay?.classList.add("show");
    logoutPopup?.classList.add("show");
    body.classList.add("no-scroll");
  };

  const hideLogoutPopup = () => {
    logoutOverlay?.classList.remove("show");
    logoutPopup?.classList.remove("show");
    if (!sideMenu?.classList.contains("open") && !profileMenu?.classList.contains("open")) {
      body.classList.remove("no-scroll");
    }
  };

  signOutAnchor?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllMenus();
    showLogoutPopup();
  });

  confirmLogoutBtn?.addEventListener("click", () => {
    hideLogoutPopup();
    console.log("User confirmed logout!");
  });

  cancelLogoutBtn?.addEventListener("click", hideLogoutPopup);
  logoutOverlay?.addEventListener("click", hideLogoutPopup);
});
