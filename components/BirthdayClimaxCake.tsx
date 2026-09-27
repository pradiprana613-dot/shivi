"use client";

import React, { useState, useEffect, useRef } from "react";

interface BirthdayClimaxCakeProps {
  isVisible: boolean;
  onReplay?: () => void;
}

type ClimaxState =
  | "CAKE_INTRO"
  | "WAITING_FOR_TAP"
  | "CANDLE_BLOWING"
  | "CANDLE_EXTINGUISHED"
  | "CELEBRATION"
  | "TITLE_REVEAL"
  | "FINAL_MESSAGE"
  | "CTA_AVAILABLE";

interface FloatingBalloon {
  id: number;
  left: string;
  delay: string;
  dur: string;
  color: string;
  size: number;
}

const CELEBRATION_BALLOONS: FloatingBalloon[] = [
  { id: 1, left: "6%", delay: "0s", dur: "7s", color: "radial-gradient(circle at 35% 30%, #ffd1dc 0%, #ff4d88 65%, #9f1239 100%)", size: 36 },
  { id: 2, left: "86%", delay: "0.4s", dur: "7.5s", color: "radial-gradient(circle at 35% 30%, #ede9fe 0%, #a855f7 65%, #581c87 100%)", size: 38 },
  { id: 3, left: "14%", delay: "1.2s", dur: "8s", color: "radial-gradient(circle at 35% 30%, #fef3c7 0%, #f59e0b 65%, #b45309 100%)", size: 34 },
  { id: 4, left: "78%", delay: "1.8s", dur: "7.2s", color: "radial-gradient(circle at 35% 30%, #fff7ed 0%, #fb923c 65%, #9a3412 100%)", size: 35 },
  { id: 5, left: "24%", delay: "2.5s", dur: "8.5s", color: "radial-gradient(circle at 35% 30%, #fce7f3 0%, #ec4899 65%, #831843 100%)", size: 32 },
  { id: 6, left: "70%", delay: "3.1s", dur: "7.8s", color: "radial-gradient(circle at 35% 30%, #e0e7ff 0%, #6366f1 65%, #312e81 100%)", size: 34 },
];

export function BirthdayClimaxCake({ isVisible, onReplay }: BirthdayClimaxCakeProps) {
  const [climaxState, setClimaxState] = useState<ClimaxState>("CAKE_INTRO");
  const [flameBlownOut, setFlameBlownOut] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    if (!isVisible) {
      clearAllTimers();
      setClimaxState("CAKE_INTRO");
      setFlameBlownOut(false);
      setShowSmoke(false);
      setIsExiting(false);
    } else {
      // Intro transition -> WAITING_FOR_TAP after 700ms
      const t = setTimeout(() => {
        setClimaxState("WAITING_FOR_TAP");
      }, 700);
      timersRef.current.push(t);
    }

    return () => clearAllTimers();
  }, [isVisible]);

  // Main tap interaction: user taps anywhere to blow out the candle
  const handleSceneTap = () => {
    if (climaxState !== "WAITING_FOR_TAP" && climaxState !== "CAKE_INTRO") {
      return;
    }

    clearAllTimers();
    setClimaxState("CANDLE_BLOWING");

    // 0.65s: Flame completely blows out
    const tBlow = setTimeout(() => {
      setFlameBlownOut(true);
      setShowSmoke(true);
      setClimaxState("CANDLE_EXTINGUISHED");

      // 0.9s: Smoke dissipates and celebration erupts
      const tCeleb = setTimeout(() => {
        setShowSmoke(false);
        setClimaxState("CELEBRATION");

        // 1.8s: HAPPY BIRTHDAY reveals
        const tTitle = setTimeout(() => {
          setClimaxState("TITLE_REVEAL");

          // 2.7s: SHIVI 💖 and supporting message
          const tFinal = setTimeout(() => {
            setClimaxState("FINAL_MESSAGE");

            // 4.2s: REPLAY CTA becomes available
            const tCta = setTimeout(() => {
              setClimaxState("CTA_AVAILABLE");
            }, 1500);
            timersRef.current.push(tCta);
          }, 1000);
          timersRef.current.push(tFinal);
        }, 1100);
        timersRef.current.push(tTitle);
      }, 750);
      timersRef.current.push(tCeleb);
    }, 650);
    timersRef.current.push(tBlow);
  };

  const handleReplayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      if (onReplay) {
        onReplay();
      }
    }, 600);
  };

  if (!isVisible) {
    return null;
  }

  const isCelebrationActive =
    climaxState === "CELEBRATION" ||
    climaxState === "TITLE_REVEAL" ||
    climaxState === "FINAL_MESSAGE" ||
    climaxState === "CTA_AVAILABLE";

  const isTitleActive =
    climaxState === "TITLE_REVEAL" ||
    climaxState === "FINAL_MESSAGE" ||
    climaxState === "CTA_AVAILABLE";

  const isFinalMessageActive =
    climaxState === "FINAL_MESSAGE" || climaxState === "CTA_AVAILABLE";

  return (
    <div
      onClick={handleSceneTap}
      className={`absolute inset-0 z-50 overflow-hidden flex flex-col justify-between p-4 select-none cursor-pointer transition-all duration-700 ease-out ${
        isExiting ? "opacity-0 scale-[0.98] pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: isCelebrationActive
          ? "radial-gradient(circle at 50% 48%, #1f103d 0%, #120829 45%, #050212 100%)"
          : "radial-gradient(circle at 50% 48%, #120a26 0%, #090418 55%, #020108 100%)",
        animation: !isExiting
          ? "climaxSceneEntrance 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          : undefined,
      }}
      aria-label="Birthday Cake Climax Celebration"
    >
      {/* ========================================================
          1. BACKGROUND DRIFTING BIRTHDAY TYPOGRAPHY (SUBTLE / DISTANT)
          ======================================================== */}
      {isCelebrationActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
          <div
            className="whitespace-nowrap font-['Plus_Jakarta_Sans',sans-serif] text-[10px] tracking-[0.35em] text-[#F6D98B] uppercase"
            style={{
              animation: "driftBackgroundText 32s linear infinite",
            }}
          >
            HAPPY BIRTHDAY • SHIVI • HAPPY BIRTHDAY • SHIVI • HAPPY BIRTHDAY • SHIVI • HAPPY BIRTHDAY • SHIVI •
          </div>
        </div>
      )}

      {/* ========================================================
          2. ATMOSPHERIC PARTICLES & CELEBRATION BALLOONS
          ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Fairy Lights / Stars in Background */}
        {[
          { l: "15%", t: "10%", s: 2, d: "0s" },
          { l: "82%", t: "12%", s: 2.5, d: "1.5s" },
          { l: "48%", t: "6%", s: 2.8, d: "0.8s" },
          { l: "20%", t: "38%", s: 1.8, d: "2.1s" },
          { l: "85%", t: "42%", s: 2.2, d: "1.2s" },
          { l: "12%", t: "78%", s: 2.6, d: "0.3s" },
          { l: "88%", t: "82%", s: 2, d: "2.5s" },
        ].map((star, idx) => (
          <div
            key={`cake-star-${idx}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: star.l,
              top: star.t,
              width: `${star.s}px`,
              height: `${star.s}px`,
              animationDuration: isCelebrationActive ? "2s" : "3.8s",
              animationDelay: star.d,
              opacity: isCelebrationActive ? 0.9 : 0.45,
            }}
          />
        ))}

        {/* Celebration Aura behind cake */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000"
          style={{
            width: isCelebrationActive ? "380px" : "240px",
            height: isCelebrationActive ? "380px" : "240px",
            background: isCelebrationActive
              ? "radial-gradient(circle, rgba(246, 217, 139, 0.24) 0%, rgba(255, 115, 185, 0.18) 40%, transparent 72%)"
              : "radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, transparent 70%)",
          }}
        />

        {/* Confetti & Party Sparkles during Celebration */}
        {isCelebrationActive && (
          <div className="absolute inset-0 pointer-events-none">
            {[
              { l: "16%", bg: "#F6D98B", d: "0.2s" },
              { l: "32%", bg: "#ff73b9", d: "0.9s" },
              { l: "50%", bg: "#c084fc", d: "0.4s" },
              { l: "68%", bg: "#F6D98B", d: "1.2s" },
              { l: "84%", bg: "#f43f5e", d: "0.7s" },
              { l: "24%", bg: "#38bdf8", d: "1.5s" },
              { l: "76%", bg: "#f472b6", d: "1.8s" },
            ].map((cf, idx) => (
              <div
                key={`conf-${idx}`}
                className="absolute w-1.5 h-2 rounded-sm"
                style={{
                  left: cf.l,
                  top: "4%",
                  backgroundColor: cf.bg,
                  boxShadow: `0 0 6px ${cf.bg}`,
                  animation: "confettiFall 6s linear infinite",
                  animationDelay: cf.d,
                }}
              />
            ))}

            {/* Floating Love Hearts */}
            {[
              { l: "18%", t: "75%", d: "0s", s: 13 },
              { l: "80%", t: "72%", d: "1.4s", s: 15 },
              { l: "45%", t: "82%", d: "2.6s", s: 12 },
            ].map((ht, idx) => (
              <span
                key={`cake-ht-${idx}`}
                className="absolute text-pink-300 opacity-65"
                style={{
                  left: ht.l,
                  top: ht.t,
                  fontSize: `${ht.s}px`,
                  animation: "heartFloatContinuous 6.5s ease-in-out infinite",
                  animationDelay: ht.d,
                  textShadow: "0 0 8px rgba(244, 114, 182, 0.8)",
                }}
              >
                ♥
              </span>
            ))}
          </div>
        )}

        {/* Ascending Colorful Celebration Balloons */}
        {isCelebrationActive &&
          CELEBRATION_BALLOONS.map((b) => (
            <div
              key={`celeb-balloon-${b.id}`}
              className="absolute pointer-events-none"
              style={{
                left: b.left,
                bottom: "-100px",
                width: `${b.size}px`,
                height: `${Math.round(b.size * 1.25)}px`,
                background: b.color,
                borderRadius: "50% 50% 50% 50% / 42% 42% 58% 58%",
                boxShadow:
                  "0 12px 24px rgba(0, 0, 0, 0.45), inset -3px -5px 8px rgba(0, 0, 0, 0.3), inset 4px 5px 8px rgba(255, 255, 255, 0.7)",
                animation: `balloonClimaxRise ${b.dur} cubic-bezier(0.2, 0.8, 0.3, 1) ${b.delay} infinite`,
              }}
            >
              {/* Knot */}
              <div
                className="absolute left-1/2 -bottom-[3px] -translate-x-1/2 w-[5px] h-[4px]"
                style={{ background: b.color, filter: "brightness(0.85)" }}
              />
            </div>
          ))}
      </div>

      {/* ========================================================
          3. TOP BANNER & MAIN HEADINGS
          ======================================================== */}
      <header className="relative z-20 w-full flex flex-col items-center text-center pt-2 min-h-[96px] justify-center">
        {!isCelebrationActive ? (
          /* Initial Calm Wish Instruction */
          <div
            className="flex flex-col items-center text-center transition-opacity duration-500"
            style={{
              animation: "wishPromptFloat 3s ease-in-out infinite alternate",
            }}
          >
            <h2 className="font-['Playfair_Display',serif] text-[20px] sm:text-[22px] tracking-[0.1em] font-bold text-[#F6D98B] drop-shadow-[0_0_12px_rgba(246,217,139,0.6)]">
              MAKE A WISH ✨
            </h2>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[rgba(235,230,220,0.7)] mt-1 font-light">
              Tap anywhere to blow out the candle
            </p>
          </div>
        ) : (
          /* Climax Title: HAPPY BIRTHDAY SHIVI 💖 */
          <div className="flex flex-col items-center text-center">
            {isTitleActive && (
              <span
                className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] sm:text-[13px] tracking-[0.28em] uppercase text-[#F6D98B] font-semibold opacity-0"
                style={{
                  animation:
                    "fadeInScaleUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  textShadow:
                    "0 1px 3px rgba(0,0,0,0.9), 0 0 16px rgba(246, 217, 139, 0.6)",
                }}
              >
                HAPPY BIRTHDAY
              </span>
            )}

            {isFinalMessageActive && (
              <h1
                className="font-['Playfair_Display',serif] text-[34px] sm:text-[40px] tracking-[0.06em] font-extrabold text-[#FAF6EE] mt-0.5 opacity-0 leading-tight"
                style={{
                  animation:
                    "fadeInScaleUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards",
                  textShadow:
                    "0 2px 6px rgba(0, 0, 0, 0.95), 0 0 24px rgba(255, 115, 185, 0.8), 0 0 45px rgba(246, 217, 139, 0.5)",
                }}
              >
                SHIVI <span className="text-pink-400">💖</span>
              </h1>
            )}

            {isFinalMessageActive && (
              <p
                className="font-['Playfair_Display',serif] italic text-[13px] sm:text-[14px] text-[rgba(245,235,215,0.92)] mt-1.5 opacity-0 max-w-[280px]"
                style={{
                  animation:
                    "fadeInScaleUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards",
                  textShadow:
                    "0 1px 3px rgba(0, 0, 0, 0.9), 0 0 14px rgba(246, 217, 139, 0.3)",
                }}
              >
                “May your day be as beautiful as you are.”
              </p>
            )}
          </div>
        )}
      </header>

      {/* ========================================================
          4. THE 3D BIRTHDAY CAKE & INTERACTIVE CANDLE
          ======================================================== */}
      <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-center my-auto">
        <div
          className="relative flex flex-col items-center select-none"
          style={{
            animation: "cakeGentleLevitate 4.8s ease-in-out infinite alternate",
          }}
        >
          {/* ================= CANDLE & FLAME ================= */}
          <div className="relative flex flex-col items-center -mb-1 z-30">
            {/* The Flame & Smoke */}
            <div className="relative w-8 h-12 flex items-center justify-center">
              {!flameBlownOut ? (
                <div
                  className="relative flex flex-col items-center cursor-pointer"
                  style={{
                    animation:
                      climaxState === "CANDLE_BLOWING"
                        ? "flameExtinguishBlow 0.65s cubic-bezier(0.2, 0.9, 0.3, 1) forwards"
                        : "flameNaturalFlicker 1.8s ease-in-out infinite alternate",
                  }}
                >
                  {/* Outer Flame Glow Halo */}
                  <div
                    className="absolute -top-3 w-10 h-10 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(245, 158, 11, 0.25) 50%, transparent 75%)",
                    }}
                  />

                  {/* Main Flame Teardrop */}
                  <div
                    className="w-4 h-7 rounded-[50%_50%_35%_35%/60%_60%_40%_40%]"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 65%, #ffffff 0%, #fef08a 35%, #f59e0b 70%, #ea580c 100%)",
                      boxShadow:
                        "0 0 14px rgba(251, 191, 36, 0.95), 0 0 28px rgba(245, 158, 11, 0.6)",
                    }}
                  />

                  {/* Inner Blue Core */}
                  <div
                    className="absolute bottom-0 w-2 h-2.5 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, #67e8f9 0%, #0284c7 60%, transparent 100%)",
                      opacity: 0.85,
                    }}
                  />
                </div>
              ) : showSmoke ? (
                /* Natural Curling Smoke Puff */
                <div
                  className="absolute bottom-2 flex flex-col items-center pointer-events-none"
                  style={{
                    animation: "smokeRiseAndCurl 0.75s ease-out forwards",
                  }}
                >
                  <div className="w-2.5 h-6 rounded-full bg-gradient-to-t from-[rgba(235,230,220,0.7)] to-transparent blur-[1px]" />
                </div>
              ) : null}
            </div>

            {/* Candle Wick */}
            <div className="w-[1.5px] h-[5px] bg-[#332211] -mt-1 rounded-t-sm" />

            {/* Slender Spiral Gold Candle Body */}
            <div
              className="w-[10px] h-[34px] rounded-t-sm relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(90deg, #fef9c3 0%, #fef08a 40%, #eab308 85%, #ca8a04 100%)",
                boxShadow:
                  "0 2px 6px rgba(0, 0, 0, 0.4), inset 1px 0 1px rgba(255, 255, 255, 0.8)",
              }}
            >
              {/* Spiral Stripe Accents */}
              <div
                className="w-full h-full opacity-35"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, transparent, transparent 3px, #b45309 3px, #b45309 5px)",
                }}
              />
            </div>
          </div>

          {/* ================= CAKE TOP TIER ================= */}
          <div className="relative z-20 flex flex-col items-center -mt-1">
            {/* Top Tier Elliptical Frosting Cap */}
            <div
              className="w-[124px] h-[30px] rounded-full relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 35%, #ffffff 0%, #fff7ed 55%, #fde68a 100%)",
                boxShadow:
                  "inset 0 1px 2px rgba(255, 255, 255, 0.95), 0 2px 5px rgba(0, 0, 0, 0.15)",
                border: "1px solid rgba(246, 217, 139, 0.6)",
              }}
            >
              {/* Golden pearl bead border */}
              <div className="absolute inset-x-2 bottom-1 flex justify-between px-1 opacity-60">
                {[...Array(9)].map((_, i) => (
                  <span key={`p1-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#F6D98B] inline-block shadow-[0_0_2px_#F6D98B]" />
                ))}
              </div>
            </div>

            {/* Top Tier Cylindrical Body */}
            <div
              className="w-[124px] h-[48px] -mt-[14px] rounded-b-[18px] relative overflow-hidden flex flex-col justify-between"
              style={{
                background:
                  "linear-gradient(180deg, #fff7ed 0%, #fef3c7 45%, #fde68a 85%, #eab308 100%)",
                boxShadow:
                  "0 6px 14px rgba(0, 0, 0, 0.35), inset -3px 0 5px rgba(180, 130, 40, 0.3), inset 3px 0 5px rgba(255, 255, 255, 0.7)",
              }}
            >
              {/* Scalloped Strawberry Pink Frosting Drips */}
              <div className="w-full flex justify-around -mt-0.5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`drip1-${i}`}
                    className="w-4 h-3.5 rounded-b-full bg-gradient-to-b from-[#ffd1dc] to-[#ff80ab] shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                  />
                ))}
              </div>

              {/* Delicate Gold Floral Accent */}
              <div className="self-center mb-1 text-[11px] text-[#b45309] opacity-80">
                ✿
              </div>
            </div>
          </div>

          {/* ================= CAKE BOTTOM TIER ================= */}
          <div className="relative z-10 flex flex-col items-center -mt-[12px]">
            {/* Bottom Tier Elliptical Frosting Cap */}
            <div
              className="w-[188px] h-[40px] rounded-full relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, #ffffff 0%, #fff1f2 45%, #fecdd3 85%, #fda4af 100%)",
                boxShadow:
                  "inset 0 1.5px 3px rgba(255, 255, 255, 0.95), 0 3px 8px rgba(0, 0, 0, 0.25)",
                border: "1px solid rgba(254, 205, 211, 0.8)",
              }}
            >
              {/* Rose Cream Piping Swirls */}
              <div className="absolute inset-x-3 bottom-1.5 flex justify-between px-1 opacity-70">
                {[...Array(11)].map((_, i) => (
                  <span key={`p2-${i}`} className="w-2 h-2 rounded-full bg-[#f43f5e]/40 inline-block shadow-[0_0_3px_#f43f5e]" />
                ))}
              </div>
            </div>

            {/* Bottom Tier Cylindrical Body */}
            <div
              className="w-[188px] h-[64px] -mt-[20px] rounded-b-[24px] relative overflow-hidden flex flex-col justify-between"
              style={{
                background:
                  "linear-gradient(180deg, #fff1f2 0%, #ffe4e6 35%, #fecdd3 75%, #fda4af 100%)",
                boxShadow:
                  "0 10px 24px rgba(0, 0, 0, 0.5), inset -4px 0 6px rgba(180, 60, 90, 0.25), inset 4px 0 6px rgba(255, 255, 255, 0.8)",
              }}
            >
              {/* Scalloped Gold & Cream Lace */}
              <div className="w-full flex justify-around -mt-0.5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`drip2-${i}`}
                    className="w-5 h-4.5 rounded-b-full bg-gradient-to-b from-[#fef3c7] to-[#F6D98B] shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                  />
                ))}
              </div>

              {/* Lower Gold Filigree Swirls */}
              <div className="w-full flex items-center justify-around px-4 mb-2 opacity-65 text-[10px] text-[#9f1239]">
                <span>❦</span>
                <span>•</span>
                <span>❦</span>
                <span>•</span>
                <span>❦</span>
              </div>
            </div>
          </div>

          {/* ================= CAKE STAND / PEDESTAL ================= */}
          <div className="relative z-0 flex flex-col items-center -mt-[14px]">
            {/* Scalloped Porcelain Plate with Gold Rim */}
            <div
              className="w-[228px] h-[34px] rounded-full relative"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 25%, #ffffff 0%, #f8fafc 55%, #e2e8f0 100%)",
                boxShadow:
                  "0 12px 28px rgba(0, 0, 0, 0.65), inset 0 2px 4px rgba(255, 255, 255, 1), 0 0 12px rgba(246, 217, 139, 0.35)",
                border: "1.5px solid #F6D98B",
              }}
            />

            {/* Pedestal Foot */}
            <div
              className="w-[74px] h-[16px] -mt-[10px] rounded-b-[10px]"
              style={{
                background:
                  "linear-gradient(180deg, #f8fafc 0%, #cbd5e1 100%)",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.55)",
              }}
            />

            {/* Ambient Ground Shadow */}
            <div
              className="w-[260px] h-[22px] rounded-full -mt-[6px] blur-[6px] pointer-events-none"
              style={{
                background: "rgba(0, 0, 0, 0.6)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          5. FOOTER REPLAY CTA (APPEARS AT THE VERY END)
          ======================================================== */}
      <footer className="relative z-30 w-full flex justify-center pb-2 sm:pb-3 select-none min-h-[48px]">
        {climaxState === "CTA_AVAILABLE" && (
          <div
            style={{
              animation: "nextCtaFadeUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <button
              type="button"
              onClick={handleReplayClick}
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-2 rounded-full border border-[rgba(246,217,139,0.55)] bg-[rgba(246,217,139,0.14)] text-[#F6D98B] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] sm:text-[12px] font-medium tracking-[0.2em] uppercase transition-all duration-300 ease-out active:scale-[0.96] hover:border-[#F6D98B] hover:bg-[rgba(246,217,139,0.28)] hover:text-white cursor-pointer shadow-[0_0_20px_rgba(246,217,139,0.35),0_0_30px_rgba(255,115,185,0.2)]"
              aria-label="Replay Birthday Experience"
            >
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">REPLAY</span>
              <span className="text-[12px] transition-transform duration-300 group-hover:rotate-180">
                ✨
              </span>
            </button>
          </div>
        )}
      </footer>

      {/* ========================================================
          6. KEYFRAME STYLES
          ======================================================== */}
      <style jsx global>{`
        @keyframes climaxSceneEntrance {
          0% {
            opacity: 0;
            transform: scale(0.97);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes wishPromptFloat {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, -3px, 0);
          }
        }

        @keyframes cakeGentleLevitate {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, -5px, 0);
          }
        }

        @keyframes flameNaturalFlicker {
          0% {
            transform: rotate(-1.5deg) scaleY(0.96);
          }
          50% {
            transform: rotate(2deg) scaleY(1.04) scaleX(0.98);
          }
          100% {
            transform: rotate(-1deg) scaleY(1);
          }
        }

        @keyframes flameExtinguishBlow {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
          35% {
            transform: rotate(28deg) scaleY(0.7) scaleX(0.85);
            opacity: 0.9;
          }
          75% {
            transform: rotate(45deg) scaleY(0.3) scaleX(0.5);
            opacity: 0.6;
          }
          100% {
            transform: rotate(60deg) scale(0);
            opacity: 0;
          }
        }

        @keyframes smokeRiseAndCurl {
          0% {
            opacity: 0.85;
            transform: translate3d(0, 0, 0) scale(0.6);
          }
          50% {
            opacity: 0.55;
            transform: translate3d(4px, -14px, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate3d(-3px, -30px, 0) scale(1.4);
          }
        }

        @keyframes balloonClimaxRise {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.9;
          }
          50% {
            transform: translate3d(12px, -350px, 0) rotate(4deg);
            opacity: 0.95;
          }
          100% {
            transform: translate3d(-10px, -780px, 0) rotate(-3deg);
            opacity: 0.2;
          }
        }

        @keyframes fadeInScaleUp {
          0% {
            opacity: 0;
            transform: scale(0.88) translate3d(0, 10px, 0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate3d(0, 0, 0);
          }
        }

        @keyframes driftBackgroundText {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
