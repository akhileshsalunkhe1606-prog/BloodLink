const mongoose = require("mongoose");

const emergencyRequestSchema = new mongoose.Schema(
    {
        patientName: {
            type: String,
            required: true,
            trim: true
        },

        bloodGroup: {
            type: String,
            required: true,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        },

        hospital: {
            type: String,
            trim: true
        },

        contact: {
            type: String,
            required: true,
            trim: true
        },

        notes: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ["Pending", "Accepted", "Completed", "Cancelled"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const EmergencyRequest = mongoose.model(
    "EmergencyRequest",
    emergencyRequestSchema
);

module.exports = EmergencyRequest;