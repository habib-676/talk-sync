import { useEffect, useMemo, useRef, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, loading]);

  const disabled = useMemo(() => loading || !input.trim(), [loading, input]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    setLoading(true);
    setError("");
    
    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      timestamp: new Date()
    };

    setConversations(prev => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axiosSecure.post("/agent/chat", { question: message });
      
      if (res.data?.success) {
        const aiContent = res.data.answer || "No answer found.";
        
        // Add AI message
        const aiMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: aiContent,
          timestamp: new Date()
        };

        setConversations(prev => [...prev, aiMessage]);
      } else {
        throw new Error(res.data?.message || "No response from AI");
      }
    } catch (err) {
      console.error("AI Chat error:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      // Ignore copy errors
    }
  };

  const clearConversation = () => {
    setConversations([]);
    setError("");
  };

  const samplePrompts = [
    "How do I find a language partner who speaks French?",
    "What's the best way to improve my pronunciation?",
    "How do video calls work on TalkSync?",
    "Tell me about the language exchange features",
    "আমি কিভাবে বাংলা ভাষা শিখতে পারি?",
    "How can I track my language learning progress?"
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 lg:w-80 flex-col bg-white border-r border-gray-200">
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
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Today</h3>
            {conversations.length > 0 && (
              <div className="text-sm text-gray-700 p-3 hover:bg-blue-50 rounded-lg cursor-pointer border border-gray-200">
                <div className="truncate">
                  {conversations.find(c => c.role === "user")?.content || "New conversation"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {conversations.length} messages
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Quick Start</h3>
            <div className="space-y-2">
              {samplePrompts.map((prompt, index) => (
                <button
                  key={index}
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
              <div className="text-xs text-gray-600 truncate">Always learning</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">AI</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-800">TalkSync Assistant</h1>
                <p className="text-sm text-gray-600">Powered by AI • Online</p>
              </div>
            </div>
            
            {conversations.length > 0 && (
              <button
                onClick={clearConversation}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-blue-50 rounded-lg transition-colors border border-gray-300"
              >
                Clear chat
              </button>
            )}
          </div>
        </header>

        {/* Messages Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto bg-white"
        >
          <div className="max-w-3xl mx-auto w-full p-4">
            {/* Welcome Screen */}
            {conversations.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 border border-blue-200">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">How can I help you today?</h1>
                <p className="text-gray-600 text-lg mb-8 max-w-md">
                  I'm your TalkSync AI assistant. Ask me about language learning, features, or anything else!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {samplePrompts.slice(0, 4).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(prompt)}
                      className="p-4 text-left text-gray-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl hover:border-blue-300 transition-all duration-200"
                    >
                      <div className="font-medium mb-1">{prompt.split('?')[0]}?</div>
                      <div className="text-xs text-gray-600">Language learning</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-6 py-4">
              {conversations.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-semibold">AI</span>
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] ${message.role === "user" ? "order-first" : ""}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === "user" 
                        ? "bg-blue-500 text-white rounded-br-md" 
                        : "bg-gray-50 text-gray-800 rounded-bl-md border border-gray-200"
                    }`}>
                      <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    </div>
                    
                    <div className={`flex items-center gap-2 mt-2 text-xs ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}>
                      <span className="text-gray-500">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {copiedId === message.id ? (
                          <span className="text-green-500">✓ Copied</span>
                        ) : (
                          "Copy"
                        )}
                      </button>
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-semibold">You</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">AI</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
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

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message TalkSync AI..."
                className="w-full resize-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 placeholder:text-gray-500 min-h-[56px] max-h-32 transition-colors"
                rows={1}
                spellCheck={false}
                disabled={loading}
              />
              
              <button
                onClick={handleSend}
                disabled={disabled}
                className={`absolute right-3 bottom-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  disabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25"
                }`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 text-center">
              TalkSync AI can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}