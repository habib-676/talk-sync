import React, { useState, useRef } from "react";
import { Mic, Square } from "lucide-react";
import { motion } from "framer-motion";

export default function SpeakingPracticeDemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const recognitionRef = useRef(null);

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognitionRef.current.onend = () => setIsRecording(false);
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    generateFeedback(transcript);
  };

  const generateFeedback = (text) => {
    if (!text) {
      setFeedback("Please say something 🎙️");
      speakAI("Please say something.");
      return;
    }

    let reply = "";
    if (text.split(" ").length < 6) {
      reply = "Try speaking in full sentences for better fluency.";
    } else {
      reply = "Great job! Your pronunciation is clear.";
    }

    setFeedback(reply);
    speakAI(reply); // AI voice reply
  };

  const speakAI = (message) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(message);
    utter.lang = "en-US";
    utter.pitch = 1;
    utter.rate = 1;
    synth.speak(utter);
  };

  return (
    <section className="relative bg-white py-24 overflow-hidden">
      {/* Decorative gradient circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-4"
        >
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Speaking Practice Demo
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-lg text-gray-700"
        >
          Speak freely and get instant{" "}
          <span className="font-semibold">AI-powered feedback</span> (with voice).
        </motion.p>

        {/* Mic Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-8 rounded-full shadow-xl border-4 transition-all ${
              isRecording
                ? "bg-red-500 border-red-300 animate-pulse text-white"
                : "bg-white border-4 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-purple-600 hover:scale-110"
            }`}
            style={{
              backgroundImage: !isRecording
                ? "linear-gradient(white, white), linear-gradient(to right, #3b82f6, #9333ea, #ec4899)"
                : undefined,
              backgroundOrigin: !isRecording ? "border-box" : undefined,
              backgroundClip: !isRecording ? "padding-box, border-box" : undefined,
            }}
          >
            {isRecording ? <Square size={40} /> : <Mic size={40} />}
          </button>
          <p className="text-sm italic text-gray-500">
            {isRecording ? "🎙️ Listening..." : "Tap mic to start speaking"}
          </p>
        </motion.div>

        {/* Transcript */}
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-10 max-w-2xl mx-auto bg-white/80 backdrop-blur-md text-gray-900 rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="font-bold text-lg mb-2 text-purple-700">
              Your Speech
            </h3>
            <p className="leading-relaxed">{transcript}</p>
          </motion.div>
        )}

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-6 max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50 text-gray-800 rounded-2xl shadow-lg border border-purple-200 p-6"
          >
            <h3 className="font-bold text-lg mb-2 text-purple-700">
              AI Feedback
            </h3>
            <p className="leading-relaxed">{feedback}</p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition"
        >
          Try a Free Demo Now 🚀
        </motion.button>
      </div>
    </section>
  );
}
