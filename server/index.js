const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("Talk-Sync-Data");
    const usersCollections = database.collection("users");

    app.get("/", (req, res) => {
      res.send("Welcome to TalkSync server");
    });

    // User related APIs
    app.post("/users", async (req, res) => {
      try {
        const { user_name, user_email, password } = req.body;

        //step-1: prevent duplicate users.
        const existingUser = await usersCollections.findOne({ user_email });
        if (existingUser) {
          return res
            .status(400)
            .send({ success: false, message: "Email already existed" });
        }

        //step -2
        const hashedPassword = await bcrypt.hash(password, 10);

        //step - 3: create user collection
        const newUser = {
          user_name,
          user_email,
          password: hashedPassword,
          user_country,
          photo,
          bio,
          date_of_birth,
          native_language,
          learning_language,
          gender,
          interests: [],
          proficiency_level,
          status: "Offline",
          friends: [],
          feedback: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          role: "user",
        };

        //step - 4: send to  the database
        const result = await usersCollections.insertOne(newUser);

        //step - 5: send success status in the front-end
        res.status(201).json({ success: true, userId: result.insertedId });
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`TalkSync server is running on port ${port}`);
});
