
/* ==================
   MENU TOGGLE
========================= */

function toggleMenu() {
    const nav = document.getElementById("navLinks");
    nav.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".newsletter input");
    const button = document.querySelector(".newsletter button");

    const message = document.createElement("p");
    message.style.marginTop = "15px";
    message.style.fontWeight = "bold";

    document.querySelector(".newsletter").appendChild(message);

    button.addEventListener("click", () => {
        const email = input.value.trim();

        if (!email || !email.includes("@")) {
            message.textContent = "❌ Please enter a valid email.";
            message.style.color = "red";
            return;
        }

        message.textContent = "✅ Successfully subscribed!";
        message.style.color = "lightgreen";

        input.value = "";
    });
});