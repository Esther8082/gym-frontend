
const BASE_URL = "https://gym-website-1-guo0.onrender.com";

/* =========================
   IMAGE HELPER (FIXED + DEBUG)
========================= */

function getImageUrl(path) {
    if (!path) return "";

    return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
}

/* =========================
   GLOBAL IMAGE ERROR TRACKER
========================= */

document.addEventListener("error", function (e) {
    if (e.target.tagName === "IMG") {
        console.error("❌ IMAGE FAILED TO LOAD:");
        console.error("Broken URL:", e.target.src);
    }
}, true);

/* =========================
   HOMEPAGE CONTENT
========================= */

async function loadHomepageContent() {
    try {
        const res = await fetch(`${BASE_URL}/home`);
        const data = await res.json();

        console.log("📦 HOME API RESPONSE:", data);

        // Hero video
        const video = document.getElementById("heroVideo");
        const source = document.getElementById("heroVideoSource");

        source.src = getImageUrl(data.hero_video);
        video.load();

        // Welcome image
        const welcomeImg = document.getElementById("welcomeImage");
        welcomeImg.src = getImageUrl(data.welcome_image);

        welcomeImg.onerror = () => {
            console.error("❌ Welcome image failed:", welcomeImg.src);
        };

        // Map image
        const mapImg = document.getElementById("mapImage");
        mapImg.src = getImageUrl(data.map_image);

        mapImg.onerror = () => {
            console.error("❌ Map image failed:", mapImg.src);
        };

    } catch (err) {
        console.error("Failed to load homepage content:", err);
    }
}

/* =========================
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

function renderCoach(index) {
    const coach = coachesData[index];
    if (!coach) return;

    document.getElementById("coachName").textContent = coach.name;
    document.getElementById("coachDesc").textContent = coach.description;

    const imgContainer = document.getElementById("coachImages");
    imgContainer.innerHTML = `
        <img src="${getImageUrl(coach.image)}" alt="${coach.name}">
    `;
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
let currentCoachIndex = 0;

async function loadCoaches() {
    try {
        const res = await fetch(`${BASE_URL}/trainers`);

        if (!res.ok) throw new Error("Failed to fetch trainers");

        coachesData = await res.json();

        renderCoach(0);

        setInterval(() => {
            if (!coachesData.length) return;

            currentCoachIndex =
                (currentCoachIndex + 1) % coachesData.length;

            renderCoach(currentCoachIndex);

        }, 5000);

    } catch (err) {
        console.error("Failed to load coaches:", err);
    }
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

        locations.forEach(loc => {
            container.innerHTML += `
                <div class="location-card">
                    <img src="${getImageUrl(loc.image)}" alt="${loc.name}">
                    <h4>${loc.name}</h4>
                </div>
            `;
        });

    } catch (err) {
        console.error("Failed to load locations:", err);
    }
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

document.addEventListener("DOMContentLoaded", () => {
    loadHomepageContent();
    loadFlowPrograms();
    loadHomeMemberships();
    loadCoaches();
    loadLocations();
    loadPrograms();
});