const express = require("express");
const router = express.Router();
const pool = require("../db/database");


/* ==================
   MENU TOGGLE
========================= */

function toggleMenu() {
    const nav = document.getElementById("navLinks");
    nav.classList.toggle("active");
}

// GET ALL CLASS IMAGES
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM class_images ORDER BY class_id"
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

module.exports = router;