function bookTrainer(trainerName) {

    const message = document.getElementById("bookingMessage");

    if (!trainerName) {
        message.textContent = "Scroll and select a trainer first.";
        message.style.color = "red";
        return;
    }

    message.textContent = "Booking saved with " + trainerName + "!";
    message.style.color = "#28a745";

    message.scrollIntoView({ behavior: "smooth", block: "center" });
}