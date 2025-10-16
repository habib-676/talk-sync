import { motion } from "framer-motion";

export function LanguageFlags() {
  const flags = [
    {
      emoji: "🇺🇸",
      name: "English",
      position: { top: "15%", left: "50%" },
      delay: 0.6,
    },
    {
      emoji: "🇪🇸",
      name: "Spanish",
      position: { top: "25%", left: "70%" },
      delay: 0.7,
    },
    {
      emoji: "🇨🇳",
      name: "Chinese",
      position: { top: "60%", right: "35%" },
      delay: 0.8,
    },
    {
      emoji: "🇯🇵",
      name: "Japanese",
      position: { bottom: "40%", right: "8%" },
      delay: 0.9,
    },
    {
      emoji: "🇫🇷",
      name: "French",
      position: { bottom: "20%", left: "20%" },
      delay: 1.0,
    },
    {
      emoji: "🇩🇪",
      name: "German",
      position: { top: "40%", left: "15%" },
      delay: 1.1,
    },
    {
      emoji: "🇰🇷",
      name: "Korean",
      position: { top: "70%", left: "45%" },
      delay: 1.2,
    },
    {
      emoji: "🇮🇹",
      name: "Italian",
      position: { bottom: "55%", right: "20%" },
      delay: 1.3,
    },
  ];

  return (
    <>
      {flags.map((flag, i) => (
        <motion.div
          key={flag.name}
          className="absolute z-30"
          style={flag.position}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: flag.delay, duration: 0.5, type: "spring" }}
        >
          <motion.div
            className="relative w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/40 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.2 }}
          >
            <span className="text-3xl">{flag.emoji}</span>

            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/60"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.div>

          {/* Tooltip (Note: Tooltip interaction might need JS for true hover toggle, this is always there) */}
          <motion.div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {flag.name}
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}
