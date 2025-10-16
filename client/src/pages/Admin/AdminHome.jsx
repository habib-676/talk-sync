import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users, MessageSquare, Activity, AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar,
} from "recharts";

// ---------------- Config ----------------
const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL: API_BASE, withCredentials: true });
const fmt = (n) => Number(n ?? 0).toLocaleString();
const shortDay = (d) => (d?.slice?.(5) ?? d);

// ---------------- Helpers ----------------
const mergeSeries = (users = [], messages = [], sessions = []) => {
  const days = Array.from(new Set([
    ...users.map((d) => d.day),
    ...messages.map((d) => d.day),
    ...sessions.map((d) => d.day),
  ])).sort();
  const map = (arr) => Object.fromEntries(arr.map((x) => [x.day, x.count]));
  const u = map(users); const m = map(messages); const s = map(sessions);
  return days.map((day) => ({ day, users: u[day] ?? 0, messages: m[day] ?? 0, sessions: s[day] ?? 0 }));
};

const Skel = ({ h = 64, rounded = "rounded-2xl" }) => (
  <div className={`w-full ${rounded} bg-gradient-to-br from-gray-200/70 to-gray-300/60 dark:from-gray-700/40 dark:to-gray-800/40 animate-pulse`} style={{ height: h }} />
);

// ---------------- Data hooks ----------------
const useAdminOverview = () =>
  useQuery({ queryKey: ["admin-overview"], queryFn: async () => (await api.get("/admin/overview")).data.data });

const useAnalyticsOverview = () =>
  useQuery({ queryKey: ["analytics-overview"], queryFn: async () => (await api.get("/admin/analytics/overview")).data.data });

const useTimeseries = (metric, days = 30) =>
  useQuery({ queryKey: ["timeseries", metric, days], queryFn: async () => (await api.get("/admin/analytics/timeseries", { params: { metric, days } })).data.data });

const useTop = () =>
  useQuery({ queryKey: ["analytics-top"], queryFn: async () => (await api.get("/admin/analytics/top")).data.data });

const useDistribution = (field = "native_language") =>
  useQuery({ queryKey: ["analytics-dist", field], queryFn: async () => (await api.get("/admin/analytics/distribution", { params: { field } })).data.data });

// ---------------- Tiny presentational bits ----------------
const GlassCard = ({ children, className = "" }) => (
  <div className={[
    "relative overflow-hidden",
    "rounded-3xl border border-white/60 dark:border-white/10",
    "bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl",
    "shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
    className,
  ].join(" ")}>
    {/* subtle gradient sheen */}
    <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_20%_0%,black,transparent)] bg-gradient-to-br from-white/60 via-transparent to-transparent" />
    <div className="relative">{children}</div>
  </div>
);

const KpiCard = ({ icon: Icon, title, value, sub, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="group"
  >
    <GlassCard className="p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div className={`relative grid size-14 place-items-center rounded-2xl text-white shadow-lg shadow-black/10
          bg-gradient-to-br ${color}`}>
          <Icon size={22} />
          <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition" />
        </div>
        <div className="min-w-0">
          <p className="text-xs tracking-wide text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-[28px] leading-tight font-semibold text-gray-900 dark:text-white truncate">{fmt(value)}</p>
          {!!sub && <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>}
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

// ---------------- Main ----------------
export default function AdminHome() {
  const { data: overview, isLoading: loadingOverview, error: errOverview } = useAdminOverview();
  const { data: aov, isLoading: loadingAov, error: errAov } = useAnalyticsOverview();

  const { data: users30, isLoading: lu } = useTimeseries("users", 30);
  const { data: msgs30, isLoading: lm } = useTimeseries("messages", 30);
  const { data: sess30, isLoading: ls } = useTimeseries("sessions", 30);

  const { data: top, isLoading: lt } = useTop();
  const { data: distLang, isLoading: ld } = useDistribution("native_language");

  const timeseries = useMemo(() => mergeSeries(users30, msgs30, sess30), [users30, msgs30, sess30]);

  const errorMsg =
    errOverview?.response?.data?.message ||
    errAov?.response?.data?.message ||
    errOverview?.message ||
    errAov?.message;

  const cards = [
    {
      title: "Total Users",
      value: overview?.usersCount ?? 0,
      sub: aov?.newUsers30 ? `+${fmt(aov.newUsers30)} last 30d` : "",
      icon: Users,
      color: "from-sky-500 to-indigo-600",
    },
    {
      title: "Messages Sent",
      value: overview?.messagesCount ?? 0,
      sub: msgs30?.length ? `${fmt(msgs30.reduce((t, x) => t + x.count, 0))} in 30d` : "",
      icon: MessageSquare,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Active Users (7d)",
      value: overview?.activeUsers ?? 0,
      sub: aov?.activeUsers7 ? `Active: ${fmt(aov.activeUsers7)}` : "",
      icon: Activity,
      color: "from-violet-500 to-fuchsia-600",
    },
    {
      title: "Reported Issues",
      value: overview?.reportedIssues ?? 0,
      sub: "Internal triage",
      icon: AlertTriangle,
      color: "from-rose-500 to-orange-500",
    },
  ];

  return (
    <div className="relative min-h-screen p-6 bg-gradient-to-br from-[#f8fbff] via-[#f7f7ff] to-[#f6fffb] dark:from-[#0b1020] dark:via-[#0d1224] dark:to-[#0a101e]">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-[340px] rounded-full blur-3xl opacity-30 dark:opacity-20 bg-gradient-to-br from-sky-400/40 to-indigo-500/40" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-[380px] rounded-full blur-3xl opacity-30 dark:opacity-20 bg-gradient-to-br from-teal-400/40 to-emerald-500/40" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            TalkSync Admin
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Elegant insights across your users, messages & sessions.
          </p>
        </div>
      </motion.div>

      {/* Error */}
      {errorMsg && (
        <GlassCard className="mb-6 p-4 border-red-200/60 dark:border-red-400/20">
          <div className="text-red-700 dark:text-red-300 text-sm">{errorMsg}</div>
        </GlassCard>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {(loadingOverview || loadingAov)
          ? Array.from({ length: 4 }).map((_, i) => <Skel key={i} h={120} />)
          : cards.map((c) => (
              <KpiCard key={c.title} icon={c.icon} title={c.title} value={c.value} sub={c.sub} color={c.color} />
            ))
        }
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Trend */}
        <GlassCard className="xl:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">30-Day Activity Trend</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">Users · Messages · Sessions</span>
          </div>
          {(lu || lm || ls) ? (
            <Skel h={320} />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeseries}>
                  <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.25} />
                  <XAxis dataKey="day" tickFormatter={shortDay} tickMargin={10} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(v) => fmt(v)} labelFormatter={(l) => `Day: ${l}`} />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} name="Users" dot={false} />
                  <Line type="monotone" dataKey="messages" stroke="#059669" strokeWidth={2} name="Messages" dot={false} />
                  <Line type="monotone" dataKey="sessions" stroke="#7c3aed" strokeWidth={2} name="Sessions" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        {/* Distribution */}
        <GlassCard className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Top Native Languages</h2>
          {ld ? (
            <Skel h={320} />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distLang?.slice?.(0, 10) || []}>
                  <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.25} />
                  <XAxis dataKey="label" interval={0} angle={-30} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Bar dataKey="count" fill="#334155" name="Learners" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Leaderboards */}
      <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Leaderboard
          title="Top Message Senders"
          loading={lt}
          rows={(top?.topSenders || []).slice(0, 6).map((r) => ({
            name: r?.user?.name || "Unknown User",
            email: r?.user?.email || "—",
            metric: r.messages,
          }))}
        />
        <Leaderboard
          title="Most Followed Users"
          loading={lt}
          rows={(top?.mostFollowed || []).slice(0, 6).map((u) => ({
            name: u.name, email: u.email, metric: u.followersCount,
          }))}
        />
        <Leaderboard
          title="Most Friends"
          loading={lt}
          rows={(top?.mostFriends || []).slice(0, 6).map((u) => ({
            name: u.name, email: u.email, metric: u.friendsCount,
          }))}
        />
      </div>

      {/* System Health */}
      <GlassCard className="mt-10 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">System Health</h2>
        {(loadingOverview && loadingAov) ? (
          <Skel h={80} />
        ) : (
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5">
            <li>✅ MongoDB Connected</li>
            <li>✅ Socket.IO Active</li>
            <li>✅ JWT Auth Enabled</li>
            <li>
              🕒 Last Generated:{" "}
              <span className="font-medium">
                {aov?.generatedAt ? new Date(aov.generatedAt).toLocaleString() : "—"}
              </span>
            </li>
          </ul>
        )}
      </GlassCard>
    </div>
  );
}

// ---------------- Subcomponents ----------------
function Leaderboard({ title, loading, rows }) {
  return (
    <GlassCard className="p-5">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h2>
      {loading ? (
        <Skel h={220} />
      ) : rows?.length ? (
        <ul className="divide-y divide-gray-200/60 dark:divide-white/10">
          {rows.map((r, i) => (
            <li key={i} className="py-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{r.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.email}</p>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{fmt(r.metric)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No data</p>
      )}
    </GlassCard>
  );
}
