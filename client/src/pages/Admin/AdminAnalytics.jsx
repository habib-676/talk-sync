import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Users, MessageSquare, CalendarClock, TrendingUp,
  Globe2, Languages, RefreshCw, Download,
} from "lucide-react";
import axiosSecure from "../../hooks/useAxiosSecure";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip as ReTooltip, CartesianGrid, BarChart, Bar,
  PieChart, Pie, Cell,
} from "recharts";

/* ================== Tiny UI primitives ================== */
const Page = ({ children }) => (
  <div className="relative min-h-screen px-6 py-8 bg-gradient-to-br from-[#f8fbff] via-[#f7f7ff] to-[#f6fffb] dark:from-[#0b1020] dark:via-[#0d1224] dark:to-[#0a101e]">
    {/* soft blobs */}
    <div className="pointer-events-none absolute -top-28 -left-24 size-[360px] rounded-full blur-3xl opacity-30 dark:opacity-20 bg-gradient-to-br from-sky-400/50 to-indigo-500/40" />
    <div className="pointer-events-none absolute -bottom-28 -right-24 size-[380px] rounded-full blur-3xl opacity-30 dark:opacity-20 bg-gradient-to-br from-pink-400/50 to-pink-500/40" />
    <div className="mx-auto max-w-7xl">{children}</div>
  </div>
);

const Glass = ({ className = "", children }) => (
  <div
    className={[
      "relative overflow-hidden rounded-3xl",
      "border border-white/60 bg-white/70 backdrop-blur-xl",
      "shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
      "dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
      className,
    ].join(" ")}
  >
    <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_20%_0%,black,transparent)] bg-gradient-to-br from-white/60 via-transparent to-transparent" />
    <div className="relative">{children}</div>
  </div>
);

const Card = ({ title, value, icon, sub }) => (
  <Glass>
    <div className="flex items-center gap-3 p-4">
      <div className="grid size-10 place-items-center rounded-2xl border border-slate-200 bg-white/80 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-slate-600 dark:text-slate-400">{title}</div>
        <div className="truncate text-xl font-semibold text-slate-900 dark:text-white">{value}</div>
        {sub ? <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{sub}</div> : null}
      </div>
    </div>
  </Glass>
);

const Section = ({ title, right, children }) => (
  <Glass>
    <div className="flex items-center justify-between border-b border-white/60 px-4 py-3 dark:border-white/10">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      {right}
    </div>
    <div className="p-4">{children}</div>
  </Glass>
);

const RangeSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
  >
    <option value={7}>Last 7 days</option>
    <option value={30}>Last 30 days</option>
    <option value={90}>Last 90 days</option>
  </select>
);

const Empty = ({ label = "No data available" }) => (
  <div className="h-72 grid place-items-center text-slate-400 text-sm">{label}</div>
);

const Skel = () => (
  <div className="h-72 rounded-2xl bg-slate-100/70 dark:bg-white/10 animate-pulse" />
);

/* ================== Helpers ================== */
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
  const { value, payload: row } = payload[0];
  const total = payload[0].payload.__total || 0;
  const pct = total ? ((value / total) * 100).toFixed(1) : 0;
  return (
    <div className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-white/10 dark:bg-white/10">
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

/* ================== Main ================== */
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

  /* ---------- Charts ---------- */
  const chartGrid = <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />;
  const axisTick = { fontSize: 11, fill: "rgb(100 116 139)" };

  const lineChart = (data, label) => (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data || []} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
          {chartGrid}
          <XAxis dataKey="day" tick={axisTick} />
          <YAxis allowDecimals={false} width={28} tick={axisTick} />
          <ReTooltip />
          <Line
            type="monotone"
            dataKey="count"
            name={label}
            stroke="#2563eb"
            strokeWidth={2.6}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const barChart = (data, xKey, yKey) => (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data || []} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
          {chartGrid}
          <XAxis dataKey={xKey} tick={axisTick} />
          <YAxis allowDecimals={false} width={28} tick={axisTick} />
          <ReTooltip />
          <Bar dataKey={yKey} barSize={28} radius={[8, 8, 0, 0]} fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const piePalette = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#22c55e", "#0ea5e9"];
  const pieChart = (data) => (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ReTooltip content={<PieTooltip />} />
          <Pie data={data || []} dataKey="count" nameKey="label" outerRadius={110} innerRadius={50} stroke="none">
            {(data || []).map((_, i) => (
              <Cell key={i} fill={piePalette[i % piePalette.length]} />
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

  /* ---------- UI ---------- */
  return (
    <Page>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            User growth, engagement, and community insights.
          </p>
        </div>
        <Glass>
          <div className="flex items-center gap-3 p-2">
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
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
            >
              <RefreshCw className="size-4" />
              Refresh
            </button>
            <button
              onClick={() => downloadCSV(`users_timeseries_${range}d.csv`, qUsersTS.data || [])}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
            >
              <Download className="size-4" />
              Export CSV
            </button>
          </div>
        </Glass>
      </div>

      {/* Overview cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total Users"
          value={nf(ov?.usersCount)}
          icon={<Users className="size-5" />}
          sub={ov?.generatedAt ? `as of ${new Date(ov.generatedAt).toLocaleString()}` : null}
        />
        <Card title="Total Messages" value={nf(ov?.messagesCount)} icon={<MessageSquare className="size-5" />} />
        <Card title="Total Sessions" value={nf(ov?.sessionsCount)} icon={<CalendarClock className="size-5" />} />
        <Card
          title="Active (7d / 30d)"
          value={`${nf(ov?.activeUsers7)} / ${nf(ov?.activeUsers30)}`}
          icon={<TrendingUp className="size-5" />}
        />
      </div>

      {/* Time series */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Section title="New Users" right={<span className="text-xs text-slate-500">last {range} days</span>}>
          {qUsersTS.isLoading ? <Skel /> : qUsersTS.data?.length ? lineChart(qUsersTS.data, "Users") : <Empty />}
        </Section>

        <Section title="Messages" right={<span className="text-xs text-slate-500">last {range} days</span>}>
          {qMessagesTS.isLoading ? <Skel /> : qMessagesTS.data?.length ? lineChart(qMessagesTS.data, "Messages") : <Empty />}
        </Section>

        <Section title="Sessions" right={<span className="text-xs text-slate-500">last {range} days</span>}>
          {qSessionsTS.isLoading ? <Skel /> : qSessionsTS.data?.length ? lineChart(qSessionsTS.data, "Sessions") : <Empty />}
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
              className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
            >
              <Download className="size-3.5" />
              CSV
            </button>
          }
        >
          {qTop.isLoading ? <Skel /> : topFollowedData.length ? barChart(topFollowedData, "name", "value") : <Empty />}
        </Section>

        <Section title="Language Distribution" right={<Languages className="size-4 text-slate-500" />}>
          {qLangDist.isLoading ? <Skel /> : qLangDist.data?.length ? pieChart(withTotal(qLangDist.data)) : <Empty />}
        </Section>

        <Section title="Country Distribution" right={<Globe2 className="size-4 text-slate-500" />}>
          {qCountryDist.isLoading ? <Skel /> : qCountryDist.data?.length ? pieChart(withTotal(qCountryDist.data)) : <Empty />}
        </Section>
      </div>
    </Page>
  );
}
