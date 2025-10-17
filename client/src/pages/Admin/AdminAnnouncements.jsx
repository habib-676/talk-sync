import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  Megaphone, Plus, Search, Pin, PinOff, Upload, Archive, Undo2, Trash2,
  Calendar, Users, Clock, Tag
} from "lucide-react";

/* =========== Tiny UI Primitives =========== */
const Page = ({ children }) => (
  <div className="relative min-h-screen px-4 py-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-blue-950 dark:to-emerald-950">
    <div className="pointer-events-none absolute -top-20 -left-20 size-80 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-blue-400 to-purple-500" />
    <div className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-emerald-400 to-teal-500" />
    <div className="mx-auto max-w-7xl">{children}</div>
  </div>
);

const Glass = ({ className = "", children }) => (
  <div
    className={[
      "relative overflow-hidden rounded-2xl",
      "border border-white/80 bg-white/60 backdrop-blur-xl",
      "shadow-lg shadow-black/5",
      "dark:border-white/10 dark:bg-white/5 dark:shadow-black/20",
      className,
    ].join(" ")}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5" />
    <div className="relative">{children}</div>
  </div>
);

const Kbd = ({ children }) => (
  <kbd className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
    {children}
  </kbd>
);

const Badge = ({ children, tone = "slate" }) => {
  const map = {
    slate: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300",
    amber: "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-600 dark:bg-amber-700/30 dark:text-amber-300",
    emerald: "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-700/30 dark:text-emerald-300",
    rose: "border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-600 dark:bg-rose-700/30 dark:text-rose-300",
    blue: "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-600 dark:bg-blue-700/30 dark:text-blue-300",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${map[tone]}`}>
      {children}
    </span>
  );
};

const Btn = ({ children, className = "", ...rest }) => (
  <button
    className={[
      "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200",
      "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:shadow-sm disabled:opacity-50",
      "dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
      className,
    ].join(" ")}
    {...rest}
  >
    {children}
  </button>
);

const Pill = ({ s }) => {
  const map = {
    published: "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-700/30 dark:text-emerald-300",
    draft: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300",
    scheduled: "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-600 dark:bg-amber-700/30 dark:text-amber-300",
    archived: "border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-600 dark:bg-rose-700/30 dark:text-rose-300",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium capitalize ${map[s] || ""}`}>
      {s === 'scheduled' && <Clock className="size-3" />}
      {s === 'published' && <Upload className="size-3" />}
      {s === 'draft' && <span className="size-2 rounded-full bg-slate-400" />}
      {s === 'archived' && <Archive className="size-3" />}
      {s}
    </span>
  );
};

/* =========== Helpers =========== */
const audienceLabels = (a) => {
  if (!a || a.type === "all") return "All users";
  if (a.type === "role") return `Roles: ${a.roles?.join(", ") || "-"}`;
  if (a.type === "users") return `Specific users (${a.userIds?.length || 0})`;
  return "Unknown";
};

const Confirm = async (title, text, confirmText = "Yes") => {
  const r = await Swal.fire({
    title, 
    text, 
    icon: "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#ef4444",
    reverseButtons: true,
    focusCancel: true,
    background: '#f8fafc',
    color: '#1e293b',
    customClass: {
      popup: 'rounded-2xl shadow-2xl'
    }
  });
  return r.isConfirmed;
};

// Enhanced SweetAlert form with better styling
const openAnnouncementForm = async (initial) => {
  const isEdit = !!initial;
  const html = `
    <div class="space-y-4 text-left">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Title</label>
        <input id="a-title" class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Announcement title" value="${initial?.title || ""}">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
        <input id="a-image" class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="https://example.com/image.jpg" value="${initial?.image || ""}">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
        <textarea id="a-desc" class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Detailed description..." rows="4">${initial?.description || ""}</textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Tags (comma separated)</label>
        <input id="a-tags" class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="update, feature, important" value="${(initial?.tags || []).join(",")}">
      </div>
    </div>
  `;
  
  const { value } = await Swal.fire({
    title: `<h2 class="text-2xl font-bold text-slate-800">${isEdit ? "Edit Announcement" : "New Announcement"}</h2>`,
    width: 700,
    html,
    focusConfirm: false,
    confirmButtonText: isEdit ? "Save Changes" : "Create Announcement",
    confirmButtonColor: "#10b981",
    showCancelButton: true,
    cancelButtonColor: "#6b7280",
    background: '#f8fafc',
    customClass: {
      popup: 'rounded-2xl shadow-2xl',
      input: 'rounded-lg',
      textarea: 'rounded-lg'
    },
    preConfirm: () => {
      const title = document.getElementById("a-title").value.trim();
      const image = document.getElementById("a-image").value.trim();
      const description = document.getElementById("a-desc").value.trim();
      const tagsStr = (document.getElementById("a-tags")?.value || "").trim();
      if (!title || !description) {
        Swal.showValidationMessage("Please fill in both title and description");
        return;
      }
      const tags = tagsStr ? tagsStr.split(",").map(s => s.trim()).filter(Boolean) : [];
      return { title, image, description, tags };
    },
  });
  return value;
};

/* =========== Main Component =========== */
export default function AdminAnnouncements() {
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [pinned, setPinned] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 8;

  const queryKey = useMemo(
    () => ["admin-annc", { search, status, pinned, page, limit }],
    [search, status, pinned, page, limit]
  );

  const qList = useQuery({
    queryKey,
    queryFn: async () => {
      const params = { search, status, pinned, page, limit };
      const res = await axiosSecure.get("/admin/announcements", { params });
      return res.data;
    },
    keepPreviousData: true,
  });

  const mCreate = useMutation({
    mutationFn: async (payload) => axiosSecure.post("/admin/announcements", payload),
    onSuccess: () => { toast.success("Announcement created successfully"); qc.invalidateQueries({ queryKey }); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to create announcement"),
  });

  const mUpdate = useMutation({
    mutationFn: async ({ id, data }) => axiosSecure.patch(`/admin/announcements/${id}`, data),
    onSuccess: () => { toast.success("Announcement updated successfully"); qc.invalidateQueries({ queryKey }); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to update announcement"),
  });

  const mAction = useMutation({
    mutationFn: async ({ id, action }) => axiosSecure.post(`/admin/announcements/${id}/action`, { action }),
    onSuccess: (_d, v) => { toast.success(`Announcement ${v.action}ed successfully`); qc.invalidateQueries({ queryKey }); },
    onError: (e) => toast.error(e?.response?.data?.message || "Action failed"),
  });

  const mDelete = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/admin/announcements/${id}`),
    onSuccess: () => { toast.success("Announcement deleted successfully"); qc.invalidateQueries({ queryKey }); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to delete announcement"),
  });

  const rows = qList.data?.data || [];
  const total = qList.data?.pagination?.total || 0;
  const pages = qList.data?.pagination?.pages || 1;

  return (
    <Page>
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Announcements
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Create and manage announcements for your users
          </p>
        </div>
        <Glass>
          <div className="flex items-center gap-3 p-3">
            <Btn
              onClick={async () => {
                const form = await openAnnouncementForm();
                if (!form) return;
                await mCreate.mutateAsync(form);
              }}
              className="bg-blue-500  border-blue-500 hover:bg-blue-600 hover:border-blue-600"
            >
              <Plus className="size-5" /> New Announcement
            </Btn>
          </div>
        </Glass>
      </div>

      {/* Controls Section */}
      <Glass className="mb-6">
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search announcements..."
              className="w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 py-3.5 text-sm outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={pinned}
            onChange={(e) => { setPinned(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Pins</option>
            <option value="true">Pinned</option>
            <option value="false">Not Pinned</option>
          </select>
        </div>
        <div className="border-t border-slate-200 px-6 py-4 text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Kbd>Enter</Kbd>
            <span>to search • Use filters to narrow results</span>
          </div>
        </div>
      </Glass>

      {/* Announcements List */}
      <Glass>
        {qList.isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex animate-pulse items-center space-x-4">
                <div className="size-12 rounded-lg bg-slate-200 dark:bg-slate-600"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded bg-slate-200 dark:bg-slate-600"></div>
                  <div className="h-3 rounded bg-slate-200 dark:bg-slate-600 w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="grid place-items-center p-16 text-center">
            <div className="mx-auto mb-4 size-20 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-400 dark:border-slate-600 dark:bg-slate-700/50 grid place-items-center">
              <Megaphone className="size-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No announcements found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm">
              {search || status !== 'all' || pinned !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Get started by creating your first announcement"}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-600">
            {rows.map((a) => (
              <li key={a._id} className="p-6 transition-all hover:bg-slate-50/80 dark:hover:bg-slate-700/30">
                <div className="flex items-start justify-between gap-6">
                  {/* Content */}
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        <Megaphone className="size-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                          {a.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill s={a.status} />
                        {a.pinned && (
                          <Badge tone="amber">
                            <Pin className="mr-1 size-4" /> Pinned
                          </Badge>
                        )}
                      </div>
                    </div>

                    {a.description && (
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {a.description}
                      </p>
                    )}

                    {a.image && (
                      <div className="overflow-hidden rounded-xl border border-slate-300 dark:border-slate-600">
                        <img
                          src={a.image}
                          alt={a.title}
                          className="aspect-[21/9] w-full object-cover transition-transform hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {!!(a.tags?.length) && (
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag className="size-4 text-slate-400" />
                        {a.tags.map((t, i) => (
                          <Badge key={i} tone="blue">#{t}</Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Users className="size-4" />
                        <span>{audienceLabels(a.audience)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>Created {new Date(a.createdAt).toLocaleDateString()}</span>
                      </div>
                      {a.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Upload className="size-4" />
                          <span>Published {new Date(a.publishedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Btn
                        onClick={async () => {
                          const form = await openAnnouncementForm(a);
                          if (!form) return;
                          await mUpdate.mutateAsync({ id: a._id, data: form });
                        }}
                        className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        Edit
                      </Btn>

                      {a.status !== "published" ? (
                        <Btn
                          onClick={async () => {
                            const ok = await Confirm("Publish announcement?", "This will make it visible to all target users.");
                            if (!ok) return;
                            await mAction.mutateAsync({ id: a._id, action: "publish" });
                          }}
                          className="text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                        >
                          <Upload className="size-4" /> Publish
                        </Btn>
                      ) : (
                        <Btn
                          onClick={async () => {
                            const ok = await Confirm("Unpublish announcement?", "This will revert it to draft status.");
                            if (!ok) return;
                            await mAction.mutateAsync({ id: a._id, action: "unpublish" });
                          }}
                        >
                          <Undo2 className="size-4" /> Unpublish
                        </Btn>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!a.pinned ? (
                        <Btn
                          onClick={() => mAction.mutate({ id: a._id, action: "pin" })}
                          className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          <Pin className="size-4" /> Pin
                        </Btn>
                      ) : (
                        <Btn onClick={() => mAction.mutate({ id: a._id, action: "unpin" })}>
                          <PinOff className="size-4" /> Unpin
                        </Btn>
                      )}

                      {a.status !== "archived" && (
                        <Btn
                          onClick={async () => {
                            const ok = await Confirm("Archive announcement?", "Archived announcements cannot be published.");
                            if (!ok) return;
                            await mAction.mutateAsync({ id: a._id, action: "archive" });
                          }}
                          className="text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                        >
                          <Archive className="size-4" /> Archive
                        </Btn>
                      )}

                      <Btn
                        onClick={async () => {
                          const ok = await Confirm("Delete announcement?", "This action cannot be undone.", "Delete");
                          if (!ok) return;
                          await mDelete.mutateAsync(a._id);
                        }}
                        className="text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                      >
                        <Trash2 className="size-4" /> Delete
                      </Btn>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-600">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-semibold">{(page - 1) * limit + rows.length}</span> of{" "}
            <span className="font-semibold">{total}</span> results
          </div>
          <div className="flex items-center gap-3">
            <Btn
              disabled={page <= 1 || qList.isFetching}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2"
            >
              Previous
            </Btn>
            <span className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200">
              Page {page} of {pages}
            </span>
            <Btn
              disabled={page >= pages || qList.isFetching}
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              className="px-4 py-2"
            >
              Next
            </Btn>
          </div>
        </div>
      </Glass>
    </Page>
  );
}