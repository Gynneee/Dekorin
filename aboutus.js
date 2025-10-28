document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");

  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  const logoutLink = document.querySelector('.profile-menu-list a i.fa-sign-out-alt');
  const logoutPopup = document.getElementById('logoutPopup');
  const logoutOverlayPopup = document.getElementById('logoutOverlay');
  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
  const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');

  function openMainMenu() {
    if (sideMenu && menuOverlay && body) {
      sideMenu.classList.add("open");
      if (!profileMenu?.classList.contains('open')) {
          menuOverlay.classList.add("open");
      }
      body.classList.add("no-scroll");
    }
  }

  function openProfileMenu() {
     if (profileMenu && menuOverlay && body) {
      profileMenu.classList.add("open");
      if (!sideMenu?.classList.contains('open')) {
          menuOverlay.classList.add("open");
      }
      body.classList.add("no-scroll");
     }
  }

  function closeAllMenus() {
    if (sideMenu) sideMenu.classList.remove("open");
    if (profileMenu) profileMenu.classList.remove("open");
    if (menuOverlay) menuOverlay.classList.remove("open");
    if (body && !document.getElementById('logoutPopup')?.classList.contains('show')) {
         body.classList.remove("no-scroll");
    }
  }

  if (navButton) {
    navButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (profileMenu && profileMenu.classList.contains("open")) {
        closeAllMenus();
      }
      openMainMenu();
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sideMenu && sideMenu.classList.contains("open")) {
        closeAllMenus();
      }
      openProfileMenu();
    });
  }

  if (closeMenuBtn && sideMenu && sideMenu.contains(closeMenuBtn)) {
        closeMenuBtn.addEventListener("click", closeAllMenus);
  }


  function openMainMenu() {
    sideMenu.classList.add("open");
    menuOverlay.classList.add("active");
    body.classList.add("no-scroll");
  }

  function closeAllMenus() {
    sideMenu.classList.remove("open");
    menuOverlay.classList.remove("active");
    body.classList.remove("no-scroll");
  }

  if (navButton) {
    navButton.addEventListener("click", (e) => {
      e.stopPropagation();
      openMainMenu();
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", closeAllMenus);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener("click", closeAllMenus);
  }

  const menuItems = document.querySelectorAll(".menu-list > li");
  let currentPage = window.location.pathname.split("/").pop() || "index.html";
  if (!currentPage.includes(".html")) currentPage += ".html";


  // ✅ FIXED: ensure correct currentPage detection and matching
  if (!currentPage || currentPage === "" || currentPage === "/" || currentPage === "aboutus") {
    currentPage = window.location.pathname.split("/").pop() || "aboutus.html";
  }

  if (currentPage === "" || currentPage === "/") {
    currentPage = "loggedin.html";
  }

  const allLinks = document.querySelectorAll(".menu-list a");
  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (!linkHref) return;

    const normalizedCurrent = currentPage.toLowerCase();
    const normalizedHref = linkHref.split("/").pop().toLowerCase();

    if (normalizedCurrent === normalizedHref) {
      const parentLi = link.closest("li");
      if (parentLi) {
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

        if (linkHref && !currentPage.endsWith(linkHref) && linkHref !== "#") {
           closeAllMenus();
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

  let signOutAnchor = null;
  if (logoutLink) {
     signOutAnchor = logoutLink.closest('a');
  }

  function showLogoutPopup() {
    const overlay = document.getElementById('menuOverlay');
    if (logoutPopup && overlay) {
      overlay.classList.add('show');
      logoutPopup.classList.add('show');
      body.classList.add('no-scroll');
    }
  }

  function hideLogoutPopup() {
    const overlay = document.getElementById('menuOverlay');
     if (logoutPopup && overlay) {
      overlay.classList.remove('show');
      logoutPopup.classList.remove('show');
      if (!sideMenu?.classList.contains('open') && !profileMenu?.classList.contains('open')) {
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

  if (menuOverlay) {
     menuOverlay.addEventListener('click', (e) => {
         if (e.target === menuOverlay && logoutPopup?.classList.contains('show')) {
             hideLogoutPopup();
         }
     });
  }

});
