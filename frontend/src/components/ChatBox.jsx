import React, { useEffect, useRef } from 'react';

const ChatBox = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        height: '100%',
        overflowY: 'auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3 style={{ marginBottom: '16px', color: '#1e3c72' }}>
        Conversation History
      </h3>

      {messages.length === 0 && (
        <p style={{ color: '#666' }}>
          Welcome to your new conversation.
          <br />
          Once you start chatting, messages will appear here.
        </p>
      )}

      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              backgroundColor: msg.sender === 'user' ? '#d0eaff' : '#e9fce9',
              border: msg.sender === 'user' ? '1px solid #99caff' : '1px solid #cdeccf',
              padding: '12px 16px',
              borderRadius: '16px',
              boxShadow: msg.sender === 'user'
                ? '0 2px 6px rgba(0, 123, 255, 0.2)'
                : '0 1px 4px rgba(0, 0, 0, 0.1)',
              color: '#333',
              maxWidth: '70%',
              wordWrap: 'break-word',
              textAlign: 'left',
            }}
          >
            <strong style={{ fontSize: '14px', color: '#1e3c72' }}>
              {msg.sender === 'user' ? 'You' : 'CyberSecurity NavAI'}
            </strong>
            <div style={{ marginTop: '6px', fontSize: '16px' }}>
              {msg.text}
            </div>
          </div>
        </div>
      ))}

      {isTyping && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginTop: '8px',
            color: '#555',
            fontStyle: 'italic',
            fontSize: '15px',
          }}
        >
          CyberSecurity NavAI is typing...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatBox;
