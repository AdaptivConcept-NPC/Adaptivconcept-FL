import React from "react";

/**
 * ChatMessage - A single message bubble in the Mini-Chat agent UI
 * @param {Object} message - { id, role: "user"|"agent", text }
 * @param {string} accentColor - Theme color for agent bubbles
 */
const ChatMessage = ({ message, accentColor }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm shadow ${
          isUser ? "rounded-br-sm text-white" : "rounded-bl-sm text-high"
        }`}
        style={
          isUser
            ? { backgroundColor: accentColor }
            : { backgroundColor: "rgba(255,255,255,0.08)" }
        }
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;