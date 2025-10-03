// server.js
require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || true, // set to frontend origin in production
}));
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Setup socket.io
const io = new Server(server, {
  cors: {
    origin: "*", //  frontend URL
  },
});

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
    const messagesCollections = database.collection("messages");

    app.get("/", (req, res) => {
      res.send("Welcome to TalkSync server");
    });

    // socket.io
    const userSocketMap = {}; // {userId: socketId}

    io.on("connection", (socket) => {
      console.log("🟢 User is connected", socket.id);
      const userId = socket.handshake.query.uid;

      if (userId) {
        userSocketMap[userId] = socket.id;
      }

      // send events to all the connected clients
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });
    });

    // receiver socket id
    const getReceiverSocketId = (userId) => {
      return userSocketMap[userId];
    };

    // User related APIs

    app.get("/users/:email", async (req, res) => {
      try {
        const email = req?.params?.email;
        if (!email) {
          res
            .status(400)
            .json({ success: false, message: "Email is required" });
        }

        const user = await usersCollections.findOne({ email });

        if (!user) {
          res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
      } catch (error) {
        console.error("❌ Error in GET /users/:email:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });

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
        res.status(201).json({ success: true, userId: result.insertedId });
      } catch (error) {
        console.error("❌ Error in /users:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // API: for update user  details
    app.put("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const updatedData = req.body;

        console.log(updatedData);

        if (!email) {
          return res
            .status(400)
            .json({ success: false, message: "Email is required" });
        }

        const result = await usersCollections.updateOne(
          { email },
          {
            $set: {
              ...updatedData,
              updatedAt: new Date().toISOString(),
            },
          },
          { upsert: false }
        );

        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          result,
        });
      } catch (error) {
        console.error("❌ Error updating user:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });

    /**
     * GET /users
     * List users (for admin/dev).
     */
    app.get("/users", async (req, res) => {
      const result = await usersCollections.find().toArray();
      res.send(result);
    });

    // message related api's
    app.post("/messages", async (req, res) => {
      try {
        const messageData = req.body;
        const { text, image } = messageData;
        let imgUrl;

        if (image) {
          // upload image in the cloudinary
          // imgUrl = link from cloudinary
        }

        const newMessage = {
          senderId: messageData?.senderId,
          receiverId: messageData?.receiverId,
          text: messageData?.text,
          image: imgUrl,
          createdAt: new Date().toISOString(),
        };

        // save message in mongoDB
        await messagesCollections.insertOne(newMessage);

        // realtime functionality
        const receiverSocketId = getReceiverSocketId(messageData?.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).send(newMessage);
      } catch (error) {
        console.log("Error in message: ", error.message);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/messages", async (req, res) => {
      try {
        const { senderId, receiverId } = req.query;
        if (!senderId || !receiverId) {
          return res.status(400).json({
            success: false,
            message: "senderId and receiverId are required",
          });
        }

        const query = {
          $or: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        };

        const messages = await messagesCollections
          .find(query)
          .sort({ createdAt: 1 })
          .toArray();
        res.status(200).json(messages);
      } catch (err) {
        console.error("GET /messages error:", err);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

run().catch(console.dir);

server.listen(port, () => {
  console.log(`TalkSync server is running on port ${port}`);
});

