document.addEventListener("DOMContentLoaded", function () {
  
  // --- NEW: Back Button Logic ---
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.addEventListener("click", () => {
      history.back();
    });
  }
  // --- All menu, overlay, and link-highlighting logic has been removed ---

  // --- Animation Code ---
  const observeElements = () => {
    const sections = document.querySelectorAll(".section-animate-init");
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });

    const cards = document.querySelectorAll(".card-animate-init");
    const cardObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.08}s`;
      cardObserver.observe(card);
    });
  };

  observeElements();
});