import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function GlobeWithConnections() {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    // Generate random connections
    const newConnections = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (360 / 8) * i,
    }));
    setConnections(newConnections);
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
      {" "}
      {/* Central globe container */}
      <motion.div
        className="relative w-64 h-64"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {/* Globe with glassmorphism */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-400/30 backdrop-blur-xl border-2 border-white/30 shadow-2xl overflow-hidden">
          {/* Globe continents overlay */}
          <svg className="w-full h-full opacity-40" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <line
              x1="50"
              y1="5"
              x2="50"
              y2="95"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <line
              x1="5"
              y1="50"
              x2="95"
              y2="50"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          </svg>

          {/* Glowing center dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Connection lines radiating out */}
        {connections.map((conn) => (
          <motion.div
            key={conn.id}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              transform: `rotate(${conn.angle}deg)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: conn.id * 0.1 }}
          >
            <svg width="200" height="4" className="overflow-visible">
              <motion.line
                x1="0"
                y1="2"
                x2="200"
                y2="2"
                stroke="url(#gradient)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: conn.id * 0.2,
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                  <stop offset="50%" stopColor="rgba(147,197,253,0.8)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Endpoint dots */}
            <motion.div
              className="absolute left-[180px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-300 shadow-lg"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: conn.id * 0.2,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
