'use client'
import { useState } from "react";


export default function Chat() {
  
  const [messages, setMessages] = useState([]);
  const [input,setInput] = useState('');
  const [loading,setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  
  const sendMessage = async () => {
    if (!input.trim()) return; // Don't send empty messages
    
    setLoading(true);
    
    try {
      // Send message to Flask backend
      const response = await fetch('https://chatbot-ro5t.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          conversation_id: conversationId 
        })
      });
      
      const data = await response.json();
      
      // Add both user message and AI response to messages
      setMessages(prev => [...prev, 
        { type: 'user', text: input },
        { type: 'ai', text: data.response }
      ]);
      
      // Store conversation ID for future messages
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      
      setInput(''); // Clear input field
    } catch (error) {
      console.error('Error:', error);
      // Add error message to chat
      setMessages(prev => [...prev, 
        { type: 'user', text: input },
        { type: 'ai', text: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen px-4 py-4 sm:px-6" style={{ background: 'linear-gradient(45deg, #78a386, #000000 ,#9bc18e)' }}>
      
      {/* Message Display Area */}
      <div className="flex-1 w-full max-w-4xl mx-auto overflow-y-auto p-2 sm:p-4 mb-4">
        {messages.length === 0 && (
          <div className="text-white/70 text-center mt-8">
            <h2 className="text-xl sm:text-2xl mb-2">Start a conversation!</h2>
            <p className="text-sm sm:text-base">Ask me anything...</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-lg max-w-xs sm:max-w-md ${
              message.type === 'user' 
                ? 'bg-blue-500/20 text-white' 
                : 'bg-white/10 text-white backdrop-blur'
            }`}>
              <div className="text-sm sm:text-base">{message.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-white/70 text-center">AI is thinking...</div>
        )}
      </div>

      {/* Message Input */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex gap-2 rounded-full p-2 bg-black/20 backdrop-blur border border-white/20">
          <input 
            className="flex-1 px-4 py-2 bg-transparent border-none outline-none text-white placeholder-white/70 text-sm sm:text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Enter your message..."
            disabled={loading}
          />
          <button 
            onClick={sendMessage} 
            className="bg-black/50 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors text-sm sm:text-base whitespace-nowrap"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
