document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  const openMenu = (menu) => {
    menu?.classList.add("open");
    menuOverlay?.classList.add("open");
    body.classList.add("no-scroll");
  };

  const closeAllMenus = () => {
    [sideMenu, profileMenu].forEach((m) => m?.classList.remove("open"));
    menuOverlay?.classList.remove("open");
    if (!document.getElementById("logoutPopup")?.classList.contains("show")) {
      body.classList.remove("no-scroll");
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
  menuOverlay?.addEventListener("click", closeAllMenus);

  const menuItems = document.querySelectorAll(".menu-list > li");
  const allLinks = document.querySelectorAll(".menu-list a");
  let currentPage = window.location.pathname.split("/").pop() || "index.html";

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const parentLi = link.closest("li");
    if (href && href === currentPage) {
      parentLi?.classList.add("active");
      const subMenu = parentLi.closest(".sub-menu");
      const mainParentLi = subMenu?.closest(".has-sub");
      if (mainParentLi) mainParentLi.classList.add("active-sub");
    } else {
      parentLi?.classList.remove("active");
    }
  });

  if (sideMenu?.querySelector(`a[href='${currentPage}']`)) {
    navButton?.classList.add("active");
  } else if (profileMenu?.querySelector(`a[href='${currentPage}']`)) {
    profileBtn?.classList.add("active");
  }

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (item.classList.contains("has-sub")) {
        if (e.target.closest(".sub-menu")) return;
        item.classList.toggle("active-sub");
        menuItems.forEach((i) => {
          if (i !== item && i.classList.contains("has-sub")) i.classList.remove("active-sub");
        });
      } else {
        const link = item.querySelector("a");
        if (!link) return;
        const linkHref = link.getAttribute("href");
        if (!linkHref || linkHref === "#" || linkHref === currentPage) e.preventDefault();
        menuItems.forEach((i) => i.classList.remove("active", "active-sub"));
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
        const target = card.getAttribute("data-link");
        if (target) window.location.href = target;
        return;
      }
      cards.forEach((c) => c.classList.remove("active"));
      activeCard = card;
      card.classList.add("active");
    });
  });

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
