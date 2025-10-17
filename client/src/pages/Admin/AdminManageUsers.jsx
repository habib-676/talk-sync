import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2, Search, ShieldCheck, UserX, UserCheck, Trash2, RefreshCw,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";

/* --------------------- tiny UI primitives --------------------- */
const GlassCard = ({ className = "", children }) => (
  <div
    className={[
      "relative overflow-hidden rounded-3xl",
      "border border-white/60 bg-white/70 backdrop-blur-xl",
      "shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
      ":border-white/10 :bg-white/[0.06] :shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
      className,
    ].join(" ")}
  >
    <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_20%_0%,black,transparent)] bg-gradient-to-br from-white/60 via-transparent to-transparent" />
    <div className="relative">{children}</div>
  </div>
);

const RoleBadge = ({ role }) => (
  <span
    className={[
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border",
      role === "admin"
        ? "border-purple-200 bg-purple-50 text-purple-700"
        : "border-slate-200 bg-slate-50 text-slate-700",
    ].join(" ")}
    title={role === "admin" ? "Administrator" : "Learner"}
  >
    <ShieldCheck className="size-3.5" />
    {role}
  </span>
);

const StatusDot = ({ status = "active" }) => (
  <span className="inline-flex items-center gap-2">
    <span
      className={`inline-block size-2 rounded-full ${
        status === "active" ? "bg-emerald-500" : "bg-rose-500"
      }`}
    />
    <span className="text-xs capitalize text-slate-600">{status}</span>
  </span>
);

const SkelRow = () => (
  <tr>
    <td colSpan={8} className="px-4 py-3">
      <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100/70 :bg-white/10" />
    </td>
  </tr>
);

const EmptyState = ({ onRefresh }) => (
  <div className="p-12 text-center">
    <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500 :bg-white/10">
      <Search className="size-5" />
    </div>
    <h3 className="text-base font-semibold text-slate-800 :text-slate-100">
      No users found
    </h3>
    <p className="mt-1 text-sm text-slate-500">
      Try adjusting filters or search terms.
    </p>
    <button
      onClick={onRefresh}
      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 :border-white/10 :bg-white/5 :text-slate-200"
    >
      <RefreshCw className="size-4" /> Refresh
    </button>
  </div>
);

/* --------------------- confirm helper --------------------- */
const confirmAction = async ({ title, text, confirmButtonText, icon = "question" }) => {
  const res = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#e11d48",
    confirmButtonText,
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });
  return res.isConfirmed;
};

/* ====================== MAIN ====================== */
export default function AdminManageUsers() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryKey = useMemo(
    () => ["admin-users", { search, role, status, page, limit }],
    [search, role, status, page, limit]
  );

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = { search, role, status, page, limit };
      const res = await axiosSecure.get("/admin/users", { params });
      return res.data;
    },
    keepPreviousData: true,
  });

  const mRole = useMutation({
    mutationFn: async ({ id, nextRole }) => {
      await axiosSecure.patch(`/admin/users/${id}/role`, { role: nextRole });
    },
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update role"),
  });

  const mStatus = useMutation({
    mutationFn: async ({ id, action }) => {
      await axiosSecure.patch(`/admin/users/${id}/status`, { action });
    },
    onSuccess: (_d, v) => {
      toast.success(v.action === "suspend" ? "User suspended" : "User activated");
      qc.invalidateQueries({ queryKey });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update status"),
  });

  const mDelete = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      toast.success("User deleted");
      const totalOnPage = data && data.data ? data.data.length : 0;
      if (totalOnPage === 1 && page > 1) setPage((p) => p - 1);
      qc.invalidateQueries({ queryKey });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete user"),
  });

  const total = data?.pagination?.total || 0;
  const pages = data?.pagination?.pages || 1;
  const users = data?.data || [];

  const canClick = !mRole.isPending && !mStatus.isPending && !mDelete.isPending;

  return (
    <div className="relative min-h-screen p-6 bg-gradient-to-br from-[#f8fbff] via-[#f7f7ff] to-[#f6fffb] :from-[#0b1020] :via-[#0d1224] :to-[#0a101e]">
      {/* soft blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-[320px] rounded-full blur-3xl opacity-30 :opacity-20 bg-gradient-to-br from-sky-400/40 to-indigo-500/40" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-[360px] rounded-full blur-3xl opacity-30 :opacity-20 bg-gradient-to-br from-pink-400/40 to-pink-500/40" />

      {/* header + toolbar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 :text-white">
            Manage Users
          </h1>
          <p className="text-sm text-slate-600 :text-slate-400">
            Search, filter, change roles, suspend/activate, or delete users.
          </p>
        </div>

        <GlassCard>
          <div className="flex items-center gap-2 p-2">
            <button
              onClick={() => {
                const p = toast.loading("Refreshing…");
                refetch().finally(() => toast.dismiss(p));
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 :border-white/10 :bg-white/5 :text-slate-200"
            >
              {isFetching ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Refresh
            </button>
          </div>
        </GlassCard>
      </div>

      {/* filters */}
      <GlassCard className="mb-4">
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email…"
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 :border-white/10 :bg-white/5 :text-slate-100"
            />
          </div>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm :border-white/10 :bg-white/5 :text-slate-100"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="learner">Learner</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm :border-white/10 :bg-white/5 :text-slate-100"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </GlassCard>

      {/* table card */}
      <GlassCard>
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50/70 backdrop-blur supports-[backdrop-filter]:bg-slate-50/60 text-left text-slate-600 :bg-white/[0.04] :text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Followers</th>
                <th className="px-4 py-3 font-semibold">Following</th>
                <th className="px-4 py-3 font-semibold">Country</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 :divide-white/10">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkelRow key={i} />)
                : users.length === 0
                ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState onRefresh={refetch} />
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const followers = Array.isArray(u.followers) ? u.followers.length : 0;
                    const following = Array.isArray(u.following) ? u.following.length : 0;
                    const joined = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—";
                    const statusValue = u.account_status || "active";
                    const nextRole = u.role === "admin" ? "learner" : "admin";

                    return (
                      <tr key={u._id} className="align-middle hover:bg-slate-50/60 :hover:bg-white/[0.03]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.image || "https://i.pravatar.cc/100?img=1"}
                              className="size-10 rounded-full object-cover ring-1 ring-slate-200 :ring-white/10"
                              alt={u.name || u.email}
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <div className="truncate font-medium text-slate-800 :text-slate-100">
                                {u.name || "Unnamed"}
                              </div>
                              <div className="truncate text-xs text-slate-500">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusDot status={statusValue} />
                        </td>
                        <td className="px-4 py-3">{followers}</td>
                        <td className="px-4 py-3">{following}</td>
                        <td className="px-4 py-3">{u.user_country || "—"}</td>
                        <td className="px-4 py-3">{joined}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle role */}
                            <button
                              disabled={!canClick}
                              onClick={async () => {
                                const ok = await confirmAction({
                                  title: "Change role?",
                                  text: `Make ${u.email} a ${nextRole}?`,
                                  confirmButtonText: `Yes, make ${nextRole}`,
                                  icon: "warning",
                                });
                                if (!ok) return;
                                toast.promise(
                                  mRole.mutateAsync({ id: u._id, nextRole }),
                                  { loading: "Updating role…", success: "Role updated", error: "Failed to update role" }
                                );
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50 :border-white/10 :bg-white/5 :text-slate-200"
                              title={`Make ${nextRole}`}
                            >
                              <ShieldCheck className="size-4" />
                              {u.role === "admin" ? "Make Learner" : "Make Admin"}
                            </button>

                            {/* Suspend / Activate */}
                            {statusValue === "active" ? (
                              <button
                                disabled={!canClick}
                                onClick={async () => {
                                  const ok = await confirmAction({
                                    title: "Suspend user?",
                                    text: `Suspend ${u.email}? They won't be able to sign in.`,
                                    confirmButtonText: "Yes, suspend",
                                    icon: "warning",
                                  });
                                  if (!ok) return;
                                  toast.promise(
                                    mStatus.mutateAsync({ id: u._id, action: "suspend" }),
                                    { loading: "Suspending…", success: "User suspended", error: "Failed to suspend" }
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-100 disabled:opacity-50 :border-rose-400/30 :bg-rose-400/10 :text-rose-300"
                                title="Suspend user"
                              >
                                <UserX className="size-4" />
                                Suspend
                              </button>
                            ) : (
                              <button
                                disabled={!canClick}
                                onClick={async () => {
                                  const ok = await confirmAction({
                                    title: "Activate user?",
                                    text: `Activate ${u.email}?`,
                                    confirmButtonText: "Yes, activate",
                                    icon: "question",
                                  });
                                  if (!ok) return;
                                  toast.promise(
                                    mStatus.mutateAsync({ id: u._id, action: "activate" }),
                                    { loading: "Activating…", success: "User activated", error: "Failed to activate" }
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 :border-emerald-400/30 :bg-emerald-400/10 :text-emerald-300"
                                title="Activate user"
                              >
                                <UserCheck className="size-4" />
                                Activate
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              disabled={!canClick}
                              onClick={async () => {
                                const ok = await confirmAction({
                                  title: "Delete user?",
                                  text: `Delete ${u.email}? This cannot be undone.`,
                                  confirmButtonText: "Yes, delete",
                                  icon: "error",
                                });
                                if (!ok) return;
                                toast.promise(mDelete.mutateAsync(u._id), {
                                  loading: "Deleting…",
                                  success: "User deleted",
                                  error: "Failed to delete",
                                });
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50 :border-white/10 :bg-white/5 :text-slate-200"
                              title="Delete user"
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
            </tbody>
          </table>
        </div>

        {/* footer / pagination */}
        <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-600 :text-slate-400">
          <div>
            Showing{" "}
            <span className="font-medium text-slate-800 :text-slate-200">
              {users.length ? (page - 1) * limit + 1 : 0}
            </span>{" "}
            –{" "}
            <span className="font-medium text-slate-800 :text-slate-200">
              {(page - 1) * limit + users.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-800 :text-slate-200">
              {total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 :border-white/10 :bg-white/5"
            >
              Prev
            </button>
            <span className="px-2">
              Page <span className="font-medium">{page}</span> / {pages}
            </span>
            <button
              disabled={page >= pages || isFetching}
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 :border-white/10 :bg-white/5"
            >
              Next
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
