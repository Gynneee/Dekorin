document.addEventListener("DOMContentLoaded", function () {
  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const body = document.body;

  function openMenu() {
    sideMenu.classList.add("open");
    body.classList.add("no-scroll");
  }

  function closeMenu() {
    sideMenu.classList.remove("open");
    body.classList.remove("no-scroll");
  }

  if (navButton && sideMenu && closeMenuBtn) {
    navButton.addEventListener("click", openMenu);
    closeMenuBtn.addEventListener("click", closeMenu);
    document.addEventListener("click", (e) => {
      if (!sideMenu.contains(e.target) && !navButton.contains(e.target)) {
        closeMenu();
      }
    });
  }

  const menuItems = document.querySelectorAll(".menu-list > li");
  let currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "" || currentPage === "/") currentPage = "index.html";

  const allLinks = document.querySelectorAll(".menu-list a");

  // highlight current page
  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href === currentPage) {
      const li = link.closest("li");
      li?.classList.add("active");

      const subMenu = li.closest(".sub-menu");
      if (subMenu) subMenu.closest(".has-sub")?.classList.add("active-sub");
    }
  });

  // menu click logic
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const isSub = item.classList.contains("has-sub");
      const link = item.querySelector("a");

      // submenu toggle
      if (isSub && !e.target.closest(".sub-menu")) {
        item.classList.toggle("active-sub");
        menuItems.forEach((i) => {
          if (i !== item && i.classList.contains("has-sub")) {
            i.classList.remove("active-sub");
          }
        });
        return;
      }

      // normal link click
      if (link) {
        const href = link.getAttribute("href");
        if (href && href !== "#") {
          localStorage.setItem("activePage", href);
        }

        // remove all previous highlights (including Home)
        menuItems.forEach((i) => i.classList.remove("active", "active-sub"));
        item.classList.add("active");
        closeMenu();
      }
    });
  });

  // restore highlight from storage
  const savedPage = localStorage.getItem("activePage");
  if (savedPage) {
    allLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const li = link.closest("li");

      if (href === savedPage) {
        li.classList.add("active");
        const subMenu = li.closest(".sub-menu");
        if (subMenu) subMenu.closest(".has-sub")?.classList.add("active-sub");
      } else {
        li.classList.remove("active");
      }
    });
  }

  // card click logic
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

  const navLinks = document.querySelectorAll("nav a, .navbar a");
  if (navLinks.length > 0) {
    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "" || currentPage === "/") currentPage = "index.html";
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
});
