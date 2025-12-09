"use client"
import React, { useState, useEffect } from 'react';
import { Clock, Send, Award, TrendingUp, X } from 'lucide-react';

export default function LiveSession() {
  const [sessionTime, setSessionTime] = useState(0);
  const [message, setMessage] = useState('');
  const [reactions, setReactions] = useState([]);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { user: 'Alex', msg: 'Ready to learn React hooks!', time: '00:02' },
    { user: 'Sarah', msg: 'Let me share my screen', time: '00:15' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addReaction = (emoji) => {
    const id = Date.now();
    setReactions(prev => [...prev, { id, emoji, x: Math.random() * 80 + 10 }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages(prev => [...prev, { 
        user: 'You', 
        msg: message, 
        time: formatTime(sessionTime) 
      }]);
      setMessage('');
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Header with Timer and Credits */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 py-3 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span className="text-xl font-bold">TimeBank</span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="font-mono text-2xl font-bold text-green-400">
                {formatTime(sessionTime)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 backdrop-blur-md rounded-lg border border-indigo-400/30">
              <Award className="w-5 h-5" />
              <div className="text-sm">
                <div className="font-semibold">Balance</div>
                <div className="text-indigo-200">180 min</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div className="text-sm">
                <div className="font-semibold">Earning</div>
                <div className="text-green-400">+60 min</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Screen Video Feeds */}
      <div className="flex-1 flex">
        
        {/* Left Side - Tutor Video (50%) */}
        <div className="w-1/2 relative bg-gray-950 border-r border-gray-800">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
            <div className="text-center">
              <div className="w-40 h-40 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-5xl font-bold">SK</span>
              </div>
              <div className="text-3xl font-semibold mb-2">Sarah K.</div>
              <div className="text-indigo-400 font-medium text-lg mb-2">Tutor</div>
              <div className="text-gray-400">Teaching React Hooks</div>
            </div>
          </div>
          
          {/* Live Badge */}
          <div className="absolute top-6 left-6 px-4 py-2 bg-red-600 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>

          {/* Floating Reactions */}
          {reactions.map(r => (
            <div
              key={r.id}
              className="absolute bottom-8 text-6xl pointer-events-none"
              style={{ 
                left: `${r.x}%`,
                animation: 'float 2s ease-out forwards'
              }}
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* Right Side - Student Video (50%) */}
        <div className="w-1/2 relative bg-gray-950">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-900/30 to-teal-900/30">
            <div className="text-center">
              <div className="w-40 h-40 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-5xl font-bold">AL</span>
              </div>
              <div className="text-3xl font-semibold mb-2">Alex L.</div>
              <div className="text-green-400 font-medium text-lg mb-2">Student</div>
              <div className="text-gray-400">Learning React Hooks</div>
            </div>
          </div>

          <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-sm font-semibold border border-white/10">
            You
          </div>
        </div>
      </div>

      {/* Floating Chat Panel - Right Side */}
      {chatOpen && (
        <div className="absolute right-6 top-24 bottom-6 w-96 flex flex-col bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-20">
          <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="font-semibold text-lg">Live Chat</h3>
              <p className="text-sm text-gray-400">Ask questions, share notes</p>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((chat, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-indigo-400">
                    {chat.user}
                  </span>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/5">
                  <p className="text-sm">{chat.msg}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reactions */}
          <div className="p-3 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center justify-center gap-2 mb-3">
              <button 
                onClick={() => addReaction('👍')}
                className="p-2 hover:bg-white/10 rounded-lg transition text-2xl"
              >
                👍
              </button>
              <button 
                onClick={() => addReaction('❤️')}
                className="p-2 hover:bg-white/10 rounded-lg transition text-2xl"
              >
                ❤️
              </button>
              <button 
                onClick={() => addReaction('😊')}
                className="p-2 hover:bg-white/10 rounded-lg transition text-2xl"
              >
                😊
              </button>
              <button 
                onClick={() => addReaction('🎉')}
                className="p-2 hover:bg-white/10 rounded-lg transition text-2xl"
              >
                🎉
              </button>
              <button 
                onClick={() => addReaction('🔥')}
                className="p-2 hover:bg-white/10 rounded-lg transition text-2xl"
              >
                🔥
              </button>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-sm focus:outline-none focus:border-indigo-400 placeholder-gray-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Chat Button (when closed) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="absolute right-6 bottom-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full font-semibold shadow-lg z-20 transition"
        >
          Open Chat
        </button>
      )}

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-250px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}