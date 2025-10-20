import { motion } from "framer-motion";
export function ChatBubbles() {
  const bubbles = [
    {
      text: "Hola! 👋",
      position: { top: "5%", left: "40%" },
      delay: 0.8,
    },
    {
      text: "你好! 😊",
      position: { top: "35%", right: "5%" },
      delay: 1.0,
    },
    {
      text: "Bonjour! 🇫🇷",
      position: { bottom: "35%", left: "5%" },
      delay: 1.2,
    },
    {
      text: "こんにちは! 🎌",
      position: { bottom: "10%", right: "25%" },
      delay: 1.4,
    },
    {
      text: "Ciao! 🇮🇹",
      position: { top: "50%", left: "8%" },
      delay: 1.6,
    },
  ];

  return (
    <>
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute z-30"
          style={bubble.position}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: bubble.delay, duration: 0.4, type: "spring" }}
        >
          <motion.div
            className="relative px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 shadow-lg whitespace-nowrap"
            animate={{
              y: [0, -8, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-white">{bubble.text}</span>

            {/* Chat bubble tail */}
            <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white/20" />
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}
