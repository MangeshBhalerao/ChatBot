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
      const response = await fetch('http://127.0.0.1:5000/chat', {
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
    <div className="flex flex-col gap-2 justify-center items-center h-screen" style={{ background: 'linear-gradient(45deg, #78a386, #000000 ,#9bc18e)' }}>
      
      {/* Message Display Area */}
    <div className="w-full max-w-2xl h-150 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block p-3 rounded-lg max-w-xs ${
            message.type === 'user' 
              ? 'bg-blue-500/20 text-white' 
              : 'bg-white/10 text-white backdrop-blur'
          }`}>
            {message.text}
          </div>
        </div>
      ))}
      {loading && (
        <div className="text-white/70 text-center">AI is thinking...</div>
      )}
    </div>

      {/* Message UI */}
      <div className="border flex gap-2 rounded-full p-2 bg-black/20 backdrop-blur">
        <input className=" w-150 pl-4 bg-transparent border-none outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Enter your message"
        />

        <button onClick={sendMessage} className="bg-black/50 text-sm text-white px-4 py-2 rounded-full hover:bg-zinc-800 hover:cursor-pointer">
          Send
        </button>
      </div>
    </div>
  );
}
