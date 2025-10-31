const applyBtn = document.querySelector('.apply-btn');
    const popupOverlay = document.getElementById('paymentSuccessPopup');
    const popupCloseBtn = document.querySelector('.popup-close-btn');
    const paymentOptions = document.querySelectorAll('.payment-option input[type="radio"]');

    applyBtn.addEventListener('click', () => {
      let isOptionSelected = false;
      paymentOptions.forEach(option => {
        if (option.checked) {
          isOptionSelected = true;
        }
      });

      if (isOptionSelected) {
        popupOverlay.classList.add('active'); 
        document.body.style.overflow = 'hidden'; 
      } else {
        alert('Please select a payment method.'); 
      }
    });

    popupCloseBtn.addEventListener('click', () => {
      popupOverlay.classList.remove('active'); 
      document.body.style.overflow = 'auto'; 
    });

    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    paymentOptions.forEach(opt => {
      opt.addEventListener("change", () => {
        console.log(`Payment method selected: ${opt.nextElementSibling.nextElementSibling.textContent}`);
      });
    });