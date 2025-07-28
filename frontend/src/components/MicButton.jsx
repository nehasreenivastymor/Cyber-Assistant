import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff } from 'lucide-react';

const MicButton = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Browser does not support voice recognition.');
      return;
    }

    if (!isListening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false, language: 'en-IN' });
    } else {
      SpeechRecognition.stopListening();
      if (transcript.trim()) {
        onTranscript(transcript);
      }
      resetTranscript();
    }

    setIsListening(!isListening);
  };

  return (
    <button
      onClick={handleMicClick}
      style={{
        backgroundColor: isListening ? '#dc3545' : '#1e88e5',
        color: '#fff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      {isListening ? 'Stop Listening' : 'Click here to enable voice input'}
    </button>
  );
};

export default MicButton;
