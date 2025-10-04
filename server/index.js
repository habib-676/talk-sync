const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Create HTTP server
const server = http.createServer(app);

// Setup socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // frontend URL
  },
});

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is missing in .env file");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const database = client.db("Talk-Sync-Data");
    const usersCollections = database.collection("users");
    const messagesCollections = database.collection("messages");

    // jwt related APIs ----->
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: "7d",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "none",
        })
        .send({ success: true });
    });

    //jwt verification middleware
    const verifyToken = (req, res, next) => {
      const token = req.cookies.token;
      if (!token)
        return res.status(401).send({ message: "Unauthorized access" });

      jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
        if (err) return res.status(403).send({ message: "Forbidden access" });

        req.decoded = decoded;
        next();
      });
    };

    //role checking middleware
    const verifyAdmin = async (req, res, next) => {
      try {
        const email = req.decoded?.email;
        if (!email) {
          return res.status(401).send({ message: "Unauthorized access" });
        }

        const user = await usersCollections.findOne({ email });
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        if (user.role !== "admin") {
          return res
            .status(403)
            .send({ message: "Access denied: Admins only" });
        }

        req.user = user;
        next();
      } catch (error) {
        console.error("Admin verification error:", error);
        res
          .status(500)
          .send({ message: "Server error during role verification" });
      }
    };

    //  Learner dashboard route
    app.get("/dashboard/learner", verifyToken, async (req, res) => {
      res.send({ message: "Welcome Learner Dashboard!" });
    });

    //  Admin dashboard route
    app.get("/dashboard/admin", verifyToken, verifyAdmin, async (req, res) => {
      res.send({ message: "Welcome Admin Dashboard!" });
    });

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

    // ✅ FIXED: Removed nested duplicate route
    app.get("/users/:email", async (req, res) => {
      try {
        const email = req?.params?.email;
        if (!email) {
          return res
            .status(400)
            .json({ success: false, message: "Email is required" });
        }

        const user = await usersCollections.findOne({ email });

        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
      } catch (error) {
        console.error("❌ Error in GET /users/:email:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });

    app.post("/users", async (req, res) => {
      try {
        const userData = req.body;
        console.log("Incoming userData:", userData);

        if (!userData?.email) {
          return res
            .status(400)
            .json({ success: false, message: "Email is required" });
        }

        // Step 1: prevent duplicate users
        const query = { email: userData?.email };
        const existingUser = await usersCollections.findOne({
          email: userData.email,
        });
        if (existingUser) {
          const result = await usersCollections.updateOne(query, {
            $set: { last_loggedIn: new Date().toISOString() },
          });
          return res.status(200).send(result);
        }

        // Step 2: only hash password if it's provided
        let hashedPassword = null;
        if (userData.password) {
          hashedPassword = await bcrypt.hash(userData.password, 10);
        }

        // Step 3: build new user object
        const newUser = {
          name: userData.name || "",
          email: userData.email,
          password: hashedPassword, // null if Google user
          image: userData.image || "",
          role: userData.role || "learner",
          uid: userData.uid || "",
          bio: "",
          user_country: "",
          date_of_birth: "",
          native_language: "",
          learning_language: [],
          gender: "",
          interests: [],
          proficiency_level: "",
          status: "Offline",
          friends: [],
          feedback: [],
          createdAt: new Date().toISOString(),
          last_loggedIn: new Date().toISOString(),
        };

        // Step 4: insert user
        const result = await usersCollections.insertOne(newUser);
        res.status(201).json({ success: true, userId: result.insertedId });
      } catch (error) {
        console.error("❌ Error in /users:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // API: for update user details
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

    // onboarding -->
    app.patch("/onboarding/:email", async (req, res) => {
      try {
        const { email } = req.params;
        const updatedData = req.body;
        console.log(updatedData);

        const result = await usersCollections.updateOne(
          { email },
          { $set: updatedData }
        );

        res.json({
          success: true,
          modifiedCount: result.modifiedCount,
          result,
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
      }
    });

    // all users --->
    app.get("/users", async (req, res) => {
      try {
        const users = await usersCollections.find().toArray();
        res.send(users);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // Get user by ID
    app.get("/users/id/:id", async (req, res) => {
      try {
        const userId = req.params.id;
        if (!userId) {
          return res
            .status(400)
            .json({ success: false, message: "User ID is required" });
        }

        const user = await usersCollections.findOne({
          _id: new ObjectId(userId),
        });
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
      } catch (error) {
        console.error("❌ Error in GET /users/id/:id:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // Check relationship status
    app.get("/relationship/:currentUserId/:targetUserId", async (req, res) => {
      try {
        const { currentUserId, targetUserId } = req.params;

        const currentUser = await usersCollections.findOne({
          _id: new ObjectId(currentUserId),
        });
        const targetUser = await usersCollections.findOne({
          _id: new ObjectId(targetUserId),
        });

        if (!currentUser || !targetUser) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        const currentUserFollowing = currentUser.following || [];
        const targetUserFollowing = targetUser.following || [];
        const currentUserFriends = currentUser.friends || [];
        const targetUserFriends = targetUser.friends || [];

        const iFollow = currentUserFollowing.includes(targetUserId);
        const followsMe = targetUserFollowing.includes(currentUserId);
        const isFriend =
          currentUserFriends.includes(targetUserId) &&
          targetUserFriends.includes(currentUserId);

        res.json({
          success: true,
          relationship: {
            iFollow,
            followsMe,
            isFriend,
          },
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // Follow endpoint
    app.post("/users/:id/follow", async (req, res) => {
      try {
        const targetUserId = req.params.id;
        const { currentUserId } = req.body;

        if (!currentUserId || !targetUserId) {
          return res
            .status(400)
            .json({ success: false, message: "Both IDs required" });
        }
        if (currentUserId === targetUserId) {
          return res
            .status(400)
            .json({ success: false, message: "You can't follow yourself" });
        }

        const currentUser = await usersCollections.findOne({
          _id: new ObjectId(currentUserId),
        });
        const targetUser = await usersCollections.findOne({
          _id: new ObjectId(targetUserId),
        });

        if (!currentUser || !targetUser) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        await usersCollections.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $addToSet: { following: targetUserId } }
        );

        await usersCollections.updateOne(
          { _id: new ObjectId(targetUserId) },
          { $addToSet: { followers: currentUserId } }
        );

        const targetUserFollowing = targetUser.following || [];
        if (targetUserFollowing.includes(currentUserId)) {
          await usersCollections.updateOne(
            { _id: new ObjectId(currentUserId) },
            { $addToSet: { friends: targetUserId } }
          );
          await usersCollections.updateOne(
            { _id: new ObjectId(targetUserId) },
            { $addToSet: { friends: currentUserId } }
          );
        }

        res.json({
          success: true,
          message: "Followed successfully",
          becameFriends: targetUserFollowing.includes(currentUserId),
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // Unfollow endpoint
    app.post("/users/:id/unfollow", async (req, res) => {
      try {
        const targetUserId = req.params.id;
        const { currentUserId } = req.body;

        if (!currentUserId || !targetUserId) {
          return res
            .status(400)
            .json({ success: false, message: "Both IDs required" });
        }

        await usersCollections.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $pull: { following: targetUserId } }
        );

        await usersCollections.updateOne(
          { _id: new ObjectId(targetUserId) },
          { $pull: { followers: currentUserId } }
        );

        await usersCollections.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $pull: { friends: targetUserId } }
        );
        await usersCollections.updateOne(
          { _id: new ObjectId(targetUserId) },
          { $pull: { friends: currentUserId } }
        );

        res.json({ success: true, message: "Unfollowed successfully" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // Remove follower endpoint
    app.post("/users/:id/remove-follower", async (req, res) => {
      try {
        const targetUserId = req.params.id;
        const { currentUserId } = req.body;

        if (!currentUserId || !targetUserId) {
          return res
            .status(400)
            .json({ success: false, message: "Both IDs required" });
        }

        await usersCollections.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $pull: { followers: targetUserId } }
        );

        await usersCollections.updateOne(
          { _id: new ObjectId(targetUserId) },
          { $pull: { following: currentUserId } }
        );

        await usersCollections.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $pull: { friends: targetUserId } }
        );
        await usersCollections.updateOne(
          { _id: new ObjectId(targetUserId) },
          { $pull: { friends: currentUserId } }
        );

        res.json({ success: true, message: "Follower removed successfully" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
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

        await messagesCollections.insertOne(newMessage);

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

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

server.listen(port, () => {
  console.log(`TalkSync server is running on port ${port}`);
});
