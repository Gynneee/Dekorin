document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  const logoutPopup = document.getElementById("logoutPopup");
  const logoutOverlay = document.getElementById("logoutOverlay");
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
  });

  cancelLogoutBtn?.addEventListener("click", hideLogoutPopup);

  const menuItems = document.querySelectorAll(".menu-list > li");
  const allLinks = document.querySelectorAll(".menu-list a");
  let currentPage = window.location.pathname.split("/").pop() || "loggedin";
  currentPage = currentPage.replace(".html", "");

  allLinks.forEach((link) => {
    const href = link.getAttribute("href")?.replace(".html", "");
    const parentLi = link.closest("li");
    if (!href || href === '#') return;

    if (currentPage === href) {
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
        const hrefForComparison = linkHref?.replace(".html", "");

        if (linkHref && linkHref !== "#" && currentPage !== hrefForComparison) {
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

  const sliderWrapper = document.querySelector(".slider-wrapper");
  if (sliderWrapper) {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    if (dots.length > 0 && slides.length > 0) {
        dots.forEach((dot, idx) => {
          dot.addEventListener("click", () => {
            if(slides[idx]) {
              sliderWrapper.scrollTo({
                left: slides[idx].offsetLeft,
                behavior: "smooth",
              });
            }
          });
        });

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const index = Array.from(slides).indexOf(entry.target);
                dots.forEach((d) => d.classList.remove("active"));
                slides.forEach((s) => s.classList.remove("active"));
                if (dots[index]) dots[index].classList.add("active");
                entry.target.classList.add("active");
              }
            });
          },
          { root: sliderWrapper, threshold: 0.5 }
        );

        slides.forEach((slide) => observer.observe(slide));
    }
  }
});