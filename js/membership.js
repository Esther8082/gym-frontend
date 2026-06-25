let standardPlans = [];
let specializedPlans = [];
let billingMode = "monthly"; 
let specializedBillingMode = "monthly";
let currentStandardIndex = 0;
let currentSpecializedIndex = 0;

const BASE_URL = "https://gym-website-1-guo0.onrender.com";

/* =========================
   IMAGE HELPER
========================= */
function getImageUrl(path) {
    if (!path) return "";
    return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
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

function setBillingMode(mode) {
    billingMode = mode;

    // update button active state (standard section)
    const stdBtns = document.querySelectorAll(".standard-section .billing-toggle button");
    stdBtns.forEach(btn => btn.classList.remove("active"));

    if (mode === "monthly") stdBtns[0].classList.add("active");
    if (mode === "annually") stdBtns[1].classList.add("active");

    // re-render current plan
    setPlan(currentStandardIndex);
}

/* =========================
   STANDARD
========================= */
function setPlan(index) {
    currentStandardIndex = index;

    const plan = standardPlans[index];
    if (!plan) return;

    document.getElementById("planTitle").textContent = plan.name;
    document.getElementById("planDescription").textContent = plan.description;

    document.getElementById("planImg").src =
        getImageUrl(plan.image);

    // PRICE LOGIC
    let price = Number(plan.price);

    if (billingMode === "annually") {
        price = price * 12;
    }

    document.getElementById("planPrice").textContent =
        `R ${price.toFixed(2)}`;

    // DOTS
    const dots = document.querySelectorAll(".standard-section .dot");

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}

function setSpecializedBilling(mode) {
    specializedBillingMode = mode;

    const btns = document.querySelectorAll(".specialized-section .billing-toggle button");

    btns.forEach(btn => btn.classList.remove("active"));

    if (mode === "monthly") btns[0].classList.add("active");
    if (mode === "annually") btns[1].classList.add("active");

    setSpecializedPlan(currentSpecializedIndex);
}

/* =========================
   SPECIALIZED
========================= */
function setSpecializedPlan(index) {
    currentSpecializedIndex = index;

    const plan = specializedPlans[index];
    if (!plan) return;

    document.getElementById("specializedTitle").textContent = plan.name;
    document.getElementById("specializedDescription").textContent = plan.description;

    document.getElementById("specializedImg").src =
        getImageUrl(plan.image);

    // PRICE LOGIC 
    let price = Number(plan.price);

    if (specializedBillingMode === "annually") {
        price = price * 12;
    }

    document.getElementById("specializedPrice").textContent =
        `R ${price.toFixed(2)}`;

    // DOTS
    const dots = document.querySelectorAll(".specialized-dot");

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
    loadMemberships();
    
});