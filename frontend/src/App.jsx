import React, { useState, useEffect, useRef } from 'react';
import ChatBox from './components/ChatBox';
import MicButton from './components/MicButton';
import AvatarPanel from './components/AvatarPanel';
import Escalation from './components/Escalation';

function App() {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);

  const AVATAR_IMAGE_URL = "https://res.cloudinary.com/djhzdophn/image/upload/v1753696436/Flux_Dev_Realistic_professional_portrait_of_a_young_woman_cybe_3_h3jtpz.jpg";

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text }]);
    if (sender === 'bot' && !muted) {
      speak(text);
      generateVideo(text);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const generateVideo = async (text) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, image_url: AVATAR_IMAGE_URL }),
      });

      const data = await res.json();

      if (res.ok && data?.video_url) {
        setVideoUrl(data.video_url);
        console.log("🎬 Video URL:", data.video_url);
      } else {
        console.warn("⚠️ Video generation failed. Ignoring in UI.");
      }
    } catch (err) {
      console.error("❌ Video API error (ignored in UI):", err);
    }
  };

  const handleTextSend = () => {
    const trimmed = textInput.trim();
    if (!trimmed || isTyping) return;
    addMessage('user', trimmed);
    setTextInput('');
    handleBotResponse(trimmed);
  };

  const handleBotResponse = async (input) => {
    setIsTyping(true);
    console.log("🤖 Sending to /chat:", input);

    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (!res.ok || !data?.response) {
        console.error("❌ /chat error:", data);
        addMessage('bot', `⚠️ Chatbot error: ${data?.error || 'Unknown server issue'}`);
      } else {
        console.log("✅ Bot says:", data.response);
        addMessage('bot', data.response);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      addMessage('bot', '❌ Failed to reach AI server.');
    }

    setIsTyping(false);
  };

  const handleVoiceCommand = (text) => {
    addMessage('user', text);
    handleBotResponse(text);
  };

  const handleMuteToggle = () => setMuted(prev => !prev);

  const handleEndCall = () => {
    if (window.confirm('End session and download chat history?')) {
      speechSynthesis.cancel();
      const data = JSON.stringify(messages, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `CyberChat_${new Date().toISOString()}.json`;
      link.click();

      setMessages([]);
      setTextInput('');
      setVideoUrl(null);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      height: '100vh',
      fontFamily: 'Segoe UI, sans-serif',
      background: 'linear-gradient(to right, #1e3c72, #2a5298)'
    }}>
      {/* Left Panel */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid #ccc'
      }}>
        <h2 style={{ color: '#2a5298' }}>CyberSecurity NavAI</h2>
        {videoUrl ? (
          <video
            key={videoUrl}
            src={videoUrl}
            autoPlay
            controls
            loop={false}
            ref={videoRef}
            onEnded={() => setVideoUrl(null)}
            style={{ width: '100%', borderRadius: '12px' }}
          />
        ) : (
          <img src={AVATAR_IMAGE_URL} alt="Avatar" style={{ width: '100%', borderRadius: '12px' }} />
        )}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={handleMuteToggle} style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #2a5298',
            backgroundColor: muted ? '#eee' : '#2a5298',
            color: muted ? '#2a5298' : '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            {muted ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={handleEndCall} style={{
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: '#e63946',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            End Call
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        backgroundColor: '#f7f9fb',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          <ChatBox messages={messages} isTyping={isTyping} />
        </div>

        <div style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTextSend();
              }
            }}
            placeholder="Type your cybersecurity question..."
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
            disabled={isTyping}
          />
          <button onClick={handleTextSend} style={{
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: '#2a5298',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }} disabled={isTyping}>
            Send
          </button>
        </div>

        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <MicButton onTranscript={handleVoiceCommand} />
          <Escalation />
        </div>
      </div>
    </div>
  );
}

export default App;
