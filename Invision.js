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

  if (closeMenuBtn && sideMenu && sideMenu.contains(closeMenuBtn)) {
     closeMenuBtn.addEventListener("click", closeAllMenus);
  }


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


  // --- MENU ACTIVE STATE LOGIC (Corrected) ---
  const menuItems = document.querySelectorAll(".menu-list > li"); // Keep for click handler
  const allLinks = document.querySelectorAll(".menu-list a");
  let currentPageFile = window.location.pathname.split("/").pop();

  if (currentPageFile === "" || currentPageFile === "/" || !currentPageFile) {
     if (window.location.pathname === '/' || window.location.pathname === '') {
       currentPageFile = "loggedin"; // Base name WITHOUT .html
     } else {
       currentPageFile = "loggedin"; // Default if path ends in /folder/
     }
  } else {
      currentPageFile = currentPageFile.replace(".html", ""); // Remove .html from URL filename
  }


  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    const parentLi = link.closest("li");
    if (!linkHref || linkHref === '#') return;

    let linkFileName = linkHref.split("/").pop().replace(".html", ""); // Remove .html from link

    if (linkFileName === currentPageFile) { // Compare base names
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
  // --- END OF CORRECTED HIGHLIGHT LOGIC ---


  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
        let currentPageFileOnClick = window.location.pathname.split("/").pop();
         if (currentPageFileOnClick === "" || currentPageFileOnClick === "/" || !currentPageFileOnClick) {
             if (window.location.pathname === '/' || window.location.pathname === '') {
                 currentPageFileOnClick = "loggedin";
             } else {
                 currentPageFileOnClick = "loggedin";
             }
         } else {
             currentPageFileOnClick = currentPageFileOnClick.replace(".html", "");
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
        const linkFileNameOnClick = linkHref?.split("/").pop().replace(".html", "");

        if (linkHref && linkHref !== "#" && linkFileNameOnClick !== currentPageFileOnClick) {
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

  const cards = document.querySelectorAll(".article-card");
  let activeCard = null;
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (activeCard === card) {
        const targetLink = card.getAttribute("data-link");
        if (targetLink) window.location.href = targetLink;
        return;
      }
      cards.forEach((c) => c.classList.remove("active"));
      activeCard = card;
      card.classList.add("active");
    });
  });

});