import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const API = import.meta.env.VITE_API_URL;

export default function useNotifications() {
  const { user, socketRef } = useAuth();
  const uid = user?.uid || null;
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const fetchingRef = useRef(false);

  const client = useMemo(() => {
    const inst = axios.create({ baseURL: API, withCredentials: true });
    return inst;
  }, []);

  const loadInitial = useCallback(async () => {
    if (!uid) {
      setItems([]);
      setUnread(0);
      return;
    }
    setLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        client.get("/notifications", { params: { uid, page: 1, limit: 20 } }),
        client.get("/notifications/unread-count", { params: { uid } }),
      ]);
      setItems(listRes.data?.data || []);
      setUnread(countRes.data?.count || 0);
      pageRef.current = 1;
      hasMoreRef.current = (listRes.data?.data || []).length >= 20;
    } catch (e) {
      console.error("load notifications error", e);
    } finally {
      setLoading(false);
    }
  }, [client, uid]);

  const loadMore = useCallback(async () => {
    if (!uid || !hasMoreRef.current || fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const next = pageRef.current + 1;
      const res = await client.get("/notifications", {
        params: { uid, page: next, limit: 20 },
      });
      const more = res.data?.data || [];
      if (more.length) {
        setItems((prev) => {
          const merged = [...prev];
          for (const n of more) {
            if (!merged.find((m) => m._id === n._id)) merged.push(n);
          }
          return merged.sort((a, b) =>
            (b.createdAt || "").localeCompare(a.createdAt || "")
          );
        });
        pageRef.current = next;
      }
      hasMoreRef.current = more.length >= 20;
    } catch (e) {
      console.error("load more notifications error", e);
    } finally {
      fetchingRef.current = false;
    }
  }, [client, uid]);

  // mark single notification as read
  const markRead = useCallback(
    async (id) => {
      if (!uid || !id) return;
      try {
        await client.post(`/notifications/${id}/read`, { uid });
        setItems((prev) =>
          prev.map((it) => {
            if (it._id === id) {
              if (it.audience === "all") {
                const rb = Array.isArray(it.readBy) ? it.readBy : [];
                return { ...it, readBy: rb.includes(uid) ? rb : [...rb, uid] };
              }
              return { ...it, readAt: it.readAt || new Date().toISOString() };
            }
            return it;
          })
        );
        setUnread((c) => Math.max(0, c - 1));
      } catch (e) {
        console.error("markRead error", e);
      }
    },
    [client, uid]
  );

  const markAllRead = useCallback(async () => {
    if (!uid) return;
    try {
      await client.post("/notifications/read-all", { uid });
      setItems((prev) =>
        prev.map((it) => {
          if (it.audience === "all") {
            const rb = Array.isArray(it.readBy) ? it.readBy : [];
            return { ...it, readBy: rb.includes(uid) ? rb : [...rb, uid] };
          }
          return { ...it, readAt: it.readAt || new Date().toISOString() };
        })
      );
      setUnread(0);
    } catch (e) {
      console.error("markAllRead error", e);
    }
  }, [client, uid]);

  // socket subscription
  useEffect(() => {
    if (!uid) return;
    loadInitial();
  }, [uid, loadInitial]);

  useEffect(() => {
    const s = socketRef?.current;
    if (!s) return;
    const handler = (notif) => {
      // Push new item and bump unread (only if this user is a recipient or audience is all)
      if (notif.recipientUid && notif.recipientUid !== uid) return;
      setItems((prev) => {
        const exists = prev.find((p) => p._id === notif._id);
        if (exists) return prev;
        const next = [notif, ...prev];
        return next.sort((a, b) =>
          (b.createdAt || "").localeCompare(a.createdAt || "")
        );
      });
      setUnread((c) => c + 1);
    };
    s.on("notification:new", handler);
    return () => {
      s.off("notification:new", handler);
    };
  }, [socketRef, uid]);

  return {
    items,
    unread,
    loading,
    open,
    setOpen,
    loadMore,
    markRead,
    markAllRead,
  };
}
