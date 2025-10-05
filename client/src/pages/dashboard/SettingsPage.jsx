// src/pages/dashboard/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SettingsPage() {
  const { mongoUser, refreshMongoUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    bio: "",
    native_language: "",
    learning_language: "",
    availability: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mongoUser) {
      setForm({
        name: mongoUser.name || "",
        bio: mongoUser.bio || "",
        native_language: mongoUser.native_language || mongoUser.native || "",
        learning_language: Array.isArray(mongoUser.learning_language) ? mongoUser.learning_language.join(", ") : (mongoUser.learning_language || ""),
        availability: mongoUser.availability || "",
      });
    }
  }, [mongoUser]);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    if (!mongoUser?.email) return alert("Please login");
    setSaving(true);
    try {
      // convert learning_language to array
      const payload = {
        ...form,
        learning_language: form.learning_language.split(",").map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch(`${BACKEND}/users/${encodeURIComponent(mongoUser.email)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Save failed");
      await refreshMongoUser();
      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 my-24">Settings</h2>
    </div>
  );
}
