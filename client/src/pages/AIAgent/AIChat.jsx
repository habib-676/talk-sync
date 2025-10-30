// src/pages/AIChat.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";
import TalkSyncLogo from "../../components/logo/TalkSyncLogo";
import logo from "../../assets/logo/logo.png";

/**
 * Enhanced TalkSync AIChat with modern design
 * - Glass morphism effects
 * - Smooth animations
 * - Better visual feedback
 * - Innovative layout
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
  const [level, setLevel] = useState("A2");
  const [topic, setTopic] = useState("Daily life");

  // Voice features
  const [isRecording, setIsRecording] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // ====== Init Web Speech Recognition ======
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
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
      window.speechSynthesis.cancel();
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
      window.speechSynthesis.cancel();
      rec.start();
      setIsRecording(true);
    }
  };

  // ====== Start Speaking Session ======
  const startSpeakingSession = async () => {
    try {
      setConversations([]);
      setError("");

      const { data } = await axiosSecure.post("/speaking/coach", {
        targetLanguage: "English",
        level,
        topic,
        history: [],
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

  // ====== Send flow ======
  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    setLoading(true);
    setError("");

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
        // Text Mode
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
        // Speaking Mode
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

          setConversations((prev) => [
            ...prev,
            {
              id: Date.now() + 2,
              role: "assistant",
              content: brief,
              timestamp: new Date(),
            },
            {
              id: Date.now() + 3,
              role: "assistant",
              content: "[[SCORE_CARD]]" + JSON.stringify({
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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* ===== Mobile Sidebar Overlay ===== */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ===== Sidebar ===== */}
      <aside className={`
        fixed md:relative z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:flex md:w-80 flex-col bg-white/80 backdrop-blur-lg border-r border-gray-200/60 h-full
      `}>
        <div className="p-5 border-b border-gray-200/60">
          <div className="flex items-center justify-between">
            <TalkSyncLogo />
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* New Chat Button */}
          <button
            onClick={clearConversation}
            className="w-full px-6 py-4 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Start New Chat
          </button>

          {/* Recent Conversations */}
          <div className="space-y-4 mb-8">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
              <span>Recent Chats</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </h3>
            {conversations.length > 0 ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/60 hover:border-blue-300 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {conversations.find((c) => c.role === "user")?.content || "New conversation"}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{conversations.length} messages</span>
                      <span>•</span>
                      <span>{formatTime(conversations[0]?.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-sm">No recent conversations</p>
              </div>
            )}
          </div>

          {/* Quick Start Prompts */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
              <span>Quick Start</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </h3>
            <div className="grid gap-3">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(prompt);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full text-left p-4 text-sm bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/60 hover:border-blue-300 hover:bg-white/80 transition-all duration-300 group"
                >
                  <div className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                    {prompt.split("?")[0]}?
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                    Language learning
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-1 border-t border-gray-200/60">
          <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl ">
            <div className="relative">
              <div className="w-12 h-12  flex items-center justify-center">
                <img src={logo} alt=""/>
                
                
              </div>
              
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800">TalkSync AI</div>
              <div className="text-xs text-gray-600 truncate">
                {speakingMode ? "🎯 Speaking Coach" : "🤖 Assistant"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 p-4 lg:p-5.5 sticky top-0 z-30">
          <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div>
                
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${speakingMode ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`}></span>
                  {speakingMode ? "Speaking Practice Mode" : "Text Chat Mode"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mode Toggle */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setSpeakingMode(false)}
                  className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                    !speakingMode 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  💬 Text
                </button>
                <button
                  onClick={async () => {
                    setSpeakingMode(true);
                    await startSpeakingSession();
                  }}
                  className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                    speakingMode 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🎤 Speak
                </button>
              </div>

              {/* Speaking Config */}
              {speakingMode && (
                <div className="flex items-center gap-2">
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {["A1", "A2", "B1", "B2", "C1", "C2"].map((lv) => (
                      <option key={lv} value={lv}>Level {lv}</option>
                    ))}
                  </select>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {["Daily life", "Travel", "Study", "Work", "Food & Health", "Hobbies"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}

              {conversations.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                  title="Clear chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full p-4 lg:p-6">
            {/* Welcome Screen */}
            {conversations.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[70vh] text-center">
                <div className="relative mb-8">
                  <div className=" flex items-center justify-center  mb-4 transform hover:scale-105 transition-transform duration-300">
                    <img src={logo} alt="" className="w-20 h-20" />
                    
                  </div>
                  {speakingMode && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                        🎤 LIVE
                      </div>
                    </div>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {speakingMode ? "Ready to Practice Speaking?" : "Welcome to TalkSync AI"}
                </h1>
                <p className="text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
                  {speakingMode
                    ? "I'll ask engaging questions. Respond by speaking or typing, and get instant feedback on your pronunciation, fluency, and more!"
                    : "Ask me anything about language learning, TalkSync features, or get help with your language journey."}
                </p>

                {!speakingMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    {samplePrompts.slice(0, 4).map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(prompt)}
                        className="p-4 text-left bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                          {prompt}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Try this prompt
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={startSpeakingSession}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 font-semibold text-lg"
                  >
                    🎤 Start Speaking Practice
                  </button>
                )}
              </div>
            )}

            {/* Conversation */}
            <div className="space-y-6 py-4">
              {conversations.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <img src={logo} alt="AI" className="w-6 h-6" />
                      </div>
                    </div>
                  )}

                  <div className={`max-w-[80%] ${m.role === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-3xl px-6 py-4 backdrop-blur-sm ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md shadow-lg"
                          : "bg-white/80 text-gray-800 rounded-bl-md border border-gray-200/60 shadow-sm"
                      }`}
                    >
                      {m.content.startsWith?.("[[SCORE_CARD]]") ? (
                        <ScoreCard jsonText={m.content.replace("[[SCORE_CARD]]", "")} />
                      ) : (
                        <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                      )}
                    </div>

                    <div
                      className={`flex items-center gap-3 mt-3 text-xs ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="text-gray-500">{formatTime(m.timestamp)}</span>
                      <button
                        onClick={() => handleCopy(m.content, m.id)}
                        className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                      >
                        {copiedId === m.id ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {m.role === "user" && (
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <span className="text-white text-xs font-semibold">You</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Animation */}
              {loading && (
                <div className="flex gap-4">
                  <div className="flex items-center justify-center flex-shrink-0">
                    <img src={logo} alt="AI" className="w-10 h-10" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-3xl rounded-bl-md px-6 py-4 shadow-sm">
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm font-medium">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-sm">!</span>
                  </div>
                  <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-3xl px-6 py-4 max-w-[80%] shadow-sm">
                    <div className="text-red-700 text-sm">
                      <div className="font-semibold mb-1 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Something went wrong
                      </div>
                      <div>{error}</div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200/60 p-4 sticky bottom-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3">
              {/* Voice Toggle */}
              <button
                onClick={() => setSpeakEnabled((s) => !s)}
                title={speakEnabled ? "AI voice: ON" : "AI voice: OFF"}
                className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                  speakEnabled 
                    ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                    : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.034-3.78v7.56A4.5 4.5 0 0 0 16.5 12zm-2.034-7.535a8 8 0 0 1 0 15.07v-2.1a6 6 0 0 0 0-10.87v-2.1z" />
                </svg>
              </button>

              {/* Mic Button */}
              <button
                onClick={toggleRecord}
                title={isRecording ? "Stop recording" : "Start recording"}
                className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? 'bg-red-500 border-red-500 text-white shadow-lg animate-pulse'
                    : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2ZM11 19.95V22h2v-2.05a8.5 8.5 0 0 0 7-7.45h-2a6.5 6.5 0 0 1-13 0H3a8.5 8.5 0 0 0 8 7.45Z" />
                </svg>
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={speakingMode ? "Speak or type your answer..." : "Type your message..."}
                  className="w-full resize-none bg-white border-2 border-white rounded-2xl px-6 py-4 pr-20 focus:ring-2 focus:ring-white focus:border-white outline-none text-gray-800 placeholder:text-gray-500 transition-all duration-300"
                  rows={1}
                  spellCheck={false}
                  disabled={loading}
                />
                
                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={disabledSend}
                  className={`absolute right-3 bottom-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    disabledSend
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Status Text */}
            <div className="mt-1 text-center">
              <div className="text-xs text-gray-600 inline-flex items-center gap-1 bg-white/60 ">
                {isRecording ? (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Listening... {speakingMode ? "Answer the question" : "Speak your message"}</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>
                      {speakingMode ? "Click mic to speak your answer" : "Click mic to speak"} • 
                      AI Voice: <span className={speakEnabled ? "text-green-600 font-medium" : "text-gray-500"}>{speakEnabled ? "ON" : "OFF"}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/**
 * Enhanced Score Card Component
 */
function ScoreCard({ jsonText = "{}" }) {
  let data = {};
  try {
    data = JSON.parse(jsonText);
  } catch {
    return <div className="whitespace-pre-wrap">{jsonText}</div>;
  }

  const { scores = {}, tips = [], mistakes = [], pronunciation_hints = [], estimated_cefr } = data;

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          🎯 Speaking Assessment
        </h3>
        {estimated_cefr && (
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Level: {estimated_cefr}
          </div>
        )}
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="bg-white/80 rounded-xl p-3 border border-gray-200/60 text-center">
            <div className="text-xs uppercase text-gray-500 mb-1">{key}</div>
            <div className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}/5</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className={`h-1.5 rounded-full ${
                  value >= 4 ? 'bg-green-500' : value >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(value / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      {tips?.length > 0 && (
        <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-200/60">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            Improvement Tips
          </h4>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mistakes Section */}
      {mistakes?.length > 0 && (
        <div className="bg-red-50/80 rounded-2xl p-4 border border-red-200/60">
          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            Corrections
          </h4>
          <ul className="space-y-3">
            {mistakes.map((mistake, i) => (
              <li key={i} className="text-sm">
                <div className="text-red-600 line-through mb-1">{mistake?.original}</div>
                <div className="text-green-700 font-medium">→ {mistake?.better}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pronunciation Hints */}
      {pronunciation_hints?.length > 0 && (
        <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-200/60">
          <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            Pronunciation Tips
          </h4>
          <ul className="space-y-2">
            {pronunciation_hints.map((hint, i) => (
              <li key={i} className="text-sm text-purple-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}