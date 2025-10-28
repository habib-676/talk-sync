// src/pages/AIChat.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";

/**
 * TalkSync AIChat
 * - Two clean modes:
 *   1) Text Mode: plain Q/A via /agent/chat (no speaking scores)
 *   2) Speaking Mode: coach flow (question -> your answer -> scores -> follow-up)
 *      uses /speaking/{coach,assess,followup}
 * - Built-in Web Speech:
 *   - Mic (STT) with Web Speech Recognition
 *   - AI Voice (TTS) with speechSynthesis
 */
export default function AIChat() {
  // ====== Core state ======
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Modes & speaking options
  const [speakingMode, setSpeakingMode] = useState(false);
  const [level, setLevel] = useState("A2");           // CEFR: A1..C2
  const [topic, setTopic] = useState("Daily life");    // short topic label

  // Voice features
  const [isRecording, setIsRecording] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(true);

  // Refs
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  // ====== Helpers ======
  const samplePrompts = [
    "How do I find a language partner who speaks French?",
    "What's the best way to improve my pronunciation?",
    "How do video calls work on TalkSync?",
    "Tell me about the language exchange features",
    "আমি কিভাবে বাংলা ভাষা শিখতে পারি?",
    "How can I track my language learning progress?",
  ];

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ====== Auto-resize textarea ======
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  // ====== Auto-scroll to bottom ======
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, loading]);

  // ====== Init Web Speech Recognition (STT) once ======
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return; // unsupported browser
    const rec = new SR();
    rec.lang = "en-US"; // You can make this dynamic later
    rec.interimResults = true;
    rec.continuous = true;

    let partial = "";

    rec.onresult = (e) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += chunk;
        else partial = chunk;
      }
      if (final) {
        setInput((prev) => (prev ? prev + " " : "") + final.trim());
        partial = "";
      }
    };

    rec.onerror = (e) => {
      console.warn("SpeechRecognition error:", e);
      setError(e.error || "Speech recognition error");
      setIsRecording(false);
    };

    rec.onend = () => setIsRecording(false);

    recognitionRef.current = rec;
  }, []);

  const disabledSend = useMemo(() => loading || !input.trim(), [loading, input]);

  // ====== TTS (AI speaks) ======
  const speak = (text) => {
    try {
      if (!speakEnabled || !text) return;
      const u = new SpeechSynthesisUtterance(text);
      // u.lang = "en-US"; // set dynamically if you want
      window.speechSynthesis.cancel(); // stop any previous utterance
      window.speechSynthesis.speak(u);
    } catch {
      /* no-op */
    }
  };

  // ====== Mic toggle ======
  const toggleRecord = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      setError("Your browser doesn't support Speech Recognition.");
      return;
    }
    if (isRecording) {
      rec.stop();
      setIsRecording(false);
    } else {
      setError("");
      window.speechSynthesis.cancel(); // stop any current AI speech
      rec.start();
      setIsRecording(true);
    }
  };

  // ====== Start Speaking Session (first question) ======
  const startSpeakingSession = async () => {
    try {
      // Reset convo for a clean speaking session
      setConversations([]);
      setError("");

      const { data } = await axiosSecure.post("/speaking/coach", {
        targetLanguage: "English",
        level,
        topic,
        history: [], // keep last QAs if you store them
      });

      const q = data?.question || "Tell me about your day.";
      const first = {
        id: Date.now(),
        role: "assistant",
        content: `Question: ${q}`,
        timestamp: new Date(),
      };
      setConversations([first]);
      speak(q);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to start speaking session");
    }
  };

  // ====== Send flow (split by mode) ======
  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    setLoading(true);
    setError("");

    // Push user message immediately
    const userMsg = {
      id: Date.now(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setConversations((prev) => [...prev, userMsg]);
    setInput("");

    try {
      if (!speakingMode) {
        // =================== TEXT MODE ===================
        const res = await axiosSecure.post("/agent/chat", { question: message });
        const aiContent = res.data?.answer || "No answer found.";
        const aiMsg = {
          id: Date.now() + 1,
          role: "assistant",
          content: aiContent,
          timestamp: new Date(),
        };
        setConversations((prev) => [...prev, aiMsg]);
        speak(aiContent);
      } else {
        // =================== SPEAKING MODE ===================
        // 1) Assess your reply
        const assess = await axiosSecure.post("/speaking/assess", {
          transcript: message,
          targetLanguage: "English",
          level,
          topic,
        });

        if (assess.data?.success && assess.data.data) {
          const {
            scores,
            summary,
            estimated_cefr,
            tips,
            pronunciation_hints,
            mistakes,
            spoken_feedback,
          } = assess.data.data;

          const brief =
            `Scores — Pron:${scores?.pronunciation}/5 • Flu:${scores?.fluency}/5 • ` +
            `Gram:${scores?.grammar}/5 • Vocab:${scores?.vocabulary}/5 • ` +
            `Detail:${scores?.detail}/5 • Coh:${scores?.coherence}/5\n` +
            (summary ? `Summary: ${summary}\n` : "") +
            (estimated_cefr ? `Estimated CEFR: ${estimated_cefr}` : "");

          // A compact text summary
          setConversations((prev) => [
            ...prev,
            {
              id: Date.now() + 2,
              role: "assistant",
              content: brief,
              timestamp: new Date(),
            },
            // An inline JSON block (lets you render a fancy score card later if you want)
            {
              id: Date.now() + 3,
              role: "assistant",
              content:
                "[[SCORE_CARD]]" +
                JSON.stringify({
                  scores,
                  tips,
                  mistakes,
                  pronunciation_hints,
                  estimated_cefr,
                }),
              timestamp: new Date(),
            },
          ]);

          if (spoken_feedback) speak(spoken_feedback);
        }

        // 2) Follow-up short question
        const follow = await axiosSecure.post("/speaking/followup", {
          userAnswer: message,
          targetLanguage: "English",
          level,
          topic,
        });
        const nextQ = follow.data?.question || "Could you tell me more?";
        const fMsg = {
          id: Date.now() + 4,
          role: "assistant",
          content: `Question: ${nextQ}`,
          timestamp: new Date(),
        };
        setConversations((prev) => [...prev, fMsg]);
        speak(nextQ);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ====== Keyboard send ======
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ====== Copy ======
  const handleCopy = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  };

  // ====== Clear chat ======
  const clearConversation = () => {
    setConversations([]);
    setError("");
    setInput("");
    window.speechSynthesis?.cancel();
  };

  return (
    <div className="flex h-screen bg-white">
      {/* ===== Sidebar ===== */}
      <aside className="hidden md:flex md:w-64 lg:w-80 flex-col bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={clearConversation}
            className="w-full px-4 py-3 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-3 text-blue-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Today
            </h3>
            {conversations.length > 0 && (
              <div className="text-sm text-gray-700 p-3 hover:bg-blue-50 rounded-lg cursor-pointer border border-gray-200">
                <div className="truncate">
                  {conversations.find((c) => c.role === "user")?.content || "New conversation"}
                </div>
                <div className="text-xs text-gray-500 mt-1">{conversations.length} messages</div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Quick Start
            </h3>
            <div className="space-y-2">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="w-full text-left p-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">TS</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800">TalkSync AI</div>
              <div className="text-xs text-gray-600 truncate">
                {speakingMode ? "Speaking coach" : "Assistant"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== Main ===== */}
      <main className="flex-1 flex flex-col">
        {/* Header with Mode Toggle */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">AI</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-800">TalkSync Assistant</h1>
                <p className="text-sm text-gray-600">
                  {speakingMode ? "Voice-enabled • Speaking Mode" : "Voice-enabled • Text Mode"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Mode buttons */}
              <button
                onClick={() => setSpeakingMode(false)}
                className={`px-3 py-2 text-sm rounded-lg border ${
                  !speakingMode ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-300"
                }`}
              >
                Text Mode
              </button>
              <button
                onClick={async () => {
                  setSpeakingMode(true);
                  await startSpeakingSession();
                }}
                className={`px-3 py-2 text-sm rounded-lg border ${
                  speakingMode ? "bg-green-600 text-white border-green-600" : "bg-white border-gray-300"
                }`}
              >
                Speaking Mode
              </button>

              {/* Speaking config (only visible in speaking mode) */}
              {speakingMode && (
                <>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="px-2 py-2 text-sm rounded-lg border border-gray-300 bg-white"
                  >
                    {["A1", "A2", "B1", "B2", "C1", "C2"].map((lv) => (
                      <option key={lv} value={lv}>
                        {lv}
                      </option>
                    ))}
                  </select>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="px-2 py-2 text-sm rounded-lg border border-gray-300 bg-white"
                  >
                    {["Daily life", "Travel", "Study", "Work", "Food & Health", "Hobbies"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {conversations.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 bg-white rounded-lg transition-colors border border-gray-300"
                >
                  Clear chat
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto w-full p-4">
            {/* Welcome */}
            {conversations.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 border border-blue-200">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {speakingMode ? "Start your speaking practice" : "How can I help you today?"}
                </h1>
                <p className="text-gray-600 text-lg mb-8 max-w-md">
                  {speakingMode
                    ? "I'll ask short questions. Answer by speaking or typing, and I'll score your pronunciation, fluency, grammar, vocabulary, detail & coherence."
                    : "Ask me anything about TalkSync and language learning. I’ll answer clearly."}
                </p>

                {!speakingMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                    {samplePrompts.slice(0, 4).map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(prompt)}
                        className="p-4 text-left text-gray-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl hover:border-blue-300 transition-all duration-200"
                      >
                        <div className="font-medium mb-1">{prompt.split("?")[0]}?</div>
                        <div className="text-xs text-gray-600">Language learning</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={startSpeakingSession}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    Start Speaking Session
                  </button>
                )}
              </div>
            )}

            {/* Conversation bubbles */}
            <div className="space-y-6 py-4">
              {conversations.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-semibold">AI</span>
                    </div>
                  )}

                  <div className={`max-w-[85%] ${m.role === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        m.role === "user"
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-gray-50 text-gray-800 rounded-bl-md border border-gray-200"
                      }`}
                    >
                      {/* If SCORE_CARD block, render a quick readable view */}
                      {m.content.startsWith?.("[[SCORE_CARD]]") ? (
                        <ScoreCard jsonText={m.content.replace("[[SCORE_CARD]]", "")} />
                      ) : (
                        <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                      )}
                    </div>

                    <div
                      className={`flex items-center gap-2 mt-2 text-xs ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="text-gray-500">{formatTime(m.timestamp)}</span>
                      <button
                        onClick={() => handleCopy(m.content, m.id)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {copiedId === m.id ? (
                          <span className="text-green-600">✓ Copied</span>
                        ) : (
                          "Copy"
                        )}
                      </button>
                    </div>
                  </div>

                  {m.role === "user" && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-semibold">You</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading bubble */}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">AI</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full animate-bounce bg-blue-500" />
                        <div
                          className="w-2 h-2 rounded-full animate-bounce bg-blue-500"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full animate-bounce bg-blue-500"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error bubble */}
              {error && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 max-w-[85%]">
                    <div className="text-red-700 text-sm">
                      <div className="font-medium mb-1">Error</div>
                      <div>{error}</div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* ===== Input Area with Mic + Voice Toggle ===== */}
        <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2">
              {/* Mic */}
              <button
                onClick={toggleRecord}
                title={isRecording ? "Stop recording" : "Start recording"}
                className={`w-10 h-10 rounded-lg border ${
                  isRecording ? "bg-red-100 border-red-300 text-red-600" : "bg-gray-50 border-gray-300 text-gray-700"
                } flex items-center justify-center`}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2ZM11 19.95V22h2v-2.05a8.5 8.5 0 0 0 7-7.45h-2a6.5 6.5 0 0 1-13 0H3a8.5 8.5 0 0 0 8 7.45Z" />
                </svg>
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={speakingMode ? "Speak or type your answer..." : "Type your message..."}
                className="flex-1 resize-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 placeholder:text-gray-500 min-h-[56px] max-h-32 transition-colors"
                rows={1}
                spellCheck={false}
                disabled={loading}
              />

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={disabledSend}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  disabledSend
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25"
                }`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              {/* Voice toggle */}
              <button
                onClick={() => setSpeakEnabled((s) => !s)}
                title={speakEnabled ? "AI voice: ON" : "AI voice: OFF"}
                className={`w-10 h-10 rounded-lg border ${
                  speakEnabled ? "bg-green-50 border-green-300 text-green-700" : "bg-gray-50 border-gray-300 text-gray-700"
                } flex items-center justify-center`}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.034-3.78v7.56A4.5 4.5 0 0 0 16.5 12zm-2.034-7.535a8 8 0 0 1 0 15.07v-2.1a6 6 0 0 0 0-10.87v-2.1z" />
                </svg>
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-500 text-center">
              {speakingMode
                ? isRecording
                  ? "Listening… answer the question by speaking."
                  : "Click mic to speak your answer."
                : isRecording
                ? "Listening… speak your message or type."
                : "Click mic to speak. AI Voice is " + (speakEnabled ? "ON" : "OFF") + "."}
            </div>

            {error && <div className="mt-2 text-sm text-red-600 text-center">{error}</div>}
          </div>
        </footer>
      </main>
    </div>
  );
}

/**
 * Tiny renderer for the inline [[SCORE_CARD]] JSON block
 * You can replace this with a fancy card UI later.
 */
function ScoreCard({ jsonText = "{}" }) {
  let data = {};
  try {
    data = JSON.parse(jsonText);
  } catch {
    return <div className="whitespace-pre-wrap">{jsonText}</div>;
  }

  const { scores = {}, tips = [], mistakes = [], pronunciation_hints = [], estimated_cefr } = data;

  return (
    <div className="text-sm space-y-2">
      <div className="font-semibold">Speaking Assessment</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(scores).map(([k, v]) => (
          <div key={k} className="px-2 py-1 bg-white/70 border border-gray-200 rounded">
            <span className="capitalize">{k}</span>: <span className="font-medium">{v}/5</span>
          </div>
        ))}
      </div>

      {estimated_cefr && (
        <div className="px-2 py-1 bg-white/70 border border-gray-200 rounded inline-block">
          Estimated CEFR: <span className="font-semibold">{estimated_cefr}</span>
        </div>
      )}

      {tips?.length > 0 && (
        <div>
          <div className="font-medium">Tips</div>
          <ul className="list-disc list-inside space-y-1">
            {tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {mistakes?.length > 0 && (
        <div>
          <div className="font-medium">Corrections</div>
          <ul className="list-disc list-inside space-y-1">
            {mistakes.map((m, i) => (
              <li key={i}>
                <span className="text-red-600 line-through">{m?.original}</span>{" "}
                <span className="text-green-700">→ {m?.better}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pronunciation_hints?.length > 0 && (
        <div>
          <div className="font-medium">Pronunciation Hints</div>
          <ul className="list-disc list-inside space-y-1">
            {pronunciation_hints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
