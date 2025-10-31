const checkboxes = document.querySelectorAll(".select-box");
const checkout = document.getElementById("checkout");
const minusButtons = document.querySelectorAll(".qty-btn.minus");
const popup = document.getElementById("removePopup");
const cancelBtn = document.getElementById("cancelRemove");
const confirmBtn = document.getElementById("confirmRemove");
const main = document.querySelector("main"); 

function toggleSelect(btn) {
  btn.classList.toggle("active");
  const selected = document.querySelectorAll(".select-box.active");
  const isShown = selected.length > 0;

  checkout.classList.toggle("show", isShown);

  if (isShown) {
    const checkoutHeight = checkout.offsetHeight;
    main.style.paddingBottom = checkoutHeight + "px";
  } else {
    main.style.paddingBottom = "1rem"; 
  }
}

function increaseQty(btn) {
  const qtySpan = btn.previousElementSibling;
  qtySpan.textContent = parseInt(qtySpan.textContent) + 1;
}

function decreaseQty(btn) {
  const qtySpan = btn.nextElementSibling;
  const current = parseInt(qtySpan.textContent);
  if (current > 1) {
    qtySpan.textContent = current - 1;
  } else {
    popup.classList.remove("hidden");
  }
}

cancelBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
});

confirmBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
  alert("Item removed from cart! (simulasi)");
});