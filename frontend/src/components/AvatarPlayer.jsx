// src/components/AvatarPlayer.jsx
import React, { useEffect, useState } from "react";
import AvatarPanel from "./AvatarPanel";

const AVATAR_IMAGE_URL = "https://res.cloudinary.com/djhzdophn/image/upload/v1753696436/Flux_Dev_Realistic_professional_portrait_of_a_young_woman_cybe_3_h3jtpz.jpg";

const AvatarPlayer = ({ audioUrl }) => {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (!audioUrl) return;

    const createTalkingAvatar = async () => {
      const encodedKey = import.meta.env.VITE_DID_API_KEY;

      try {
        const response = await fetch("https://api.d-id.com/talks", {
          method: "POST",
          headers: {
            Authorization: `Basic ${encodedKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_url: AVATAR_IMAGE_URL,
            script: {
              type: "audio",
              audio_url: audioUrl,
            },
          }),
        });

        const data = await response.json();
        if (data.result_url) {
          setVideoUrl(data.result_url);
        } else {
          console.error("D-ID error:", data);
        }
      } catch (err) {
        console.error("D-ID fetch failed:", err);
      }
    };

    createTalkingAvatar();
  }, [audioUrl]);

  return <AvatarPanel videoUrl={videoUrl} />;
};

export default AvatarPlayer;
