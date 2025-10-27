const cards = document.querySelectorAll(".article-card");
let activeCard = null;

cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (activeCard === card) {
      const link = card.getAttribute("data-link");
      window.location.href = link;
      return;
    }

    cards.forEach((c) => c.classList.remove("active"));
    activeCard = card;
    card.classList.add("active");
  });
});
