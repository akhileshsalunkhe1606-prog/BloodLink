const express = require("express");
const EmergencyRequest = require("../models/EmergencyRequest");

const router = express.Router();

// Submit a new emergency request
router.post("/", async (req, res) => {
    try {
        const request = new EmergencyRequest(req.body);

        const savedRequest = await request.save();

        res.status(201).json(savedRequest);
    } catch (error) {
        console.error("Emergency request failed:", error.message);

        res.status(400).json({
            message: "Failed to submit emergency request"
        });
    }
});

// Get all emergency requests
router.get("/", async (req, res) => {
    try {
        const requests = await EmergencyRequest
            .find()
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error("Failed to fetch emergency requests:", error.message);

        res.status(500).json({
            message: "Failed to fetch emergency requests"
        });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { status } = req.body;

        const updatedRequest = await EmergencyRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({
                message: "Emergency request not found"
            });
        }

        res.json(updatedRequest);

    } catch (error) {
        console.error("Failed to update emergency request:", error.message);

        res.status(500).json({
            message: "Failed to update emergency request"
        });
    }
});

module.exports = router;