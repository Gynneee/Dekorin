document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  // ========== MENU CONTROL ==========
  function openMainMenu() {
    sideMenu?.classList.add("open");
    menuOverlay?.classList.add("open");
    body.classList.add("no-scroll");
  }

  function openProfileMenu() {
    profileMenu?.classList.add("open");
    menuOverlay?.classList.add("open");
    body.classList.add("no-scroll");
  }

  function closeAllMenus() {
    sideMenu?.classList.remove("open");
    profileMenu?.classList.remove("open");
    menuOverlay?.classList.remove("open");
    body.classList.remove("no-scroll");
  }

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

  if (menuOverlay) {
    menuOverlay.addEventListener("click", (e) => {
      if (e.target === menuOverlay) closeAllMenus();
    });
  }

  // ========== ACTIVE MENU LOGIC ==========
  const menuItems = document.querySelectorAll(".menu-list > li");
  const allLinks = document.querySelectorAll(".menu-list a");
  let currentPage = window.location.pathname.split("/").pop() || "index.html";

  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (linkHref && currentPage === linkHref) {
      const parentLi = link.closest("li");
      parentLi?.classList.add("active");
      const subMenu = parentLi?.closest(".sub-menu");
      const mainParentLi = subMenu?.closest(".has-sub");
      if (mainParentLi) mainParentLi.classList.add("active-sub");
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
        menuItems.forEach((i) => i.classList.remove("active", "active-sub"));
        item.classList.add("active");
        const link = item.querySelector("a");
        if (link) localStorage.setItem("activePage", link.getAttribute("href"));
        closeAllMenus();
      }
    });
  });

  const savedPage = localStorage.getItem("activePage");
  if (savedPage) {
    allLinks.forEach((link) => {
      if (link.getAttribute("href") === savedPage) {
        const parentLi = link.closest("li");
        parentLi?.classList.add("active");
        const subMenu = parentLi?.closest(".sub-menu");
        const mainParentLi = subMenu?.closest(".has-sub");
        if (mainParentLi) mainParentLi.classList.add("active-sub");
      }
    });
  }

  // ========== SLIDER ==========
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

  // ========== ARTICLE CARDS ==========
  const cards = document.querySelectorAll(".article-card");
  let activeCard = null;
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (activeCard === card) {
        const link = card.getAttribute("data-link");
        if (link) window.location.href = link;
        return;
      }
      cards.forEach((c) => c.classList.remove("active"));
      activeCard = card;
      card.classList.add("active");
    });
  });

  // ========== LOGOUT POPUP ==========
  const logoutLink = document.querySelector(".profile-menu-list a i.fa-sign-out-alt");
  const logoutPopup = document.getElementById("logoutPopup");
  const logoutOverlayPopup = document.getElementById("logoutOverlay");
  const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
  const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
  const signOutAnchor = logoutLink?.closest("a");

  function showLogoutPopup() {
    logoutOverlayPopup?.classList.add("show");
    logoutPopup?.classList.add("show");
    body.classList.add("no-scroll");
  }

  function hideLogoutPopup() {
    logoutOverlayPopup?.classList.remove("show");
    logoutPopup?.classList.remove("show");
    if (!sideMenu?.classList.contains("open") && !profileMenu?.classList.contains("open")) {
      body.classList.remove("no-scroll");
    }
  }

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
  logoutOverlayPopup?.addEventListener("click", hideLogoutPopup);

  // ========== NAVBAR ACTIVE LINK ==========
  const navLinks = document.querySelectorAll("nav a, .navbar a");
  if (navLinks.length > 0) {
    let currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");
      link.classList.toggle("active", linkHref && currentPage === linkHref);
    });
  }
});
