import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authMiddleware, AuthRequest } from "./middleware/authMiddleware";
import { generateToken } from "./auth/jwt";
import { connectToMongo } from "./db/mongo";
import { ensureMongoSchema } from "./db/schemaSetup";
import { createUser, getUserByEmail, comparePassword, getUserById } from "./auth/userService";
import { RegisterRequest, LoginRequest, AuthResponse } from "./auth/types";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Backend running 🚀" });
});

// Register endpoint
app.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body as RegisterRequest;

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
    const user = await createUser(email, name, password);

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };

    res.status(201).json(response);
  } catch (error: any) {
    if (error.message === "User already exists") {
      res.status(400).json({ error: "Email already registered" });
    } else {
      res.status(500).json({ error: "Registration failed" });
    }
  }
});

// Login endpoint
app.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Validation
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find user
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Protected route - get current user
app.get("/auth/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.auth) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await getUserById(req.auth.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

async function startServer() {
  try {
    await connectToMongo();
    await ensureMongoSchema();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

void startServer();