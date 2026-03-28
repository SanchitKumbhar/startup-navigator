"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const jwt_1 = require("./auth/jwt");
const mongo_1 = require("./db/mongo");
const schemaSetup_1 = require("./db/schemaSetup");
const userService_1 = require("./auth/userService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check route
app.get("/", (_req, res) => {
    res.json({ message: "Backend running 🚀" });
});
// Register endpoint
app.post("/auth/register", async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        // Validation
        if (!email || !password || !confirmPassword) {
            res.status(400).json({ error: "Email, password, and confirmPassword are required" });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({ error: "Passwords do not match" });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ error: "Password must be at least 6 characters" });
            return;
        }
        // Extract name from email
        const name = email.split("@")[0] || "Team Member";
        // Create user
        const user = await (0, userService_1.createUser)(email, name, password);
        // Generate token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
        });
        const response = {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
        res.status(201).json(response);
    }
    catch (error) {
        if (error.message === "User already exists") {
            res.status(400).json({ error: "Email already registered" });
        }
        else {
            res.status(500).json({ error: "Registration failed" });
        }
    }
});
// Login endpoint
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }
        // Find user
        const user = await (0, userService_1.getUserByEmail)(email);
        if (!user) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        // Verify password
        const isPasswordValid = await (0, userService_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
        });
        const response = {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});
// Protected route - get current user
app.get("/auth/me", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        if (!req.auth) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        const user = await (0, userService_1.getUserById)(req.auth.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});
async function startServer() {
    try {
        await (0, mongo_1.connectToMongo)();
        await (0, schemaSetup_1.ensureMongoSchema)();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}
void startServer();
