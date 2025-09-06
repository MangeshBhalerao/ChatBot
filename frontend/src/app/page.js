'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <div
      className="flex flex-col justify-center items-center h-screen px-4"
      style={{
        background: 'url(https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Faurora-dark-green-black-green-orange-grainy-gradient-abstract-background-poster-banner_319965-3037.jpg&f=1&nofb=1&ipt=e8c47d9ddc7ab1b954586e294d55eaef728ef0221c2abf3f71bb91b6f82fb8f2)',
        backgroundSize: 'cover',
      }}
    >
      <h1 className="text-2xl sm:text-4xl font-bold text-white text-center mb-4">WELCOME TO AI CHATBOT</h1>
      <p className="text-base sm:text-lg text-white text-center mb-8 max-w-md">Your personal AI assistant is just a click away.</p>
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded text-base sm:text-lg"
        style={{
          background: 'linear-gradient(45deg, #78a386, #000000 ,#9bc18e)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        onClick={() => router.push("/chat")}
      >
        Try Chat
      </button>
    </div>
  );
}
