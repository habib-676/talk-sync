
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("MONGO_URI missing");

const dbName = process.env.DB_NAME || "Talk-Sync-Data";
const collName = "knowledge_vectors";

const CHUNK_SIZE = 900;
const OVERLAP = 120;
const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB safety

function chunkText(s, size = CHUNK_SIZE, overlap = OVERLAP) {
  const out = [];
  let i = 0;
  const step = Math.max(1, size - overlap);
  while (i < s.length) {
    const end = Math.min(i + size, s.length);
    const piece = s.slice(i, end).trim();
    if (piece) out.push(piece);
    if (end >= s.length) break;
    i += step;
  }
  return out.length ? out : [s.trim()];
}

// Lazily load Gemini once (prevents multiples & leaks)
let _embedModel = null;
async function getEmbedModel() {
  if (_embedModel) return _embedModel;
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing in .env");
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  _embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
  return _embedModel;
}

async function embedText(text) {
  const t = (text || "").trim();
  if (!t) throw new Error("empty text");
  const model = await getEmbedModel();
  const res = await model.embedContent(t);
  // Gemini returns { embedding: { values: number[] } }
  const arr = res?.embedding?.values;
  if (!Array.isArray(arr)) throw new Error("invalid embedding response");
  return arr; // keep as plain JS array
}

async function run() {
  const client = new MongoClient(uri, { ignoreUndefined: true });
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection(collName);

  const folder = path.join(__dirname, "knowledge");
  if (!fs.existsSync(folder)) {
    console.error("❌ knowledge folder not found:", folder);
    process.exit(1);
  }

  const files = fs.readdirSync(folder).filter(f => f.endsWith(".md"));
  if (!files.length) {
    console.warn("⚠️ No .md files in knowledge folder.");
    process.exit(0);
  }

  // clean old docs for these files
  await col.deleteMany({ file: { $in: files } });

  let total = 0;

  for (const file of files) {
    const fullPath = path.join(folder, file);
    const stat = fs.statSync(fullPath);
    const sizeKB = Math.round(stat.size / 1024);
    console.log(`➡️  Processing ${file} (${sizeKB} KB)`);

    if (stat.size === 0) {
      console.warn(`  ⚠️  ${file} is empty. Skipping.`);
      continue;
    }
    if (stat.size > MAX_FILE_BYTES) {
      console.warn(`  ⚠️  ${file} > ${MAX_FILE_BYTES} bytes. Skipping to avoid OOM.`);
      continue;
    }

    const txt = fs.readFileSync(fullPath, "utf8");
    const parts = txt.trim().length <= CHUNK_SIZE ? [txt.trim()] : chunkText(txt);

    console.log(`  — chunks: ${parts.length}`);
    let idx = 0;

    for (const pieceRaw of parts) {
      idx++;
      // hard-cap single chunk length (defensive)
      const text = pieceRaw.slice(0, 2000);

      let embedding;
      try {
        embedding = await embedText(text);
      } catch (err) {
        console.warn(`  ⚠️  embed failed at ${file}#${idx}: ${err?.message}`);
        continue;
      }

      // insert immediately — no big batches in memory
      await col.insertOne({
        file,
        section: `${file}#${idx}`,
        text,
        embedding,
      });

      total++;
      if (total % 10 === 0) {
        process.stdout.write(`  ✓ inserted ${total}\r`);
        // try to hint GC for long runs (requires --expose-gc)
        global.gc?.();
      }
    }
  }

  console.log(`\n✅ Ingest complete. Inserted ${total} chunks from ${files.length} files.`);
  await client.close();
}

run().catch((e) => {
  console.error("❌ Ingest failed:", e);
  process.exit(1);
});
