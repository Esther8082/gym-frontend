
// Base URL of the backend API hosted on Render
const BASE_URL = "https://gym-website-1-guo0.onrender.com";
let programsData = [];  // Stores all program data fetched from the backend

/* ==============
   IMAGE HELPER 
================ */

function getImageUrl(path) {
    if (!path) return "";

// Combine the backend URL with the image path
    return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
}


/* =============
   HOMEPAGE CONTENT
=============== */

async function loadHomepageContent() {
    try {

        //request items from the backend
        const res = await fetch(`${BASE_URL}/home`);
        const data = await res.json();

        console.log(" HOME API RESPONSE:", data);

        // Hero video
        const video = document.getElementById("heroVideo");
        const source = document.getElementById("heroVideoSource");

        source.src = getImageUrl(data.hero_video);
        video.load();

        // Welcome image
        const welcomeImg = document.getElementById("welcomeImage");
        welcomeImg.src = getImageUrl(data.welcome_image);

        welcomeImg.onerror = () => {
            console.error(" Welcome image failed:", welcomeImg.src);
        };

        // Map image
        const mapImg = document.getElementById("mapImage");
        mapImg.src = getImageUrl(data.map_image);

        mapImg.onerror = () => {
            console.error("Map image failed:", mapImg.src);
        };

    } catch (err) {
        console.error("Failed to load homepage content:", err);
    }

}


/* ==================
   MENU TOGGLE
========================= */

function toggleMenu() {
    const nav = document.getElementById("navLinks");
    nav.classList.toggle("active");
}

/* =========================
   FLOW PROGRAMS
========================= */

async function loadFlowPrograms() {
    try {
        const res = await fetch(`${BASE_URL}/home/flow`);
        const programs = await res.json();

        const container = document.getElementById("flowCards");
        container.innerHTML = "";

        // Dynamically create program cards
        programs.forEach(program => {
            container.innerHTML += `
                <div class="flow-card">
                    <img src="${getImageUrl(program.image)}" alt="${program.title}">
                    <h3>${program.title}</h3>
                    <p>${program.description}</p>
                </div>
            `;
        });

    } catch (err) {
        console.error("Failed to load flow programs:", err);
    }
}

/* =========================
   HOME MEMBERSHIPS
========================= */

async function loadHomeMemberships() {
    try {
        const [stdRes, specRes] = await Promise.all([
            fetch(`${BASE_URL}/memberships/standard`),
            fetch(`${BASE_URL}/memberships/specialized`)
        ]);

        const standard = await stdRes.json();
        const specialized = await specRes.json();

        const stdContainer = document.getElementById("standardMembershipCards");
        const specContainer = document.getElementById("specializedMembershipCards");

        stdContainer.innerHTML = "";
        specContainer.innerHTML = "";

        // Display standard memberships
        standard.forEach(plan => {
            stdContainer.innerHTML += `
                <div class="membership-card">
                    <img src="${getImageUrl(plan.image)}" alt="${plan.name}">
                    <div class="membership-content">
                        <h4>${plan.name}</h4>
                        <p>${plan.description}</p>
                    </div>
                </div>
            `;
        });

        specialized.forEach(plan => {
            specContainer.innerHTML += `
                <div class="membership-card">
                    <img src="${getImageUrl(plan.image)}" alt="${plan.name}">
                    <div class="membership-content">
                        <h4>${plan.name}</h4>
                        <p>${plan.description}</p>
                    </div>
                </div>
            `;
        });

    } catch (err) {
        console.error("Failed to load home memberships:", err);
    }
}


function renderProgram(index) {
    const program = programsData[index];
    if (!program) return;

    document.getElementById("programTitle").textContent = program.title;
    document.getElementById("programDescription").textContent = program.description;

    document.getElementById("programImg").src =
        getImageUrl(program.image);
}

function renderProgramButtons() {
    const container = document.getElementById("programButtons");
    if (!container || !programsData) return;

    container.innerHTML = "";

    programsData.forEach((p, index) => {
        container.innerHTML += `
            <button onclick="renderProgram(${index})">
                ${p.title}
            </button>
        `;
    });
}

/* =========================
   COACH SECTION
========================= */

let coachesData = [];
let coachIndex = 0;

async function loadCoaches() {
    try {
        const res = await fetch(`${BASE_URL}/trainers`);
        coachesData = await res.json();

         // Remove Coach Hans
        coachesData = coachesData.filter(
            coach => coach.name !== "Coach Hans"
        );

        if (!coachesData.length) return;

        showCoach(0); // Display first coach

        // Automatically switch coaches every 4 seconds
        setInterval(() => {
            coachIndex = (coachIndex + 1) % coachesData.length;
            showCoach(coachIndex);
        }, 4000);

    } catch (err) {
        console.error("Failed to load coaches:", err);
    }
}

// Displays coach details on screen
function showCoach(i) {
    const coach = coachesData[i];
    if (!coach) return;

    document.getElementById("coachName").textContent = coach.name;
    document.getElementById("coachDesc").textContent = coach.description;
    document.getElementById("coachImage").src = getImageUrl(coach.image);
}

/* =========================
   LOCATIONS
========================= */

async function loadLocations() {
    try {
        const res = await fetch(`${BASE_URL}/locations`);
        const locations = await res.json();

        const container = document.getElementById("locationGrid");
        container.innerHTML = "";

        locations.forEach((loc, index) => {
            container.innerHTML += `
                <div class="location-card" data-index="${index}">
                    <img src="${getImageUrl(loc.image)}" alt="${loc.name}">
                    <h4>${loc.name}</h4>
                </div>
            `;
        });

        setupLocationInteraction();

    } catch (err) {
        console.error("Failed to load locations:", err);
    }
}

function setupLocationInteraction() {
    const pins = document.querySelectorAll(".pin");
    const cards = document.querySelectorAll(".location-card");

    function setActive(index) {

        // PIN highlight
        pins.forEach(pin => {
            pin.classList.remove("active-pin");
        });

        const activePin = document.querySelector(`.pin[data-index="${index}"]`);
        if (activePin) activePin.classList.add("active-pin");

        // IMAGE highlight
        cards.forEach(card => {
            card.classList.remove("active");
        });

        const activeCard = document.querySelector(`.location-card[data-index="${index}"]`);
        if (activeCard) activeCard.classList.add("active");
    }

    // PIN CLICK
    pins.forEach(pin => {
        pin.addEventListener("click", () => {
            const index = pin.dataset.index;
            setActive(index);
        });
    });

    // IMAGE CLICK
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const index = card.dataset.index;
            setActive(index);
        });
    });
}

/* =========================
   PROGRAMS
========================= */

async function loadPrograms() {
    try {
        const res = await fetch(`${BASE_URL}/programs`);
        programsData = await res.json();

        renderProgram(0);
        renderProgramButtons();

    } catch (err) {
        console.error("Failed to load programs:", err);
    }
}

function initMapLogic() {
    const pins = document.querySelectorAll(".pin");
    const mapImg = document.getElementById("mapImage");
    const rightImages = document.querySelectorAll(".location-grid img");

    let activeIndex = null;

    function setActive(index) {
        activeIndex = index;

        // ONLY highlight pin
        pins.forEach((p, i) => {
            p.classList.toggle("active-pin", i === index);
        });

        // lift ONLY right-side image
        rightImages.forEach((img, i) => {
            img.classList.toggle("active-location", i === index);
        });
    }

    // PIN CLICK
    pins.forEach((pin, index) => {
        pin.addEventListener("click", (e) => {
            e.stopPropagation();
            setActive(index);
        });
    });

    // RIGHT IMAGE CLICK 
    rightImages.forEach((img, index) => {
        img.addEventListener("click", () => {
            setActive(index);
        });
    });

}

document.addEventListener("DOMContentLoaded", () => {
    loadHomepageContent();
    loadFlowPrograms();
    loadHomeMemberships();
    loadCoaches();
    loadLocations();
    loadPrograms();
    initMapLogic()
});

