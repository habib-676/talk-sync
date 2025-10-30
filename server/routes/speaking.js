// server/routes/speaking.js
// Express Router for Speaking Coach + Assessment using Google Gemini

const express = require("express");
const router = express.Router();

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// --- Utils ---
const safeJson = (t, fallback) => {
  try {
    return JSON.parse(t);
  } catch {
    // try to extract first {...} block
    const m = t.match(/\{[\s\S]*\}$/m);
    if (m) {
      try { return JSON.parse(m[0]); } catch {}
    }
    return fallback;
  }
};

// ---------- ROUTES ----------

// 1) Speaking partner: give one short question
router.post("/coach", async (req, res) => {
  try {
    const {
      targetLanguage = "English",
      level = "A2",
      topic = "Daily life",
      history = [],
    } = req.body || {};

    const sys = `
You are TalkSync's speaking partner. Ask the learner ONE short question in ${targetLanguage} (CEFR ${level})
about "${topic}". Keep it 6-14 words. No translations. Strict JSON: {"question":"..."} only.`;

    const user = `Previous QA (last 3): ${history
      .slice(-3)
      .map((x) => `Q:${x.q} A:${x.a}`)
      .join(" | ")}`;

    // ✅ Pass a single prompt string (NOT an array with role/parts)
    const out = await chatModel.generateContent(`${sys}\n\n${user}`);
    const text = out.response.text().trim();

    const json = safeJson(text, {
      question: text.replace(/^["'{\[]/, "").slice(0, 160),
    });

    return res.json({ success: true, ...json });
  } catch (e) {
    console.error("coach error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

// 2) Assessment: scores + feedback + corrections (+ spoken_feedback for TTS)
router.post("/assess", async (req, res) => {
  try {
    const {
      transcript = "",
      targetLanguage = "English",
      level = "A2",
      topic = "Daily life",
      rubric = ["pronunciation", "fluency", "grammar", "vocabulary", "detail", "coherence"],
    } = req.body || {};

    if (!transcript || !transcript.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "transcript required" });
    }

    const prompt = `
You are a speaking examiner for ${targetLanguage}. Evaluate the learner's SPOKEN response below.

Return STRICT JSON ONLY with this exact shape (no markdown outside JSON):
{
  "scores": { 
    "pronunciation": 1-5, 
    "fluency": 1-5, 
    "grammar": 1-5, 
    "vocabulary": 1-5, 
    "detail": 1-5,
    "coherence": 1-5
  },
  "summary": "Max 2 sentences describing overall performance.",
  "highlights": ["strong point 1","strong point 2"],
  "mistakes": [
    { "type": "grammar|word-choice|coherence|pronunciation", "original": "…", "better": "…" }
  ],
  "pronunciation_hints": ["If transcript suggests likely problem words, give phonetic hints (IPA allowed)."],
  "tips": {
    "pronunciation": "one sentence tip",
    "fluency": "one sentence tip",
    "grammar": "one sentence tip",
    "vocabulary": "one sentence tip",
    "detail": "one sentence tip",
    "coherence": "one sentence tip"
  },
  "estimated_cefr": "A1|A2|B1|B2|C1|C2",
  "spoken_feedback": "45-80 words: friendly voice feedback that reads well aloud. One praise + two actionable suggestions."
}

Keep ratings consistent with CEFR ${level} expectations and the topic "${topic}".
Base pronunciation hints ONLY on transcript cues (no audio).
Be concise and useful. STRICT JSON ONLY.

TRANSCRIPT:
${transcript}
`;

    const out = await chatModel.generateContent(prompt);
    const text = out.response.text().trim();

    const data =
      safeJson(text, null) || {
        scores: {
          pronunciation: 3,
          fluency: 3,
          grammar: 3,
          vocabulary: 3,
          detail: 3,
          coherence: 3,
        },
        summary: "Clear ideas with room to improve accuracy and flow.",
        highlights: ["Clear message", "Relevant ideas"],
        mistakes: [],
        pronunciation_hints: [],
        tips: {
          pronunciation: "Slow down and stress key syllables.",
          fluency: "Use linking phrases to maintain flow.",
          grammar: "Check verb tense consistency.",
          vocabulary: "Add one topic-specific word next time.",
          detail: "Include a concrete example.",
          coherence: "Use first/then/finally to structure.",
        },
        estimated_cefr: level,
        spoken_feedback:
          "Nice effort! Your ideas are clear. Try speaking slightly slower and add one example to support your point. Also review verb tenses. Keep practicing—you’re improving!",
      };

    return res.json({ success: true, data });
  } catch (e) {
    console.error("assess error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

// 3) Follow-up short question to keep conversation flowing
router.post("/followup", async (req, res) => {
  try {
    const {
      userAnswer = "",
      targetLanguage = "English",
      level = "A2",
      topic = "Daily life",
    } = req.body || {};

    const prompt = `
User answered: "${userAnswer}"
Give a SHORT (<=12 words) follow-up question in ${targetLanguage}, CEFR ${level}, topic "${topic}".
Output JSON only: {"question":"..."}
`;

    // ✅ Also pass a single string prompt here
    const out = await chatModel.generateContent(prompt);
    const text = out.response.text().trim();
    const json = safeJson(text, {
      question: text.replace(/^["'{\[]/, "").slice(0, 160),
    });

    return res.json({ success: true, ...json });
  } catch (e) {
    console.error("followup error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
