if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 0);
  
  const body = document.body;

  const signInPopup = document.getElementById("signInPopup");
  const signInOverlay = document.getElementById("signInOverlay");
  const cancelSignInBtn = document.getElementById("cancelSignInBtn");
  const popupSignInBtn = document.getElementById("popupSignInBtn");

  const protectedLinks = document.querySelectorAll(
    ".feature-item, .chat-button, .estimate-button, .ar-button"
  );

  const showSignInPopup = () => {
    if (signInPopup && signInOverlay) {
      signInOverlay.classList.add("show");
      signInPopup.classList.add("show");
      body.classList.add("no-scroll");
    }
  };

  const hideSignInPopup = () => {
    if (signInPopup && signInOverlay) {
      signInOverlay.classList.remove("show");
      signInPopup.classList.remove("show");
      body.classList.remove("no-scroll");
    }
  };

  protectedLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showSignInPopup();
    });
  });

  cancelSignInBtn?.addEventListener("click", hideSignInPopup);
  signInOverlay?.addEventListener("click", hideSignInPopup);
  
  popupSignInBtn?.addEventListener("click", () => {
    window.location.href = "login.html";
  });

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
    const elementsToAnimate = document.querySelectorAll('.content-section, .features-section, .ai-chat-section, .estimate-section, .ar-preview-section, .main-footer-section');
    
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';

          if (entry.target.classList.contains('ai-chat-section')) {
            const chatBubbleP = document.getElementById('ai-chat-bubble-text');
            if (chatBubbleP && !chatBubbleP.classList.contains('typing-done')) { 
              const textToType = chatBubbleP.getAttribute('data-text');
              if (textToType) {
                typeAnimation(chatBubbleP, textToType, 40);
              }
            }
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elementsToAnimate.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)';
      sectionObserver.observe(el);
    });

    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
      sliderContainer.style.opacity = '1';
      sliderContainer.style.transform = 'translateY(0)';
    }

    const featureItems = document.querySelectorAll('.feature-item');
    
    const itemObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    featureItems.forEach((item, index) => {
      item.classList.add('feature-item-animate-init');
      item.style.transitionDelay = `${index * 0.2}s`;
      itemObserver.observe(item);
    });

    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    const horizontalSections = document.querySelectorAll('.content-slider-wrapper, .horizontal-scroll-wrapper');
    
    horizontalSections.forEach(section => {
      const cardsInSection = section.querySelectorAll('.review-card, .article-card-invision, .product-card');
      
      cardsInSection.forEach((card, index) => {
        card.classList.add('card-animate-init');
        card.style.transitionDelay = `${index * 0.05}s`;
        cardObserver.observe(card);
      });
    });
  };

  function initializeSlider(containerSelector) {
    const sliderContainer = document.querySelector(containerSelector);
    if (!sliderContainer) return;

    const wrapper = sliderContainer.querySelector(".slider-wrapper, .content-slider-wrapper");
    const slides = wrapper ? Array.from(wrapper.children) : [];
    const dotsContainer = sliderContainer.querySelector(".slider-dots");
    if (!wrapper || slides.length === 0 || !dotsContainer) return;

    const isContentSlider = wrapper.classList.contains("content-slider-wrapper");

    if (isContentSlider) {
      wrapper.style.scrollSnapType = "x mandatory";
      wrapper.style.scrollPaddingLeft = "0";
      wrapper.style.scrollPaddingRight = "0";
      wrapper.style.justifyContent = "flex-start";
      
      slides.forEach((slide, idx) => {
        slide.style.scrollSnapAlign = "center";
        slide.style.scrollSnapStop = "always";
        slide.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)";
        slide.style.flex = "0 0 330px";
        slide.style.marginLeft = idx === 0 ? "calc(50% - 165px)" : "0";
        slide.style.marginRight = idx === slides.length - 1 ? "calc(50% - 165px)" : "0";
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
              inline: "center"
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
        
        const scale = Math.max(0.75, 1 - (normalizedDistance * 0.25));
        const opacity = Math.max(0.5, 1 - (normalizedDistance * 0.5));

        slide.style.transform = `scale(${scale})`;
        slide.style.opacity = opacity;
        slide.style.filter = 'none';
        slide.style.boxShadow = 'none';
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
        if (slides[0] && wrapper.getBoundingClientRect().top >= 0 && wrapper.getBoundingClientRect().bottom <= window.innerHeight) {
          slides[0].scrollIntoView({
            behavior: "auto",
            block: "nearest",
            inline: "center"
          });
          updateSlideScales();
        }
      }, 100);
    }
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const filterDropdowns = document.querySelectorAll(".filter-dropdown");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const targetDropdown = document.getElementById(targetId);

      if (button.classList.contains("active")) {
        button.classList.remove("active");
        targetDropdown.classList.remove("show");
        return;
      }

      filterDropdowns.forEach(dropdown => {
        dropdown.classList.remove("show");
      });
      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      targetDropdown.classList.add("show");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".filter-section")) {
      filterDropdowns.forEach(dropdown => {
        dropdown.classList.remove("show");
      });
      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });
    }
  });

  const featuresGrid = document.querySelector(".features-grid");
  const featuresSection = document.querySelector(".features-section");

  if (featuresGrid && featuresSection) {
    const handleScroll = () => {
      const maxScrollLeft = featuresGrid.scrollWidth - featuresGrid.clientWidth;

      featuresSection.classList.toggle("show-left-shadow", featuresGrid.scrollLeft > 10);
      featuresSection.classList.toggle("show-right-shadow", featuresGrid.scrollLeft < maxScrollLeft - 10);
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

  observeElements();
});