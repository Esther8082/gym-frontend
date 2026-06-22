let standardPlans = [];
let specializedPlans = [];

const BASE_URL = "https://gym-website-1-guo0.onrender.com";

/* =========================
   IMAGE HELPER
========================= */
function getImageUrl(path) {
    if (!path) return "";
    return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
}

async function loadHeroImage() {
    try {
        const res = await fetch(`${BASE_URL}/memberships/hero`);

        const data = await res.json();

        document.getElementById("heroImage").src =
            `${BASE_URL}/${data.hero_image}`;

    } catch (err) {
        console.error("Failed to load hero image:", err);
    }
}

async function loadMemberships() {
    try {
        const [stdRes, specRes] = await Promise.all([
            fetch(`${BASE_URL}/memberships/standard`),
            fetch(`${BASE_URL}/memberships/specialized`)
        ]);

        standardPlans = await stdRes.json();
        specializedPlans = await specRes.json();

        setPlan(0);
        setSpecializedPlan(0);

    } catch (err) {
        console.error("Failed to load memberships:", err);
    }
}

/* =========================
   STANDARD
========================= */
function setPlan(index) {
    const plan = standardPlans[index];
    if (!plan) return;

    document.getElementById("planTitle").textContent = plan.name;
    document.getElementById("planDescription").textContent = plan.description;

    document.getElementById("planImg").src =
        getImageUrl(plan.image);

    document.getElementById("planPrice").textContent =
        `R ${Number(plan.price).toFixed(2)}`;
}

/* =========================
   SPECIALIZED
========================= */
function setSpecializedPlan(index) {
    const plan = specializedPlans[index];
    if (!plan) return;

    document.getElementById("specializedTitle").textContent = plan.name;
    document.getElementById("specializedDescription").textContent = plan.description;

    document.getElementById("specializedImg").src =
        getImageUrl(plan.image);

    document.getElementById("specializedPrice").textContent =
        `R ${Number(plan.price).toFixed(2)}`;
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
    loadMemberships();
    loadHeroImage();
});