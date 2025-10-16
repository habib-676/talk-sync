import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function SpeakingPracticeDemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(false); // state for browser support
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support on mount
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setBrowserSupportsSpeech(true);
    }
  }, []);

  const startRecording = () => {
    if (!browserSupportsSpeech) {
      alert(
        "Your browser does not support speech recognition. Please try Chrome or Edge."
      );
      return;
    }

    setTranscript(""); // Clear previous transcript
    setFeedback(""); // Clear previous feedback

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false; // We want final results only
    recognitionRef.current.maxAlternatives = 1; // Only get the most likely transcript

    recognitionRef.current.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const text = lastResult[0].transcript;
      setTranscript(text);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      setIsProcessing(false); // Stop processing state on error
      if (event.error === "not-allowed") {
        setFeedback(
          "Microphone access denied. Please allow in browser settings."
        );
      } else if (event.error === "no-speech") {
        setFeedback("No speech detected. Please speak clearly.");
      } else {
        setFeedback(`Error: ${event.error}. Please try again.`);
      }
      speakAI(feedback);
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        // Only process if recording was actively stopped by user or speech ended naturally
        setIsRecording(false);
        processTranscript(transcript); // Process transcript after recording ends
      }
    };

    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      // Feedback generation will happen in onend
    }
  };

  const processTranscript = async (text) => {
    setIsProcessing(true); // Start processing state
    if (!text) {
      const noSpeechFeedback = "Please say something 🎙️";
      setFeedback(noSpeechFeedback);
      speakAI(noSpeechFeedback);
      setIsProcessing(false); // End processing
      return;
    }

    let reply = "";
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (text.split(" ").length < 6) {
      reply = "Try speaking in full sentences for better fluency.";
    } else {
      reply = "Great job! Your pronunciation is clear and confident.";
    }

    setFeedback(reply);
    speakAI(reply); // AI voice reply
    setIsProcessing(false); // End processing
  };

  const speakAI = (message) => {
    const synth = window.speechSynthesis;
    // Clear any existing utterances before speaking new ones
    if (synth.speaking) {
      synth.cancel();
    }
    const utter = new SpeechSynthesisUtterance(message);
    utter.lang = "en-US";
    utter.pitch = 1;
    utter.rate = 1;
    synth.speak(utter);
  };

  return (
    <section className="relative bg-white py-16 md:py-24 overflow-hidden">
      {/* Decorative gradient circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-20"></div>{" "}
      {/* Primary gradient */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full blur-3xl opacity-20"></div>{" "}
      {/* Primary gradient (reversed) */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-gray-900"
        >
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {" "}
            Speaking Practice Demo
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Speak freely and get instant{" "}
          <span className="font-semibold text-blue-600">
            AI-powered feedback
          </span>{" "}
          (with voice).
        </motion.p>

        {/* Browser support warning */}
        {!browserSupportsSpeech && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg max-w-lg mx-auto"
          >
            <p className="font-semibold">Speech recognition not supported.</p>
            <p className="text-sm">Please use Chrome or Edge for this demo.</p>
          </motion.div>
        )}

        {/* Mic Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-6 sm:p-8 rounded-full shadow-xl border-4 transition-all duration-300 relative focus:outline-none focus:ring-4 focus:ring-blue-300 ${
              isRecording
                ? "bg-red-500 border-red-300 animate-pulse-slow text-white"
                : "bg-white border-transparent text-blue-600 hover:scale-110"
            } ${!browserSupportsSpeech ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{
              backgroundImage: !isRecording
                ? "linear-gradient(white, white), linear-gradient(to right, #2563EB, #4F46E5)"
                : undefined,
              backgroundOrigin: !isRecording ? "border-box" : undefined,
              backgroundClip: !isRecording
                ? "padding-box, border-box"
                : undefined,
            }}
            disabled={!browserSupportsSpeech}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <Square size={40} /> : <Mic size={40} />}
            {isRecording && (
              <span className="absolute inset-0 rounded-full ring-4 ring-red-400 opacity-75 animate-ping-slow" /> // Pulsing ring effect
            )}
          </button>
          <p className="text-sm italic text-gray-600">
            {isRecording ? (
              <span className="flex items-center gap-2 text-blue-600 font-semibold">
                <Mic size={16} className="text-blue-600" /> Listening...
              </span>
            ) : isProcessing ? (
              <span className="flex items-center gap-2 text-indigo-600 font-semibold">
                <Loader size={16} className="animate-spin text-indigo-600" />{" "}
                Processing...
              </span>
            ) : (
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent font-medium">
                {" "}
                {/* Primary gradient */}
                Tap mic to start speaking
              </span>
            )}
          </p>
        </motion.div>

        {/* Transcript */}
        {(transcript || isProcessing) && ( // Show transcript area if there's text or processing
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }} // Use animate for dynamic visibility
            transition={{ duration: 0.6 }}
            className="mt-10 max-w-2xl mx-auto bg-white/80 backdrop-blur-md text-gray-900 rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              {/* Primary gradient */}
              Your Speech
            </h3>
            <p className="leading-relaxed text-gray-800">
              {transcript || "Waiting for your speech..."}
            </p>
          </motion.div>
        )}

        {/* Feedback */}
        {(feedback || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-6 max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 rounded-2xl shadow-lg border border-blue-200 p-6"
          >
            <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              AI Feedback
            </h3>
            <p className="leading-relaxed text-gray-800">
              {isProcessing && !feedback ? (
                <span className="flex items-center gap-2">
                  <Loader size={20} className="animate-spin text-indigo-600" />{" "}
                  Generating feedback...
                </span>
              ) : (
                feedback
              )}
            </p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
        >
          Try a Free Demo Now 🚀
        </motion.button>
      </div>
    </section>
  );
}
