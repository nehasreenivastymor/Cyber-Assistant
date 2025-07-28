// src/components/ThreatPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ThreatPanel() {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/threats")
      .then(response => {
        setThreats(response.data.threats);
      })
      .catch(error => {
        console.error("Error fetching threats:", error);
      });
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md h-full overflow-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-700">🛡️ Threat Intelligence</h2>

      {threats.length === 0 ? (
        <p className="text-gray-500">No recent threats found.</p>
      ) : (
        threats.map((threat, index) => (
          <div key={index} className="mb-4 p-3 border-l-4 border-red-600 bg-gray-50 rounded-md">
            <p className="text-sm font-semibold text-red-700">{threat.id}</p>
            <p className="text-lg font-medium">{threat.title}</p>
            <p className="text-sm text-gray-600">Severity: <b>{threat.severity}</b></p>
            <p className="text-sm text-gray-600">Published: {threat.published}</p>
            <p className="text-sm mt-1">{threat.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
