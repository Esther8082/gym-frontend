const searchInput = document.getElementById("locationSearch");
const pins = document.querySelectorAll(".pin");

/* =========================
   API CONFIG
========================= */

const API_URL = "https://gym-website-1-guo0.onrender.com/clubs";

let clubs = [];

/* =========================
   LOAD DATA FROM DATABASE
========================= */

fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        clubs = data;

        console.log("Clubs loaded:", clubs);

        if (clubs.length > 0) {
            showClub(0);
        }
    })
    .catch(err => console.error("Error loading clubs:", err));

/* =================
   DISPLAY CLUB
========================= */

function showClub(index) {

    const club = clubs[index];

    if (!club) return;

    document.getElementById("clubName").textContent = club.name;
    document.getElementById("clubAddress").textContent = "📍 " + club.address;
    document.getElementById("clubFacilities").textContent = club.facilities;
    document.getElementById("clubHours").innerHTML = club.opening_hours;

    activatePin(index);
}

/* =========================
   PIN HIGHLIGHT
========================= */

function activatePin(index) {

    pins.forEach(pin => pin.classList.remove("active-pin"));

    if (pins[index]) {
        pins[index].classList.add("active-pin");
    }
}

/* =========================
   SEARCH FUNCTION
========================= */

function searchClub() {

    const value = searchInput.value.toLowerCase().trim();

    const foundIndex = clubs.findIndex(club =>
        club.name.toLowerCase().includes(value) ||
        club.address.toLowerCase().includes(value)
    );

    if (foundIndex !== -1) {
        showClub(foundIndex);
    } else {
        const randomIndex = Math.floor(Math.random() * clubs.length);
        showClub(randomIndex);
    }
}

/* =========================
   NEAREST CLUB (TEMP LOGIC)
==================== */

function findNearestClub() {
    showClub(2);
}

/* =========================
   PIN CLICK SUPPORT
========================= */

pins.forEach((pin, index) => {
    pin.addEventListener("click", () => {
        showClub(index);
    });
});