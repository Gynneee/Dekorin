document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  body.classList.add("logged-in");

  function initializeSlider(containerSelector) {
    const sliderContainer = document.querySelector(containerSelector);
    if (!sliderContainer) return;

    const wrapper = sliderContainer.querySelector(".slider-wrapper, .content-slider-wrapper");
    const slides = wrapper ? Array.from(wrapper.children) : [];
    const dotsContainer = sliderContainer.querySelector(".slider-dots");
    if (!wrapper || slides.length === 0 || !dotsContainer) return;

    dotsContainer.innerHTML = "";
    slides.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (idx === 0) dot.classList.add("active");
      dot.setAttribute("data-slide", idx);
      dot.addEventListener("click", () => {
        if (slides[idx]) {
          wrapper.scrollTo({
            left: slides[idx].offsetLeft,
            behavior: "smooth",
          });
        }
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".dot");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(slides).indexOf(entry.target);
            dots.forEach((d) => d.classList.remove("active"));
            slides.forEach((s) => s.classList.remove("active"));
            dots[index]?.classList.add("active");
            entry.target.classList.add("active");
          }
        });
      },
      { root: wrapper, threshold: 0.5 }
    );

    slides.forEach((slide) => observer.observe(slide));
  }

  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  const logoutPopup = document.getElementById("logoutPopup");
  const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
  const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
  const logoutLink = document.querySelector(".profile-menu-list a i.fa-sign-out-alt");
  const signOutAnchor = logoutLink?.closest("a");

  const openMenu = (menu) => {
    menu?.classList.add("open");
    menuOverlay?.classList.add("open");
    body.classList.add("no-scroll");
  };

  const closeAllMenus = () => {
    [sideMenu, profileMenu].forEach((m) => m?.classList.remove("open"));
    menuOverlay?.classList.remove("open");
    if (!logoutPopup?.classList.contains("show")) {
      body.classList.remove("no-scroll");
    }
  };

  const showLogoutPopup = () => {
    if (logoutPopup && menuOverlay) {
      menuOverlay.classList.add("show");
      logoutPopup.classList.add("show");
      body.classList.add("no-scroll");
    }
  };

  const hideLogoutPopup = () => {
    if (logoutPopup && menuOverlay) {
      menuOverlay.classList.remove("show");
      logoutPopup.classList.remove("show");
      if (!sideMenu?.classList.contains("open") && !profileMenu?.classList.contains("open")) {
        body.classList.remove("no-scroll");
      }
    }
  };

  navButton?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (profileMenu?.classList.contains("open")) closeAllMenus();
    openMenu(sideMenu);
  });

  profileBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (sideMenu?.classList.contains("open")) closeAllMenus();
    openMenu(profileMenu);
  });

  closeMenuBtn?.addEventListener("click", closeAllMenus);

  menuOverlay?.addEventListener("click", (e) => {
    if (e.target === menuOverlay) {
      if (logoutPopup?.classList.contains("show")) {
        hideLogoutPopup();
      } else {
        closeAllMenus();
      }
    }
  });
  
  sideMenu?.addEventListener("click", (e) => e.stopPropagation());
  profileMenu?.addEventListener("click", (e) => e.stopPropagation());

  signOutAnchor?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllMenus();
    showLogoutPopup();
  });

  confirmLogoutBtn?.addEventListener("click", () => {
    hideLogoutPopup();
    console.log("User confirmed logout!");
    localStorage.setItem("isLoggedIn", "false");
    body.classList.remove("logged-in");
    window.location.href = "index.html";
  });

  cancelLogoutBtn?.addEventListener("click", hideLogoutPopup);

  const allLinks = document.querySelectorAll(".menu-list a");
  const menuItems = document.querySelectorAll(".menu-list > li");

  let currentPageFile = window.location.pathname.split("/").pop();
  let currentPageBase = currentPageFile.replace('.html', '');
  
  if (currentPageFile === "" || currentPageFile === "/" || !currentPageFile) {
     if (window.location.pathname === '/' || window.location.pathname === '') {
       currentPageFile = "loggedin.html";
       currentPageBase = "loggedin";
     } else {
       currentPageFile = "loggedin.html";
       currentPageBase = "loggedin";
     }
  }

  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    const parentLi = link.closest("li");
    if (!linkHref || linkHref === '#') return;

    const linkBase = linkHref.replace('.html', '');

    if (linkHref === currentPageFile || linkBase === currentPageBase || linkHref === `/${currentPageBase}`) {
      parentLi?.classList.add("active");
      const subMenu = parentLi?.closest(".sub-menu");
      if (subMenu) subMenu.closest(".has-sub")?.classList.add("active-sub");
    } else {
      parentLi?.classList.remove("active");
      const subMenuParent = parentLi?.closest(".has-sub");
      if(subMenuParent && !subMenuParent.querySelector('.sub-menu li.active')){
          subMenuParent.classList.remove("active-sub");
      }
    }
  });

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
        let currentPageFileOnClick = window.location.pathname.split("/").pop();
        let currentPageBaseOnClick = currentPageFileOnClick.replace('.html', '');
        
        if (currentPageFileOnClick === "" || currentPageFileOnClick === "/") {
            currentPageFileOnClick = "loggedin.html";
            currentPageBaseOnClick = "loggedin";
        }

      if (item.classList.contains("has-sub")) {
        if (e.target.closest(".sub-menu a")) {
             closeAllMenus();
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
        const linkBase = linkHref ? linkHref.replace('.html', '') : '';

        if (linkHref && linkHref !== "#" && linkHref !== currentPageFileOnClick && linkBase !== currentPageBaseOnClick) {
          closeAllMenus();
          return;
        }

        e.preventDefault();
        menuItems.forEach((i) => {
            i.classList.remove("active");
            i.classList.remove("active-sub");
        });
        item.classList.add("active");
         const subMenu = item.closest(".sub-menu");
         if (subMenu) subMenu.closest(".has-sub")?.classList.add("active-sub");

        closeAllMenus();
      }
    });
  });

  const featuresGrid = document.querySelector(".features-grid");
  const featuresSection = document.querySelector(".features-section");

  if (featuresGrid && featuresSection) {
    const handleScroll = () => {
      const maxScrollLeft = featuresGrid.scrollWidth - featuresGrid.clientWidth;

      featuresSection.classList.toggle("show-left-shadow", featuresGrid.scrollLeft > 10);
      featuresSection.classList.toggle("show-right-shadow", featuresGrid.scrollLeft < maxScrollLeft - 10);
    };

    featuresGrid.addEventListener("scroll", handleScroll);
    handleScroll();
  }

  initializeSlider(".slider-container");

  document.querySelectorAll(".slider-section").forEach((section, index) => {
    const uniqueSelector = `content-slider-section-${index}`;
    section.classList.add(uniqueSelector);
    initializeSlider(`.${uniqueSelector}`);
  });
});