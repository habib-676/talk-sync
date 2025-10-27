const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function embedText(text) {
  const t = (text || "").trim();
  if (!t) throw new Error("empty text");
  const res = await embeddingModel.embedContent(t);
  return Array.from(res.embedding.values);
}

module.exports = { embedText };