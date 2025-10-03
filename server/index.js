// server.js
require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcrypt"); // or bcryptjs if you prefer
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || true, // set to frontend origin in production
}));
app.use(express.json());

// Ensure MONGO_URI exists
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const DB_NAME = process.env.DB_NAME || "Talk-Sync-Data";
    const database = client.db(DB_NAME);
    const usersCollections = database.collection("users");

    // Create unique index on email for safety (idempotent)
    await usersCollections.createIndex({ email: 1 }, { unique: true });

    // Root
    app.get("/", (req, res) => {
      res.send("Welcome to TalkSync server");
    });

    /**
     * POST /users
     * Register or upsert a user.
     * Accepts body with at least { email }.
     * If user exists, it updates last_loggedIn and returns 200.
     */
    app.post("/users", async (req, res) => {
      try {
        const userData = req.body || {};
        const email = (userData.email || "").toLowerCase().trim();

        if (!email) {
          return res.status(400).json({ success: false, message: "Email is required" });
        }

        // If user exists, update last_loggedIn and return existing
        const existing = await usersCollections.findOne({ email });
        if (existing) {
          await usersCollections.updateOne({ email }, { $set: { last_loggedIn: new Date().toISOString() } });
          // return the public user object (without password)
          const publicUser = await usersCollections.findOne({ email }, { projection: { password: 0 } });
          return res.status(200).json({ success: true, user: publicUser });
        }

        // Hash password only if provided
        let hashedPassword = null;
        if (userData.password) {
          hashedPassword = await bcrypt.hash(userData.password, 10);
        }

        // Construct new user with safe defaults
        const newUser = {
          name: userData.name || "",
          email,
          password: hashedPassword, // null for social logins
          image: userData.image || "",
          role: userData.role || "learner",
          uid: userData.uid || "",
          bio: userData.bio || "",
          user_country: userData.user_country || "",
          date_of_birth: userData.date_of_birth || "",
          native: userData.native || "", // renamed to 'native' to match frontend
          learning: Array.isArray(userData.learning) ? userData.learning : (userData.learning ? [userData.learning] : []),
          gender: userData.gender || "",
          interests: Array.isArray(userData.interests) ? userData.interests : [],
          proficiency_level: userData.proficiency_level || "",
          availability: userData.availability || "",
          status: "Offline",
          friends: [],
          feedback: [],
          points: userData.points || 0,
          badges: userData.badges || [],
          recent: userData.recent || [],
          stats: userData.stats || {},
          createdAt: new Date().toISOString(),
          last_loggedIn: new Date().toISOString(),
        };

        const result = await usersCollections.insertOne(newUser);
        const publicUser = await usersCollections.findOne({ _id: result.insertedId }, { projection: { password: 0 } });
        return res.status(201).json({ success: true, user: publicUser });
      } catch (err) {
        console.error("Error in POST /users:", err);
        if (err.code === 11000) {
          return res.status(409).json({ success: false, message: "Email already exists" });
        }
        return res.status(500).json({ success: false, message: err.message || "Internal server error" });
      }
    });

    /**
     * GET /users
     * List users (for admin/dev).
     */
    app.get("/users", async (req, res) => {
      try {
        const docs = await usersCollections.find({}, { projection: { password: 0 } }).toArray();
        res.json(docs);
      } catch (err) {
        console.error("GET /users error:", err);
        res.status(500).json({ error: "Server error" });
      }
    });

    /**
     * GET /users/:email
     * Return a user by email (public fields only).
     */
    app.get("/users/:email", async (req, res) => {
      try {
        const email = (req.params.email || "").toLowerCase();
        if (!email) return res.status(400).json({ error: "Email required" });
        const user = await usersCollections.findOne({ email }, { projection: { password: 0 } });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
      } catch (err) {
        console.error("GET /users/:email error:", err);
        res.status(500).json({ error: "Server error" });
      }
    });

    /**
     * GET /api/me?email=...
     * Simple dev mode endpoint: returns profile for a given email.
     * In production replace this with an authenticated endpoint that derives the user from the token.
     */
    app.get("/api/me", async (req, res) => {
      try {
        const email = (req.query.email || "").toLowerCase().trim();
        if (!email) return res.status(400).json({ error: "email query required (dev mode)" });

        const user = await usersCollections.findOne({ email }, { projection: { password: 0 } });
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.json(user);
      } catch (err) {
        console.error("GET /api/me error:", err);
        return res.status(500).json({ error: "Server error" });
      }
    });

    /**
     * PATCH /api/me
     * Body: { email: string, updates: { field: value, ... } }
     * Updates the user and returns updated user (no password).
     * For demo mode we accept email in body; change to token-based auth in production.
     */
    app.patch("/api/me", async (req, res) => {
      try {
        const { email, updates } = req.body || {};
        if (!email || !updates) return res.status(400).json({ error: "email and updates are required" });

        // Do not allow updating password through this endpoint. If needed, create a separate password flow.
        if (updates.password) delete updates.password;

        // normalize some fields
        if (updates.learning && !Array.isArray(updates.learning)) {
          updates.learning = [updates.learning];
        }
        if (typeof updates.email === "string") delete updates.email; // don't allow changing email here (or handle separately)

        const result = await usersCollections.findOneAndUpdate(
          { email: email.toLowerCase().trim() },
          { $set: { ...updates, updatedAt: new Date().toISOString() } },
          { returnDocument: "after", projection: { password: 0 } }
        );

        if (!result.value) return res.status(404).json({ error: "User not found" });
        return res.json(result.value);
      } catch (err) {
        console.error("PATCH /api/me error:", err);
        return res.status(500).json({ error: "Server error" });
      }
    });

    // Ping DB
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

run().catch(console.dir);

// Start server
app.listen(port, () => {
  console.log(`TalkSync server is running on port ${port}`);
});

