const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

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

      // ----------- VIDEO CALL EVENTS -----------

      // when a user calls someone
      socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        const receiverSocketId = userSocketMap[userToCall];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("incomingCall", {
            from,
            name,
            signal: signalData,
          });
        }
      });

      // When user accepts a call
      socket.on("acceptCall", ({ to, signal }) => {
        const callerSocketId = userSocketMap[to];
        if (callerSocketId) {
          io.to(callerSocketId).emit("callAccepted", signal);
        }
      });

      // When user declines a call
      socket.on("declineCall", ({ to }) => {
        const callerSocketId = userSocketMap[to];
        if (callerSocketId) {
          io.to(callerSocketId).emit("callDeclined");
        }
      });

      // Exchange ICE candidates
      socket.on("iceCandidate", ({ to, candidate }) => {
        const targetSocketId = userSocketMap[to];
        if (targetSocketId) {
          io.to(targetSocketId).emit("iceCandidate", candidate);
        }
      });

      // End call
      socket.on("endCall", ({ to }) => {
        const targetSocketId = userSocketMap[to];
        if (targetSocketId) {
          io.to(targetSocketId).emit("endCall");
        }
      });

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
