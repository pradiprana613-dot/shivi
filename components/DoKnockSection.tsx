"use client";

import React, { useState, useRef, useEffect } from "react";

interface DoKnockSectionProps {
  isVisible: boolean;
  isExiting?: boolean;
  onDoKnock?: (knockCount: number) => void;
  onSequenceComplete?: () => void;
}

// Balloon colors for each of the 3 knocks
function getBalloonColor(knockIndex: number): string {
  switch (knockIndex) {
    case 1:
      // Romantic Rose Pink
      return "radial-gradient(circle at 35% 30%, #ffd1dc 0%, #ff4d88 65%, #9f1239 100%)";
    case 2:
      // Celestial Lavender Violet
      return "radial-gradient(circle at 35% 30%, #ede9fe 0%, #a855f7 65%, #581c87 100%)";
    case 3:
      // Luminous Golden Sunset Coral
      return "radial-gradient(circle at 35% 30%, #fff7ed 0%, #fb923c 65%, #9a3412 100%)";
    default:
      return "radial-gradient(circle at 35% 30%, #ffd1dc 0%, #ff4d88 65%, #9f1239 100%)";
  }
}

export function DoKnockSection({
  isVisible,
  isExiting = false,
  onDoKnock,
  onSequenceComplete,
}: DoKnockSectionProps) {
  // Knock progression: 0 (not started), 1 (1st knock), 2 (2nd knock), 3 (3rd knock)
  const [knockCount, setKnockCount] = useState<0 | 1 | 2 | 3>(0);
  const [isLocked, setIsLocked] = useState(false);

  // Active balloon floating in center
  const [balloonState, setBalloonState] = useState<{
    knockIndex: number;
    isPopping: boolean;
  } | null>(null);

  // Revealed message emerging from the EXACT balloon pop position
  // Before first knock, this is strictly null (no text anywhere!)
  const [revealedMessage, setRevealedMessage] = useState<{
    knock: 1 | 2 | 3;
    text: string;
    isFadingOut?: boolean;
  } | null>(null);

  const [showKnockAgain, setShowKnockAgain] = useState(false);

  // Stable callbacks
  const onDoKnockRef = useRef(onDoKnock);
  const onSequenceCompleteRef = useRef(onSequenceComplete);
  useEffect(() => {
    onDoKnockRef.current = onDoKnock;
    onSequenceCompleteRef.current = onSequenceComplete;
  }, [onDoKnock, onSequenceComplete]);

  // Timers cleanup ref
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Guard against double taps or interaction during animation or after knock 3
    if (isLocked || knockCount >= 3) return;

    const nextKnock = (knockCount + 1) as 1 | 2 | 3;
    setKnockCount(nextKnock);
    setIsLocked(true);
    setShowKnockAgain(false);

    if (onDoKnockRef.current) {
      onDoKnockRef.current(nextKnock);
    }

    // If there was an existing revealed message, fade it out smoothly as the new balloon ascends
    setRevealedMessage((prev) => (prev ? { ...prev, isFadingOut: true } : null));

    // 1. Balloon appears: starts slightly smaller and lower, gently floats upward & bobs
    const tLaunch = setTimeout(() => {
      setRevealedMessage(null);
      setBalloonState({
        knockIndex: nextKnock,
        isPopping: false,
      });
    }, 180);
    timersRef.current.push(tLaunch);

    // 2. Keep balloon visible for a short moment with natural floating motion, then pop
    const tPop = setTimeout(() => {
      setBalloonState({
        knockIndex: nextKnock,
        isPopping: true,
      });

      // 3. Animated pop burst (scale-up, burst, particles, confetti) plays for 400ms
      // ONLY AFTER the balloon pops, reveal the message at the EXACT SAME POSITION
      const tBurst = setTimeout(() => {
        setBalloonState(null);

        let msgText = "";
        if (nextKnock === 1) msgText = "The stars remembered this moment...";
        if (nextKnock === 2) msgText = "The sky kept a little secret… ✨";
        if (nextKnock === 3) msgText = "Now, let the night reveal it. 💫";

        // Message emerges from the exact position where the balloon popped
        setRevealedMessage({
          knock: nextKnock,
          text: msgText,
          isFadingOut: false,
        });

        if (nextKnock < 3) {
          // 4a. For Knocks 1 & 2: "Knock Again…" softly appears slightly after the main sentence
          const tAgain = setTimeout(() => {
            setShowKnockAgain(true);
            setIsLocked(false); // Unlock button for next knock
          }, 350);
          timersRef.current.push(tAgain);
        } else {
          // 4b. For Knock 3: Do NOT show "Knock Again…"!
          // Wait for short cinematic pause (~1.0s), then automatically start door animation
          const tDoor = setTimeout(() => {
            if (onSequenceCompleteRef.current) {
              onSequenceCompleteRef.current();
            }
          }, 1000);
          timersRef.current.push(tDoor);
        }
      }, 400);
      timersRef.current.push(tBurst);
    }, 1100);
    timersRef.current.push(tPop);
  };

  if (!isVisible || isExiting) {
    return null;
  }

  return (
    <>
      {/* ========================================================
          1. BALLOON ENTRANCE & POP EFFECT (Exact Center: top: 44%, left: 50%)
          - Smooth entrance: starts slightly smaller and lower
          - Gently floats upward and scales naturally
          - Realistic bobbing / floating sway
          - Pops with quick scale-up, radiant burst, particles & confetti
          ======================================================== */}
      {balloonState && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-visible select-none">
          <div
            className="absolute flex flex-col items-center select-none"
            style={{
              left: "50%",
              top: "44%",
              animation: balloonState.isPopping
                ? "none"
                : balloonState.knockIndex === 1
                ? "balloonNaturalEntrance1 1.05s cubic-bezier(0.2, 0.9, 0.3, 1) forwards"
                : balloonState.knockIndex === 2
                ? "balloonNaturalEntrance2 1.05s cubic-bezier(0.2, 0.9, 0.3, 1) forwards"
                : "balloonNaturalEntrance3 1.05s cubic-bezier(0.2, 0.9, 0.3, 1) forwards",
            }}
          >
            {/* Balloon Body: Large, cute birthday-style balloon (52px × 66px) */}
            <div
              className="relative rounded-[50%_50%_50%_50%_/_42%_42%_58%_58%] overflow-visible"
              style={{
                width: "52px",
                height: "66px",
                background: getBalloonColor(balloonState.knockIndex),
                boxShadow:
                  "0 14px 32px rgba(0, 0, 0, 0.5), inset -4px -7px 14px rgba(0, 0, 0, 0.3), inset 5px 7px 10px rgba(255, 255, 255, 0.8)",
                animation: balloonState.isPopping
                  ? "balloonPopBurst 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards"
                  : undefined,
              }}
            >
              {/* Shiny Highlight Specular Reflection */}
              <div
                className="absolute rounded-full"
                style={{
                  top: "14%",
                  left: "17%",
                  width: "13px",
                  height: "22px",
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0) 100%)",
                  transform: "rotate(-25deg)",
                  opacity: balloonState.isPopping ? 0 : 1,
                  transition: "opacity 0.1s",
                }}
              />

              {/* Balloon Knot */}
              <div
                className="absolute left-1/2 -bottom-[4px] -translate-x-1/2"
                style={{
                  width: "7px",
                  height: "5px",
                  background: getBalloonColor(balloonState.knockIndex),
                  borderRadius: "1px 1px 4px 4px",
                  filter: "brightness(0.85)",
                  opacity: balloonState.isPopping ? 0 : 1,
                }}
              />

              {/* Celebratory Pop Burst: Tiny particles, sparkles & confetti */}
              {balloonState.isPopping && (
                <div className="absolute inset-0 pointer-events-none overflow-visible">
                  {/* Radiant light burst */}
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                    style={{
                      width: "80px",
                      height: "80px",
                      background:
                        "radial-gradient(circle, rgba(255, 255, 255, 0.98) 0%, rgba(255, 195, 230, 0.55) 35%, transparent 70%)",
                      animation: "popFlashFade 0.4s ease-out forwards",
                    }}
                  />

                  {/* 8 Balloon Fragments / Confetti */}
                  {[
                    { x: "-32px", y: "-28px", w: 4, h: 3, rot: "15deg" },
                    { x: "34px", y: "-26px", w: 4, h: 3, rot: "-30deg" },
                    { x: "-36px", y: "20px", w: 3, h: 4, rot: "45deg" },
                    { x: "35px", y: "22px", w: 4, h: 3, rot: "-20deg" },
                    { x: "0px", y: "-38px", w: 3, h: 4, rot: "0deg" },
                    { x: "-18px", y: "34px", w: 3, h: 3, rot: "25deg" },
                    { x: "18px", y: "34px", w: 3, h: 3, rot: "-25deg" },
                    { x: "0px", y: "38px", w: 3, h: 3, rot: "10deg" },
                  ].map((frag, idx) => (
                    <div
                      key={`pop-frag-${idx}`}
                      className="absolute rounded-full"
                      style={
                        {
                          left: "50%",
                          top: "50%",
                          width: `${frag.w}px`,
                          height: `${frag.h}px`,
                          marginLeft: `-${Math.round(frag.w / 2)}px`,
                          marginTop: `-${Math.round(frag.h / 2)}px`,
                          background: getBalloonColor(balloonState.knockIndex),
                          boxShadow: "0 0 8px rgba(255, 255, 255, 0.9)",
                          transform: `rotate(${frag.rot})`,
                          animation:
                            "balloonFragmentBurst 0.42s cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
                          "--frag-x": frag.x,
                          "--frag-y": frag.y,
                        } as React.CSSProperties
                      }
                    />
                  ))}

                  {/* 6 Delicate Glowing Sparkles */}
                  {[
                    { x: "-24px", y: "24px", delay: "0.02s" },
                    { x: "26px", y: "-28px", delay: "0.01s" },
                    { x: "-28px", y: "-20px", delay: "0.03s" },
                    { x: "28px", y: "16px", delay: "0.02s" },
                    { x: "0px", y: "-26px", delay: "0.04s" },
                    { x: "0px", y: "26px", delay: "0.01s" },
                  ].map((sp, idx) => (
                    <div
                      key={`pop-sp-${idx}`}
                      className="absolute text-[12px] text-amber-200 select-none pointer-events-none drop-shadow-[0_0_8px_rgba(251,191,36,0.95)]"
                      style={
                        {
                          left: "50%",
                          top: "50%",
                          marginLeft: "-6px",
                          marginTop: "-6px",
                          animation: "popSparkleFloat 0.44s ease-out forwards",
                          animationDelay: sp.delay,
                          // @ts-ignore
                          "--sp-x": sp.x,
                          "--sp-y": sp.y,
                        } as React.CSSProperties
                      }
                    >
                      ✨
                    </div>
                  ))}

                  {/* 4 Tiny Celebratory Hearts */}
                  {[
                    { char: "♥", x: "-22px", y: "-24px", color: "#ff4081" },
                    { char: "♡", x: "24px", y: "-22px", color: "#f48fb1" },
                    { char: "♥", x: "26px", y: "18px", color: "#ea80fc" },
                    { char: "♡", x: "-24px", y: "18px", color: "#ffffff" },
                  ].map((heart, idx) => (
                    <span
                      key={`pop-heart-${idx}`}
                      className="absolute text-[12px] font-bold select-none pointer-events-none drop-shadow-[0_0_6px_rgba(255,180,220,0.85)]"
                      style={
                        {
                          left: "50%",
                          top: "50%",
                          marginLeft: "-6px",
                          marginTop: "-6px",
                          color: heart.color,
                          animation: "popHeartFloat 0.45s ease-out forwards",
                          // @ts-ignore
                          "--heart-x": heart.x,
                          "--heart-y": heart.y,
                        } as React.CSSProperties
                      }
                    >
                      {heart.char}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Balloon String */}
            <svg
              className="w-full"
              style={{
                width: "28px",
                height: "46px",
                marginTop: "-1px",
                opacity: balloonState.isPopping ? 0 : 0.85,
                transition: "opacity 0.15s ease-out",
              }}
              viewBox="0 0 28 46"
              fill="none"
            >
              <path
                d="M 14 0 Q 9 14 18 26 T 13 46"
                stroke="rgba(255, 255, 255, 0.65)"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================
          2. MESSAGE REVEAL (EXACT SAME POSITION: top: 44%, left: 50%)
          - ONLY appears AFTER the balloon pops
          - PURE TEXT FLOATING DIRECTLY OVER THE BACKGROUND
          - NO background, NO card, NO border, NO box-shadow, NO blur
          - Scales smoothly from 0.85 to 1, opacity 0 to 1, soft moon-like glow
          ======================================================== */}
      {revealedMessage && (
        <div
          key={`revealed-msg-${revealedMessage.knock}`}
          className={`absolute pointer-events-none z-45 flex flex-col items-center justify-center text-center select-none transition-opacity duration-300 ${
            revealedMessage.isFadingOut || isExiting ? "opacity-0" : "opacity-100"
          }`}
          style={{
            left: "50%",
            top: "44%",
            width: "max-content",
            maxWidth: "90%",
            transform: "translate3d(-50%, -50%, 0)",
            animation: "popMessageReveal 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Main Poetic Message - plain text, directly over the background */}
          <h2
            className="font-['Caveat',cursive] text-[27px] sm:text-[30px] font-bold leading-snug text-white tracking-wide select-none text-center m-0 p-0"
            style={{
              textShadow:
                "0 0 10px rgba(255, 255, 255, 0.85), 0 0 22px rgba(255, 180, 220, 0.7), 0 2px 5px rgba(0, 0, 0, 0.95)",
            }}
          >
            {revealedMessage.text}
          </h2>

          {/* Sub-text: "Knock Again..." ONLY for Knocks 1 & 2 */}
          {showKnockAgain && revealedMessage.knock < 3 && (
            <p
              className="font-['Playfair_Display',Georgia,serif] text-[13px] sm:text-[14px] font-semibold text-pink-100 tracking-wider leading-tight text-center mt-2 m-0 p-0 select-none"
              style={{
                textShadow:
                  "0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 140, 205, 0.6), 0 2px 4px rgba(0, 0, 0, 0.95)",
                animation: "knockAgainFadeIn 0.5s ease-out forwards",
              }}
            >
              Knock Again...
            </p>
          )}

          {/* For Knock 3: Subtle indicator during short pause */}
          {revealedMessage.knock === 3 && (
            <div
              className="flex items-center gap-1.5 mt-2.5 opacity-90 select-none"
              style={{ animation: "knockAgainFadeIn 0.65s ease-out forwards" }}
            >
              <span
                className="text-[11px] text-pink-100 font-serif italic tracking-widest"
                style={{
                  textShadow:
                    "0 0 8px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0, 0, 0, 0.95)",
                }}
              >
                Opening the door…
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-200 animate-ping shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          3. BOTTOM INTERACTION AREA (Compact card with ONLY the button)
          NO duplicate text! NO static background messages!
          ======================================================== */}
      <div
        className={`absolute inset-x-0 bottom-2 sm:bottom-2.5 z-40 px-2.5 flex flex-col items-center select-none overflow-visible transition-all duration-400 ease-out ${
          isExiting ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0 pointer-events-auto"
        }`}
        style={{
          animation: !isExiting ? "doKnockEntrance 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards" : undefined,
        }}
      >
        <div
          className="relative w-full max-w-[270px] sm:max-w-[280px] rounded-[18px] px-3.5 py-2.5 sm:py-3 flex flex-col items-center text-center overflow-visible"
          style={{
            background:
              "linear-gradient(155deg, rgba(16, 8, 28, 0.82) 0%, rgba(38, 12, 46, 0.74) 50%, rgba(14, 5, 26, 0.88) 100%)",
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

          {/* Fluttering Micro Butterfly on Top Right */}
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

          {/* Door Knocker Icon */}
          <div
            className="relative z-10 w-6 h-6 flex items-center justify-center -mt-0.5 mb-0.5"
            style={{
              animation: "knockerTapPulse 3.2s ease-in-out infinite alternate",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4.5 h-4.5 drop-shadow-[0_0_8px_rgba(251,191,36,0.95)]"
              fill="none"
            >
              <circle cx="12" cy="7.5" r="4.2" fill="url(#knockerGoldGrad)" />
              <circle cx="12" cy="7.5" r="2.2" fill="#3b0724" opacity="0.4" />
              <path
                d="M8.5 10 C8.5 16 15.5 16 15.5 10"
                stroke="url(#knockerGoldGrad)"
                strokeWidth="2.3"
                strokeLinecap="round"
              />
              <circle cx="12" cy="18" r="1.7" fill="url(#knockerGoldGrad)" />
              <defs>
                <linearGradient id="knockerGoldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fff7d6" />
                  <stop offset="45%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Heading */}
          <h3
            className="relative z-10 font-['Caveat',cursive] text-[22px] sm:text-[23px] font-bold leading-none text-white tracking-wide select-none"
            style={{
              textShadow:
                "0 0 10px rgba(255, 140, 205, 0.95), 0 0 20px rgba(244, 63, 142, 0.85), 0 0 32px rgba(236, 72, 153, 0.65)",
              animation: "headingGlowPulse 3.5s ease-in-out infinite alternate",
            }}
          >
            Do Knock
          </h3>

          {/* Flourish Divider */}
          <div className="relative z-10 flex items-center justify-center gap-1 my-1 opacity-90">
            <span className="text-[8px] text-pink-200/70 tracking-tighter">──»</span>
            <span className="text-[9px] text-pink-300">✨</span>
            <span className="text-[8px] text-pink-200/70 tracking-tighter">«──</span>
          </div>

          {/* Interactive Button: "Do Knock →" (Available for Knocks 1 & 2; smoothly hidden on Knock 3) */}
          {knockCount < 3 && (
            <button
              id="do-knock-button"
              type="button"
              onClick={handleClick}
              disabled={isLocked}
              aria-label="Do Knock"
              className={`group relative w-full max-w-[190px] sm:max-w-[200px] h-[33px] sm:h-[34px] rounded-full px-4 font-semibold tracking-wide transition-all duration-300 cursor-pointer overflow-hidden active:scale-[0.975] hover:scale-[1.025] focus:outline-none flex items-center justify-center gap-1.5 mt-0.5 ${
                isLocked ? "opacity-70 cursor-not-allowed" : "opacity-100"
              }`}
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
                Do Knock →
              </span>
            </button>
          )}

          {/* After Knock 3: Subtle indicator during short cinematic pause */}
          {knockCount === 3 && (
            <div
              className="relative z-10 flex items-center justify-center gap-1.5 my-1"
              style={{
                animation: "popMessageReveal 0.6s ease-out forwards",
              }}
            >
              <span className="text-[10px] text-pink-200/90 font-serif italic tracking-widest">
                Opening the door…
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-ping" />
            </div>
          )}
        </div>
      </div>

      {/* Embedded Animations */}
      <style jsx>{`
        @keyframes doKnockEntrance {
          0% {
            opacity: 0;
            transform: translate3d(0, 18px, 0) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes balloonNaturalEntrance1 {
          0% {
            opacity: 0;
            transform: translate3d(-50%, 35px, 0) scale(0.7);
          }
          30% {
            opacity: 1;
            transform: translate3d(-53%, 16px, 0) scale(0.94) rotate(-2.5deg);
          }
          65% {
            transform: translate3d(-47%, 2px, 0) scale(1.02) rotate(2deg);
          }
          85% {
            transform: translate3d(-50%, -6px, 0) scale(1.04) rotate(-1deg);
          }
          100% {
            opacity: 1;
            transform: translate3d(-50%, -10px, 0) scale(1.02) rotate(0deg);
          }
        }
        @keyframes balloonNaturalEntrance2 {
          0% {
            opacity: 0;
            transform: translate3d(-50%, 35px, 0) scale(0.7);
          }
          30% {
            opacity: 1;
            transform: translate3d(-47%, 16px, 0) scale(0.94) rotate(2.5deg);
          }
          65% {
            transform: translate3d(-53%, 2px, 0) scale(1.02) rotate(-2deg);
          }
          85% {
            transform: translate3d(-50%, -6px, 0) scale(1.04) rotate(1deg);
          }
          100% {
            opacity: 1;
            transform: translate3d(-50%, -10px, 0) scale(1.02) rotate(0deg);
          }
        }
        @keyframes balloonNaturalEntrance3 {
          0% {
            opacity: 0;
            transform: translate3d(-50%, 35px, 0) scale(0.7);
            filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6));
          }
          30% {
            opacity: 1;
            transform: translate3d(-52%, 16px, 0) scale(0.95) rotate(-2deg);
            filter: drop-shadow(0 0 16px rgba(251, 191, 36, 0.8));
          }
          65% {
            transform: translate3d(-48%, 2px, 0) scale(1.03) rotate(1.5deg);
            filter: drop-shadow(0 0 22px rgba(251, 191, 36, 0.95));
          }
          100% {
            opacity: 1;
            transform: translate3d(-50%, -10px, 0) scale(1.03) rotate(0deg);
            filter: drop-shadow(0 0 25px rgba(251, 191, 36, 1));
          }
        }
        @keyframes balloonPopBurst {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          35% {
            transform: scale(1.28);
            opacity: 1;
            filter: brightness(1.7);
          }
          60% {
            transform: scale(0.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
        @keyframes popFlashFade {
          0% {
            opacity: 1;
            transform: scale(0.3);
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }
        @keyframes balloonFragmentBurst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--frag-x), var(--frag-y)) scale(0.15);
            opacity: 0;
          }
        }
        @keyframes popSparkleFloat {
          0% {
            transform: translate(0, 0) scale(0.4);
            opacity: 1;
          }
          50% {
            transform: translate(var(--sp-x), var(--sp-y)) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(calc(var(--sp-x) * 1.3), calc(var(--sp-y) * 1.3)) scale(0.2);
            opacity: 0;
          }
        }
        @keyframes popHeartFloat {
          0% {
            transform: translate(0, 0) scale(0.5);
            opacity: 1;
          }
          60% {
            transform: translate(var(--heart-x), var(--heart-y)) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(var(--heart-x) * 1.3), calc(var(--heart-y) * 1.3)) scale(0.3);
            opacity: 0;
          }
        }
        @keyframes popMessageReveal {
          0% {
            opacity: 0;
            transform: translate3d(-50%, -50%, 0) scale(0.85);
          }
          70% {
            opacity: 1;
            transform: translate3d(-50%, -50%, 0) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translate3d(-50%, -50%, 0) scale(1);
          }
        }
        @keyframes knockAgainFadeIn {
          0% {
            opacity: 0;
            transform: translate3d(0, 5px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes knockerTapPulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.8));
          }
          50% {
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
    </>
  );
}

// Backward compatibility export
export { DoKnockSection as DoNockSection };
