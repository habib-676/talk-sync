// src/pages/dashboard/FeedbackForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";
const OBJID_RE = /^[0-9a-fA-F]{24}$/;

function Stars({ value = 3, onChange }) {
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`p-1 rounded ${n <= value ? "text-amber-500" : "text-gray-300"} hover:text-amber-500`}
          aria-label={`Set rating ${n}`}
        >
          <Star size={16} />
        </button>
      ))}
    </div>
  );
}

export default function FeedbackForm({ sessionId: propSessionId }) {
  const { sessionId: urlSessionId } = useParams() || {};
  const sessionId = propSessionId || urlSessionId; // prefer prop override
  const { user: authUser } = useAuth();
  const email = authUser?.email?.toLowerCase?.();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [existing, setExisting] = useState(null);
  const [localError, setLocalError] = useState(null);

  // richer fields
  const [words, setWords] = useState([{ word: "", meaning: "", translation: "", pos: "" }]);
  const [sentences, setSentences] = useState([{ word: "", sentence: "", context: "" }]);
  const [confidenceBefore, setConfidenceBefore] = useState(3);
  const [confidenceAfter, setConfidenceAfter] = useState(4);
  const [notes, setNotes] = useState("");

  // validate sessionId quickly
  useEffect(() => {
    setLocalError(null);
    if (!sessionId) {
      setLocalError("Missing session id. Please open Feedback from a session's 'Upcoming' item.");
      return;
    }
    if (!OBJID_RE.test(sessionId)) {
      setLocalError("Invalid session id. Make sure you opened Feedback from the session.");
      return;
    }
    setLocalError(null);
  }, [sessionId]);

  // load existing feedback for this session and prefill
  useEffect(() => {
    if (!sessionId || !email) return;
    (async () => {
      try {
        const res = await fetch(
          `${BACKEND}/sessions/${encodeURIComponent(sessionId)}/feedback?email=${encodeURIComponent(email)}`
        );
        if (!res.ok) return;
        const json = await res.json();
        if (!json.success) return;
        setExisting(json.feedback);

        // responses can be object-mapped (responses[email]) or array of {email,...}
        const respObj = json.feedback?.responses || {};
        let myResp = null;
        if (respObj && typeof respObj === "object" && !Array.isArray(respObj)) {
          myResp = respObj[email] || respObj[email.toLowerCase?.()] || null;
        }
        if (!myResp && Array.isArray(json.feedback?.responses)) {
          myResp = json.feedback.responses.find((r) => (r.email || "").toLowerCase() === (email || "").toLowerCase());
        }

        if (myResp) {
          if (Array.isArray(myResp.words) && myResp.words.length) {
            // convert plain word strings -> rich word items (meaning/translation left blank)
            setWords(myResp.words.map((w) => ({ word: w, meaning: "", translation: "", pos: "" })));
          }
          if (Array.isArray(myResp.sentences) && myResp.sentences.length) {
            setSentences(
              myResp.sentences.map((s) => {
                // s may be string or {word, sentence}
                if (typeof s === "string") return { word: "", sentence: s, context: "" };
                return { word: s.word || "", sentence: s.sentence || "", context: s.context || "" };
              })
            );
          }
          setConfidenceBefore(myResp.confidenceBefore ?? 3);
          setConfidenceAfter(myResp.confidenceAfter ?? 4);
          setNotes(myResp.notes || "");
        }
      } catch (err) {
        console.error("Failed to load feedback:", err);
      }
    })();
  }, [sessionId, email]);

  // helpers for words
  const updateWord = (idx, key, value) => setWords((prev) => prev.map((w, i) => (i === idx ? { ...w, [key]: value } : w)));
  const addWord = () => setWords((prev) => [...prev, { word: "", meaning: "", translation: "", pos: "" }]);
  const removeWord = (idx) => setWords((prev) => prev.filter((_, i) => i !== idx));

  // helpers for sentences
  const updateSentence = (idx, key, value) => setSentences((prev) => prev.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));
  const addSentence = () => setSentences((prev) => [...prev, { word: "", sentence: "", context: "" }]);
  const removeSentence = (idx) => setSentences((prev) => prev.filter((_, i) => i !== idx));

  // preview helper
  const previewSentences = () =>
    sentences.map((s, i) => (
      <div key={i} className="p-3 rounded bg-indigo-50/80 border-l-4 border-indigo-200">
        <div className="font-medium">{s.word || "—"}</div>
        <div className="text-sm text-slate-700 mt-1">{s.sentence || "No sentence provided"}</div>
        {s.context && <div className="text-xs text-slate-500 mt-1">Context: {s.context}</div>}
      </div>
    ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Sign in to submit feedback");
    if (!sessionId) return toast.error("Missing session id");
    if (!OBJID_RE.test(sessionId)) return toast.error("Invalid session id");

    setLoading(true);
    try {
      // flatten words array to plain strings for backend (backend expects words array of strings)
      const wordsPlain = words.map((w) => (w.word || "").trim()).filter(Boolean);

      // ensure sentences are an array of {word, sentence, context}
      const sentPayload = sentences.map((s) => ({
        word: (s.word || "").trim(),
        sentence: (s.sentence || "").trim(),
        context: (s.context || "").trim(),
      })).filter(s => s.sentence || s.word);

      const payload = {
        email,
        words: wordsPlain,
        sentences: sentPayload,
        confidenceBefore,
        confidenceAfter,
        notes: notes || "",
      };

      const res = await fetch(`${BACKEND}/sessions/${encodeURIComponent(sessionId)}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to save feedback");
      toast.success("Feedback saved! Returning to upcoming sessions...");

      // small delay for UX, then navigate back to sessions (upcoming tab)
      setTimeout(() => {
        navigate("/dashboard/sessions?tab=upcoming");
      }, 700);
    } catch (err) {
      console.error("Submit feedback error:", err);
      toast.error(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-indigo-50 to-white/90 rounded-3xl shadow-2xl p-6 border border-indigo-100">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-indigo-700">Session Feedback</h1>
            <p className="text-sm text-slate-500 mt-1">
              Reflect on your conversation — add words, examples, translations and rate your confidence.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Session</div>
            <div className="font-semibold">{sessionId || "—"}</div>
          </div>
        </header>

        {localError && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-100">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Words learned */}
          <section className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg">Words learned</h2>
              <div className="text-xs text-slate-500">Add meaning, translation & Part of Speech</div>
            </div>

            <div className="space-y-2">
              {words.map((w, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    className="col-span-3 input input-sm"
                    placeholder="Word"
                    value={w.word}
                    onChange={(e) => updateWord(i, "word", e.target.value)}
                  />
                  <input
                    className="col-span-4 input input-sm"
                    placeholder="Meaning"
                    value={w.meaning}
                    onChange={(e) => updateWord(i, "meaning", e.target.value)}
                  />
                  <input
                    className="col-span-3 input input-sm"
                    placeholder="Part of Speech"
                    value={w.pos}
                    onChange={(e) => updateWord(i, "pos", e.target.value)}
                  />
                  <button type="button" onClick={() => removeWord(i)} className="col-span-1 btn btn-ghost">✖</button>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <button type="button" onClick={addWord} className="btn btn-sm btn-outline">+ Add word</button>
            </div>
          </section>

          {/* Sentences */}
          <section className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg">Example sentences</h2>
              <div className="text-xs text-slate-500">Provide context to help learning</div>
            </div>

            <div className="space-y-2">
              {sentences.map((s, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start">
                  <input
                    className="col-span-3 input input-sm"
                    placeholder="Word (optional)"
                    value={s.word}
                    onChange={(e) => updateSentence(i, "word", e.target.value)}
                  />
                  <input
                    className="col-span-6 input input-sm"
                    placeholder="Sentence"
                    value={s.sentence}
                    onChange={(e) => updateSentence(i, "sentence", e.target.value)}
                  />
                  <input
                    className="col-span-3 input input-sm"
                    placeholder="Context"
                    value={s.context}
                    onChange={(e) => updateSentence(i, "context", e.target.value)}
                  />
                  <button type="button" onClick={() => removeSentence(i)} className="col-span-1 btn btn-ghost">✖</button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button type="button" onClick={addSentence} className="btn btn-sm btn-outline">+ Add sentence</button>
              <button
                type="button"
                onClick={() => {
                  // quick preview modal-like behavior (inline toggle)
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-sm text-indigo-600 hover:underline"
              >
                Preview
              </button>
            </div>
          </section>

          {/* Confidence sliders / stars and notes */}
          <section className="bg-white p-4 rounded-xl shadow-sm border grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="text-sm text-slate-600 mb-2">Confidence before</div>
              <Stars value={confidenceBefore} onChange={setConfidenceBefore} />
            </div>
            <div className="md:col-span-1">
              <div className="text-sm text-slate-600 mb-2">Confidence after</div>
              <Stars value={confidenceAfter} onChange={setConfidenceAfter} />
            </div>
            <div className="md:col-span-1">
              <div className="text-sm text-slate-600 mb-2">Quick notes</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="textarea textarea-bordered w-full"
                placeholder="Reflection, what went well, what to improve..."
              />
              <div className="text-xs text-slate-400 mt-1">{notes.length} chars</div>
            </div>
          </section>

          {/* Preview of sample sentences */}
          <section className="bg-gradient-to-t from-white to-indigo-50 p-4 rounded-xl border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Preview</h3>
              <div className="text-xs text-slate-500">How your entries will appear to your partner</div>
            </div>
            <div className="space-y-2">
              {previewSentences()}
              {sentences.length === 0 && <div className="text-sm text-slate-500">Add sentences to preview them here.</div>}
            </div>
          </section>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Status: <span className="font-medium">{existing ? (existing.responses && (existing.responses[email] || (Array.isArray(existing.responses) && existing.responses.find(r => (r.email||"").toLowerCase() === email))) ? "submitted" : "not submitted") : "not submitted"}</span>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="btn btn-ghost" onClick={() => navigate("/dashboard/sessions?tab=upcoming")}>
                Cancel
              </button>
              <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading || !!localError}>
                {loading ? "Saving..." : "Submit feedback"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


