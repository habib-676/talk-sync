// server.js
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

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // set to frontend origin in production
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Create HTTP server
const server = http.createServer(app);

// Setup socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"], // frontend URL
    credentials: true,
    methods: ["GET", "POST"],
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

    // jwt related APIs ----->
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const payload = { email: user.email, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: "7d",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        })
        .send({ success: true });
    });

    //jwt verification middleware
    const verifyToken = (req, res, next) => {
      const token =
        req.cookies?.token || req.headers.authorization?.split(" ")[1];
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
 
app.get("/user-role", verifyToken, async (req, res) => {
  try {
    const email = req.decoded?.email;
    if (!email) return res.status(401).send({ message: "Unauthorized" });

    const user = await usersCollections.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    res.send({ role: user.role || "learner" });
  } catch (e) {
    console.error("Error getting user role:", e);
    res.status(500).send({ message: "Server error during role retrieval" });
  }
});


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
        const userData = req.body || {};
        const email = (userData.email || "").toLowerCase().trim();

        if (!email) {
          return res
            .status(400)
            .json({ success: false, message: "Email is required" });
        }

        // If user exists, update last_loggedIn and return existing
        const existing = await usersCollections.findOne({ email });
        if (existing) {
          await usersCollections.updateOne(
            { email },
            { $set: { last_loggedIn: new Date().toISOString() } }
          );
          // return the public user object (without password)
          const publicUser = await usersCollections.findOne(
            { email },
            { projection: { password: 0 } }
          );
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
    app.get("/dashboard/overview", async (req, res) => {
      try {
        const email = (req.query.email || "").toLowerCase().trim();
        if (!email)
          return res
            .status(400)
            .json({ success: false, message: "email is required" });

        const user = await usersCollections.findOne(
          { email },
          { projection: { password: 0 } }
        );
        if (!user)
          return res
            .status(404)
            .json({ success: false, message: "User not found" });

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const recent = Array.isArray(user.recent) ? user.recent : [];
        const sessionsThisWeek = recent.filter((s) => {
          if (!s.createdAt) return false;
          const d = new Date(s.createdAt);
          return d >= weekAgo && d <= now;
        }).length;

        let nextSession = user.nextSession || null;
        if (!nextSession) {
          const future = recent.filter(
            (s) => s.startTime && new Date(s.startTime) > now
          );
          future.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
          nextSession = future.length ? future[0] : null;
        }

        const learning = Array.isArray(user.learning_language)
          ? user.learning_language
          : user.learning_language
          ? [user.learning_language]
          : [];
        const partnerQuery = { email: { $ne: email } };
        if (learning.length) partnerQuery.native_language = { $in: learning };

        const suggestedPartners = await usersCollections
          .find(partnerQuery, {
            projection: {
              name: 1,
              email: 1,
              native_language: 1,
              image: 1,
              learning_language: 1,
            },
          })
          .limit(6)
          .toArray();

        const learners = await usersCollections.countDocuments();

        // ====== REPLACED distinct() with aggregation to be API strict compatible ======
        const countryAgg = await usersCollections
          .aggregate([
            { $match: { user_country: { $exists: true, $ne: "" } } },
            { $group: { _id: "$user_country" } },
            { $count: "distinctCountries" },
          ])
          .toArray();
        const countriesCount =
          (countryAgg[0] && countryAgg[0].distinctCountries) || 0;

        const langAgg = await usersCollections
          .aggregate([
            { $match: { native_language: { $exists: true, $ne: "" } } },
            { $group: { _id: "$native_language" } },
            { $count: "distinctLanguages" },
          ])
          .toArray();
        const languagesCount =
          (langAgg[0] && langAgg[0].distinctLanguages) || 0;

        const summary = {
          nextSession,
          sessionsThisWeek,
          points: user.points ?? 0,
          badges: user.badges ?? [],
          suggestedPartners,
          learners: learners || 0,
          countries: countriesCount,
          languages: languagesCount,
        };

        res.json({ success: true, summary });
      } catch (error) {
        console.error("GET /dashboard/summary error:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });
    // inside run() after you define usersCollections, messagesCollections
    const sessionsCollections = database.collection("sessions");

    /**
     * GET /users/following/:email
     * Returns full user docs for people that the given user follows
     */
    app.get("/users/following/:email", async (req, res) => {
      try {
        const email = req.params.email;
        if (!email)
          return res
            .status(400)
            .json({ success: false, message: "Email required" });

        const me = await usersCollections.findOne({ email });
        if (!me)
          return res
            .status(404)
            .json({ success: false, message: "User not found" });

        const following = Array.isArray(me.following) ? me.following : [];
        if (!following.length) return res.json({ success: true, users: [] });

        // following array stores user IDs (strings) — fetch those users
        const followDocs = await usersCollections
          .find({ _id: { $in: following.map((id) => new ObjectId(id)) } })
          .project({ password: 0 })
          .toArray();

        res.json({ success: true, users: followDocs });
      } catch (err) {
        console.error("GET /users/following error:", err);
        res.status(500).json({ success: false, message: err.message });
      }
    });

    /**
     * POST /sessions/request
     * Create a session request (status: pending)
     * Body: { fromEmail, toEmail, scheduledAt(optional ISO string), durationMinutes (optional) , message (optional) }
     */
    app.post("/sessions/request", async (req, res) => {
      try {
        const {
          fromEmail,
          toEmail,
          scheduledAt,
          durationMinutes = 10,
          message = "",
        } = req.body;
        if (!fromEmail || !toEmail) {
          return res.status(400).json({
            success: false,
            message: "fromEmail and toEmail required",
          });
        }

        // fetch users
        const fromUser = await usersCollections.findOne({ email: fromEmail });
        const toUser = await usersCollections.findOne({ email: toEmail });
        if (!fromUser || !toUser) {
          return res
            .status(404)
            .json({ success: false, message: "User(s) not found" });
        }

        const session = {
          fromUserId: fromUser._id.toString(),
          fromEmail,
          fromName: fromUser.name || fromUser.displayName || "",
          toUserId: toUser._id.toString(),
          toEmail,
          toName: toUser.name || toUser.displayName || "",
          status: "pending", // pending | accepted | rejected | canceled | finished
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
          durationMinutes,
          message,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await sessionsCollections.insertOne(session);

        // notify the receiver via socket if connected
        const receiverSocketId = userSocketMap[session.toUserId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("sessionRequested", {
            sessionId: result.insertedId.toString(),
            session,
          });
        }

        res
          .status(201)
          .json({ success: true, sessionId: result.insertedId, session });
      } catch (err) {
        console.error("POST /sessions/request error:", err);
        res.status(500).json({ success: false, message: err.message });
      }
    });

    /**
     * GET /sessions?email=...
     * Returns sessions where the email is either requester or receiver.
     * Optional query param status to filter.
     */
    app.get("/sessions", async (req, res) => {
      try {
        const email = (req.query.email || "").toLowerCase();
        if (!email)
          return res
            .status(400)
            .json({ success: false, message: "email query required" });

        const status = req.query.status; // optional
        const q = {
          $or: [{ fromEmail: email }, { toEmail: email }],
        };
        if (status) q.status = status;

        const sessions = await sessionsCollections
          .find(q)
          .sort({ createdAt: -1 })
          .toArray();
        res.json({ success: true, sessions });
      } catch (err) {
        console.error("GET /sessions error:", err);
        res.status(500).json({ success: false, message: err.message });
      }
    });

    /**
     * POST /sessions/:id/accept
     * Accept a session request. Body: { actionByEmail } // must be receiver
     */
    app.post("/sessions/:id/accept", async (req, res) => {
      try {
        const { id } = req.params;
        const { actionByEmail } = req.body;
        if (!actionByEmail)
          return res
            .status(400)
            .json({ success: false, message: "actionByEmail required" });

        const session = await sessionsCollections.findOne({
          _id: new ObjectId(id),
        });
        if (!session)
          return res
            .status(404)
            .json({ success: false, message: "Session not found" });

        // only the receiver (toEmail) can accept
        if (session.toEmail.toLowerCase() !== actionByEmail.toLowerCase()) {
          return res
            .status(403)
            .json({ success: false, message: "Only receiver can accept" });
        }

        const update = {
          $set: {
            status: "accepted",
            updatedAt: new Date().toISOString(),
          },
        };

        await sessionsCollections.updateOne({ _id: new ObjectId(id) }, update);

        // notify the requester
        const requesterSocketId = userSocketMap[session.fromUserId];
        if (requesterSocketId) {
          io.to(requesterSocketId).emit("sessionAccepted", {
            sessionId: id,
            session: { ...session, status: "accepted" },
          });
        }

        res.json({ success: true, message: "Session accepted" });
      } catch (err) {
        console.error("POST /sessions/:id/accept error:", err);
        res.status(500).json({ success: false, message: err.message });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  } finally {
    // do not close client here to keep connection for app lifetime
  }
}

run().catch(console.dir);

server.listen(port, "0.0.0.0", () => {
  console.log(`TalkSync server is running on port ${port}`);
});
