const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bloodRoutes = require("./routes/blood");
const donorRoutes = require("./routes/donors");
const emergencyRoutes = require("./routes/emergency");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/blood", bloodRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/emergency", emergencyRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "BloodLink Backend is running!"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`BloodLink server running on http://localhost:${PORT}`);
});