"use client";

import React, { useState, useEffect } from "react";

interface FourBalloonsSectionProps {
  isVisible: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

type StepState =
  | "B1_ACTIVE"
  | "B1_POPPING"
  | "B2_ACTIVE"
  | "B2_POPPING"
  | "B3_ACTIVE"
  | "B3_POPPING"
  | "B4_ACTIVE"
  | "B4_POPPING"
  | "FINAL_CELEBRATION"
  | "NEXT_AVAILABLE";

interface BalloonConfig {
  id: 1 | 2 | 3 | 4;
  word: string;
  left: string;
  top: string;
  colorGradient: string;
  glowColor: string;
  floatDelay: string;
}

const BALLOONS: BalloonConfig[] = [
  {
    id: 1,
    word: "YOU",
    left: "14%",
    top: "22%",
    colorGradient:
      "radial-gradient(circle at 35% 30%, #ffd1dc 0%, #ff4d88 65%, #9f1239 100%)",
    glowColor: "rgba(255, 77, 136, 0.45)",
    floatDelay: "0s",
  },
  {
    id: 2,
    word: "ARE",
    left: "64%",
    top: "26%",
    colorGradient:
      "radial-gradient(circle at 35% 30%, #ede9fe 0%, #a855f7 65%, #581c87 100%)",
    glowColor: "rgba(168, 85, 247, 0.45)",
    floatDelay: "1.2s",
  },
  {
    id: 3,
    word: "SO",
    left: "18%",
    top: "56%",
    colorGradient:
      "radial-gradient(circle at 35% 30%, #fff7ed 0%, #fb923c 65%, #9a3412 100%)",
    glowColor: "rgba(251, 146, 60, 0.45)",
    floatDelay: "2.1s",
  },
  {
    id: 4,
    word: "SPECIAL",
    left: "60%",
    top: "58%",
    colorGradient:
      "radial-gradient(circle at 35% 30%, #fef3c7 0%, #f59e0b 65%, #b45309 100%)",
    glowColor: "rgba(245, 158, 11, 0.5)",
    floatDelay: "0.8s",
  },
];

export function FourBalloonsSection({
  isVisible,
  onNext,
}: FourBalloonsSectionProps) {
  const [step, setStep] = useState<StepState>("B1_ACTIVE");
  const [poppedIds, setPoppedIds] = useState<number[]>([]);
  const [isCenteringUnified, setIsCenteringUnified] = useState(false);
  const [showSubLine, setShowSubLine] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Progressive magic levels: 0 to 4
  const magicLevel = poppedIds.length;

  // Reset when visibility changes
  useEffect(() => {
    if (!isVisible) {
      setStep("B1_ACTIVE");
      setPoppedIds([]);
      setIsCenteringUnified(false);
      setShowSubLine(false);
      setIsExiting(false);
    }
  }, [isVisible]);

  // Handle balloon tapping with strict order enforcement
  const handleBalloonTap = (balloonId: 1 | 2 | 3 | 4) => {
    // Only current active balloon can be tapped
    if (balloonId === 1 && step === "B1_ACTIVE") {
      setStep("B1_POPPING");
      triggerPop(1, "B2_ACTIVE");
    } else if (balloonId === 2 && step === "B2_ACTIVE") {
      setStep("B2_POPPING");
      triggerPop(2, "B3_ACTIVE");
    } else if (balloonId === 3 && step === "B3_ACTIVE") {
      setStep("B3_POPPING");
      triggerPop(3, "B4_ACTIVE");
    } else if (balloonId === 4 && step === "B4_ACTIVE") {
      setStep("B4_POPPING");
      triggerPop(4, "FINAL_CELEBRATION");
    }
  };

  const triggerPop = (id: number, nextStep: StepState) => {
    // 180ms for pop compression and burst
    setTimeout(() => {
      setPoppedIds((prev) => [...prev, id]);

      if (id === 4) {
        // Fourth balloon: start final celebration sequence
        setTimeout(() => {
          setStep("FINAL_CELEBRATION");
          setIsCenteringUnified(true);

          // Sub line appears after phrase settles
          setTimeout(() => {
            setShowSubLine(true);
          }, 1000);

          // Next button appears after full celebration settles
          setTimeout(() => {
            setStep("NEXT_AVAILABLE");
          }, 1800);
        }, 800);
      } else {
        // Unlock next balloon smoothly
        setTimeout(() => {
          setStep(nextStep);
        }, 400);
      }
    }, 180);
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      if (onNext) {
        onNext();
      }
    }, 550);
  };

  if (!isVisible) {
    return null;
  }

  // Active balloon check
  const activeBalloonId =
    step === "B1_ACTIVE"
      ? 1
      : step === "B2_ACTIVE"
      ? 2
      : step === "B3_ACTIVE"
      ? 3
      : step === "B4_ACTIVE"
      ? 4
      : null;

  return (
    <div
      className={`absolute inset-0 z-50 overflow-hidden flex flex-col justify-between p-4 select-none transition-all duration-700 ease-out ${
        isExiting ? "opacity-0 scale-[0.98] pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background:
          magicLevel >= 4
            ? "radial-gradient(circle at 50% 42%, #221245 0%, #130a2f 50%, #050212 100%)"
            : magicLevel >= 2
            ? "radial-gradient(circle at 50% 42%, #190f38 0%, #0d0724 50%, #04020e 100%)"
            : "radial-gradient(circle at 50% 42%, #140d2e 0%, #09051c 50%, #020108 100%)",
        animation: !isExiting
          ? "balloonSceneEntrance 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          : undefined,
      }}
      aria-label="Four Balloon Surprise"
    >
      {/* ========================================================
          1. PROGRESSIVE ATMOSPHERE (STARS, PARTICLES & GLOW)
          ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft atmospheric radial bloom */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full transition-all duration-1000"
          style={{
            background:
              magicLevel >= 4
                ? "radial-gradient(circle, rgba(255, 115, 185, 0.22) 0%, rgba(246, 217, 139, 0.16) 40%, transparent 70%)"
                : "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
          }}
        />

        {/* Ambient Twinkling Stars (Base layer) */}
        {[
          { l: "12%", t: "12%", s: 2, d: "0s" },
          { l: "82%", t: "15%", s: 2.5, d: "1.2s" },
          { l: "48%", t: "8%", s: 3, d: "2.1s" },
          { l: "22%", t: "42%", s: 1.5, d: "0.8s" },
          { l: "78%", t: "46%", s: 2, d: "1.9s" },
          { l: "10%", t: "80%", s: 2.5, d: "0.5s" },
          { l: "88%", t: "76%", s: 2, d: "2.4s" },
          { l: "50%", t: "88%", s: 3, d: "1.6s" },
        ].map((star, idx) => (
          <div
            key={`base-star-${idx}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: star.l,
              top: star.t,
              width: `${star.s}px`,
              height: `${star.s}px`,
              animationDuration: "3.5s",
              animationDelay: star.d,
              opacity: magicLevel >= 1 ? 0.9 : 0.45,
            }}
          />
        ))}

        {/* Level 1+: Additional Starlight Glow */}
        {magicLevel >= 1 && (
          <>
            <div className="absolute top-[18%] left-[45%] w-2 h-2 rounded-full bg-[#fcedbb] animate-ping" style={{ animationDuration: "4s" }} />
            <div className="absolute top-[68%] left-[38%] w-1.5 h-1.5 rounded-full bg-pink-200 animate-ping" style={{ animationDuration: "3.2s" }} />
          </>
        )}

        {/* Level 2+: Warm Golden Particles */}
        {magicLevel >= 2 &&
          [
            { l: "30%", t: "35%", d: "0s" },
            { l: "65%", t: "38%", d: "1.5s" },
            { l: "42%", t: "62%", d: "2.8s" },
          ].map((pt, idx) => (
            <div
              key={`warm-pt-${idx}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#F6D98B]"
              style={{
                left: pt.l,
                top: pt.t,
                boxShadow: "0 0 8px #F6D98B",
                animation: "particleFloatSlow 5s ease-in-out infinite",
                animationDelay: pt.d,
              }}
            />
          ))}

        {/* Level 3+: Floating Soft Hearts */}
        {magicLevel >= 3 &&
          [
            { l: "20%", t: "75%", d: "0s", s: 12 },
            { l: "74%", t: "70%", d: "1.8s", s: 14 },
            { l: "46%", t: "78%", d: "3.2s", s: 11 },
          ].map((ht, idx) => (
            <span
              key={`heart-float-${idx}`}
              className="absolute text-pink-300 pointer-events-none opacity-60"
              style={{
                left: ht.l,
                top: ht.t,
                fontSize: `${ht.s}px`,
                animation: "heartFloatContinuous 6s ease-in-out infinite",
                animationDelay: ht.d,
                textShadow: "0 0 8px rgba(244, 114, 182, 0.8)",
              }}
            >
              ♥
            </span>
          ))}

        {/* Level 4: Final Celebration Confetti & Sparkles */}
        {magicLevel >= 4 && (
          <div className="absolute inset-0 pointer-events-none">
            {[
              { l: "18%", bg: "#F6D98B", d: "0.2s" },
              { l: "32%", bg: "#ff73b9", d: "0.8s" },
              { l: "50%", bg: "#c084fc", d: "0.4s" },
              { l: "68%", bg: "#F6D98B", d: "1.1s" },
              { l: "82%", bg: "#f43f5e", d: "0.6s" },
            ].map((cf, idx) => (
              <div
                key={`confetti-cel-${idx}`}
                className="absolute w-1.5 h-2 rounded-sm"
                style={{
                  left: cf.l,
                  top: "6%",
                  backgroundColor: cf.bg,
                  boxShadow: `0 0 6px ${cf.bg}`,
                  animation: "confettiFall 5.5s linear infinite",
                  animationDelay: cf.d,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          2. TOP PROGRESSIVE BANNER
          ======================================================== */}
      <header className="relative z-10 w-full flex flex-col items-center text-center pt-2">
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[9.5px] sm:text-[10px] tracking-[0.26em] uppercase text-[rgba(235,230,220,0.65)] font-light">
          A SECRET MESSAGE FOR YOU
        </span>

        {/* Progressive text banner preview at top */}
        <div className="min-h-[28px] mt-1 flex items-center justify-center gap-1.5">
          {poppedIds.length > 0 && !isCenteringUnified && (
            <div className="flex items-center gap-2 font-['Playfair_Display',serif] text-[16px] sm:text-[18px] tracking-[0.08em] font-semibold text-[#FAF6EE]">
              {poppedIds.includes(1) && <span>YOU</span>}
              {poppedIds.includes(2) && <span>ARE</span>}
              {poppedIds.includes(3) && <span>SO</span>}
              {poppedIds.includes(4) && (
                <span className="text-[#F6D98B] drop-shadow-[0_0_10px_rgba(246,217,139,0.7)]">
                  SPECIAL
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ========================================================
          3. MAIN INTERACTION ARENA: 4 BALLOONS & REVEALED WORDS
          ======================================================== */}
      <div className="relative z-20 w-full flex-1 overflow-visible">
        {/* Render each balloon or its revealed word */}
        {BALLOONS.map((b) => {
          const isPopped = poppedIds.includes(b.id);
          const isActive = activeBalloonId === b.id;
          const isPoppingThis =
            (b.id === 1 && step === "B1_POPPING") ||
            (b.id === 2 && step === "B2_POPPING") ||
            (b.id === 3 && step === "B3_POPPING") ||
            (b.id === 4 && step === "B4_POPPING");

          if (!isPopped) {
            /* ---------------- BALLOON VIEW ---------------- */
            return (
              <div
                key={`balloon-${b.id}`}
                onClick={() => handleBalloonTap(b.id)}
                className={`absolute flex flex-col items-center cursor-pointer transition-transform duration-200 select-none ${
                  isActive
                    ? "pointer-events-auto"
                    : "pointer-events-none opacity-55"
                }`}
                style={{
                  left: b.left,
                  top: b.top,
                  animation: !isPoppingThis
                    ? `balloonSwayFloat 4.2s ease-in-out ${b.floatDelay} infinite alternate`
                    : undefined,
                  transform: isPoppingThis ? "scale(1.18)" : undefined,
                  transition: isPoppingThis ? "transform 0.16s ease-out" : undefined,
                }}
              >
                {/* Active Indicator Badge */}
                {isActive && (
                  <div className="mb-1 px-2 py-0.5 rounded-full border border-[rgba(246,217,139,0.6)] bg-[rgba(246,217,139,0.18)] shadow-[0_0_12px_rgba(246,217,139,0.4)] animate-bounce">
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[9px] font-semibold tracking-[0.16em] text-[#F6D98B] uppercase">
                      Tap 🎈
                    </span>
                  </div>
                )}

                {/* Balloon Sphere (64px × 78px) */}
                <div
                  className="relative rounded-[50%_50%_50%_50%_/_42%_42%_58%_58%] transition-shadow duration-300"
                  style={{
                    width: "64px",
                    height: "78px",
                    background: b.colorGradient,
                    boxShadow: isActive
                      ? `0 14px 30px rgba(0, 0, 0, 0.6), 0 0 24px ${b.glowColor}, inset -4px -6px 12px rgba(0, 0, 0, 0.35), inset 5px 6px 10px rgba(255, 255, 255, 0.8)`
                      : `0 10px 24px rgba(0, 0, 0, 0.45), inset -3px -5px 10px rgba(0, 0, 0, 0.3), inset 4px 5px 8px rgba(255, 255, 255, 0.6)`,
                  }}
                >
                  {/* Glossy Specular Reflection */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      top: "14%",
                      left: "18%",
                      width: "14px",
                      height: "25px",
                      background:
                        "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%)",
                      transform: "rotate(-25deg)",
                    }}
                  />

                  {/* Knot */}
                  <div
                    className="absolute left-1/2 -bottom-[4px] -translate-x-1/2 rounded-[1px_1px_3px_3px]"
                    style={{
                      width: "7px",
                      height: "5px",
                      background: b.colorGradient,
                      filter: "brightness(0.85)",
                    }}
                  />
                </div>

                {/* Balloon String */}
                <div
                  className="w-[1.2px] h-[36px] mt-1"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 100%)",
                  }}
                />
              </div>
            );
          } else if (!isCenteringUnified) {
            /* ---------------- REVEALED WORD IN PLACE ---------------- */
            return (
              <div
                key={`revealed-word-${b.id}`}
                className="absolute flex flex-col items-center justify-center select-none"
                style={{
                  left: b.left,
                  top: b.top,
                  width: "90px",
                  height: "80px",
                  animation:
                    "wordPopReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                }}
              >
                {/* Pop Sparkle Aura */}
                <div
                  className="absolute w-20 h-20 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${b.glowColor} 0%, transparent 70%)`,
                  }}
                />

                <span
                  className={`font-['Playfair_Display',serif] tracking-[0.06em] font-bold ${
                    b.id === 4
                      ? "text-[23px] text-[#F6D98B]"
                      : "text-[22px] text-[#FAF6EE]"
                  }`}
                  style={{
                    textShadow:
                      b.id === 4
                        ? "0 1px 3px rgba(0,0,0,0.9), 0 0 16px rgba(246, 217, 139, 0.8), 0 0 28px rgba(246, 217, 139, 0.4)"
                        : "0 1px 3px rgba(0,0,0,0.9), 0 0 14px rgba(255, 255, 255, 0.45)",
                  }}
                >
                  {b.word}
                </span>
              </div>
            );
          } else {
            return null;
          }
        })}

        {/* ========================================================
            4. UNIFIED FINAL CELEBRATION (CENTERED "YOU ARE SO SPECIAL")
            ======================================================== */}
        {isCenteringUnified && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
            style={{
              animation: "unifiedPhraseEntrance 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            {/* Grand Golden Radiant Aura */}
            <div
              className="absolute w-[320px] h-[180px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(246, 217, 139, 0.22) 0%, rgba(255, 115, 185, 0.16) 45%, transparent 75%)",
              }}
            />

            {/* Sparkle glyph */}
            <span className="text-[18px] text-[#F6D98B] drop-shadow-[0_0_8px_rgba(246,217,139,0.8)] mb-2 animate-spin" style={{ animationDuration: "12s" }}>
              ✦
            </span>

            {/* Main Unified Phrase */}
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[28px] sm:text-[32px] tracking-[0.05em] leading-tight text-[#FAF6EE]"
              style={{
                textShadow:
                  "0 2px 6px rgba(0, 0, 0, 0.95), 0 0 20px rgba(255, 255, 255, 0.4), 0 0 35px rgba(246, 217, 139, 0.3)",
              }}
            >
              <span>YOU ARE SO </span>
              <span
                className="text-[#F6D98B] inline-block font-extrabold"
                style={{
                  textShadow:
                    "0 2px 6px rgba(0, 0, 0, 0.95), 0 0 20px rgba(246, 217, 139, 0.9), 0 0 38px rgba(246, 217, 139, 0.6)",
                }}
              >
                SPECIAL
              </span>
            </h2>

            {/* Supporting Line: "And maybe you already knew that... ✨" */}
            {showSubLine && (
              <p
                className="font-['Playfair_Display',serif] italic text-[13.5px] sm:text-[14.5px] text-[rgba(245,235,215,0.9)] mt-4 max-w-[280px] sm:max-w-[300px] leading-relaxed"
                style={{
                  animation: "subLineFadeIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  textShadow:
                    "0 1px 3px rgba(0, 0, 0, 0.9), 0 0 14px rgba(246, 217, 139, 0.35)",
                }}
              >
                And maybe you already knew that... ✨
              </p>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          5. NEXT CTA BUTTON (Revealed ONLY after full celebration)
          ======================================================== */}
      <footer className="relative z-30 w-full flex justify-center pb-2 sm:pb-3 select-none min-h-[48px]">
        {step === "NEXT_AVAILABLE" && (
          <div
            style={{
              animation: "nextCtaFadeUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <button
              type="button"
              onClick={handleNextClick}
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-2 rounded-full border border-[rgba(255,182,218,0.5)] bg-[rgba(255,235,245,0.14)] text-[#ffd4e5] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] sm:text-[12px] font-medium tracking-[0.18em] uppercase transition-all duration-300 ease-out active:scale-[0.96] hover:border-[rgba(255,182,218,0.85)] hover:bg-[rgba(255,182,218,0.25)] hover:text-white cursor-pointer shadow-[0_0_18px_rgba(255,182,218,0.3),0_0_24px_rgba(246,217,139,0.2)]"
              aria-label="Continue"
            >
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">NEXT</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 text-[13px]">
                →
              </span>
            </button>
          </div>
        )}
      </footer>

      {/* Keyframe Animations */}
      <style jsx global>{`
        @keyframes balloonSceneEntrance {
          0% {
            opacity: 0;
            transform: scale(0.97);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes balloonSwayFloat {
          0% {
            transform: translate3d(0, 0, 0) rotate(-2deg);
          }
          50% {
            transform: translate3d(3px, -12px, 0) rotate(2deg);
          }
          100% {
            transform: translate3d(-3px, 4px, 0) rotate(-1deg);
          }
        }

        @keyframes wordPopReveal {
          0% {
            opacity: 0;
            transform: scale(0.4) translate3d(0, 10px, 0);
          }
          65% {
            opacity: 1;
            transform: scale(1.08) translate3d(0, -4px, 0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate3d(0, 0, 0);
          }
        }

        @keyframes unifiedPhraseEntrance {
          0% {
            opacity: 0;
            transform: scale(0.92) translate3d(0, 16px, 0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate3d(0, 0, 0);
          }
        }

        @keyframes subLineFadeIn {
          0% {
            opacity: 0;
            transform: translate3d(0, 8px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes particleFloatSlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.5;
          }
          50% {
            transform: translate3d(4px, -14px, 0);
            opacity: 0.95;
          }
        }
      `}</style>
    </div>
  );
}
