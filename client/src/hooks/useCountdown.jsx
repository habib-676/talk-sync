// src/hooks/useCountdown.js
import { useEffect, useState } from "react";

export default function useCountdown(targetISO) {
  const [state, setState] = useState(() => compute(targetISO));

  useEffect(() => {
    if (!targetISO) {
      setState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
      return;
    }
    const iv = setInterval(() => setState(compute(targetISO)), 1000);
    return () => clearInterval(iv);
  }, [targetISO]);

  return state;
}

function compute(targetISO) {
  if (!targetISO) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const t = new Date(targetISO).getTime();
  if (Number.isNaN(t)) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const diff = Math.max(0, t - Date.now());
  const expired = diff === 0;
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, expired };
}
