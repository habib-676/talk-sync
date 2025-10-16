import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  Megaphone, Plus, Search, Pin, PinOff, Upload, Archive, Undo2, Trash2,
} from "lucide-react";

// ---------- Small helpers ----------
const audienceLabels = (a) => {
  if (!a || a.type === "all") return "All users";
  if (a.type === "role") return `Roles: ${a.roles?.join(", ") || "-"}`;
  if (a.type === "users") return `Specific users (${a.userIds?.length || 0})`;
  return "Unknown";
};

const StatusPill = ({ s }) => {
  const map = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft: "bg-slate-50 text-slate-700 border-slate-200",
    scheduled: "bg-amber-50 text-amber-700 border-amber-200",
    archived: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs capitalize ${map[s] || ""}`}>
      {s}
    </span>
  );
};

const Confirm = async (title, text, confirmText = "Yes") => {
  const r = await Swal.fire({
    title, text, icon: "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#e11d48",
    reverseButtons: true,
    focusCancel: true,
  });
  return r.isConfirmed;
};

// ---------- SweetAlert form (Create/Edit) ----------
// NOW: title + image + description + tags (for everyone)
const openAnnouncementForm = async (initial) => {
  const isEdit = !!initial;

  const html = `
    <div class="space-y-2 text-left">
      <label class="text-xs text-slate-600">Title</label>
      <input id="a-title" class="swal2-input" placeholder="Title" value="${initial?.title || ""}">

      <label class="text-xs text-slate-600">Image URL</label>
      <input id="a-image" class="swal2-input" placeholder="https://..." value="${initial?.image || ""}">

      <label class="text-xs text-slate-600">Description</label>
      <textarea id="a-desc" class="swal2-textarea" placeholder="Short description">${initial?.description || ""}</textarea>

      <label class="text-xs text-slate-600">Tags (comma separated)</label>
      <input id="a-tags" class="swal2-input" placeholder="update,feature,urgent" value="${(initial?.tags || []).join(",")}">
    </div>
  `;

  const { value: formValues } = await Swal.fire({
    title: isEdit ? "Edit Announcement" : "New Announcement",
    width: 600,
    html,
    focusConfirm: false,
    confirmButtonText: isEdit ? "Save" : "Create",
    preConfirm: () => {
      const title = document.getElementById("a-title").value.trim();
      const image = document.getElementById("a-image").value.trim();
      const description = document.getElementById("a-desc").value.trim();
      const tagsStr = (document.getElementById("a-tags")?.value || "").trim();

      if (!title || !description) {
        Swal.showValidationMessage("Title and description are required");
        return;
      }

      const tags = tagsStr ? tagsStr.split(",").map(s => s.trim()).filter(Boolean) : [];
      return { title, image, description, tags };
    },
  });

  return formValues; // undefined if canceled
};

// ---------- Main component ----------
export default function AdminAnnouncements() {
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [pinned, setPinned] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

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
    onSuccess: () => { toast.success("Created"); qc.invalidateQueries({ queryKey }); },
    onError: (e) => toast.error(e?.response?.data?.message || "Create failed"),
  });

  const mUpdate = useMutation({
    mutationFn: async ({ id, data }) => axiosSecure.patch(`/admin/announcements/${id}`, data),
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey }); },
    onError: (e) => toast.error(e?.response?.data?.message || "Update failed"),
  });

  const mAction = useMutation({
    mutationFn: async ({ id, action }) => axiosSecure.post(`/admin/announcements/${id}/action`, { action }),
    onSuccess: (_d, v) => { toast.success(`${v.action} ok`); qc.invalidateQueries({ queryKey }); },
    onError: (e) => toast.error(e?.response?.data?.message || "Action failed"),
  });

  const mDelete = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/admin/announcements/${id}`),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey }); },
    onError: (e) => toast.error(e?.response?.data?.message || "Delete failed"),
  });

  const rows = qList.data?.data || [];
  const total = qList.data?.pagination?.total || 0;
  const pages = qList.data?.pagination?.pages || 1;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
          <p className="text-slate-500 text-sm">Create and manage messages for your users.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              const form = await openAnnouncementForm();
              if (!form) return;
              await mCreate.mutateAsync(form); // {title,image,description,tags}
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            <Plus className="size-4" /> New
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search title, description…"
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 outline-none ring-0 focus:border-slate-300"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select value={pinned} onChange={(e) => { setPinned(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <option value="all">Pinned: All</option>
          <option value="true">Pinned</option>
          <option value="false">Not pinned</option>
        </select>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {qList.isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No announcements.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {rows.map((a) => (
              <li key={a._id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Megaphone className="size-4 text-slate-500" />
                      <h3 className="truncate font-medium text-slate-800">{a.title}</h3>
                      <StatusPill s={a.status} />
                      {a.pinned && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                          <Pin className="size-3.5" /> pinned
                        </span>
                      )}
                    </div>

                    {a.description && <p className="mt-1 text-sm text-slate-700">{a.description}</p>}

                    {a.image && (
                      <div className="mt-3">
                        <img
                          src={a.image}
                          alt={a.title}
                          className="w-full max-h-48 rounded-lg object-cover border border-slate-200"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {!!(a.tags?.length) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {a.tags.map((t, i) => (
                          <span key={i}
                            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 text-xs text-slate-500">
                      Audience: {audienceLabels(a.audience)} &middot; Created {new Date(a.createdAt).toLocaleString()}
                      {a.publishedAt && <> &middot; Published {new Date(a.publishedAt).toLocaleString()}</>}
                      {a.scheduledAt && <> &middot; Scheduled {new Date(a.scheduledAt).toLocaleString()}</>}
                      {a.expiresAt && <> &middot; Expires {new Date(a.expiresAt).toLocaleString()}</>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex flex-wrap items-center gap-2">
                    <button
                      onClick={async () => {
                        const form = await openAnnouncementForm(a);
                        if (!form) return;
                        await mUpdate.mutateAsync({ id: a._id, data: form }); // {title,image,description,tags}
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50">
                      Edit
                    </button>

                    {a.status !== "published" ? (
                      <button
                        onClick={async () => {
                          const ok = await Confirm("Publish announcement?", "Push to all target users now.");
                          if (!ok) return;
                          await mAction.mutateAsync({ id: a._id, action: "publish" });
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-100">
                        <Upload className="size-4" /> Publish
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          const ok = await Confirm("Unpublish announcement?", "It will go back to Draft.");
                          if (!ok) return;
                          await mAction.mutateAsync({ id: a._id, action: "unpublish" });
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50">
                        <Undo2 className="size-4" /> Unpublish
                      </button>
                    )}

                    {!a.pinned ? (
                      <button
                        onClick={() => mAction.mutate({ id: a._id, action: "pin" })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-100">
                        <Pin className="size-4" /> Pin
                      </button>
                    ) : (
                      <button
                        onClick={() => mAction.mutate({ id: a._id, action: "unpin" })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50">
                        <PinOff className="size-4" /> Unpin
                      </button>
                    )}

                    {a.status !== "archived" && (
                      <button
                        onClick={async () => {
                          const ok = await Confirm("Archive announcement?", "You can’t publish it again without unarchiving via edit.");
                          if (!ok) return;
                          await mAction.mutateAsync({ id: a._id, action: "archive" });
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-100">
                        <Archive className="size-4" /> Archive
                      </button>
                    )}

                    <button
                      onClick={async () => {
                        const ok = await Confirm("Delete announcement?", "This cannot be undone.", "Delete");
                        if (!ok) return;
                        await mDelete.mutateAsync(a._id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50">
                      <Trash2 className="size-4" /> Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer: Pagination */}
        <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-600">
          <div>
            Showing <span className="font-medium">{rows.length ? (page - 1) * limit + 1 : 0}</span>
            {" "}–{" "}
            <span className="font-medium">{(page - 1) * limit + rows.length}</span>
            {" "}of <span className="font-medium">{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || qList.isFetching}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50">
              Prev
            </button>
            <span className="px-2">Page <span className="font-medium">{page}</span> / {pages}</span>
            <button
              disabled={page >= pages || qList.isFetching}
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
