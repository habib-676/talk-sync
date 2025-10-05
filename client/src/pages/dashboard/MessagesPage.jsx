// src/pages/dashboard/MessagesPage.jsx
import React, { useEffect, useState, useRef } from "react";
import useAuth from "../../hooks/useAuth";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function MessagesPage(){
  const { mongoUser } = useAuth();
  const [conversations, setConversations] = useState([]); // list of conversation partners (simple)
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    // For a simple demo, we pull last conversations from user's recent field
    if (mongoUser?.recent) {
      const partners = mongoUser.recent.map(r => ({ email: r.partnerEmail || r.partner, title: r.title })).filter(Boolean);
      setConversations(partners);
    }
  }, [mongoUser]);

  const loadConversation = async (partnerEmail) => {
    setActivePartner(partnerEmail);
    setLoading(true);
    try {
      // call your backend: GET /messages?senderId=...&receiverId=...
      // If you only store by emails, adapt server accordingly.
      const res = await fetch(`${BACKEND}/messages?senderId=${encodeURIComponent(mongoUser?._id || mongoUser?.email)}&receiverId=${encodeURIComponent(partnerEmail)}`);
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setMessages(data || []);
      setTimeout(()=> scrollRef.current?.scrollIntoView({behavior:'smooth'}), 50);
    } catch (err) {
      console.warn("Messages load:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    const payload = {
      senderId: mongoUser?._id || mongoUser?.email,
      receiverId: activePartner,
      text: text.trim(),
    };
    try {
      const res = await fetch(`${BACKEND}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("send failed");
      const saved = await res.json();
      setMessages(prev => [...prev, saved]);
      setText("");
      setTimeout(()=> scrollRef.current?.scrollIntoView({behavior:'smooth'}), 50);
    } catch (err) {
      console.error(err);
      alert("Failed to send (server must implement /messages)");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 bg-white p-4 rounded-2xl shadow">
        <h4 className="font-semibold text-indigo-600">Conversations</h4>
        <div className="mt-3 space-y-2">
          {conversations.length ? conversations.map((c, idx)=>(
            <button key={idx} onClick={()=>loadConversation(c.email)} className={`w-full text-left p-2 rounded ${activePartner===c.email ? "bg-indigo-50" : "hover:bg-slate-50"}`}>
              <div className="font-medium">{c.title || c.email}</div>
              <div className="text-xs text-slate-400">{c.email}</div>
            </button>
          )) : <div className="text-sm text-gray-500">No conversations yet.</div>}
        </div>
      </div>

      <div className="lg:col-span-3 bg-white p-4 rounded-2xl shadow flex flex-col">
        <h4 className="font-semibold text-indigo-600">{activePartner ? `Chat with ${activePartner}` : "Select a conversation"}</h4>

        <div className="flex-1 mt-4 overflow-auto space-y-3">
          {loading ? <div className="text-sm text-gray-500">Loading…</div> :
            messages.length ? messages.map((m, idx)=>(
              <div key={idx} className={`p-2 rounded ${String(m.senderId)===String(mongoUser?._id||mongoUser?.email) ? "bg-indigo-50 self-end" : "bg-slate-100 self-start"} max-w-xl`}>
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-slate-400 mt-1">{new Date(m.createdAt || Date.now()).toLocaleString()}</div>
              </div>
            )) : <div className="text-sm text-gray-500">No messages.</div>
          }
          <div ref={scrollRef} />
        </div>

        <div className="mt-3">
          <div className="flex gap-2">
            <input value={text} onChange={(e)=>setText(e.target.value)} placeholder={activePartner ? "Type a message" : "Select a conversation first"} disabled={!activePartner} className="flex-1 p-2 rounded border" />
            <button onClick={sendMessage} disabled={!activePartner || !text.trim()} className="px-4 py-2 rounded bg-indigo-600 text-white">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
