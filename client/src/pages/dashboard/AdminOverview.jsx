// src/pages/dashboard/admin/AdminOverview.jsx
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";


function KPI({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow flex flex-col">
      <span className="text-sm text-gray-500">{title}</span>
      <span className="text-2xl font-bold">{(value ?? 0).toLocaleString()}</span>
    </div>
  );
}

function TimeseriesList({ metric, label }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-timeseries", metric],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/analytics/timeseries?metric=${metric}&days=30`);
      if (!res.data?.success) throw new Error(res.data?.message || "Failed timeseries");
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold text-indigo-600 mb-3">{label}</h3>
      {isLoading && <div>Loading...</div>}
      {isError && <div className="text-sm text-red-600">{String(error?.message || "Failed")}</div>}
      {!isLoading && !isError && (
        <div className="text-sm text-gray-700 space-y-1 max-h-60 overflow-auto">
          {data?.map((d) => (
            <div key={d.day} className="flex justify-between border-b py-1">
              <span>{d.day}</span>
              <span className="font-semibold">{d.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TopCard({ title, pick }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-top"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics/top");
      if (!res.data?.success) throw new Error(res.data?.message || "Failed top");
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });

  const list = data ? data[pick] || [] : [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold text-indigo-600 mb-3">{title}</h3>
      {isLoading && <div>Loading...</div>}
      {isError && <div className="text-sm text-red-600">{String(error?.message || "Failed")}</div>}
      {!isLoading && !isError && (
        <ul className="space-y-2">
          {list.map((r, i) => (
            <li key={i} className="flex items-center justify-between border-b py-2">
              <div className="flex items-center gap-3">
                <img
                  src={r?.user?.image || r?.image || "https://placehold.co/40x40"}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{r?.user?.name || r?.name || "Unknown"}</div>
                  <div className="text-xs text-gray-500">{r?.user?.email || r?.email || ""}</div>
                </div>
              </div>
              <div className="text-sm font-semibold">
                {"messages" in r ? r.messages : r.followersCount ?? r.friendsCount ?? 0}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DistributionCard({ field, title }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-distribution", field],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/analytics/distribution?field=${field}`);
      if (!res.data?.success) throw new Error(res.data?.message || "Failed distribution");
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold text-indigo-600 mb-3">{title}</h3>
      {isLoading && <div>Loading...</div>}
      {isError && <div className="text-sm text-red-600">{String(error?.message || "Failed")}</div>}
      {!isLoading && !isError && (
        <ul className="space-y-2 max-h-64 overflow-auto">
          {data?.map((r, idx) => (
            <li key={idx} className="flex justify-between border-b py-1">
              <span className="text-sm">{r.label}</span>
              <span className="text-sm font-semibold">{r.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminOverview() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/overview");
      if (!res.data?.success) throw new Error(res.data?.message || "Failed");
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="space-y-6">
      {isLoading && <div className="p-6 bg-white rounded-md">Loading...</div>}
      {isError && <div className="p-6 bg-red-50 text-red-700 rounded-md">{String(error?.message || "Failed")}</div>}
      {!isLoading && !isError && data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <KPI title="Users" value={data.usersCount} />
            <KPI title="Messages" value={data.messagesCount} />
            <KPI title="Sessions" value={data.sessionsCount} />
            <KPI title="Active (7d)" value={data.activeUsers} />
            <KPI title="Reported Issues" value={data.reportedIssues} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TimeseriesList metric="users" label="New Users (30d)" />
            <TimeseriesList metric="messages" label="Messages (30d)" />
            <TimeseriesList metric="sessions" label="Sessions (30d)" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TopCard title="Top Senders" pick="topSenders" />
            <TopCard title="Most Followed" pick="mostFollowed" />
            <TopCard title="Most Friends" pick="mostFriends" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DistributionCard field="native_language" title="Top Languages" />
            <DistributionCard field="user_country" title="Top Countries" />
            <DistributionCard field="proficiency_level" title="Proficiency Split" />
          </div>
        </>
      )}
    </div>
  );
}
