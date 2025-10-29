import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

// simple scoring config
const WORD_POINT = 1;
const SENTENCE_POINT = 3;

const EvaluationModal = ({
  visible,
  onClose,
  feedback, // the feedback doc { _id?, from, to, words[], sentences[], notes, createdAt }
  evaluation = null, // optional: { feedbackId, senderId, receiverId, words:[{text,correct}], sentences:[{text,correct}], breakdown, totalMarks }
  readOnly = false,
  onEvaluated, // callback with result
  points = { word: WORD_POINT, sentence: SENTENCE_POINT },
}) => {
  const [saving, setSaving] = useState(false);
  const MotionDiv = motion.div;

  // Resolve and show human-friendly sender name
  const [fromName, setFromName] = useState("");

  // small helper to detect a Mongo ObjectId-like string
  const looksLikeObjectId = (v) => /^[a-f\d]{24}$/i.test(String(v || ""));

  // Determine display lists using evaluation when provided
  const displayWords = useMemo(() => {
    if (evaluation?.words?.length) return evaluation.words.map((w) => w.text);
    return feedback?.words || [];
  }, [evaluation?.words, feedback?.words]);
  const displaySentences = useMemo(() => {
    if (evaluation?.sentences?.length)
      return evaluation.sentences.map((s) => s.text);
    return feedback?.sentences || [];
  }, [evaluation?.sentences, feedback?.sentences]);

  const initialWords = useMemo(() => {
    if (evaluation?.words?.length)
      return evaluation.words.map((w) => !!w.correct);
    return displayWords.map(() => false);
  }, [evaluation?.words, displayWords]);
  const initialSentences = useMemo(() => {
    if (evaluation?.sentences?.length)
      return evaluation.sentences.map((s) => !!s.correct);
    return displaySentences.map(() => false);
  }, [evaluation?.sentences, displaySentences]);
  const [wordChecks, setWordChecks] = useState(initialWords);
  const [sentenceChecks, setSentenceChecks] = useState(initialSentences);

  useEffect(() => {
    // reset when opening for a different feedback
    if (visible) {
      if (evaluation) {
        setWordChecks(initialWords);
        setSentenceChecks(initialSentences);
      } else {
        setWordChecks((feedback?.words || []).map(() => false));
        setSentenceChecks((feedback?.sentences || []).map(() => false));
      }
    }
  }, [visible, feedback, evaluation, initialWords, initialSentences]);

  // try to hydrate sender name gracefully
  useEffect(() => {
    let cancelled = false;
    async function hydrateName() {
      const direct =
        feedback?.fromName ||
        feedback?.fromDisplayName ||
        feedback?.from_user_name ||
        feedback?.fromUser?.name ||
        feedback?.fromUser?.displayName;
      if (direct) {
        if (!cancelled) setFromName(direct);
        return;
      }

      const id = evaluation?.senderId || feedback?.from;
      if (!id) return;

      try {
        // If it's an ObjectId, hit /users/id/:id
        if (looksLikeObjectId(id)) {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/id/${id}`
          );
          const user = data?.user;
          if (!cancelled && user)
            setFromName(user.name || user.displayName || user.email || "");
          return;
        }

        // Fallback: fetch all users and match by uid
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/users`
        );
        const list = Array.isArray(data) ? data : data?.users || [];
        const found = list.find(
          (u) => u?.uid === id || u?._id === id || String(u?._id) === String(id)
        );
        if (!cancelled && found)
          setFromName(found.name || found.displayName || found.email || "");
      } catch (e) {
        // stay silent; we'll show the id fallback below
        console.warn("Unable to resolve user name for", id, e?.message);
      }
    }
    if (visible) {
      hydrateName();
    }
    return () => {
      cancelled = true;
    };
  }, [visible, feedback, evaluation]);

  const wordsCorrect = useMemo(
    () => wordChecks.filter(Boolean).length,
    [wordChecks]
  );
  const sentencesCorrect = useMemo(
    () => sentenceChecks.filter(Boolean).length,
    [sentenceChecks]
  );
  const totalMarks =
    wordsCorrect * (points?.word ?? WORD_POINT) +
    sentencesCorrect * (points?.sentence ?? SENTENCE_POINT);

  const buildPayload = () => {
    return {
      feedbackId: feedback?._id || feedback?.id || null,
      senderId: feedback?.from,
      receiverId: feedback?.to,
      words: (feedback?.words || []).map((w, i) => ({
        text: w,
        correct: !!wordChecks[i],
      })),
      sentences: (feedback?.sentences || []).map((s, i) => ({
        text: s,
        correct: !!sentenceChecks[i],
      })),
      breakdown: {
        wordsCorrect,
        sentencesCorrect,
        wordPoint: points?.word ?? WORD_POINT,
        sentencePoint: points?.sentence ?? SENTENCE_POINT,
      },
      totalMarks,
      createdAt: new Date().toISOString(),
    };
  };

  const submit = async () => {
    try {
      setSaving(true);
      const payload = buildPayload();
      // Ready to send to backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/feedbacks/evaluate`,
        payload
      );
      if (!data?.success)
        throw new Error(data?.message || "Failed to save evaluation");
      toast.success("Evaluation saved");
      onEvaluated && onEvaluated(payload);
      onClose && onClose();
    } catch (e) {
      console.error("Evaluation submit error:", e);
      // If backend isn't ready yet, at least provide the object
      toast.error(e?.message || "Failed to save evaluation");
      console.log("Evaluation payload (ready to send):", buildPayload());
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {visible && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
        >
          <MotionDiv
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-3xl bg-slate-50 rounded-xl p-4 border border-[#e7edf4] shadow-xl"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <div>
                <h2 className="text-[#0d141c] text-xl font-bold leading-tight tracking-[-0.015em]">
                  Feedback Evaluation
                </h2>
                <p className="text-[#0d141c] text-sm mt-1">
                  Feedback from{" "}
                  <span className="font-medium">
                    {fromName || String(feedback?.from || "").slice(0, 8)}
                  </span>
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={onClose}
                disabled={saving}
              >
                Close
              </button>
            </div>

            {/* Words */}
            <h3 className="text-[#0d141c] text-base font-bold tracking-[-0.015em] px-1 pb-1 pt-3">
              Words
            </h3>
            <div className="px-1 py-2">
              <div className="overflow-hidden rounded-xl border border-[#cedbe8] bg-slate-50">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium w-[60%]">
                        Word
                      </th>
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium w-[40%]">
                        Mark
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(displayWords || []).map((w, i) => (
                      <tr key={i} className="border-t border-[#cedbe8]">
                        <td className="px-4 py-3 text-[#0d141c] text-sm">
                          {w}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={
                              readOnly
                                ? undefined
                                : () =>
                                    setWordChecks((prev) =>
                                      prev.map((v, idx) => (idx === i ? !v : v))
                                    )
                            }
                            className={`flex items-center justify-center h-8 px-4 rounded-xl text-sm font-medium w-full max-w-[200px] ${
                              wordChecks[i]
                                ? "bg-green-100 text-green-800"
                                : "bg-[#e7edf4] text-[#0d141c]"
                            }`}
                          >
                            {wordChecks[i] ? "Correct" : "Incorrect"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Correct: {wordsCorrect}/{displayWords?.length || 0}
              </div>
            </div>

            {/* Sentences */}
            <h3 className="text-[#0d141c] text-base font-bold tracking-[-0.015em] px-1 pb-1 pt-4">
              Sentences
            </h3>
            <div className="px-1 py-2">
              <div className="overflow-hidden rounded-xl border border-[#cedbe8] bg-slate-50">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium w-[70%]">
                        Sentence
                      </th>
                      <th className="px-4 py-3 text-left text-[#49739c] text-sm font-medium w-[30%]">
                        Mark
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(displaySentences || []).map((s, i) => (
                      <tr key={i} className="border-t border-[#cedbe8]">
                        <td className="px-4 py-3 text-[#0d141c] text-sm">
                          {s}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={
                              readOnly
                                ? undefined
                                : () =>
                                    setSentenceChecks((prev) =>
                                      prev.map((v, idx) => (idx === i ? !v : v))
                                    )
                            }
                            className={`flex items-center justify-center h-8 px-4 rounded-xl text-sm font-bold tracking-[0.015em] w-full max-w-[200px] ${
                              sentenceChecks[i]
                                ? "bg-green-100 text-green-800"
                                : "bg-[#e7edf4] text-[#0d141c]"
                            }`}
                          >
                            {sentenceChecks[i] ? "Correct" : "Wrong"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Correct: {sentencesCorrect}/{displaySentences?.length || 0}
              </div>
            </div>

            {/* Summary */}
            <h3 className="text-[#0d141c] text-base font-bold tracking-[-0.015em] px-1 pb-1 pt-4">
              Summary
            </h3>
            <div className="px-1 pb-2">
              <div className="grid grid-cols-[20%_1fr] gap-x-6 border-t border-[#cedbe8] py-4">
                <p className="text-[#49739c] text-sm">Total Marks</p>
                <p className="text-[#0d141c] text-sm">
                  {wordsCorrect + sentencesCorrect}/
                  {(displayWords?.length || 0) +
                    (displaySentences?.length || 0)}
                  <span className="ml-2 text-xs text-slate-500">
                    points: {totalMarks} (word {points?.word ?? WORD_POINT}/ea,
                    sentence {points?.sentence ?? SENTENCE_POINT}/ea)
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-1 pt-1">
              <button
                className="flex items-center justify-center rounded-xl h-10 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-bold tracking-[0.015em]"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              {!readOnly && (
                <button
                  className={`flex items-center justify-center rounded-xl h-10 px-4 text-sm font-bold tracking-[0.015em] text-white ${
                    saving
                      ? "bg-[#0d80f2]/70 cursor-not-allowed"
                      : "bg-[#0d80f2]"
                  }`}
                  onClick={submit}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save evaluation"}
                </button>
              )}
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default EvaluationModal;
