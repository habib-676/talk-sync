import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { AiFillStar } from "react-icons/ai";
import { AnimatePresence, motion as Motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import EvaluationModal from "../../../modals/EvaluationModal";

const RightSidebar = ({ selectedUser }) => {
  const { onlineUsers, user } = useAuth();
  const isOnline = selectedUser && onlineUsers?.includes(selectedUser.uid);
  const [feedbacks, setFeedbacks] = useState([]);
  const [evalOpen, setEvalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // simple relative time helper
  const timeAgo = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        if (!user?.uid || !selectedUser?.uid) {
          setFeedbacks([]);
          return;
        }
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/feedbacks`,
          { params: { to: user.uid, from: selectedUser.uid } }
        );
        let list = data?.success && Array.isArray(data.data) ? data.data : [];

        // Fetch evaluations for this pair and filter out already evaluated ones
        try {
          const evRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/feedbacks/evaluations`,
            { params: { senderId: selectedUser.uid, receiverId: user.uid } }
          );
          const evals = evRes?.data?.data || [];
          const evaluatedIds = new Set(
            evals.map((e) => String(e.feedbackId || ""))
          );
          list = list.filter(
            (fb) => !evaluatedIds.has(String(fb._id || fb.id))
          );
        } catch (e) {
          // If evaluation API fails, show raw list (non-blocking)
          console.warn("Eval fetch failed", e?.message);
        }

        setFeedbacks(list);
      } catch (err) {
        console.error("Fetch feedbacks error:", err);
        setFeedbacks([]);
      }
    };
    fetchFeedbacks();
  }, [user?.uid, selectedUser?.uid]);

  // simple motion variants for list items
  const listVariants = {
    hidden: { opacity: 0, y: 8 },
    show: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.04,
        type: "spring",
        stiffness: 220,
        damping: 20,
      },
    }),
    exit: { opacity: 0, y: 6 },
  };
  return (
    selectedUser && (
      <div
        className={`w-full relative overflow-y-auto bg-base-100/40 backdrop-blur ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        {/* Profile card */}
        <div className="pt-10 pb-4 flex flex-col items-center gap-3 text-sm mx-auto">
          {selectedUser?.profilePic || selectedUser?.image ? (
            <img
              src={selectedUser.profilePic || selectedUser.image}
              alt=""
              className="w-24 h-24 object-cover rounded-full border border-base-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center">
              <RxAvatar size={40} />
            </div>
          )}

          <h1 className="px-6 text-lg font-semibold mx-auto flex items-center gap-2">
            {isOnline && (
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            )}
            {selectedUser.fullName || selectedUser.name}
          </h1>
          <p className="px-6 mx-auto text-gray-400 text-xs text-center">
            {selectedUser.bio || "No bio provided."}
          </p>
        </div>

        <div className="px-4">
          {/* Shared media */}
          <div className="bg-base-100/70 border border-base-300 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium mb-3">Shared Media</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-video rounded-lg bg-base-200" />
              <div className="aspect-video rounded-lg bg-base-200" />
            </div>
          </div>

          {/* Feedback from this user */}
          <div className="bg-base-100/70 border border-base-300 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium mb-3">Feedback from this user</p>
            {feedbacks.length === 0 ? (
              <p className="text-xs text-secondary/60">No feedback yet.</p>
            ) : (
              <AnimatePresence initial={false}>
                <div className="flex flex-col gap-3">
                  {feedbacks.map((fb, idx) => (
                    <Motion.button
                      key={idx}
                      type="button"
                      custom={idx}
                      variants={listVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => {
                        setSelectedFeedback(fb);
                        setEvalOpen(true);
                      }}
                      className="group relative text-left p-3 rounded-xl border border-base-200 bg-base-50/80 backdrop-blur-sm shadow-sm transition-all hover:bg-base-100/80 hover:shadow-md ring-1 ring-transparent hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-secondary/70 inline-flex items-center gap-1">
                          {timeAgo(fb.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <AiFillStar
                              key={i}
                              className={`${
                                i < (Number(fb.rating) || 0)
                                  ? "text-amber-400"
                                  : "text-base-300"
                              } h-3.5 w-3.5`}
                            />
                          ))}
                          <span className="ml-1 text-secondary/80">
                            {fb.rating}/5
                          </span>
                        </span>
                      </div>

                      {fb.words?.length ? (
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {fb.words.map((w, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[11px] rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/15 transition-colors"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {fb.sentences?.length ? (
                        <div>
                          <p className="text-xs font-bold text-primary">
                            Sentences
                          </p>
                          <ul className="list-disc list-inside text-xs text-black space-y-1">
                            {fb.sentences.map((s, i) => (
                              <li key={i} className="line-clamp-2">
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {fb.notes ? (
                        <div>
                          <p className="text-xs mt-2 font-bold text-primary">
                            Notes
                          </p>
                          <p className=" text-xs italic text-secondary/80 line-clamp-2">
                            {fb.notes}
                          </p>
                        </div>
                      ) : null}

                      {/* subtle gradient sheen on hover */}
                      <span className="pointer-events-none absolute inset-x-0 -top-16 h-16 translate-y-0 opacity-0 bg-gradient-to-b from-primary/10 to-transparent transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-16" />
                    </Motion.button>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
        {/* Evaluation modal */}
        <EvaluationModal
          visible={evalOpen}
          onClose={() => setEvalOpen(false)}
          feedback={selectedFeedback}
          onEvaluated={(payload) => {
            const fid =
              payload?.feedbackId ||
              selectedFeedback?._id ||
              selectedFeedback?.id;
            setFeedbacks((prev) =>
              prev.filter((f) => String(f._id || f.id) !== String(fid))
            );
            setEvalOpen(false);
          }}
        />
      </div>
    )
  );
};

export default RightSidebar;
