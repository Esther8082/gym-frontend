let selectedSession = null;
let currentClassId = 1;
let currentGym = "White River";

let classesData = [];
let classImages = [];

/* =========================
   BASE URL
========================= */
const BASE_URL = "https://gym-website-1-guo0.onrender.com";

/* ====================
   IMAGE HELPER
========================= */
function getImageUrl(path) {
    if (!path) return "";

    // Build and return the full image URL
    return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/* ==================
   MENU TOGGLE
========================= */

function toggleMenu() {
    const nav = document.getElementById("navLinks");
    nav.classList.toggle("active");
}

/* =================
   HERO IMAGE 
========================= */
function setHeroImage() {
    const heroImg = document.querySelector(".classes-hero-img");

   heroImg.src = "classesmedia/heroimage.jpg";}


/* =========================
   LOAD DATA
   Fetches class information and images from
   the backend and dynamically creates class cards.
========================= */
async function loadClasses() {

    try {

        // Fetch classes and images
        const [classesRes, imagesRes] = await Promise.all([ //to fetch classes and class images simultaneously
            fetch(`${BASE_URL}/classes`),
            fetch(`${BASE_URL}/class-images`)
        ]);

         // Convert responses to JSON
        classesData = await classesRes.json();
        classImages = await imagesRes.json();

        
        const grid = document.getElementById("classesGrid");
        if (!grid) return;

        grid.innerHTML = "";

        classesData.forEach(cls => {

            const img = classImages.find(i => i.class_id == cls.class_id);
            const imageUrl = img ? getImageUrl(img.image_url) : "";

            const card = document.createElement("div");
            card.className = "class-card";

            card.onclick = () => openClass(cls.class_id);

            card.innerHTML = `
                <img src="${imageUrl}" alt="${cls.name}">
                <h3>${cls.name}</h3>
            `;

            grid.appendChild(card);
        });
// Automatically display the first class
        if (classesData.length > 0) {
            openClass(classesData[0].class_id, false);
        }

    } catch (err) {
        console.error("Failed to load classes:", err);
    }
}

/* =========================
   OPEN CLASS
========================= */
function openClass(classId, shouldScroll = true) {

    const info = classesData.find(c => c.class_id == classId);
    if (!info) return;

    // Store selected class ID
    currentClassId = classId;

    document.getElementById("classTitle").textContent = info.name;
    document.getElementById("classLevel").textContent = info.level;
    document.getElementById("classDuration").textContent = info.duration;
    document.getElementById("classCategory").textContent = info.category;

     // Find and display class background image
    const img = classImages.find(i => i.class_id == classId);
    const imageUrl = img ? getImageUrl(img.image_url) : "";

    const section = document.getElementById("class-view");

    section.style.backgroundImage = `url('${imageUrl}')`;
    section.style.backgroundSize = "cover";
    section.style.backgroundPosition = "center";

    // Scroll to class details section
    if (shouldScroll) {
        section.scrollIntoView({ behavior: "smooth" });
    }

    loadSchedule();
}

/* =========================
   GYM CHANGE
========================= */
function changeGym(gym) {
    currentGym = gym;
    loadSchedule();
}

/* =========================
   LOAD SCHEDULE

========================= */
async function loadSchedule() {

    const tableBody = document.getElementById("scheduleBody");
    if (!tableBody) return;

    try {
        const res = await fetch(
            `${BASE_URL}/classes/gym/${currentGym}`
        );

        const data = await res.json();

        selectedSession = data.length ? data[0] : null;

        tableBody.innerHTML = "";

        if (!data.length) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4">No sessions available</td>
                </tr>
            `;
            return;
        }

        data.forEach(session => {

            const row = document.createElement("tr");
            row.style.cursor = "pointer";

            row.innerHTML = `
                <td>${session.day}</td>
                <td>${session.time}</td>
                <td>${session.duration}</td>
                <td>${session.instructor}</td>
            `;

            row.onclick = () => {
                selectedSession = session;
                showBooking();

                document.getElementById("bookingSection")
                    .scrollIntoView({ behavior: "smooth" });
            };

            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error("Schedule load error:", err);
    }
}

/* =========================
   BOOKING DISPLAY
========================= */
function showBooking() {

    const info = classesData.find(
        c => c.class_id == currentClassId
    );

    if (!info || !selectedSession) return;

    document.getElementById("bookingTitle").textContent = info.name;
    document.getElementById("bookingLevel").textContent = info.level;
    document.getElementById("bookingDuration").textContent = info.duration;
    document.getElementById("bookingCategory").textContent = info.category;

    document.getElementById("bookingDay").textContent = selectedSession.day;
    document.getElementById("bookingTime").textContent = selectedSession.time;
    document.getElementById("bookingCoach").textContent = selectedSession.instructor;
}

/* =========================
   SAVE BOOKING
========================= */
function saveBooking() {

    const title = document.getElementById("bookingTitle").textContent.trim();
    const message = document.getElementById("bookingMessage");

    if (!title) {
        message.textContent = "Scroll up and select a class to add.";
        message.style.color = "red";
        return;
    }

    message.textContent = "Booking saved successfully!";
    message.style.color = "green";
}

/* =========================
   INITIALIZATION
   Executes automatically when the webpage
   finishes loading.
========================= */

document.addEventListener("DOMContentLoaded", () => {
    setHeroImage();
    loadClasses();
});
