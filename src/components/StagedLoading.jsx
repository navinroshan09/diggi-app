import React, { useState, useEffect } from "react";

const STAGES = [
  "Thinking...",
  "Fetching data from sources...",
  "Analyzing news and perspectives...",
  "Structuring summary...",
  "Finalizing response..."
];

export default function StagedLoading({ className }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      minHeight: "350px",
      gap: 20,
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      background: "transparent"
    }}>
      <style>{`
        @keyframes pulseGlow {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 200, 150, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(0, 200, 150, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 200, 150, 0); }
        }
        @keyframes textFade {
          0% { opacity: 0; transform: translateY(5px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-5px); }
        }
      `}</style>

      {/* Pulsing ring */}
      <div style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#00c896",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "pulseGlow 2s infinite",
        marginBottom: 10
      }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#141c2b", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 22 }}>🧠</span>
        </div>
      </div>

      {/* Stage Text */}
      <div key={index} style={{
        fontSize: 15,
        fontWeight: 600,
        color: "#00c896",
        animation: "textFade 2.5s ease-in-out forwards",
        textAlign: "center",
        letterSpacing: 0.2
      }}>
        {STAGES[index]}
      </div>

      {/* Sub shimmer text simulating background activity */}
      <div style={{ fontSize: 11, color: "#5a6a7e", fontStyle: "italic", marginTop: -8 }}>
        Assembling verified sources from multiple networks...
      </div>
    </div>
  );
}
