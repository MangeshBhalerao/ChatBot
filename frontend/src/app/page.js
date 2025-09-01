'use client'
import { useState } from "react";




export default function Home() {
  
  const [messages, setMessages] = useState([]);
  const [input,setInput] = useState('');
  const [loading,setLoading] = useState(false)
  
  const sendMessage = async () =>{
  }

  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen" style={{ background: 'linear-gradient(45deg, #78a386, #000000 ,#9bc18e)' }}>
      
      {/* Message UI */}
      <div className="border flex gap-2 rounded-full p-3 bg-black/20 backdrop-blur">
        <input className=" w-150 pl-4 bg-transparent border-none outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message"
        />
        <button onClick={sendMessage} className="bg-zinc-700 text-white px-4 py-2 rounded-full hover:bg-zinc-800 hover:cursor-pointer">
          Send
        </button>
      </div>
    </div>
  );
}
