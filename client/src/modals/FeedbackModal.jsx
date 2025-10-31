import React, { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../hooks/useAxiosSecure";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
// Modern mood icons (Tabler via react-icons)
import {
  TbMoodCry,
  TbMoodSad,
  TbMoodNeutral,
  TbMoodSmile,
  TbMoodHappy,
} from "react-icons/tb";

const ratingMeta = {
  1: {
    label: "Terrible",
    Icon: TbMoodCry,
    colors: "from-red-400 to-orange-400",
  },
  2: { label: "Bad", Icon: TbMoodSad, colors: "from-orange-400 to-amber-400" },
  3: {
    label: "Okay",
    Icon: TbMoodNeutral,
    colors: "from-amber-400 to-yellow-300",
  },
  4: { label: "Good", Icon: TbMoodSmile, colors: "from-lime-400 to-green-400" },
  5: {
    label: "Great",
    Icon: TbMoodHappy,
    colors: "from-green-400 to-emerald-400",
  },
};

const RatingInput = ({ value, onChange }) => {
  const opts = [1, 2, 3, 4, 5];
  const current = ratingMeta[value] || ratingMeta[3];

  return (
    <div className="w-full flex flex-col items-center">
      {/* modern icon row */}
      <div className="relative flex items-center justify-center gap-3 md:gap-4">
        {opts.map((n) => {
          const meta = ratingMeta[n];
          const isActive = n === value;
          const Icon = meta.Icon;
          return (
            <motion.button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.98 }}
              className={`relative isolate grid place-items-center rounded-2xl transition-all duration-200 ${
                isActive ? "" : "grayscale opacity-70"
              }`}
              aria-label={meta.label}
              title={meta.label}
            >
              {/* glow ring for active */}
              {isActive && (
                <span
                  className={`absolute -inset-2 rounded-2xl bg-gradient-to-tr ${meta.colors} opacity-80 blur-md`}
                  aria-hidden
                />
              )}
              <Icon
                className="relative z-[1]"
                size={isActive ? 64 : 40}
                strokeWidth={1.5}
              />
            </motion.button>
          );
        })}
      </div>

      {/* label chip with caret */}
      <motion.div
        key={current.label}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="mt-3 px-3 py-1 rounded-full bg-[#e7edf4] text-xs text-[#0d141c] shadow-sm relative"
      >
        {current.label}
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-b-6 border-b-[#e7edf4]" />
      </motion.div>
    </div>
  );
};

const ChipsInput = ({ label, placeholder, max = 10, values, setValues }) => {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (!v) return;
    if (values.includes(v)) return;
    if (values.length >= max) return toast.error(`Max ${max} items`);
    setValues([...values, v]);
    setInput("");
  };
  const remove = (idx) => {
    const next = values.slice();
    next.splice(idx, 1);
    setValues(next);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div>
      <label className="block text-[#0d141c] text-sm font-medium mb-1">
        {label}
        <span className="ml-2 text-[11px] text-slate-600">
          {values.length}/{max}
        </span>
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v, i) => (
          <span
            key={i}
            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(i)}
              className="ml-1 text-primary/70 hover:text-primary"
              title="Remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 input input-bordered input-sm bg-white border-[#cedbe8]"
        />
        <button type="button" className="btn btn-sm" onClick={add}>
          Add
        </button>
      </div>
      <p className="mt-1 text-xs text-slate-600">
        Press Enter to add. Max {max}.
      </p>
    </div>
  );
};

const SentencesInput = ({ values, setValues, max = 3 }) => {
  const addField = () => {
    if (values.length >= max) {
      return toast.error(`Max ${max} sentences`);
    }
    setValues([...values, ""]);
  };
  const update = (idx, v) => {
    const next = values.slice();
    next[idx] = v;
    setValues(next);
  };
  const remove = (idx) => {
    const next = values.slice();
    next.splice(idx, 1);
    setValues(next);
  };
  return (
    <div>
      <label className="block text-[#0d141c] text-sm font-medium mb-1">
        Sentences
        <span className="ml-2 text-[11px] text-slate-600">
          {values.length}/{max}
        </span>
      </label>
      <div className="flex flex-col gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2 items-start">
            <textarea
              value={v}
              onChange={(e) => update(i, e.target.value)}
              rows={2}
              placeholder="Write a helpful sentence..."
              className="textarea textarea-bordered textarea-sm w-full bg-white border-[#cedbe8]"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="btn btn-ghost btn-xs"
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={addField} className="btn btn-sm">
          Add sentence
        </button>
        <p className="text-xs text-slate-600">
          Keep them short and specific. Max {max}.
        </p>
      </div>
    </div>
  );
};

const FeedbackModal = ({
  visible,
  onClose,
  fromUser, // { uid, name }
  toUser, // { uid, name }
  onSubmitted,
  sessionId,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [words, setWords] = useState([]);
  const [sentences, setSentences] = useState([]);
  const [notes, setNotes] = useState("");
  const [showThanks, setShowThanks] = useState(false);

  const MotionDiv = motion.div;

  const canSubmit = useMemo(
    () =>
      !submitting &&
      fromUser?.uid &&
      toUser?.uid &&
      Number.isFinite(rating) &&
      rating >= 1 &&
      rating <= 5,
    [fromUser?.uid, toUser?.uid, rating, submitting]
  );

  useEffect(() => {
    if (!visible) {
      setSubmitting(false);
      setRating(5);
      setWords([]);
      setSentences([]);
      setNotes("");
      setShowThanks(false);
    }
  }, [visible]);

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload = {
        from: fromUser?.uid,
        to: toUser?.uid,
        sessionId: sessionId || undefined,
        rating,
        words,
        sentences: sentences.map((s) => s.trim()).filter(Boolean),
        notes: notes.trim(),
      };

      const { data } = await axiosSecure.post("/feedbacks", payload);
      if (!data?.success && !data?.id) {
        throw new Error(data?.message || "Failed to submit feedback");
      }

      setShowThanks(true);
      onSubmitted && onSubmitted(data?.data || payload);
      setTimeout(() => {
        onClose && onClose();
        setSubmitting(false);
      }, 1200);
    } catch (err) {
      console.error("Feedback submit error:", err);
      toast.error(err?.message || "Failed to submit feedback");
      setSubmitting(false);
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
            className="relative w-full max-w-3xl bg-slate-50 rounded-xl p-4 border border-[#e7edf4] shadow-xl"
          >
            {/* success overlay */}
            <AnimatePresence>
              {showThanks && (
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-50/95 backdrop-blur-sm z-10"
                >
                  <MotionDiv
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="text-center"
                  >
                    <div className="text-[#0d141c] text-2xl md:text-3xl font-bold">
                      Thank you for your feedback 🎉
                    </div>
                    <div className="text-sm mt-1 text-slate-600">
                      Saved successfully
                    </div>
                  </MotionDiv>
                </MotionDiv>
              )}
            </AnimatePresence>

            {/* header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div>
                <h3 className="text-[#0d141c] text-xl font-bold leading-tight tracking-[-0.015em]">
                  Share feedback
                </h3>
                <p className="text-[#0d141c] text-sm mt-1">
                  For {toUser?.name || toUser?.email || toUser?.uid}
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={onClose}
                disabled={submitting}
              >
                Close
              </button>
            </div>

            {/* body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-[#0d141c] text-sm font-medium mb-2">
                    How was the session?
                  </label>
                  <RatingInput value={rating} onChange={setRating} />
                </div>
                <div className="px-1">
                  <ChipsInput
                    label="Words to practice"
                    placeholder="Type a word and press Enter"
                    max={10}
                    values={words}
                    setValues={setWords}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <SentencesInput
                  values={sentences}
                  setValues={setSentences}
                  max={3}
                />
                <div>
                  <label className="block text-[#0d141c] text-sm font-medium mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="textarea textarea-bordered w-full bg-white border-[#cedbe8]"
                    placeholder="Any extra suggestions..."
                  />
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="mt-4 flex items-center justify-end gap-2 px-1">
              <button
                className="flex items-center justify-center rounded-xl h-10 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-bold tracking-[0.015em]"
                onClick={onClose}
                disabled={submitting}
              >
                Skip
              </button>
              <button
                className={`flex items-center justify-center rounded-xl h-10 px-4 text-sm font-bold tracking-[0.015em] text-white ${
                  submitting
                    ? "bg-[#0d80f2]/70 cursor-not-allowed"
                    : "bg-[#0d80f2]"
                }`}
                onClick={submit}
                disabled={!canSubmit}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FeedbackModal;
