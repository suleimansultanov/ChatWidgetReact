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
      setMessages(prev => [...prev, { sender: "ai", text: "⚠️ Ошибка соединения с AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-[360px] rounded-3xl shadow-2xl overflow-hidden font-sans z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-400 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div className="text-sm font-semibold leading-tight">
            Виртуальный<br />помощник Unit
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white text-xl font-bold leading-none"
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      {/* Message Box */}
      <div className="bg-white p-4 h-64 overflow-y-auto space-y-2 text-sm">
        {messages.length === 0 && (
          <div className="bg-gray-100 text-gray-800 p-3 rounded-xl">
            Привет! Я здесь, чтобы помочь с вопросами о продуктах, доставке или оформлении заказа.
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl max-w-[85%] ${
              msg.sender === "user"
                ? "bg-blue-100 text-right ml-auto"
                : "bg-gray-100 mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-400">✍️ Печатает...</div>}
      </div>

      {/* Input Section */}
      <div className="bg-white px-4 pb-4 pt-2 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Напишите ваш вопрос о товаре..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-4 py-2 text-sm font-medium rounded-xl hover:opacity-90 transition"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
