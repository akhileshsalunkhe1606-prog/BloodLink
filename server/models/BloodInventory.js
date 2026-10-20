const mongoose = require("mongoose");

const bloodInventorySchema = new mongoose.Schema({
    bloodGroup: {
        type: String,
        required: true,
        unique: true
    },

    units: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ["available", "limited"],
        default: "available"
    }
});

const BloodInventory = mongoose.model(
    "BloodInventory",
    bloodInventorySchema
);

module.exports = BloodInventory;