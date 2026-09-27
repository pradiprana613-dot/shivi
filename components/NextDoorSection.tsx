"use client";

import React, { useState } from "react";

interface NextDoorSectionProps {
  isVisible: boolean;
  isExiting?: boolean;
  onNextDoor?: () => void;
}

export function NextDoorSection({ isVisible, isExiting = false, onNextDoor }: NextDoorSectionProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    if (onNextDoor) {
      onNextDoor();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`absolute inset-x-0 bottom-2 sm:bottom-2.5 z-40 px-2.5 flex flex-col items-center select-none overflow-visible transition-all duration-400 ease-out ${
        isExiting ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0 pointer-events-auto"
      }`}
      style={{
        animation: !isExiting ? "nextDoorEntrance 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards" : undefined,
      }}
    >
      {/* ========================================================
          ULTRA-COMPACT ELEGANT GLASSMORPHIC CARD
          Low-profile height to reveal maximum background artwork
          ======================================================== */}
      <div
        className="relative w-full max-w-[270px] sm:max-w-[280px] rounded-[18px] px-3.5 py-2.5 sm:py-3 flex flex-col items-center text-center overflow-visible"
        style={{
          background:
            "linear-gradient(155deg, rgba(16, 8, 28, 0.76) 0%, rgba(38, 12, 46, 0.68) 50%, rgba(14, 5, 26, 0.82) 100%)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          border: "1.2px solid rgba(255, 215, 235, 0.38)",
          boxShadow:
            "0 12px 32px rgba(0, 0, 0, 0.55), 0 0 24px rgba(255, 115, 185, 0.28), inset 0 1.2px 1.5px rgba(255, 255, 255, 0.55), inset 0 -1px 2px rgba(255, 180, 220, 0.2)",
        }}
      >
        {/* Corner Flora: Top Left */}
        <div className="absolute -top-1.5 -left-1 pointer-events-none z-20 flex items-center gap-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          <span className="text-[10px]">🌸</span>
          <span className="text-[8.5px] -ml-1">🌺</span>
          <span className="text-[8px] -ml-1 text-emerald-300">🍃</span>
        </div>

        {/* Corner Flora: Top Right */}
        <div className="absolute -top-1.5 -right-1 pointer-events-none z-20 flex items-center gap-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          <span className="text-[8px] text-emerald-300">🍃</span>
          <span className="text-[8.5px] -mr-1">🌺</span>
          <span className="text-[10px]">🌸</span>
        </div>

        {/* Delicate Fluttering Micro Butterfly on Top Right */}
        <div
          className="absolute -top-3 right-3.5 pointer-events-none z-30"
          style={{
            animation: "microButterflyFloat 4.2s ease-in-out infinite alternate",
          }}
        >
          <span className="text-[12px] drop-shadow-[0_0_8px_rgba(255,182,218,0.9)]">
            🦋
          </span>
        </div>

        {/* Subtle Ambient Twinkling Sparkles inside card */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[18px]">
          <div
            className="absolute top-1 left-4 w-1 h-1 rounded-full bg-white animate-ping"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute bottom-2 right-5 w-1 h-1 rounded-full bg-pink-200 animate-pulse"
            style={{ animationDuration: "2.4s" }}
          />
        </div>

        {/* ======================================================
            1. TOP GLOWING GOLDEN KEY ICON
            ====================================================== */}
        <div
          className="relative z-10 w-6 h-6 flex items-center justify-center -mt-0.5 mb-0"
          style={{
            animation: "goldenKeyPulse 3s ease-in-out infinite alternate",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4.5 h-4.5 drop-shadow-[0_0_8px_rgba(251,191,36,0.95)]"
            fill="none"
          >
            <path
              d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
              fill="url(#keyGoldGradUltraCompact)"
            />
            <defs>
              <linearGradient id="keyGoldGradUltraCompact" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff7d6" />
                <stop offset="45%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ======================================================
            2. MAIN HEADING: "Next Door"
            Cursive/Script typography with vibrant soft pink neon glow
            ====================================================== */}
        <h3
          className="relative z-10 font-['Caveat',cursive] text-[23px] sm:text-[24px] font-bold leading-none text-white tracking-wide select-none"
          style={{
            textShadow:
              "0 0 10px rgba(255, 140, 205, 0.95), 0 0 20px rgba(244, 63, 142, 0.85), 0 0 32px rgba(236, 72, 153, 0.65)",
            animation: "headingGlowPulse 3.5s ease-in-out infinite alternate",
          }}
        >
          Next Door
        </h3>

        {/* Flourish Divider */}
        <div className="relative z-10 flex items-center justify-center gap-1 my-0.5 opacity-90">
          <span className="text-[8px] text-pink-200/70 tracking-tighter">──»</span>
          <span className="text-[9px] text-pink-300">💖</span>
          <span className="text-[8px] text-pink-200/70 tracking-tighter">«──</span>
        </div>

        {/* ======================================================
            3. SUBHEADING: "A New Surprise Awaits..."
            ====================================================== */}
        <p className="relative z-10 font-['Playfair_Display',Georgia,serif] text-[11px] sm:text-[11.5px] font-medium text-pink-100/95 tracking-wide leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          A New Surprise Awaits...
        </p>

        {/* Supporting Caption: "Click below to continue this beautiful journey! ♡" */}
        <p className="relative z-10 text-[9px] sm:text-[9.5px] text-pink-200/85 font-normal tracking-wide mt-0.5 mb-1.5 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
          Click below to continue this beautiful journey! ♡
        </p>

        {/* ======================================================
            4. THE BUTTON: "Next Door →"
            Exact required text, sleek compact pill, soft pink glow
            ====================================================== */}
        <button
          id="next-door-button"
          type="button"
          onClick={handleClick}
          aria-label="Next Door"
          className="group relative w-full max-w-[190px] sm:max-w-[200px] h-[33px] sm:h-[34px] rounded-full px-4 font-semibold tracking-wide transition-all duration-200 cursor-pointer overflow-hidden active:scale-[0.975] hover:scale-[1.025] focus:outline-none flex items-center justify-center gap-1.5"
          style={{
            background: "linear-gradient(90deg, #ffb3cb 0%, #ff7da8 50%, #f43f8e 100%)",
            border: "1.2px solid rgba(255, 255, 255, 0.75)",
            boxShadow:
              "0 0 18px rgba(255, 115, 175, 0.65), 0 3px 10px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.8)",
            animation: "buttonPulseGlow 3s ease-in-out infinite alternate",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {/* Top Glossy Reflection */}
          <span className="absolute inset-x-2 top-0.5 h-[34%] rounded-full bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

          {/* Button Text */}
          <span className="relative z-10 font-serif font-bold text-[12px] sm:text-[12.5px] text-[#3e0822] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] flex items-center gap-1.5">
            Next Door →
          </span>
        </button>
      </div>

      {/* Embedded Animations for Smooth Staggered Presentation */}
      <style jsx>{`
        @keyframes nextDoorEntrance {
          0% {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes goldenKeyPulse {
          0% {
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.8));
          }
          100% {
            transform: scale(1.08) rotate(3deg);
            filter: drop-shadow(0 0 10px rgba(251, 191, 36, 1));
          }
        }
        @keyframes headingGlowPulse {
          0% {
            text-shadow: 0 0 8px rgba(255, 140, 205, 0.8), 0 0 16px rgba(244, 63, 142, 0.7);
          }
          100% {
            text-shadow: 0 0 12px rgba(255, 160, 220, 1), 0 0 24px rgba(244, 63, 142, 0.95), 0 0 36px rgba(236, 72, 153, 0.75);
          }
        }
        @keyframes buttonPulseGlow {
          0% {
            box-shadow: 0 0 15px rgba(255, 115, 175, 0.55), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.8);
          }
          100% {
            box-shadow: 0 0 22px rgba(255, 130, 190, 0.85), 0 3px 10px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.9);
          }
        }
        @keyframes microButterflyFloat {
          0% {
            transform: translate3d(0, 0, 0) rotate(-4deg);
          }
          100% {
            transform: translate3d(2.5px, -4px, 0) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}
