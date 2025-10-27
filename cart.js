const checkboxes = document.querySelectorAll(".select-box");
const checkout = document.getElementById("checkout");

function toggleSelect(btn) {
  btn.classList.toggle("active");
  const selected = document.querySelectorAll(".select-box.active");
  checkout.classList.toggle("show", selected.length > 0);
}
