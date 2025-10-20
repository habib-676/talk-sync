import { motion } from "framer-motion";

export function LandmarkIcons() {
  const landmarks = [
    {
      name: "Eiffel Tower",
      position: { top: "10%", left: "15%" },
      svg: (
        <svg viewBox="0 0 40 60" className="w-12 h-16" fill="white">
          <path d="M20 5 L15 25 L13 55 L27 55 L25 25 Z" opacity="0.9" />
          <path d="M10 25 L30 25" stroke="white" strokeWidth="1" />
          <path d="M12 40 L28 40" stroke="white" strokeWidth="1" />
          <rect x="18" y="55" width="4" height="5" />
        </svg>
      ),
    },
    {
      name: "Tokyo Tower",
      position: { top: "20%", right: "10%" },
      svg: (
        <svg viewBox="0 0 40 60" className="w-12 h-16" fill="white">
          <path d="M20 0 L12 50 L28 50 Z" opacity="0.9" />
          <path d="M14 15 L26 15" stroke="white" strokeWidth="1" />
          <path d="M13 30 L27 30" stroke="white" strokeWidth="1" />
          <rect x="10" y="50" width="20" height="3" />
        </svg>
      ),
    },
    {
      name: "Big Ben",
      position: { bottom: "25%", left: "10%" },
      svg: (
        <svg viewBox="0 0 30 60" className="w-10 h-16" fill="white">
          <rect x="10" y="15" width="10" height="35" opacity="0.9" />
          <path d="M8 15 L22 15 L20 10 L10 10 Z" />
          <circle
            cx="15"
            cy="25"
            r="3"
            fill="white"
            stroke="white"
            strokeWidth="0.5"
          />
          <rect x="7" y="5" width="16" height="5" />
          <path d="M15 0 L12 5 L18 5 Z" />
        </svg>
      ),
    },
    {
      name: "Statue of Liberty",
      position: { bottom: "15%", right: "15%" },
      svg: (
        <svg viewBox="0 0 40 60" className="w-10 h-16" fill="white">
          <path d="M20 10 L15 45 L25 45 Z" opacity="0.9" />
          <circle cx="20" cy="8" r="3" />
          <path
            d="M20 3 L18 0 M20 3 L22 0 M20 3 L20 0"
            stroke="white"
            strokeWidth="1"
          />
          <path d="M25 15 L30 12 L28 18 Z" />
          <rect x="12" y="45" width="16" height="8" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {landmarks.map((landmark, i) => (
        <motion.div
          key={landmark.name}
          className="absolute z-20"
          style={landmark.position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
        >
          <motion.div
            className="relative p-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/30 shadow-xl"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {landmark.svg}

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}
