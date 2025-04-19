import React, { useState } from "react";
import "./index.css"; // Tailwind styles
import './App.css';
import FloatingChatWidget from "./chatBot";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  return (
    <div className="App">
      <div className="relative z-50">
        {/* Floating Chat Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
        >
          {isOpen ? "✖" : "💬"}
        </button>

      {/* Chatbox Container */}
      {isOpen && (
        <FloatingChatWidget 
          onClose={() => setIsOpen(false)}
          messages={messages}
          setMessages={setMessages} />
      )}
      </div>
    </div>
  );
}

export default App;


