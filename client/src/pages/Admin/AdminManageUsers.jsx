import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Loader2,
  Search,
  ShieldCheck,
  UserX,
  UserCheck,
  Trash2,
  RefreshCw,
} from "lucide-react";

import Swal from "sweetalert2";
import toast from "react-hot-toast";

// NOTE: আপনি আগে axiosSecure হুক বানিয়েছেন — এটা axios instance রিটার্ন করে
import axiosSecure from "../../hooks/useAxiosSecure";

const RoleBadge = ({ role }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border ${
        role === "admin"
          ? "border-purple-200 bg-purple-50 text-purple-700"
          : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
      title={role === "admin" ? "Administrator" : "Learner"}
    >
      <ShieldCheck className="size-3.5" />
      {role}
    </span>
  );
};

const StatusDot = ({ status = "active" }) => {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`inline-block size-2 rounded-full ${
          status === "active" ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      <span className="text-xs capitalize text-slate-600">{status}</span>
    </span>
  );
};

// SweetAlert2 confirm helper
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

  // === Mutations with toast feedback ===
  const mRole = useMutation({
    mutationFn: async ({ id, nextRole }) => {
      await axiosSecure.patch(`/admin/users/${id}/role`, { role: nextRole });
    },
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update role");
    },
  });

  const mStatus = useMutation({
    mutationFn: async ({ id, action }) => {
      await axiosSecure.patch(`/admin/users/${id}/status`, { action });
    },
    onSuccess: (_d, v) => {
      toast.success(
        v.action === "suspend" ? "User suspended" : "User activated"
      );
      qc.invalidateQueries({ queryKey });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
    },
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
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    },
  });

  const total = data?.pagination?.total || 0;
  const pages = data?.pagination?.pages || 1;
  const users = data?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-slate-500 text-sm">
            Search, filter, change roles, suspend/activate, or delete users.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const p = toast.loading("Refreshing…");
              refetch().finally(() => toast.dismiss(p));
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            {isFetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email…"
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 outline-none ring-0 focus:border-slate-300"
          />
        </div>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5"
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
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Followers</th>
                <th className="px-4 py-3">Following</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    <Loader2 className="mx-auto size-5 animate-spin" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const followers = Array.isArray(u.followers) ? u.followers.length : 0;
                  const following = Array.isArray(u.following) ? u.following.length : 0;
                  const joined = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—";
                  const statusValue = u.account_status || "active";
                  const nextRole = u.role === "admin" ? "learner" : "admin";
                  const canClick = !mRole.isPending && !mStatus.isPending && !mDelete.isPending;

                  return (
                    <tr key={u._id} className="align-middle">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.image || "https://i.pravatar.cc/100?img=1"}
                            className="size-9 rounded-full object-cover"
                            alt={u.name || u.email}
                          />
                          <div>
                            <div className="font-medium text-slate-800">
                              {u.name || "Unnamed"}
                            </div>
                            <div className="text-xs text-slate-500">{u.email}</div>
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
                                {
                                  loading: "Updating role…",
                                  success: "Role updated",
                                  error: "Failed to update role",
                                }
                              );
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50"
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
                                  {
                                    loading: "Suspending…",
                                    success: "User suspended",
                                    error: "Failed to suspend",
                                  }
                                );
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-100"
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
                                  {
                                    loading: "Activating…",
                                    success: "User activated",
                                    error: "Failed to activate",
                                  }
                                );
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-100"
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
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
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

        {/* Footer: Pagination */}
        <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-600">
          <div>
            Showing{" "}
            <span className="font-medium">
              {users.length ? (page - 1) * limit + 1 : 0}
            </span>{" "}
            –{" "}
            <span className="font-medium">
              {(page - 1) * limit + users.length}
            </span>{" "}
            of <span className="font-medium">{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2">
              Page <span className="font-medium">{page}</span> / {pages}
            </span>
            <button
              disabled={page >= pages || isFetching}
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
