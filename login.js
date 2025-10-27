const button = document.querySelector(".btn");
button.addEventListener("click", (e) => {
  e.preventDefault();
  button.classList.add("active");
  button.innerText = "Signing In...";

  setTimeout(() => {
    button.classList.remove("active");
    button.innerText = "Continue";
    alert("Login successful (simulasi)");
  }, 1500);
});

window.addEventListener("load", () => {
  document.querySelector(".container").style.opacity = "1";
});
