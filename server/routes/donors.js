const express = require("express");
const Donor = require("../models/Donor");

const router = express.Router();

// Register a new donor
router.post("/", async (req, res) => {
    try {
        const donor = new Donor(req.body);

        const savedDonor = await donor.save();

        res.status(201).json(savedDonor);
    } catch (error) {
        console.error("Donor registration failed:", error.message);

        res.status(400).json({
            message: "Failed to register donor"
        });
    }
});

// Get all donors
router.get("/", async (req, res) => {
    try {
        const donors = await Donor.find().sort({ createdAt: -1 });

        res.json(donors);
    } catch (error) {
        console.error("Failed to fetch donors:", error.message);

        res.status(500).json({
            message: "Failed to fetch donors"
        });
    }
});

module.exports = router;