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

// If you already have axiosSecure, swap it in here.
const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL: API_BASE, withCredentials: true });

// ---------------- Helpers ----------------
const fmt = (n) => Number(n ?? 0).toLocaleString();
const shortDay = (d) => (d?.slice?.(5) ?? d); // "YYYY-MM-DD" -> "MM-DD"

// simple skeleton block
const Skel = ({ h = 64 }) => (
  <div className="w-full rounded-xl bg-gray-200/70 dark:bg-gray-700/50 animate-pulse" style={{ height: h }} />
);

// compose timeseries merge helper for multi-series charts
const mergeSeries = (users = [], messages = [], sessions = []) => {
  // all days from any series
  const days = Array.from(
    new Set([
      ...users.map((d) => d.day),
      ...messages.map((d) => d.day),
      ...sessions.map((d) => d.day),
    ])
  ).sort();
  const map = (arr) => Object.fromEntries(arr.map((x) => [x.day, x.count]));
  const u = map(users); const m = map(messages); const s = map(sessions);
  return days.map((day) => ({ day, users: u[day] ?? 0, messages: m[day] ?? 0, sessions: s[day] ?? 0 }));
};

// ---------------- Data hooks ----------------
const useAdminOverview = () =>
  useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => (await api.get("/admin/overview")).data.data,
  });

const useAnalyticsOverview = () =>
  useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => (await api.get("/admin/analytics/overview")).data.data,
  });

const useTimeseries = (metric, days = 30) =>
  useQuery({
    queryKey: ["timeseries", metric, days],
    queryFn: async () => (await api.get("/admin/analytics/timeseries", { params: { metric, days } })).data.data,
  });

const useTop = () =>
  useQuery({
    queryKey: ["analytics-top"],
    queryFn: async () => (await api.get("/admin/analytics/top")).data.data,
  });

const useDistribution = (field = "native_language") =>
  useQuery({
    queryKey: ["analytics-dist", field],
    queryFn: async () => (await api.get("/admin/analytics/distribution", { params: { field } })).data.data,
  });

// ---------------- Component ----------------
export default function AdminHome() {
  const { data: overview, isLoading: loadingOverview, error: errOverview } = useAdminOverview();
  const { data: aov, isLoading: loadingAov, error: errAov } = useAnalyticsOverview();

  const { data: users30, isLoading: lu } = useTimeseries("users", 30);
  const { data: msgs30, isLoading: lm } = useTimeseries("messages", 30);
  const { data: sess30, isLoading: ls } = useTimeseries("sessions", 30);

  const { data: top, isLoading: lt } = useTop();
  const { data: distLang, isLoading: ld } = useDistribution("native_language");

  const timeseries = useMemo(() => mergeSeries(users30, msgs30, sess30), [users30, msgs30, sess30]);

  // error UI (auth / permission will show here)
  const errorMsg =
    errOverview?.response?.data?.message ||
    errAov?.response?.data?.message ||
    errOverview?.message ||
    errAov?.message;

  // KPI cards
  const cards = [
    {
      title: "Total Users",
      value: overview?.usersCount ?? 0,
      sub: aov?.newUsers30 ? `+${fmt(aov.newUsers30)} last 30d` : "",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Messages Sent",
      value: overview?.messagesCount ?? 0,
      sub: msgs30?.reduce?.((t, x) => t + x.count, 0) ? `${fmt(msgs30.reduce((t, x) => t + x.count, 0))} in 30d` : "",
      icon: MessageSquare,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Active Users (7d)",
      value: overview?.activeUsers ?? 0,
      sub: aov?.activeUsers7 ? `Active: ${fmt(aov.activeUsers7)}` : "",
      icon: Activity,
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Reported Issues",
      value: overview?.reportedIssues ?? 0,
      sub: "Placeholder",
      icon: AlertTriangle,
      color: "from-red-500 to-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          TalkSync Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Live overview of users, messages, sessions & engagement trends.
        </p>
      </motion.div>

      {/* Error */}
      {errorMsg && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(loadingOverview || loadingAov)
          ? Array.from({ length: 4 }).map((_, i) => <Skel key={i} h={110} />)
          : cards.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} grid place-items-center text-white shadow-md`}>
                    <item.icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{item.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight truncate">
                      {fmt(item.value)}
                    </p>
                    {!!item.sub && <p className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</p>}
                  </div>
                </div>
              </motion.div>
            ))
        }
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 30-day trend (Users/Messages/Sessions) */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              30-Day Activity Trend
            </h2>
            <span className="text-xs text-gray-500">Users / Messages / Sessions</span>
          </div>
          {(lu || lm || ls) ? (
            <Skel h={280} />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeseries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickFormatter={shortDay} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(v) => fmt(v)} labelFormatter={(l) => `Day: ${l}`} />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" name="Users" dot={false} />
                  <Line type="monotone" dataKey="messages" stroke="#10b981" name="Messages" dot={false} />
                  <Line type="monotone" dataKey="sessions" stroke="#8b5cf6" name="Sessions" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Distribution (Top Languages) */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Top Native Languages
          </h2>
          {ld ? (
            <Skel h={280} />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distLang?.slice?.(0, 10) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" interval={0} angle={-30} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Bar dataKey="count" fill="#64748b" name="Learners" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboards */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Senders */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Top Message Senders</h2>
          {lt ? (
            <Skel h={210} />
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {(top?.topSenders || []).slice(0, 6).map((row, i) => (
                <li key={i} className="py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {row?.user?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {row?.user?.email || "—"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {fmt(row.messages)}
                  </span>
                </li>
              ))}
              {!top?.topSenders?.length && <p className="text-sm text-gray-500">No data</p>}
            </ul>
          )}
        </div>

        {/* Most Followed */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Most Followed Users</h2>
          {lt ? (
            <Skel h={210} />
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {(top?.mostFollowed || []).slice(0, 6).map((u, i) => (
                <li key={i} className="py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {fmt(u.followersCount)}
                  </span>
                </li>
              ))}
              {!top?.mostFollowed?.length && <p className="text-sm text-gray-500">No data</p>}
            </ul>
          )}
        </div>

        {/* Most Friends */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Most Friends</h2>
          {lt ? (
            <Skel h={210} />
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {(top?.mostFriends || []).slice(0, 6).map((u, i) => (
                <li key={i} className="py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {fmt(u.friendsCount)}
                  </span>
                </li>
              ))}
              {!top?.mostFriends?.length && <p className="text-sm text-gray-500">No data</p>}
            </ul>
          )}
        </div>
      </div>

      {/* System Health */}
      <div className="mt-10 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">System Health</h2>
        {(loadingOverview && loadingAov) ? (
          <Skel h={80} />
        ) : (
          <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
            <li>✅ MongoDB Connected</li>
            <li>✅ Socket.IO Active</li>
            <li>✅ JWT Auth Enabled</li>
            <li>🕒 Last Generated: <span className="font-medium">{aov?.generatedAt ? new Date(aov.generatedAt).toLocaleString() : "—"}</span></li>
          </ul>
        )}
      </div>
    </div>
  );
}
