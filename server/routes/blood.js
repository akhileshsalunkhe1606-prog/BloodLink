const express = require("express");
const BloodInventory = require("../models/BloodInventory");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const bloodInventory = await BloodInventory.find();

        res.json(bloodInventory);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch blood inventory"
        });
    }
});
router.patch("/:bloodGroup", async (req, res) => {
    try {
        const { units } = req.body;

        const blood = await BloodInventory.findOneAndUpdate(
            { bloodGroup: req.params.bloodGroup },
            { units: units },
            { new: true }
        );

        if (!blood) {
            return res.status(404).json({
                message: "Blood group not found"
            });
        }

        res.json(blood);

    } catch (error) {
        res.status(500).json({
            message: "Failed to update blood inventory"
        });
    }
});

module.exports = router;