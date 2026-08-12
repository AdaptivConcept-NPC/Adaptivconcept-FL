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
          isUser ? "rounded-br-sm" : "rounded-bl-sm"
        }`}
        style={
          isUser
            ? {
                backgroundColor: accentColor,
                color: "var(--on-theme-text, #ffffff)",
              }
            : { backgroundColor: "rgba(10,10,10,0.06)", color: "#0a0a0a" }
        }
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;