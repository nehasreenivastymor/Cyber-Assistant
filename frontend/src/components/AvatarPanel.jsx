// src/components/AvatarPanel.jsx
import React from 'react';

const AvatarPanel = ({ videoUrl }) => {
  return (
    <div style={{ width: '100%' }}>
      <video
        key={videoUrl}
        src={videoUrl || "/avatar.mp4"}
        autoPlay
        loop
        controls
        playsInline
        style={{
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
};

export default AvatarPanel;
