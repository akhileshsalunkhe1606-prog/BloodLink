const dotenv = require("dotenv");
const connectDB = require("./config/db");
const BloodInventory = require("./models/BloodInventory");

dotenv.config();

const bloodData = [
    { bloodGroup: "A+", units: 12, status: "available" },
    { bloodGroup: "A-", units: 8, status: "available" },
    { bloodGroup: "B+", units: 4, status: "available" },
    { bloodGroup: "B-", units: 7, status: "available" },
    { bloodGroup: "AB+", units: 6, status: "available" },
    { bloodGroup: "AB-", units: 2, status: "limited" },
    { bloodGroup: "O+", units: 15, status: "available" },
    { bloodGroup: "O-", units: 3, status: "limited" }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        await BloodInventory.deleteMany();

        await BloodInventory.insertMany(bloodData);

        console.log("Blood inventory added successfully");

        process.exit();
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedDatabase();