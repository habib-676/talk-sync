import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, MessageSquare, Activity, AlertTriangle } from "lucide-react";
import axios from "axios";

// If you already have axiosSecure, you can swap it in here.
const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/admin/overview`, {
          withCredentials: true,
        });
        if (mounted) setStats(res.data.data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Failed to fetch admin overview. Are you logged in as admin?"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-700 dark:text-gray-200">
        Loading admin overview…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="px-4 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats?.usersCount ?? 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Messages Sent",
      value: stats?.messagesCount ?? 0,
      icon: MessageSquare,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Active Users (7d)",
      value: stats?.activeUsers ?? 0,
      icon: Activity,
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Reported Issues",
      value: stats?.reportedIssues ?? 0,
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
          Real-time overview of users, messages, and sessions.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} grid place-items-center text-white shadow-md`}
            >
              <item.icon size={22} />
            </div>
            <h3 className="mt-4 text-gray-700 dark:text-gray-300 text-sm font-medium">
              {item.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {Number(item.value).toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* System Health */}
      <div className="mt-10 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          System Health
        </h2>
        <ul className="text-gray-700 dark:text-gray-300 space-y-2">
          <li>✅ MongoDB Connected</li>
          <li>✅ Socket.IO Active</li>
          <li>✅ JWT Auth Enabled</li>
        </ul>
      </div>
    </div>
  );
}
