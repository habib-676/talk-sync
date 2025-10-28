const { MongoClient } = require("mongodb");
const { embedText } = require("./embedText");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
const dbName = process.env.DB_NAME || "Talk-Sync-Data";

async function searchSimilar(query, k = 6) {
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection("knowledge_vectors");
  const queryVector = await embedText(query);

  const pipeline = [
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector,
        numCandidates: 200,
        limit: k,
      },
    },
    {
      $project: {
        text: 1,
        file: 1,
        section: 1,
        score: { $meta: "searchScore" },
      },
    },
  ];

  try {
    return await col.aggregate(pipeline).toArray();
  } catch (e) {
    console.warn("⚠️ Vector search unavailable, fallback mode:", e.message);
    // fallback: return last k docs (no ranking)
    const docs = await col
      .find({}, { projection: { text: 1, file: 1, section: 1 } })
      .sort({ _id: -1 })
      .limit(k)
      .toArray();
    return docs.map((d) => ({ ...d, score: 0 }));
  }
}

module.exports = { searchSimilar };