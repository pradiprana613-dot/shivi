"use client";

import React, { useState, useEffect, useRef } from "react";

interface SecretClueModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onUnlocked?: () => void;
}

export function SecretClueModal({ isOpen, onClose, onUnlocked }: SecretClueModalProps) {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showHearts, setShowHearts] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (!isUnlocked) {
          inputRef.current?.focus();
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setPassword("");
      setIsWrong(false);
      setErrorMessage("");
    }
  }, [isOpen, isUnlocked]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnlocked) return;

    const trimmed = password.trim().toUpperCase();

    if (trimmed === "331010") {
      setIsWrong(false);
      setErrorMessage("");
      setIsUnlocked(true);
      setSuccessMessage("The door remembers you. 💗");
      setShowHearts(true);

      setTimeout(() => {
        if (onUnlocked) {
          onUnlocked();
        }
      }, 1100);
    } else {
      setIsWrong(true);
      setErrorMessage("Hmm… the door knows that's not it. Try again 💗");
      setTimeout(() => {
        setIsWrong(false);
      }, 1200);
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-3 select-none overflow-hidden"
      style={{
        backgroundColor: "rgba(8, 4, 24, 0.42)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: "secretOverlayFade 0.45s ease-out forwards",
      }}
    >
      {/* ========================================================
          AMBIENT GLOWING BUTTERFLIES & DRIFTING ROSE PETALS
          ======================================================== */}
      {/* Left Fluttering Butterfly */}
      <div
        className="absolute pointer-events-none z-20 select-none"
        style={{
          left: "5%",
          top: "43%",
          width: "28px",
          height: "26px",
          animation: "modalButterflyFlyLeft 6s ease-in-out infinite",
        }}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,182,218,0.9)]">
          <path
            d="M 12 13 C 10 7, 2 5, 2 12 C 2 18, 9 19, 12 14 C 15 19, 22 18, 22 12 C 22 5, 14 7, 12 13 Z"
            fill="url(#leftWingGrad)"
          />
          <defs>
            <linearGradient id="leftWingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#ffaec9" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f43f8e" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Right Fluttering Butterfly */}
      <div
        className="absolute pointer-events-none z-20 select-none"
        style={{
          right: "5%",
          top: "50%",
          width: "26px",
          height: "24px",
          animation: "modalButterflyFlyRight 7s ease-in-out infinite",
        }}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,200,230,0.9)]">
          <path
            d="M 12 13 C 10 7, 2 5, 2 12 C 2 18, 9 19, 12 14 C 15 19, 22 18, 22 12 C 22 5, 14 7, 12 13 Z"
            fill="url(#rightWingGrad)"
          />
          <defs>
            <linearGradient id="rightWingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffb3d1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Subtle Floating Sparkles & Soft Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[
          { left: "12%", top: "18%", delay: "0s", dur: "4.2s" },
          { left: "84%", top: "24%", delay: "1.4s", dur: "5.1s" },
          { left: "20%", top: "78%", delay: "0.8s", dur: "4.6s" },
          { left: "78%", top: "74%", delay: "2.1s", dur: "4.8s" },
          { left: "50%", top: "12%", delay: "2.8s", dur: "5.4s" },
        ].map((pt, i) => (
          <div
            key={`sparkle-pt-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/80 blur-[0.3px]"
            style={{
              left: pt.left,
              top: pt.top,
              boxShadow: "0 0 6px rgba(255, 220, 240, 0.9), 0 0 12px rgba(255, 182, 218, 0.6)",
              animation: `modalStarTwinkle ${pt.dur} ease-in-out infinite`,
              animationDelay: pt.delay,
            }}
          />
        ))}
      </div>

      {/* ========================================================
          THE CENTERED MAGICAL GLASSMORPHISM PANEL
          (Visually matches Image 2)
          ======================================================== */}
      <div
        className={`relative z-10 w-[92%] max-w-[348px] rounded-[26px] p-5 sm:p-5.5 flex flex-col items-center text-center overflow-visible transition-all duration-500 ${
          isUnlocked ? "scale-[1.01]" : ""
        }`}
        style={{
          background:
            "linear-gradient(145deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 195, 225, 0.08) 50%, rgba(210, 180, 255, 0.12) 100%)",
          backdropFilter: "blur(14px) saturate(130%)",
          WebkitBackdropFilter: "blur(14px) saturate(130%)",
          border: "1.5px solid rgba(255, 235, 210, 0.42)",
          boxShadow: isUnlocked
            ? "0 20px 50px rgba(0, 0, 0, 0.45), 0 0 45px rgba(255, 182, 218, 0.8), inset 0 1.5px 2px rgba(255, 255, 255, 0.65)"
            : "0 22px 55px rgba(0, 0, 0, 0.42), 0 0 35px rgba(255, 182, 218, 0.28), inset 0 1.5px 2px rgba(255, 255, 255, 0.5), inset 0 -1px 2px rgba(255, 190, 220, 0.2)",
          animation: "panelScaleEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* ======================================================
            CORNER ACCENT 1: PINNED PARCHMENT NOTE (TOP RIGHT)
            "Good Things Take A Little Effort ♡" with little heart pin
            ====================================================== */}
        <div
          className="absolute -top-3.5 -right-2.5 z-30 pointer-events-none select-none"
          style={{
            transform: "rotate(6.5deg)",
            filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))",
            animation: "noteFloatSway 4.8s ease-in-out infinite alternate",
          }}
        >
          {/* Little Red Heart Pushpin */}
          <div className="absolute left-1/2 -top-2 -translate-x-1/2 z-10 text-red-500 text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            ❤️
          </div>

          {/* Parchment Sticky Card */}
          <div className="w-[78px] px-2 py-2.5 pt-3 rounded-[4px] bg-[#fbf6ec] border border-[#e2d5c3] flex flex-col items-center justify-center text-center shadow-inner">
            <p className="font-['Caveat',cursive] text-[13px] leading-[1.08] font-bold text-[#5a331c] tracking-tight">
              Good
              <br />
              Things
              <br />
              Take A
              <br />
              Little Effort
            </p>
            <span className="font-['Caveat',cursive] text-[12px] text-[#8c4b28] mt-0.5 leading-none">
              ♡
            </span>
          </div>
        </div>

        {/* ======================================================
            CORNER ACCENT 2: TOP-LEFT CHERRY BLOSSOMS & LANTERN
            ====================================================== */}
        <div className="absolute -top-2 -left-2 pointer-events-none z-25">
          {/* Draping Floral Sprig */}
          <div className="flex items-center gap-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            <span className="text-[13px]">🌸</span>
            <span className="text-[11px] -ml-1">🌺</span>
            <span className="text-[10px] -ml-1 text-emerald-300">🍃</span>
          </div>
        </div>

        {/* Top-Left Delicate Hanging Lantern */}
        <div
          className="absolute -top-1 left-3.5 pointer-events-none z-20 flex flex-col items-center"
          style={{
            animation: "lanternGentleSway 4.2s ease-in-out infinite alternate",
            transformOrigin: "top center",
          }}
        >
          {/* Wire */}
          <div className="w-[1px] h-3 bg-amber-200/60" />
          {/* Lantern Body */}
          <div className="w-3.5 h-4.5 rounded-[2px] bg-gradient-to-b from-amber-200/40 via-amber-400/80 to-amber-600/60 border border-amber-200/70 shadow-[0_0_8px_rgba(251,191,36,0.9)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
          </div>
        </div>

        {/* Delicate Dismiss Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 left-3.5 text-white/50 hover:text-white/95 transition-colors text-base leading-none p-1 focus:outline-none cursor-pointer z-30"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        {/* ======================================================
            1. TOP GLOWING BUTTERFLY ICON
            ====================================================== */}
        <div
          className="relative z-10 w-9 h-8 flex items-center justify-center mb-1 drop-shadow-[0_0_12px_rgba(255,182,218,0.9)]"
          style={{
            animation: "topButterflyPulse 3.5s ease-in-out infinite",
          }}
        >
          <svg viewBox="0 0 32 28" className="w-full h-full">
            <path
              d="M 16 14 C 13 6, 2 4, 2 13 C 2 20, 11 22, 16 16 C 21 22, 30 20, 30 13 C 30 4, 19 6, 16 14 Z"
              fill="url(#topButterflyGrad)"
            />
            {/* Center Body */}
            <ellipse cx="16" cy="15" rx="1.2" ry="4.5" fill="#ffffff" />
            <defs>
              <linearGradient id="topButterflyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                <stop offset="50%" stopColor="#ffaec9" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f472b6" stopOpacity="0.85" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ======================================================
            2. MAIN HEADING
            "A Little Secret Awaits..." in Classic Serif
            ====================================================== */}
        <h2 className="relative z-10 font-['Playfair_Display',Georgia,serif] text-[20px] sm:text-[21.5px] font-medium text-white tracking-wide leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
          A Little Secret Awaits...
        </h2>

        {/* Decorative Flourish Divider */}
        <div className="relative z-10 flex items-center justify-center gap-1.5 my-1.5 opacity-90">
          <span className="text-[10px] text-pink-200/70 tracking-tighter">──»</span>
          <span className="text-[11px] text-pink-300">💖</span>
          <span className="text-[10px] text-pink-200/70 tracking-tighter">«──</span>
        </div>

        {/* ======================================================
            3. SUBTITLE PILL
            "Only someone special knows the way in. 💖"
            ====================================================== */}
        <div className="relative z-10 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/20 shadow-inner max-w-full">
          <p className="text-[11.5px] sm:text-[12px] text-pink-100/95 font-normal tracking-wide leading-snug drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] flex items-center justify-center gap-1">
            <span>Only someone special knows the way in.</span>
            <span className="text-pink-300">💗</span>
          </p>
        </div>

        {/* ======================================================
            4. CENTERPIECE VISUAL: ORNATE GOLDEN KEY ON PEDESTAL
            With silky pink ribbon, rose petals, and daisies
            ====================================================== */}
        <div className="relative z-10 w-full my-3 rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.35)] border border-white/30 bg-black/20">
          <img
            src="/golden-key.jpg"
            alt="Magical Golden Key"
            className="w-full h-[124px] sm:h-[136px] object-cover block select-none pointer-events-none"
            draggable={false}
          />

          {/* Soft Gradient Sheen on top of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 pointer-events-none" />

          {/* Floating Handwritten Script Overlay on Right:
              "Unlock A Beautiful Surprise ♡" */}
          <div className="absolute right-2.5 top-2.5 pointer-events-none text-right z-10">
            <p className="font-['Caveat',cursive] text-[14px] sm:text-[15px] font-bold text-pink-100 leading-[1.05] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Unlock
              <br />
              A Beautiful
              <br />
              Surprise
            </p>
            <div className="font-['Caveat',cursive] text-[12px] text-pink-200 leading-none mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              ♡
              <span className="block text-[8px] tracking-widest text-pink-200/80 -mt-0.5">── ──</span>
            </div>
          </div>
        </div>

        {/* ======================================================
            5. PASSWORD FORM & INPUT FIELD
            ====================================================== */}
        <form onSubmit={handleSubmit} className="relative z-10 w-full flex flex-col items-center gap-2">
          {/* Glass-style pill input with Magnifying Glass & Sparkle */}
          <div className="relative w-full">
            <div
              className={`w-full rounded-full h-[42px] px-3.5 flex items-center transition-all duration-300 ${
                isUnlocked
                  ? "border border-pink-300/80 bg-pink-950/35 ring-2 ring-pink-300/60 shadow-[0_0_20px_rgba(255,182,218,0.7)]"
                  : isWrong
                  ? "border border-rose-300/80 bg-rose-950/35 animate-subtle-shake shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                  : isInputFocused
                  ? "border border-pink-300/90 bg-white/[0.14] ring-2 ring-pink-300/50 shadow-[0_0_16px_rgba(244,114,182,0.4)]"
                  : "border border-white/35 bg-white/[0.09] hover:border-white/50 shadow-inner"
              }`}
              style={{
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              {/* Left Magnifying Glass Icon */}
              <span className="text-pink-200/80 text-sm mr-2 flex-shrink-0 select-none">
                🔍
              </span>

              {/* Input Field */}
              <input
                ref={inputRef}
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (isWrong) setIsWrong(false);
                }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                disabled={isUnlocked}
                placeholder="Enter the secret..."
                autoComplete="off"
                autoCapitalize="characters"
                className="w-full bg-transparent border-none outline-none focus:outline-none text-center text-[13.5px] font-medium text-white placeholder:text-pink-100/60 placeholder:font-serif placeholder:italic tracking-wider"
              />

              {/* Right Sparkle Icon */}
              <span className="text-amber-200/80 text-xs ml-2 flex-shrink-0 select-none animate-pulse">
                ✨
              </span>
            </div>
          </div>

          {/* Feedback Message */}
          <div className="min-h-[18px] flex items-center justify-center px-1 text-center">
            {errorMessage && !isUnlocked && (
              <p className="text-[11px] text-pink-200 font-medium leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] animate-fade-in flex items-center gap-1">
                <span>💗</span>
                <span>{errorMessage}</span>
              </p>
            )}
            {successMessage && isUnlocked && (
              <p className="text-[11.5px] text-pink-100 font-semibold leading-tight drop-shadow-[0_0_8px_rgba(244,114,182,0.9)] animate-fade-in flex items-center gap-1.5">
                <span>✨</span>
                <span>{successMessage}</span>
              </p>
            )}
          </div>

          {/* ======================================================
              6. GLOWING PINK CTA BUTTON: "Unlock The Door →"
              ====================================================== */}
          <button
            type="submit"
            disabled={isUnlocked}
            className={`group relative w-full rounded-full h-[44px] px-6 font-semibold text-[14.5px] tracking-wide text-[#3f0923] transition-all duration-200 cursor-pointer overflow-hidden shadow-[0_4px_18px_rgba(244,114,182,0.55)] active:scale-[0.975] focus:outline-none flex items-center justify-center gap-1.5 ${
              isUnlocked
                ? "bg-gradient-to-r from-[#ffaec9] via-[#ff7da8] to-[#f43f8e] text-[#4a0e2e] shadow-[0_0_30px_rgba(255,182,218,0.85)] border border-white/80"
                : "bg-gradient-to-r from-[#ffb6ce] via-[#ff7da8] to-[#f43f8e] border border-white/70 hover:brightness-105"
            }`}
            style={{
              boxShadow: "0 0 25px rgba(255, 115, 175, 0.55), inset 0 1px 2px rgba(255, 255, 255, 0.75)",
            }}
          >
            {/* Top Glossy Reflection Highlight */}
            <span className="absolute inset-x-2 top-0.5 h-[34%] rounded-full bg-gradient-to-b from-white/75 to-transparent pointer-events-none" />

            {isUnlocked ? (
              <span className="relative z-10 flex items-center gap-1.5 font-bold font-serif text-[15px] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                Unlocked ✨
              </span>
            ) : (
              <span className="relative z-10 flex items-center gap-1.5 font-bold font-serif text-[15px] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                Unlock The Door →
              </span>
            )}
          </button>
        </form>

        {/* ======================================================
            7. BOTTOM ROMANTIC CLUE
            Small white heart + "Whose smile made this little world worth creating?"
            ====================================================== */}
        <div className="relative z-10 mt-2.5 flex flex-col items-center">
          <span className="text-[11px] text-white/90 leading-none mb-1">
            🤍
          </span>
          <p className="font-['Playfair_Display',Georgia,serif] italic text-[11px] sm:text-[11.5px] text-pink-100/90 font-normal leading-snug drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
            “Whose smile made this little world
            <br />
            worth creating?”
          </p>
        </div>
      </div>

      {/* Embedded Animations for Subtle Movements */}
      <style jsx>{`
        @keyframes secretOverlayFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes panelScaleEntrance {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes modalButterflyFlyLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(-4deg);
          }
          50% {
            transform: translate3d(6px, -12px, 0) rotate(5deg);
          }
        }
        @keyframes modalButterflyFlyRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(4deg);
          }
          50% {
            transform: translate3d(-6px, -10px, 0) rotate(-4deg);
          }
        }
        @keyframes noteFloatSway {
          0% {
            transform: rotate(5deg) translateY(0);
          }
          100% {
            transform: rotate(8deg) translateY(-2px);
          }
        }
        @keyframes lanternGentleSway {
          0% {
            transform: rotate(-3deg);
          }
          100% {
            transform: rotate(3deg);
          }
        }
        @keyframes topButterflyPulse {
          0%,
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 10px rgba(255, 182, 218, 0.8));
          }
          50% {
            transform: scale(1.08);
            filter: drop-shadow(0 0 16px rgba(255, 140, 200, 1));
          }
        }
        @keyframes modalStarTwinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
}
