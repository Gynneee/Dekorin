document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");

  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");

  const menuOverlay = document.getElementById("menuOverlay");

  function openMainMenu() {
    if (sideMenu && menuOverlay && body) {
      sideMenu.classList.add("open");
      menuOverlay.classList.add("open");
      body.classList.add("no-scroll");
    }
  }

   function openProfileMenu() {
     if (profileMenu && menuOverlay && body) {
      profileMenu.classList.add("open");
      menuOverlay.classList.add("open");
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

        if (linkHref && linkHref !== currentPage && linkHref !== "#") {
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
        window.location.href = card.getAttribute("data-link");
        return;
      }
      cards.forEach((c) => c.classList.remove("active"));
      activeCard = card;
      card.classList.add("active");
    });
  });

  const logoutLink = document.querySelector('.profile-menu-list a i.fa-sign-out-alt');
  const logoutPopup = document.getElementById('logoutPopup');
  const logoutOverlayPopup = document.getElementById('logoutOverlay'); 
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

  if (logoutOverlayPopup) {
     logoutOverlayPopup.addEventListener('click', hideLogoutPopup);
  }

}); 