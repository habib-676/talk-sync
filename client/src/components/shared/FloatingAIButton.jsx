import { LucideBotMessageSquare } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export default function FloatingAIButton({
  to = "/aiAgent",
  label = "Ask our AI Assistant",
}) {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate(to);
  }, [navigate, to]);

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 select-none">
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        className="relative group focus:outline-none"
      >
        {/* Soft pulsing ring */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-primary/25 animate-ping-slower" />

        {/* Main circular button */}
        <span className="relative inline-flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary text-white shadow-xl ring-2 ring-white/40 transition-transform duration-200 ease-out group-hover:scale-105">
          {/* AI bot inline SVG icon */}
          <LucideBotMessageSquare />

          {/* Online dot */}
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-white" />
        </span>

        {/* Tooltip-like label (appears on hover) */}
        <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-base-200 px-2.5 py-1 text-xs font-medium text-base-content opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
          {label}
        </span>
      </button>
    </div>
  );
}
