const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// =========================
// Register User
// POST /api/auth/register
// =========================

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // Generate JWT
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Register Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// =========================
// Login User
// POST /api/auth/login
// =========================

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });

        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }

        // Generate JWT
        const token = generateToken(user._id);

        res.status(200).json({

            success: true,

            message: "Login successful.",

            token,

            user: {
                id: user._id,
                email: user.email
            }

        });

    } catch (error) {

        console.error("Login Error:", error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

module.exports = {

    registerUser,

    loginUser

};