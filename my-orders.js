const ordersList = document.getElementById('ordersList');

document.addEventListener("DOMContentLoaded", () => setActiveTab("active", document.querySelector(".tab.active")));

function setActiveTab(tabName, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  ordersList.classList.remove('smooth-fade');
  void ordersList.offsetWidth;
  ordersList.classList.add('smooth-fade');

  let buttonText = "";
  if (tabName === "active") buttonText = "Track";
  else if (tabName === "completed") buttonText = "Review";
  else buttonText = "Re-Order";

  ordersList.innerHTML = Array(4).fill(`
    <div class="order-item">
      <img src="src/receipt/imagemyorder.png" alt="Wallpaper">
      <div class="order-info">
        <h4>Wallpaper Polos</h4>
        <p>Dekorin Store | 2 Roll</p>
        <div class="bottom">
          <span class="price">Rp. 100.000</span>
          <button class="track-btn">${buttonText}</button>
        </div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll('.track-btn').forEach(btn => {
    btn.classList.add('button-appear');
    setTimeout(() => btn.classList.remove('button-appear'), 600);

    if (btn.textContent.trim() === "Track") {
      btn.addEventListener("click", () => {
        window.location.href = "track-order.html";
      });
    }
  });
}