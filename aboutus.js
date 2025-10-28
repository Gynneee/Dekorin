document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  const menuItems = document.querySelectorAll(".menu-list > li");

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
      menuItems.forEach((item) => item.classList.remove("active-sub"));
    }
  }

  if (navButton) navButton.addEventListener("click", (e) => { e.stopPropagation(); openMenu(); });
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);


  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (item.classList.contains("has-sub") && !e.target.closest('a')) {
        e.stopPropagation();
        item.classList.toggle("active-sub");
        menuItems.forEach((i) => {
          if (i !== item && i.classList.contains("has-sub")) i.classList.remove("active-sub");
        });
      } else if (!item.classList.contains("has-sub") || e.target.closest('.sub-menu a')) {
        closeMenu();
      }
    });
  });

  const allLinks = document.querySelectorAll(".menu-list a");
  let currentPageFile = window.location.pathname.split("/").pop();
  if (currentPageFile === "" || currentPageFile === "/" || !currentPageFile) {
     if (window.location.pathname === '/' || window.location.pathname === '') {
       currentPageFile = "loggedin.html";
     } else {
       currentPageFile = "loggedin.html";
     }
  }

  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    const parentLi = link.closest("li");
    if (!linkHref || linkHref === '#') return;

    if (linkHref === currentPageFile) {
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
      if (!sideMenu?.classList.contains('open')) {
          body.classList.remove('no-scroll');
      }
    }
  }

  if (confirmLogoutBtn) confirmLogoutBtn.addEventListener('click', () => { hideLogoutPopup(); console.log("User confirmed logout!"); });
  if (cancelLogoutBtn) cancelLogoutBtn.addEventListener('click', hideLogoutPopup);
  if (menuOverlay) {
      menuOverlay.addEventListener('click', (e) => {
          if (e.target === menuOverlay) {
              if (logoutPopup?.classList.contains('show')) {
                  hideLogoutPopup();
              } else {
                  closeMenu();
              }
          }
      });
  }

});