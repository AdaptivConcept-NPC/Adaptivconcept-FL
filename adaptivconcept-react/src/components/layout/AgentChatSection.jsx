import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, CheckCircle2 } from "lucide-react";
import ChatMessage from "./ChatMessage";

/**
 * AgentChatSection - Mini-Chat Style Agent Component foundation.
 * Pluggable foundation: replace the simulated reply with a real
 * WebSocket/API integration when the Agent Lab connects.
 * @param {string} accentColor - Theme color
 * @param {Function} onMessage - Optional intercept for outbound messages
 */
const AgentChatSection = ({ accentColor, onMessage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "agent",
      text: "Codex AI Agent online. Ask me anything about the site.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected] = useState(true);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const outbound = {
      id: messages.length + 1,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, outbound]);
    setInput("");
    onMessage?.(outbound);

    setIsTyping(true);
    // Placeholder: swap with real agent integration
    setTimeout(() => {
      const reply = {
        id: Date.now(),
        role: "agent",
        text: `Echo from Codex agent: "${trimmed}"`,
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Connection status */}
      <div
        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
        style={{ color: isConnected ? "#39ff14" : "rgba(255,255,255,0.4)" }}
        aria-live="polite"
      >
        <CheckCircle2 size={12} />
        {isConnected ? "Connected" : "Offline"}
      </div>

      {/* Message list */}
      <div
        ref={bodyRef}
        className="max-h-[200px] overflow-y-auto no-scrollbar space-y-2"
        role="log"
        aria-label="Agent chat messages"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} accentColor={accentColor} />
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="flex items-center gap-1 px-3 py-2 rounded-2xl rounded-bl-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              aria-label="Agent is typing"
            >
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-white/70"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Ask the agent..."
          aria-label="Agent chat message input"
          className="flex-1 px-3 py-2 rounded border bg-black/50 text-white text-sm placeholder:text-white/40 focus:outline-none"
          style={{ borderColor: "var(--glass-border)" }}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
          className="p-2.5 rounded-lg text-white transition-opacity disabled:opacity-40 hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          <Send size={16} />
        </button>
      </div>

      <p className="flex items-center gap-1.5 text-[10px] text-low uppercase tracking-widest">
        <Bot size={11} /> Powered by Codex agent lab (integration pending)
      </p>
    </div>
  );
};

export default AgentChatSection;