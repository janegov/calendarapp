import React, { useRef, useState, useEffect } from 'react';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: 'This is a mock AI response. (Connect your backend here!)' }]);
    }, 800);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleMic() {
    // Placeholder for future voice input
    alert('Voice input coming soon!');
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-900 text-white p-0">
      {/* Big Title and Intro Bubble only if no messages */}
      {messages.length === 0 && (
        <div className="w-full flex flex-col items-center justify-end min-h-[55vh] mb-4">
          <h1
            className="text-5xl md:text-5.5xl font-bold text-center mb-10 bg-gradient-to-r bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(to right, #97add3, #2e4f84, #4576c9)' }}
          >
            Welcome to your personal AI.
          </h1>
          {/* Intro Bubble */}
          <div className="bg-gray-700 text-gray-100 rounded-2xl px-6 py-5 max-w-xl text-lg shadow mb-6 text-center">
            Based on information you give, suggestions, changes, your personal AI assistant corrects it in your calendar for you
          </div>
        </div>
      )}
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 pt-0" ref={chatRef}>
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-xl px-4 py-3 max-w-[80%] shadow
                  ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-100 rounded-bl-none'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Input Row */}
      <form
        className="w-full max-w-2xl mx-auto flex items-center gap-2 p-4 bg-gray-900 border-t border-gray-800"
        onSubmit={e => { e.preventDefault(); handleSend(); }}
      >
        <textarea
          className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button
          type="button"
          onClick={handleMic}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Record voice message"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v2m0 0h4m-4 0H8m4-2a4 4 0 004-4V7a4 4 0 10-8 0v7a4 4 0 004 4z" />
          </svg>
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow"
        >
          Send
        </button>
      </form>
    </div>
  );
}
