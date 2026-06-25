
/* ==================
   MENU TOGGLE
========================= */

function toggleMenu() {
    const nav = document.getElementById("navLinks");
    nav.classList.toggle("active");
}

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        item.classList.toggle("active");

    });

});

function toggleChat() {
    const box = document.getElementById("chatBox");
    box.style.display = box.style.display === "flex" ? "none" : "flex";
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");

    const text = input.value.trim();
    if (!text) return;

    // user message
    const userMsg = document.createElement("div");
    userMsg.className = "user-msg";
    userMsg.textContent = text;
    messages.appendChild(userMsg);

    input.value = "";

    // bot reply (simple logic)
    setTimeout(() => {

        const botMsg = document.createElement("div");
        botMsg.className = "bot-msg";

        let reply = "Thanks for your message! We'll assist you shortly.";

        if (text.toLowerCase().includes("price")) {
            reply = "You can view all membership prices on the Membership page 💪";
        }
        else if (text.toLowerCase().includes("book")) {
            reply = "Go to Classes page to book a session 🏋️";
        }
        else if (text.toLowerCase().includes("hours")) {
            reply = "We are open from 05:00 to 21:00 every day ⏰";
        }

        botMsg.textContent = reply;
        messages.appendChild(botMsg);

        messages.scrollTop = messages.scrollHeight;

    }, 600);
}