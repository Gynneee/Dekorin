document.addEventListener("DOMContentLoaded", function () {
    const decreaseBtn = document.getElementById("decreaseBtn");
    const increaseBtn = document.getElementById("increaseBtn");
    const qtyDisplay = document.getElementById("qty");
    const totalPriceDisplay = document.getElementById("totalPrice");
    const addCartBtn = document.getElementById("addCartBtn");
    const popup = document.getElementById("popup");
    const chatBtn = document.getElementById("chatBtn");

    const basePrice = 60000;
    let quantity = 1;

    function formatRupiah(number) {
        return "Rp" + number.toLocaleString("id-ID");
    }

    function updateUI() {
        qtyDisplay.innerText = quantity;
        const total = basePrice * quantity;
        totalPriceDisplay.innerText = formatRupiah(total);
    }

    decreaseBtn.addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            updateUI();
        }
    });

    increaseBtn.addEventListener("click", () => {
        quantity++;
        updateUI();
    });

    addCartBtn.addEventListener("click", () => {
        popup.classList.add("show");
        
        const originalText = addCartBtn.innerHTML;
        addCartBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
        
        setTimeout(() => {
            popup.classList.remove("show");
            addCartBtn.innerHTML = originalText;
        }, 2000);
    });

    chatBtn.addEventListener("click", () => {
        console.log("Chat clicked");
    });
});