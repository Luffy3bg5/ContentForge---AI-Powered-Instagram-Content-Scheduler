const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const cors = require("cors");

const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const aiRoutes = require("./routes/aiRoutes");
// Load environment variables

// Connect to MongoDB
connectDB();


const app = express();

// ==========================
// Middleware
// ==========================

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));


// ==========================
// Routes
// ==========================

app.use("/api/posts", postRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/auth", require("./routes/authRoutes"));

// Root Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 ContentForge Backend API is running..."
    });
});

// Authentication Routes

// ==========================
// 404 Handler
// ==========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});

// ==========================
// Start Server
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("----------------------------------");
    console.log("🚀 ContentForge Backend Started");
    console.log(`🌐 Server : http://localhost:${PORT}`);
    console.log(`📦 Environment : ${process.env.NODE_ENV || "development"}`);
    console.log("----------------------------------");
});