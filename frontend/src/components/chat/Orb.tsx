"use client";

import React from "react";

export type OrbMood = "neutral" | "aggressive" | "cheerful" | "thoughtful" | "impatient";

export function Orb({ isThinking = false, mood = "neutral" }: { isThinking?: boolean; mood?: OrbMood }) {
  // Determine color based on UserStyle / sentiment
  let color = "rgba(100, 200, 255, 0.8)"; // neutral blue
  if (mood === "aggressive") color = "rgba(255, 60, 60, 0.8)"; // angry red
  if (mood === "cheerful") color = "rgba(255, 200, 60, 0.8)"; // cheerful yellow
  if (mood === "thoughtful") color = "rgba(180, 100, 255, 0.8)"; // thoughtful purple
  if (mood === "impatient") color = "rgba(255, 100, 0, 0.8)"; // impatient orange

  return (
    <div className={`shinon-orb-container ${isThinking ? "thinking" : "idle"}`}>
      <div 
        className="shinon-orb" 
        style={{
          background: `radial-gradient(circle at 30% 30%, #fff, ${color})`,
          boxShadow: `0 0 ${isThinking ? "40px" : "20px"} ${color}`
        }}
      ></div>
      <style dangerouslySetInnerHTML={{__html: `
        .shinon-orb-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 120px;
          margin-bottom: 20px;
        }
        .shinon-orb {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          transition: all 0.5s ease-in-out;
        }
        .shinon-orb-container.idle .shinon-orb {
          animation: breathe 4s infinite ease-in-out;
        }
        .shinon-orb-container.thinking .shinon-orb {
          animation: pulse 1s infinite alternate;
        }
        @keyframes breathe {
          0% { transform: scale(1) translateY(0px); opacity: 0.8; }
          50% { transform: scale(1.05) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0px); opacity: 0.8; }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.6; }
          100% { transform: scale(1.1); opacity: 1; filter: brightness(1.5); }
        }
      `}} />
    </div>
  );
}
