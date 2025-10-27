document.addEventListener("DOMContentLoaded", () => {
  const openMenuBtn = document.getElementById("openMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const sideMenu = document.getElementById("sideMenu");
  const subMenuToggles = document.querySelectorAll(".has-sub > span");

  if (openMenuBtn && sideMenu) {
    openMenuBtn.addEventListener("click", () => {
      sideMenu.classList.add("open");
    });
  }

  if (closeMenuBtn && sideMenu) {
    closeMenuBtn.addEventListener("click", () => {
      sideMenu.classList.remove("open");
    });
  }

  subMenuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggle.parentElement.classList.toggle("active");
    });
  });
});
