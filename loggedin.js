if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 0);

  const body = document.body;
  body.classList.add("logged-in");

  const mainSearchInput = document.querySelector(
    ".main-header .search-bar input"
  );
  const searchPage = document.getElementById("searchPage");
  const searchBackBtn = document.getElementById("searchBackBtn");
  const searchPageInput = document.getElementById("searchPageInput");

  if (mainSearchInput) {
    mainSearchInput.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      body.classList.add("search-active");

      if (searchPageInput) {
        searchPageInput.focus();
      }
    });
  }

  if (searchBackBtn) {
    searchBackBtn.addEventListener("click", () => {
      body.classList.remove("search-active");

      mainSearchInput.value = "";
      if (searchPageInput) {
        searchPageInput.value = "";
      }
    });
  }

  function typeAnimation(element, text, speed = 40) {
    let i = 0;
    element.innerHTML = "";

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        element.classList.add("typing-done");
      }
    }
    type();
  }

  const observeElements = () => {
    const elementsToAnimate = document.querySelectorAll(
      ".filter-section, .content-section, .features-section, .ai-chat-section, .estimate-section, .ar-preview-section, .main-footer-section"
    );

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

            if (entry.target.classList.contains("ai-chat-section")) {
              const chatBubbleP =
                document.getElementById("ai-chat-bubble-text");
              if (
                chatBubbleP &&
                !chatBubbleP.classList.contains("typing-done")
              ) {
                const textToType = chatBubbleP.getAttribute("data-text");
                if (textToType) {
                  typeAnimation(chatBubbleP, textToType, 40);
                }
              }
            }

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    elementsToAnimate.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition =
        "opacity 0.8s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)";
      sectionObserver.observe(el);
    });

    const sliderContainer = document.querySelector(".slider-container");
    if (sliderContainer) {
      sliderContainer.style.opacity = "1";
      sliderContainer.style.transform = "translateY(0)";
    }

    const featureItems = document.querySelectorAll(".feature-item");

    const itemObserver = new IntersectionObserver(
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

    featureItems.forEach((item, index) => {
      item.classList.add("feature-item-animate-init");
      item.style.transitionDelay = `${index * 0.05}s`;
      itemObserver.observe(item);
    });

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

    const horizontalSections = document.querySelectorAll(
      ".content-slider-wrapper, .horizontal-scroll-wrapper"
    );

    horizontalSections.forEach((section) => {
      const cardsInSection = section.querySelectorAll(
        ".review-card, .article-card-invision, .product-card"
      );

      cardsInSection.forEach((card, index) => {
        card.classList.add("card-animate-init");
        card.style.transitionDelay = `${index * 0.05}s`;
        cardObserver.observe(card);
      });
    });
  };

  function initializeSlider(containerSelector) {
    const sliderContainer = document.querySelector(containerSelector);
    if (!sliderContainer) return;

    const wrapper = sliderContainer.querySelector(
      ".slider-wrapper, .content-slider-wrapper"
    );
    const slides = wrapper ? Array.from(wrapper.children) : [];
    const dotsContainer = sliderContainer.querySelector(".slider-dots");
    if (!wrapper || slides.length === 0 || !dotsContainer) return;

    const isContentSlider =
      wrapper.classList.contains("content-slider-wrapper");

    if (isContentSlider) {
      wrapper.style.scrollSnapType = "x mandatory";
      wrapper.style.scrollPaddingLeft = "0";
      wrapper.style.scrollPaddingRight = "0";
      wrapper.style.justifyContent = "flex-start";

      slides.forEach((slide, idx) => {
        slide.style.scrollSnapAlign = "center";
        slide.style.scrollSnapStop = "always";
        slide.style.transition =
          "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)";
        slide.style.flex = "0 0 330px";
        slide.style.marginLeft = idx === 0 ? "calc(50% - 165px)" : "0";
        slide.style.marginRight =
          idx === slides.length - 1 ? "calc(50% - 165px)" : "0";
      });
    }

    dotsContainer.innerHTML = "";
    slides.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (idx === 0) dot.classList.add("active");
      dot.setAttribute("data-slide", idx);
      dot.addEventListener("click", () => {
        if (slides[idx]) {
          if (isContentSlider) {
            slides[idx].scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          } else {
            wrapper.scrollTo({
              left: slides[idx].offsetLeft,
              behavior: "smooth",
            });
          }
        }
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".dot");

    const updateSlideScales = () => {
      if (!isContentSlider) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

      slides.forEach((slide) => {
        const slideRect = slide.getBoundingClientRect();
        const slideCenter = slideRect.left + slideRect.width / 2;
        const distance = Math.abs(wrapperCenter - slideCenter);
        const maxDistance = wrapperRect.width / 2;
        const normalizedDistance = distance / maxDistance;

        const scale = Math.max(0.75, 1 - normalizedDistance * 0.25);
        const opacity = Math.max(0.5, 1 - normalizedDistance * 0.5);

        slide.style.transform = `scale(${scale})`;
        slide.style.opacity = opacity;
        slide.style.filter = "none";
        slide.style.boxShadow = "none";
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(slides).indexOf(entry.target);
            dots.forEach((d) => d.classList.remove("active"));
            slides.forEach((s) => s.classList.remove("active"));
            dots[index]?.classList.add("active");
            entry.target.classList.add("active");
          }
        });
        if (isContentSlider) {
          updateSlideScales();
        }
      },
      { root: wrapper, threshold: 0.5 }
    );

    slides.forEach((slide) => observer.observe(slide));

    if (isContentSlider) {
      let scrollTimeout;
      wrapper.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateSlideScales, 10);
      });
      updateSlideScales();

      setTimeout(() => {
        if (
          slides[0] &&
          wrapper.getBoundingClientRect().top >= 0 &&
          wrapper.getBoundingClientRect().bottom <= window.innerHeight
        ) {
          slides[0].scrollIntoView({
            behavior: "auto",
            block: "nearest",
            inline: "center",
          });
          updateSlideScales();
        }
      }, 100);
    }
  }

  const navButton = document.querySelector(".nav-button");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  const logoutPopup = document.getElementById("logoutPopup");
  const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
  const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
  const logoutLink = document.querySelector(
    ".profile-menu-list a i.fa-sign-out-alt"
  );
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
      if (
        !sideMenu?.classList.contains("open") &&
        !profileMenu?.classList.contains("open")
      ) {
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

  closeMenuBtn?.addEventListener("click", closeAllMenus);

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
    localStorage.setItem("isLoggedIn", "false");
    body.classList.remove("logged-in");
    window.location.href = "index.html";
  });

  cancelLogoutBtn?.addEventListener("click", hideLogoutPopup);

  const allLinks = document.querySelectorAll(".menu-list a");
  const menuItems = document.querySelectorAll(".menu-list > li");

  let currentPageFile = window.location.pathname.split("/").pop();
  let currentPageBase = currentPageFile.replace(".html", "");

  if (currentPageFile === "" || currentPageFile === "/" || !currentPageFile) {
    if (window.location.pathname === "/" || window.location.pathname === "") {
      currentPageFile = "loggedin.html";
      currentPageBase = "loggedin";
    } else {
      currentPageFile = "loggedin.html";
      currentPageBase = "loggedin";
    }
  }

  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    const parentLi = link.closest("li");
    if (!linkHref || linkHref === "#") return;

    const linkBase = linkHref.replace(".html", "");

    if (
      linkHref === currentPageFile ||
      linkBase === currentPageBase ||
      linkHref === `/${currentPageBase}`
    ) {
      parentLi?.classList.add("active");
      const subMenu = parentLi?.closest(".sub-menu");
      if (subMenu) subMenu.closest(".has-sub")?.classList.add("active-sub");
    } else {
      parentLi?.classList.remove("active");
      const subMenuParent = parentLi?.closest(".has-sub");
      if (
        subMenuParent &&
        !subMenuParent.querySelector(".sub-menu li.active")
      ) {
        subMenuParent.classList.remove("active-sub");
      }
    }
  });

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      let currentPageFileOnClick = window.location.pathname.split("/").pop();
      let currentPageBaseOnClick = currentPageFileOnClick.replace(".html", "");

      if (currentPageFileOnClick === "" || currentPageFileOnClick === "/") {
        currentPageFileOnClick = "loggedin.html";
        currentPageBaseOnClick = "loggedin";
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
        const linkBase = linkHref ? linkHref.replace(".html", "") : "";

        if (
          linkHref &&
          linkHref !== "#" &&
          linkHref !== currentPageFileOnClick &&
          linkBase !== currentPageBaseOnClick
        ) {
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

  const featuresGrid = document.querySelector(".features-grid");
  const featuresSection = document.querySelector(".features-section");

  if (featuresGrid && featuresSection) {
    const handleScroll = () => {
      const maxScrollLeft = featuresGrid.scrollWidth - featuresGrid.clientWidth;

      featuresSection.classList.toggle(
        "show-left-shadow",
        featuresGrid.scrollLeft > 10
      );
      featuresSection.classList.toggle(
        "show-right-shadow",
        featuresGrid.scrollLeft < maxScrollLeft - 10
      );
    };

    featuresGrid.addEventListener("scroll", handleScroll);
    handleScroll();
  }

  initializeSlider(".slider-container");

  document.querySelectorAll(".slider-section").forEach((section, index) => {
    const uniqueSelector = `content-slider-section-${index}`;
    section.classList.add(uniqueSelector);
    initializeSlider(`.${uniqueSelector}`);
  });

  const filterButtons = document.querySelectorAll(".filter-btn");
  const filterDropdowns = document.querySelectorAll(".filter-dropdown");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const targetDropdown = document.getElementById(targetId);

      const isAlreadyOpen = targetDropdown.classList.contains("show");

      filterDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("show");
      });
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      if (!isAlreadyOpen) {
        targetDropdown.classList.add("show");
        button.classList.add("active");
      }
    });
  });

  window.addEventListener("click", (e) => {
    if (
      !e.target.closest(".filter-btn") &&
      !e.target.closest(".filter-dropdown")
    ) {
      filterDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("show");
      });
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
    }
  });

  observeElements();
});