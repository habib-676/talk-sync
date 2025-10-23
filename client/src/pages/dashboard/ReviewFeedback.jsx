// src/pages/dashboard/ReviewFeedback.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ReviewFeedback({ sessionId }) {
  const { user: authUser } = useAuth();
  const me = authUser?.email?.toLowerCase();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [grade, setGrade] = useState(4);
  const [comments, setComments] = useState("");
  const [detailed, setDetailed] = useState([]);

  useEffect(() => {
    if (!sessionId || !me) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND}/sessions/${encodeURIComponent(sessionId)}/feedback?email=${encodeURIComponent(me)}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const json = await res.json();
        if (!json.success) {
          setLoading(false);
          return;
        }
        setFeedback(json.feedback);

        // determine partner and build detailed structure based on partner's sentences
        const participants = json.feedback.participants || Object.keys(json.feedback.responses || {});
        const partner = participants.find(p => p.toLowerCase() !== me);
        if (partner) {
          const partnerResp = json.feedback.responses?.[partner.toLowerCase()];
          if (partnerResp) {
            setDetailed((partnerResp.sentences || []).map(s => ({ word: s.word || "", correction: "", score: 5 })));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId, me]);

  const updateDetail = (idx, key, value) => setDetailed(prev => prev.map((d,i) => i===idx ? {...d, [key]: value} : d));

  const submitReview = async () => {
    if (!feedback) return toast.error("No feedback loaded");
    const participants = feedback.participants || Object.keys(feedback.responses || {});
    const partner = participants.find(p => p.toLowerCase() !== me);
    if (!partner) return toast.error("No partner to review");

    try {
      setLoading(true);
      const body = {
        reviewerEmail: me,
        reviewForEmail: partner,
        grade,
        comments,
        detailed
      };
      const res = await fetch(`${BACKEND}/sessions/${encodeURIComponent(sessionId)}/feedback/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to submit review");
      toast.success("Review submitted");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading review...</div>;
  if (!feedback) return <div>No feedback available yet.</div>;

  const participants = feedback.participants || Object.keys(feedback.responses || {});
  const partner = participants.find(p => p.toLowerCase() !== me);
  const partnerResp = feedback.responses?.[partner?.toLowerCase()];

  return (
    <div className="max-w-3xl mx-auto bg-white/90 p-6 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-3">Review {partner || "partner"}'s feedback</h3>
      {!partnerResp ? <div className="text-sm text-gray-500">Partner hasn't submitted feedback yet.</div> : (
        <>
          <div className="mb-3">
            <div className="text-sm font-medium">Words</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(partnerResp.words || []).map(w => <span key={w} className="px-2 py-1 bg-indigo-100 rounded text-indigo-700 text-sm">{w}</span>)}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium">Sentences & corrections</div>
            <div className="space-y-2 mt-2">
              {(partnerResp.sentences || []).map((s, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">{s.word}</div>
                  <div className="text-sm">{s.sentence}</div>
                  <div className="mt-2 grid grid-cols-12 gap-2 items-center">
                    <input type="number" min="1" max="5" value={detailed[i]?.score || 5} onChange={e => updateDetail(i, "score", Number(e.target.value))} className="col-span-2 input input-sm" />
                    <input placeholder="correction / suggestion" value={detailed[i]?.correction || ""} onChange={e => updateDetail(i, "correction", e.target.value)} className="col-span-10 input input-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-sm font-medium">Overall Grade: {grade}</div>
            <input type="range" min="1" max="5" value={grade} onChange={e => setGrade(Number(e.target.value))} />
            <textarea className="textarea textarea-bordered w-full mt-2" placeholder="Comments" value={comments} onChange={e => setComments(e.target.value)} />
          </div>

          <div className="flex gap-2">
            <button onClick={submitReview} className="btn btn-primary">Submit Review</button>
            <button onClick={() => { setComments(""); setGrade(4); setDetailed(detailed.map(d => ({...d, correction:"", score:5}))) }} className="btn btn-ghost">Reset</button>
          </div>
        </>
      )}
    </div>
  );
}
