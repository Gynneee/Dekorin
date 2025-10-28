document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  const menuItems = document.querySelectorAll(".menu-list > li");
  let currentPage = window.location.pathname.split("/").pop() || "loggedin.html";
  if (!currentPage.includes(".")) currentPage += ".html";

  // -------------------- MENU OPEN/CLOSE --------------------
  function openMenu() {
    if (sideMenu && menuOverlay) {
      sideMenu.classList.add("open");
      menuOverlay.classList.add("active");
      body.classList.add("no-scroll");
    }
  }

  function closeMenu() {
    if (sideMenu && menuOverlay) {
      sideMenu.classList.remove("open");
      menuOverlay.classList.remove("active");
      body.classList.remove("no-scroll");
      // Close all submenu
      menuItems.forEach((item) => item.classList.remove("active-sub"));
    }
  }

  if (navButton) navButton.addEventListener("click", (e) => { e.stopPropagation(); openMenu(); });
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
  if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

  // -------------------- SUBMENU TOGGLE --------------------
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (item.classList.contains("has-sub")) {
        e.stopPropagation();
        item.classList.toggle("active-sub");
        // Close other submenus
        menuItems.forEach((i) => {
          if (i !== item && i.classList.contains("has-sub")) i.classList.remove("active-sub");
        });
      } else {
        closeMenu();
      }
    });
  });

  // -------------------- HIGHLIGHT CURRENT PAGE --------------------
  const allLinks = document.querySelectorAll(".menu-list a");
  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (!linkHref) return;
    const normalizedCurrent = currentPage.toLowerCase();
    const normalizedHref = linkHref.split("/").pop().toLowerCase();
    if (normalizedCurrent === normalizedHref) {
      const parentLi = link.closest("li");
      if (parentLi) parentLi.classList.add("active");
      const subMenu = parentLi.closest(".sub-menu");
      if (subMenu) {
        const mainParentLi = subMenu.closest(".has-sub");
        if (mainParentLi) mainParentLi.classList.add("active-sub");
      }
    }
  });

  // -------------------- LOGOUT POPUP --------------------
  const logoutLink = document.querySelector('.profile-menu-list a i.fa-sign-out-alt');
  const logoutPopup = document.getElementById('logoutPopup');
  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
  const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');

  if (logoutLink) {
    const signOutAnchor = logoutLink.closest('a');
    if (signOutAnchor) {
      signOutAnchor.addEventListener('click', function(e) {
        e.preventDefault();
        closeMenu();
        if (logoutPopup && menuOverlay) {
          logoutPopup.classList.add('show');
          menuOverlay.classList.add('active');
          body.classList.add('no-scroll');
        }
      });
    }
  }

  function hideLogoutPopup() {
    if (logoutPopup && menuOverlay) {
      logoutPopup.classList.remove('show');
      menuOverlay.classList.remove('active');
      if (!sideMenu.classList.contains('open')) body.classList.remove('no-scroll');
    }
  }

  if (confirmLogoutBtn) confirmLogoutBtn.addEventListener('click', () => { hideLogoutPopup(); console.log("User confirmed logout!"); });
  if (cancelLogoutBtn) cancelLogoutBtn.addEventListener('click', hideLogoutPopup);
  if (menuOverlay) menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) hideLogoutPopup();
  });
});
