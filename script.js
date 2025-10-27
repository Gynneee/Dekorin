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
  
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  
  const menuOverlay = document.getElementById("menuOverlay");
  const body = document.body;

  function openMainMenu() {
    sideMenu.classList.add("open");
    menuOverlay.classList.add("open");
    body.classList.add("no-scroll");
  }

  function openProfileMenu() {
    profileMenu.classList.add("open");
    menuOverlay.classList.add("open");
    body.classList.add("no-scroll");
  }

  function closeAllMenus() {
    sideMenu.classList.remove("open");
    profileMenu.classList.remove("open");
    menuOverlay.classList.remove("open");
    body.classList.remove("no-scroll");
  }

  if (navButton) {
    navButton.addEventListener("click", (e) => {
      e.stopPropagation(); 
      if (profileMenu.classList.contains("open")) {
        closeAllMenus();
      }
      openMainMenu();
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      if (sideMenu.classList.contains("open")) {
        closeAllMenus();
      }
      openProfileMenu();
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", closeAllMenus);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener("click", closeAllMenus);
  }

  const menuItems = document.querySelectorAll(".menu-list > li");
  let currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "" || currentPage === "/") {
    currentPage = "index.html";
  }

  const allLinks = document.querySelectorAll(".menu-list a");
  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPage) {
      const parentLi = link.closest("li");
      const subMenu = parentLi.closest(".sub-menu");
      if (subMenu) {
        parentLi.classList.add("active");
        const mainParentLi = subMenu.closest(".has-sub");
        if (mainParentLi) {
          mainParentLi.classList.add("active-sub");
        }
      } else {
        parentLi.classList.add("active");
      }
    }
  });

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (item.classList.contains("has-sub")) {
        if (e.target.closest(".sub-menu")) {
          return; 
        }
        item.classList.toggle("active-sub");
        menuItems.forEach((i) => {
          if (i !== item && i.classList.contains("has-sub")) {
            i.classList.remove("active-sub");
          }
        });
      } else {
        const link = item.querySelector("a");
        if (!link) return;
        const linkHref = link.getAttribute("href");
        
        if (linkHref !== currentPage && linkHref !== "#") {
          return; 
        }

        e.preventDefault();
        
        menuItems.forEach((i) => {
          i.classList.remove("active");
          i.classList.remove("active-sub");
        });
        item.classList.add("active");
        closeAllMenus(); 
      }
    });
  });

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

  // ADDED Logout Popup Logic
  const logoutLink = document.querySelector('.profile-menu-list a i.fa-sign-out-alt');
  const logoutPopup = document.getElementById('logoutPopup');
  const logoutOverlayPopup = document.getElementById('logoutOverlay'); // Renamed to avoid conflict
  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
  const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');

  let signOutAnchor = null;
  if (logoutLink) {
     signOutAnchor = logoutLink.closest('a');
  }

  function showLogoutPopup() {
    if (logoutPopup && logoutOverlayPopup) {
      logoutOverlayPopup.classList.add('show');
      logoutPopup.classList.add('show');
      body.classList.add('no-scroll');
    }
  }

  function hideLogoutPopup() {
     if (logoutPopup && logoutOverlayPopup) {
      logoutOverlayPopup.classList.remove('show');
      logoutPopup.classList.remove('show');
      if (!sideMenu.classList.contains('open') && !profileMenu.classList.contains('open')) {
        body.classList.remove('no-scroll');
      }
    }
  }

  if (signOutAnchor) {
    signOutAnchor.addEventListener('click', function(e) {
      e.preventDefault(); 
      closeAllMenus();    
      showLogoutPopup();
    });
  }

  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', function() {
      hideLogoutPopup();
      console.log("User confirmed logout!");
    });
  }

  if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener('click', hideLogoutPopup);
  }

  if (logoutOverlayPopup) {
     logoutOverlayPopup.addEventListener('click', hideLogoutPopup);
  }

});