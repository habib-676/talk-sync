import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Users,
  MessageSquare,
  CalendarClock,
  TrendingUp,
  Globe2,
  Languages,
  RefreshCw,
  Download,
} from "lucide-react";
import axiosSecure from "../../hooks/useAxiosSecure";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ---------- Utility Components ----------
const Card = ({ title, value, icon }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3">
    <div className="rounded-xl border border-slate-200 p-2 bg-slate-50">{icon}</div>
    <div>
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  </div>
);

const Section = ({ title, children, right }) => (
  <div className="rounded-2xl border border-slate-200 bg-white">
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
      <h3 className="text-sm font-semibold">{title}</h3>
      {right}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const RangeSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
  >
    <option value={7}>Last 7 days</option>
    <option value={30}>Last 30 days</option>
    <option value={90}>Last 90 days</option>
  </select>
);

const Empty = ({ label = "No data available" }) => (
  <div className="h-72 grid place-items-center text-slate-400 text-sm">{label}</div>
);

// ---------- Helpers ----------
const nf = (n) => Intl.NumberFormat().format(n ?? 0);

const toCSV = (rows) => {
  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")].concat(
    rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))
  );
  return lines.join("\n");
};

const downloadCSV = (filename, rows) => {
  const blob = new Blob([toCSV(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: row } = payload[0];
  const total = payload[0].payload.__total || 0;
  const pct = total ? ((value / total) * 100).toFixed(1) : 0;
  return (
    <div className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">
      <div className="font-medium">{row.label}</div>
      <div>
        {value} ({pct}%)
      </div>
    </div>
  );
};

const withTotal = (arr = []) => {
  const total = arr.reduce((s, r) => s + (r.count || 0), 0);
  return arr.map((r) => ({ ...r, __total: total }));
};

// ---------- Main ----------
export default function AdminAnalytics() {
  const [range, setRange] = useState(30);

  // Overview
  const qOverview = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics/overview");
      return res.data.data;
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to load overview"),
  });

  // Time series
  const qUsersTS = useQuery({
    queryKey: ["analytics-ts", "users", range],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics/timeseries", {
        params: { metric: "users", days: range },
      });
      return res.data.data;
    },
    keepPreviousData: true,
  });

  const qMessagesTS = useQuery({
    queryKey: ["analytics-ts", "messages", range],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics/timeseries", {
        params: { metric: "messages", days: range },
      });
      return res.data.data;
    },
    keepPreviousData: true,
  });

  const qSessionsTS = useQuery({
    queryKey: ["analytics-ts", "sessions", range],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics/timeseries", {
        params: { metric: "sessions", days: range },
      });
      return res.data.data;
    },
    keepPreviousData: true,
  });

  // Leaders & distributions
  const qTop = useQuery({
    queryKey: ["analytics-top"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics/top");
      return res.data.data;
    },
  });

  const qLangDist = useQuery({
    queryKey: ["analytics-dist", "native_language"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics/distribution", {
        params: { field: "native_language" },
      });
      return res.data.data;
    },
  });

  const qCountryDist = useQuery({
    queryKey: ["analytics-dist", "user_country"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics/distribution", {
        params: { field: "user_country" },
      });
      return res.data.data;
    },
  });

  const ov = qOverview.data;

  const lineChart = (data, label) => (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data || []} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} width={28} tick={{ fontSize: 11 }} />
          <ReTooltip />
          <Line type="monotone" dataKey="count" strokeWidth={2} dot={false} name={label} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const barChart = (data, xKey, yKey) => (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data || []} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} width={28} tick={{ fontSize: 11 }} />
          <ReTooltip />
          <Bar dataKey={yKey} barSize={28} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const pieChart = (data) => (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ReTooltip content={<PieTooltip />} />
          <Pie data={data || []} dataKey="count" nameKey="label" outerRadius={110}>
            {(data || []).map((_, i) => (
              <Cell key={i} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const topFollowedData = useMemo(
    () =>
      (qTop.data?.mostFollowed || []).map((u) => ({
        name: u.name || u.email,
        value: u.followersCount,
      })),
    [qTop.data]
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm">
            User growth, engagement, and community insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RangeSelect value={range} onChange={setRange} />
          <button
            onClick={() => {
              const p = toast.loading("Refreshing…");
              Promise.all([
                qOverview.refetch(),
                qUsersTS.refetch(),
                qMessagesTS.refetch(),
                qSessionsTS.refetch(),
                qTop.refetch(),
                qLangDist.refetch(),
                qCountryDist.refetch(),
              ]).finally(() => toast.dismiss(p));
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            <RefreshCw className="size-4" />
            Refresh
          </button>
          <button
            onClick={() => downloadCSV(`users_timeseries_${range}d.csv`, qUsersTS.data || [])}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Overview cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total Users"
          value={nf(ov?.usersCount)}
          icon={<Users className="size-5 text-slate-700" />}
        />
        <Card
          title="Total Messages"
          value={nf(ov?.messagesCount)}
          icon={<MessageSquare className="size-5 text-slate-700" />}
        />
        <Card
          title="Total Sessions"
          value={nf(ov?.sessionsCount)}
          icon={<CalendarClock className="size-5 text-slate-700" />}
        />
        <Card
          title="Active (7d / 30d)"
          value={`${nf(ov?.activeUsers7)} / ${nf(ov?.activeUsers30)}`}
          icon={<TrendingUp className="size-5 text-slate-700" />}
        />
      </div>

      {/* Time series rows */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Section
          title="New Users"
          right={<span className="text-xs text-slate-500">last {range} days</span>}
        >
          {qUsersTS.isLoading ? (
            <Empty label="Loading…" />
          ) : qUsersTS.data?.length ? (
            lineChart(qUsersTS.data, "Users")
          ) : (
            <Empty />
          )}
        </Section>

        <Section
          title="Messages"
          right={<span className="text-xs text-slate-500">last {range} days</span>}
        >
          {qMessagesTS.isLoading ? (
            <Empty label="Loading…" />
          ) : qMessagesTS.data?.length ? (
            lineChart(qMessagesTS.data, "Messages")
          ) : (
            <Empty />
          )}
        </Section>

        <Section
          title="Sessions"
          right={<span className="text-xs text-slate-500">last {range} days</span>}
        >
          {qSessionsTS.isLoading ? (
            <Empty label="Loading…" />
          ) : qSessionsTS.data?.length ? (
            lineChart(qSessionsTS.data, "Sessions")
          ) : (
            <Empty />
          )}
        </Section>
      </div>

      {/* Leaders & distributions */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Section
          title="Top Followed Users"
          right={
            <button
              onClick={() =>
                downloadCSV(
                  `top_followed.csv`,
                  (qTop.data?.mostFollowed || []).map((u) => ({
                    name: u.name || "",
                    email: u.email || "",
                    followers: u.followersCount || 0,
                  }))
                )
              }
              className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800"
            >
              <Download className="size-3.5" />
              CSV
            </button>
          }
        >
          {topFollowedData.length ? (
            barChart(topFollowedData, "name", "value")
          ) : (
            <Empty />
          )}
        </Section>

        <Section
          title="Language Distribution"
          right={<Languages className="size-4 text-slate-500" />}
        >
          {qLangDist.isLoading ? (
            <Empty label="Loading…" />
          ) : qLangDist.data?.length ? (
            pieChart(withTotal(qLangDist.data))
          ) : (
            <Empty />
          )}
        </Section>

        <Section
          title="Country Distribution"
          right={<Globe2 className="size-4 text-slate-500" />}
        >
          {qCountryDist.isLoading ? (
            <Empty label="Loading…" />
          ) : qCountryDist.data?.length ? (
            pieChart(withTotal(qCountryDist.data))
          ) : (
            <Empty />
          )}
        </Section>
      </div>
    </div>
  );
}
