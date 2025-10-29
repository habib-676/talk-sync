import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import EvaluationModal from "../../modals/EvaluationModal";

const api = import.meta.env.VITE_API_URL;

const cx = (...c) => c.filter(Boolean).join(" ");

export default function FeedbackTable() {
  const { user: authUser } = useAuth();
  const myUid = authUser?.uid;
  const [tab, setTab] = useState("given"); // given | received
  const [loading, setLoading] = useState(true);
  const [given, setGiven] = useState([]);
  const [received, setReceived] = useState([]);
  const [usersMap, setUsersMap] = useState({}); // uid -> { name, email, image }

  const [viewOpen, setViewOpen] = useState(false);
  const [viewEval, setViewEval] = useState(null);

  // Names
  const nameOf = (uid) => {
    const u = usersMap[uid];
    return (
      u?.name ||
      u?.displayName ||
      u?.email ||
      (uid ? String(uid).slice(0, 8) : "")
    );
  };

  useEffect(() => {
    if (!myUid) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // fetch both sets and users
        const [g, r, u] = await Promise.all([
          axios
            .get(`${api}/feedbacks/evaluations`, {
              params: { receiverId: myUid },
            })
            .then((res) => res?.data?.data || []),
          axios
            .get(`${api}/feedbacks/evaluations`, {
              params: { senderId: myUid },
            })
            .then((res) => res?.data?.data || []),
          axios
            .get(`${api}/users`)
            .then((res) =>
              Array.isArray(res.data) ? res.data : res.data?.users || []
            ),
        ]);
        const map = {};
        for (const usr of u) {
          if (usr?.uid) map[usr.uid] = usr;
        }
        if (mounted) {
          setGiven(g);
          setReceived(r);
          setUsersMap(map);
        }
      } catch (e) {
        console.error("Failed to load evaluations", e);
        if (mounted) {
          setGiven([]);
          setReceived([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [myUid]);

  const list = tab === "given" ? given : received;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-400">
            Feedback
          </h2>
          <p className="text-sm text-gray-500">All evaluations and marks</p>
        </div>
        <div className="bg-white/60 rounded-2xl p-1 flex gap-1 shadow-sm">
          {[
            { key: "given", label: "Given by me" },
            { key: "received", label: "Received by me" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cx(
                "px-3 py-1.5 rounded-xl text-sm transition",
                tab === t.key
                  ? "bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-gray-600">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">{tab === "given" ? "For" : "By"}</th>
                <th className="px-4 py-3">Words ✔</th>
                <th className="px-4 py-3">Sentences ✔</th>
                <th className="px-4 py-3">Total Points</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : list.length ? (
                list.map((row, i) => {
                  const wordsC =
                    row?.breakdown?.wordsCorrect ??
                    (row.words || []).filter((w) => w.correct).length;
                  const sentC =
                    row?.breakdown?.sentencesCorrect ??
                    (row.sentences || []).filter((s) => s.correct).length;
                  const partner =
                    tab === "given" ? row.senderId : row.receiverId;
                  return (
                    <tr
                      key={i}
                      className={cx(
                        "border-t",
                        i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      )}
                    >
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(row.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {nameOf(partner)}
                      </td>
                      <td className="px-4 py-3">{wordsC}</td>
                      <td className="px-4 py-3">{sentC}</td>
                      <td className="px-4 py-3 font-semibold">
                        {row.totalMarks ?? wordsC + sentC}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setViewEval(row);
                            setViewOpen(true);
                          }}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow hover:brightness-105"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={6}>
                    No evaluations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Read-only modal view */}
      <AnimatePresence>
        {viewOpen && viewEval && (
          <EvaluationModal
            visible={viewOpen}
            onClose={() => {
              setViewOpen(false);
              setViewEval(null);
            }}
            readOnly
            evaluation={viewEval}
            feedback={{
              from: viewEval.senderId,
              to: viewEval.receiverId,
              words: (viewEval.words || []).map((w) => w.text),
              sentences: (viewEval.sentences || []).map((s) => s.text),
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
