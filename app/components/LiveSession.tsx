"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Send, Award, TrendingUp, X, Mic, MicOff, Video, VideoOff, Copy, Check, Users } from 'lucide-react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack
} from 'agora-rtc-sdk-ng';

interface LiveSessionProps {
  channelName: string;
  appId: string;
}

export default function LiveSession({ channelName, appId }: LiveSessionProps) {
  const [sessionTime, setSessionTime] = useState(0);
  const [message, setMessage] = useState('');
  const [reactions, setReactions] = useState<Array<{ id: number; emoji: string; x: number }>>([]);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{ user: string; msg: string; time: string }>>([
    { user: 'System', msg: 'Connecting to session...', time: '00:00' }
  ]);

  // Agora states
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<Map<string, any>>(new Map());
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [joined, setJoined] = useState(false);
  const [copied, setCopied] = useState(false);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  // Initialize Agora client
  useEffect(() => {
    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    setClient(agoraClient);

    return () => {
      agoraClient.leave();
      localVideoTrack?.close();
      localAudioTrack?.close();
    };
  }, []);

  // Join channel and set up tracks
  useEffect(() => {
    if (!client || !appId) return;

    const joinChannel = async () => {
      try {
        // Join channel
        await client.join(appId, channelName, null, null);
        addSystemMessage('✅ Connected to session!');
        
        // Create local tracks
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

        setLocalVideoTrack(videoTrack);
        setLocalAudioTrack(audioTrack);

        // Play local video
        if (localVideoRef.current) {
          videoTrack.play(localVideoRef.current);
        }

        // Publish tracks
        await client.publish([videoTrack, audioTrack]);
        setJoined(true);
        addSystemMessage('Your camera and microphone are active');

      } catch (error) {
        console.error('❌ Failed to join:', error);
        addSystemMessage('❌ Failed to connect. Check your camera/mic permissions.');
      }
    };

    // Handle remote users joining
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      console.log('✅ Remote user joined:', user.uid);
      addSystemMessage(`✅ ${user.uid} joined the session!`);

      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        setRemoteUsers(prev => new Map(prev).set(String(user.uid), user));
        
        // Play remote video
        if (remoteVideoRef.current && remoteVideoTrack) {
          remoteVideoTrack.play(remoteVideoRef.current);
        }
      }

      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    });

    // Handle remote users leaving
    client.on('user-unpublished', (user, mediaType) => {
      console.log('User left:', user.uid);
      addSystemMessage(`${user.uid} left the session`);
      
      if (mediaType === 'video') {
        setRemoteUsers(prev => {
          const newMap = new Map(prev);
          newMap.delete(String(user.uid));
          return newMap;
        });
      }
    });

    client.on('user-left', (user) => {
      console.log('User disconnected:', user.uid);
      setRemoteUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(String(user.uid));
        return newMap;
      });
    });

    joinChannel();
  }, [client, appId, channelName]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addSystemMessage = (msg: string) => {
    setChatMessages(prev => [...prev, {
      user: 'System',
      msg,
      time: formatTime(sessionTime)
    }]);
  };

  const addReaction = (emoji: string) => {
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

  const toggleMute = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(isMuted);
      setIsMuted(!isMuted);
      addSystemMessage(isMuted ? 'Microphone unmuted' : 'Microphone muted');
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(isVideoOff);
      setIsVideoOff(!isVideoOff);
      addSystemMessage(isVideoOff ? 'Camera turned on' : 'Camera turned off');
    }
  };

  const leaveSession = async () => {
    localVideoTrack?.close();
    localAudioTrack?.close();
    await client?.leave();
    window.location.href = '/';
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/session/${channelName}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addSystemMessage('Room link copied! Share it with the other person.');
  };

  const hasRemoteUser = remoteUsers.size > 0;

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

            <button
              onClick={copyRoomLink}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 backdrop-blur-md rounded-lg border border-indigo-400/30 transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {copied ? 'Copied!' : 'Share Link'}
              </span>
            </button>
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
        
        {/* Left Side - Remote Video (Other Person) */}
        <div className="w-1/2 relative bg-gray-950 border-r border-gray-800">
          <div 
            ref={remoteVideoRef}
            className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-purple-900/30"
          >
            {!hasRemoteUser && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <div className="text-2xl font-semibold mb-3">Waiting for other person...</div>
                  <div className="text-gray-400 mb-4">
                    Share the room link with them
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg inline-flex">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{joined ? '1' : '0'} / 2 participants</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Live Badge */}
          {hasRemoteUser && (
            <div className="absolute top-6 left-6 px-4 py-2 bg-red-600 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              LIVE
            </div>
          )}

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

        {/* Right Side - Your Video */}
        <div className="w-1/2 relative bg-gray-950">
          <div 
            ref={localVideoRef}
            className="absolute inset-0 bg-gradient-to-br from-green-900/30 to-teal-900/30"
          >
            {!joined && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="text-center">
                  <div className="text-2xl mb-3">Starting camera...</div>
                  <div className="text-gray-400">Please allow camera and microphone access</div>
                </div>
              </div>
            )}
            
            {isVideoOff && joined && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center">
                  <VideoOff className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                  <div className="text-lg">Camera Off</div>
                </div>
              </div>
            )}
          </div>

          <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-sm font-semibold border border-white/10">
            You {joined && '(Connected)'}
          </div>
        </div>
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-3">
        <button
          onClick={toggleMute}
          disabled={!joined}
          className={`p-4 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-800/80 backdrop-blur-md'} hover:bg-opacity-90 transition border border-white/10 disabled:opacity-50`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        
        <button
          onClick={toggleVideo}
          disabled={!joined}
          className={`p-4 rounded-full ${isVideoOff ? 'bg-red-600' : 'bg-gray-800/80 backdrop-blur-md'} hover:bg-opacity-90 transition border border-white/10 disabled:opacity-50`}
        >
          {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>

        <button
          onClick={leaveSession}
          className="px-6 py-4 bg-red-600 hover:bg-red-700 rounded-full font-semibold transition"
        >
          Leave Session
        </button>
      </div>

      {/* Floating Chat Panel - Right Side */}
      {chatOpen && (
        <div className="absolute right-6 top-24 bottom-6 w-96 flex flex-col bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-20">
          <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="font-semibold text-lg">Live Chat</h3>
              <p className="text-sm text-gray-400">Powered by Agora</p>
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
                  <span className={`text-sm font-semibold ${chat.user === 'System' ? 'text-gray-400' : 'text-indigo-400'}`}>
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