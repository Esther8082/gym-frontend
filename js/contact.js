document.getElementById("contactForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const message = document.getElementById("formMessage");

    message.textContent =
        "Thank you! Your message has been sent successfully.";

    message.style.color = "green";

    this.reset();
});