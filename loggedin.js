document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  const menuOverlay = document.getElementById("menuOverlay");

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

  const menuItems = document.querySelectorAll(".menu-list > li");
  const allLinks = document.querySelectorAll(".menu-list a");

  if (!currentPage.includes(".")) {
    currentPage += ".html";
  }

  let currentPage = window.location.pathname.split("/").pop() || "loggedin.html";
  if (currentPage.includes("?")) currentPage = currentPage.split("?")[0];
  if (currentPage === "" || currentPage === "/") currentPage = "loggedin.html";


  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const parentLi = link.closest("li");

    if (href && (currentPage === href || currentPage.endsWith("/" + href))) {
      parentLi?.classList.add("active");
      const subMenu = parentLi?.closest(".sub-menu");
      if (subMenu) subMenu.closest(".has-sub")?.classList.add("active-sub");
    } else {
      parentLi?.classList.remove("active");
    }
  });

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const link = item.querySelector("a");
      const href = link?.getAttribute("href");

      if (item.classList.contains("has-sub")) {
        if (e.target.closest(".sub-menu")) return;
        item.classList.toggle("active-sub");

        menuItems.forEach((i) => {
          if (i !== item && i.classList.contains("has-sub")) i.classList.remove("active-sub");
        });
      } else {
        if (href && href !== "#" && !currentPage.endsWith(href)) {
          menuItems.forEach((i) => i.classList.remove("active", "active-sub"));
          item.classList.add("active");
          closeAllMenus();
        }
      }
    });
  });

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
            const index = Array.from(slides).indexOf(entry.target);
            dots.forEach((d) => d.classList.remove("active"));
            slides.forEach((s) => s.classList.remove("active"));
            dots[index]?.classList.add("active");
            entry.target.classList.add("active");
          }
        });
      },
      { root: sliderWrapper, threshold: 0.5 }
    );

    slides.forEach((slide) => observer.observe(slide));
  }

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
