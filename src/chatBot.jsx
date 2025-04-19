import { useState } from "react";

export default function FloatingChatWidget({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages([...messages, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://4a4a-2a00-1f-9482-3001-aced-6c92-f9c2-75a2.ngrok-free.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userMsg, history: messages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: "ai", text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: "ai", text: "⚠️ Error connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border rounded-2xl shadow-2xl p-4 text-sm flex flex-col z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-lg font-bold"
        aria-label="Close chat"
      >
        ×
      </button>

      <div className="font-bold mb-2 text-center mt-1">🛍️ Unit Assistant</div>

      <div className="h-64 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`text-left p-2 rounded-xl ${msg.sender === "user" ? "bg-blue-100 text-right ml-8" : "bg-gray-100 mr-8"}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-400">Typing...</div>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-xl px-3 py-1"
          placeholder="Ask about products, delivery..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-1 rounded-xl">Send</button>
      </div>
    </div>
  );
}
