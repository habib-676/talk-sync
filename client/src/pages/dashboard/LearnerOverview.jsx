import React, { useEffect, useCallback, useRef, useState } from "react";
import NextSessionCard from "../../components/dashboard/widgets/NextSessionCard";
import ProgressDonut from "../../components/dashboard/widgets/ProgressDonut";
import SuggestedPartners from "../../components/dashboard/widgets/SuggestedPartners";
import useAuth from "../../hooks/useAuth";
import { RefreshCw } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* useInViewport - simple intersection observer */
function useInViewport(ref, options = { threshold: 0.12 }) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), options);
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, options]);
  return inView;
}

/* AnimatedCard: pastel background, subtle 3D + entrance animation */
function AnimatedCard({ children, bg = "bg-white/90", className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInViewport(ref);
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, delay, ease: [0.2, 0.9, 0.2, 1] },
      });
    } else {
      controls.start({ opacity: 0, y: 16, scale: 0.995, transition: { duration: 0.5 } });
    }
  }, [inView, controls, delay]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial={{ opacity: 0, y: 16, scale: 0.995 }}
      whileHover={{ scale: 1.02, translateY: -4 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={`rounded-2xl p-4 shadow-lg ${bg} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Overview() {
  const { user: authUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const email = (authUser?.email || "").toLowerCase().trim();

  const fetchSummary = useCallback(async () => {
    if (!email) {
      setErr("Sign in to view your dashboard");
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${BACKEND}/dashboard/overview?email=${encodeURIComponent(email)}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed");
      setSummary(json.summary || {});
    } catch (e) {
      console.error("Overview fetch error", e);
      setErr(e.message || "Failed to fetch overview");
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) return <div className="p-6">Loading overview...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">A concise snapshot of your progress and next steps.</p>
        </div>

        <button
          onClick={fetchSummary}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 hover:shadow-md transition mt-2 sm:mt-0"
          aria-label="Refresh overview"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Session */}
          <AnimatedCard bg="bg-indigo-50/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-slate-800 font-semibold text-lg sm:text-xl">
                {summary.nextSession?.title || "Next session — keep consistent for better progress."}
              </div>
              <a
                href="/dashboard/sessions"
                className="px-4 py-2 rounded-full bg-indigo-600 text-white shadow-sm hover:brightness-95 transition"
              >
                Go to Sessions
              </a>
            </div>

            <div className="mt-4">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-xl p-3 bg-white/90 shadow-lg mt-4"
              >
                <NextSessionCard nextSession={summary.nextSession} />
              </motion.div>
            </div>
          </AnimatedCard>

          {/* Small stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AnimatedCard bg="bg-rose-50/40" className="h-full" delay={0.06}>
              <StatInner label="Sessions this week" value={summary.sessionsThisWeek ?? 0} hint="Completed / active sessions" icon="🗓" />
            </AnimatedCard>
            <AnimatedCard bg="bg-amber-50/40" className="h-full" delay={0.08}>
              <StatInner label="Active learners" value={(summary.learners ?? 0).toLocaleString()} hint="Community size" icon="👥" />
            </AnimatedCard>
            <AnimatedCard bg="bg-emerald-50/40" className="h-full" delay={0.1}>
              <StatInner label="Badges earned" value={(summary.badges || []).length ?? 0} hint="Recognitions you've got" icon="🏅" />
            </AnimatedCard>
          </div>

          {/* Suggested partners */}
          <AnimatedCard bg="bg-white/90" className="p-4" delay={0.12}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-800">Suggested partners</h3>
              <div className="text-sm text-slate-500">Matches based on languages</div>
            </div>

            <div className="mt-4 overflow-x-auto py-1">
              <div className="flex gap-4">
                {summary.suggestedPartners?.length ? (
                  summary.suggestedPartners.map((p) => (
                    <motion.div key={p.email} whileHover={{ scale: 1.03 }} className=" p-3 rounded-xl bg-white/95 shadow-sm">
                      <SuggestedPartners partners={[p]} />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">No suggestions</div>
                )}
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Right column */}
        <aside className="space-y-6 mt-6 lg:mt-0">
          <AnimatedCard bg="bg-sky-50/40 text-center" className="p-4" delay={0.14}>
            <h3 className="text-sm font-medium text-slate-700">Progress</h3>
            <div className="mt-4">
              <ProgressDonut points={summary.points ?? 0} />
            </div>
            <div className="mt-3 text-xs text-slate-500">Points come from completed sessions and peer-reviewed feedback.</div>
          </AnimatedCard>

          <AnimatedCard bg="bg-white/90 p-4" delay={0.16}>
            <h4 className="text-sm font-medium text-slate-700">Quick stats</h4>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <QuickStat label="Countries" value={summary.countries ?? 0} color="bg-violet-50/50" />
              <QuickStat label="Languages" value={summary.languages ?? 0} color="bg-lime-50/50" />
              <QuickStat label="Points" value={summary.points ?? 0} color="bg-cyan-50/50" />
              <QuickStat label="Badges" value={(summary.badges || []).length ?? 0} color="bg-amber-50/50" />
            </div>
          </AnimatedCard>
        </aside>
      </div>
    </div>
  );
}

/* small subcomponents */
function StatInner({ label, value = 0, hint, icon }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="mt-2 text-2xl font-semibold text-slate-800">{value ?? "—"}</div>
        {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
      </div>
      <div className="text-3xl ml-2">{icon}</div>
    </div>
  );
}

function QuickStat({ label, value, color = "bg-slate-50/50" }) {
  return (
    <div className={`${color} p-3 rounded flex flex-col items-start`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold text-slate-800 mt-1">{value ?? "—"}</div>
    </div>
  );
}

