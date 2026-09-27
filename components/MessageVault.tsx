"use client";

import React, { useState, useEffect, useRef } from "react";

interface MessageVaultProps {
  isVisible: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

type VaultState =
  | "CLOSED"
  | "OPENING"
  | "MESSAGE_TYPING"
  | "MESSAGE_COMPLETE"
  | "NEXT_AVAILABLE";

const PARAGRAPHS = [
  "Some things are meant to stay in our memories, and some memories are so special that we want to hide them from time.",
  "You are one of those — a beautiful part of my story.",
  "I don’t know exactly when, how, or in which moment it happened, but somewhere between all those ordinary days, you became extraordinarily special to me.",
  "There was no grand beginning, no perfect moment, just a series of small, simple moments that slowly turned into something so meaningful.",
  "You became a part of my life in a way I never want to forget.",
  "That’s why I keep this memory here, safely, so that no matter how much time changes, some things never feel old.",
  "Happy Birthday, Shivii. 🧡",
  "Some memories fade with time, but ours is one of those that I’ll never let fade.",
];

const SIGNATURE = "— Pradip";

export function MessageVault({ isVisible, onNext, onBack }: MessageVaultProps) {
  const [vaultState, setVaultState] = useState<VaultState>("CLOSED");
  const [typedParagraphs, setTypedParagraphs] = useState<string[]>([]);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isSignatureTyped, setIsSignatureTyped] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const letterScrollRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset or start when becomes visible
  useEffect(() => {
    if (!isVisible) {
      setVaultState("CLOSED");
      setTypedParagraphs([]);
      setCurrentParagraphIndex(0);
      setCurrentCharIndex(0);
      setIsSignatureTyped(false);
      setIsExiting(false);
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    }
  }, [isVisible]);

  // Handle tap on closed letter
  const handleOpenLetter = () => {
    if (vaultState !== "CLOSED") return;
    setVaultState("OPENING");

    // After opening animation settles (750ms), begin typing
    setTimeout(() => {
      setVaultState("MESSAGE_TYPING");
    }, 750);
  };

  // Skip typing if user taps during typing
  const handleFastForward = () => {
    if (vaultState === "MESSAGE_TYPING") {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      setTypedParagraphs([...PARAGRAPHS]);
      setCurrentParagraphIndex(PARAGRAPHS.length);
      setIsSignatureTyped(true);
      setVaultState("MESSAGE_COMPLETE");

      setTimeout(() => {
        setVaultState("NEXT_AVAILABLE");
      }, 500);
    }
  };

  // Typewriter streaming engine
  useEffect(() => {
    if (vaultState !== "MESSAGE_TYPING") return;

    // Typing speed: ~18ms per character
    const charDelay = 18;

    if (currentParagraphIndex < PARAGRAPHS.length) {
      const currentFullParagraph = PARAGRAPHS[currentParagraphIndex];

      if (currentCharIndex < currentFullParagraph.length) {
        typingTimerRef.current = setTimeout(() => {
          setCurrentCharIndex((prev) => prev + 1);
        }, charDelay);
      } else {
        // Current paragraph finished; pause slightly before next paragraph
        typingTimerRef.current = setTimeout(() => {
          setTypedParagraphs((prev) => [...prev, currentFullParagraph]);
          setCurrentParagraphIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 180);
      }
    } else if (!isSignatureTyped) {
      // Signature reveal
      typingTimerRef.current = setTimeout(() => {
        setIsSignatureTyped(true);
        setVaultState("MESSAGE_COMPLETE");

        setTimeout(() => {
          setVaultState("NEXT_AVAILABLE");
        }, 600);
      }, 350);
    }

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [vaultState, currentParagraphIndex, currentCharIndex, isSignatureTyped]);

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

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-between p-3 sm:p-4 select-none overflow-hidden transition-all duration-600 ease-out ${
        isExiting ? "opacity-0 scale-[0.98] pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background:
          "radial-gradient(circle at 50% 36%, #083324 0%, #031c13 55%, #010a06 100%)",
        animation: !isExiting
          ? "vaultSceneEntrance 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          : undefined,
      }}
      aria-label="Curator's Special Vault"
    >
      {/* Background Ambient Warm Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(246, 217, 139, 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Thin Elegant Golden Border Framing the Main Scene */}
      <div
        className="absolute inset-2 sm:inset-3 rounded-[20px] pointer-events-none border border-[rgba(246,217,139,0.28)]"
        style={{
          boxShadow: "inset 0 0 24px rgba(0, 0, 0, 0.6), 0 0 12px rgba(246, 217, 139, 0.08)",
        }}
      >
        {/* Subtle corner flourishes */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#F6D98B]/60" />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#F6D98B]/60" />
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#F6D98B]/60" />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#F6D98B]/60" />
      </div>

      {/* ========================================================
          1. TOP HEADINGS
          ======================================================== */}
      <header className="relative z-10 flex flex-col items-center text-center pt-3 sm:pt-4">
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[9.5px] sm:text-[10.5px] tracking-[0.28em] uppercase text-[#F6D98B] font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          CURATOR&apos;S SPECIAL VAULT
        </h2>
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[8.5px] sm:text-[9px] tracking-[0.22em] uppercase text-[rgba(235,230,220,0.7)] font-light mt-0.5">
          SEALED WITH LOVE
        </span>
      </header>

      {/* ========================================================
          2. CENTER CARD CONTAINER: CLOSED OR OPEN LETTER
          ======================================================== */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-auto py-2">
        {vaultState === "CLOSED" ? (
          /* ========================================================
             CLOSED ENVELOPE / CARD STATE
             ======================================================== */
          <div
            onClick={handleOpenLetter}
            className="group relative w-full max-w-[285px] sm:max-w-[310px] aspect-[4/3] rounded-[16px] p-5 flex flex-col items-center justify-between cursor-pointer select-none transition-all duration-300 active:scale-[0.98] hover:shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_24px_rgba(246,217,139,0.25)]"
            style={{
              background:
                "linear-gradient(145deg, #FAF6EE 0%, #F5EEDB 50%, #ECE3CA 100%)",
              boxShadow:
                "0 18px 40px rgba(0, 0, 0, 0.65), 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(220, 198, 155, 0.7)",
              animation: "envelopeFloat 4.5s ease-in-out infinite alternate",
            }}
          >
            {/* Vintage Envelope Fold Lines */}
            <div className="absolute inset-0 pointer-events-none rounded-[16px] overflow-hidden opacity-30">
              <div
                className="absolute inset-x-0 top-0 h-1/2"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 49.5%, rgba(180, 155, 110, 0.4) 50%, transparent 51%)",
                }}
              />
            </div>

            {/* Top Inscription */}
            <span className="font-['Playfair_Display',serif] italic text-[11px] sm:text-[11.5px] tracking-[0.14em] text-[#6d5b45]">
              For Shivii
            </span>

            {/* Embossed Golden Wax Seal Medallion */}
            <div className="relative my-auto flex items-center justify-center">
              <div
                className="w-13 h-13 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #fcedbb 0%, #d4a94e 45%, #9e7423 85%, #66480f 100%)",
                  boxShadow:
                    "0 6px 16px rgba(0, 0, 0, 0.45), 0 0 18px rgba(246, 217, 139, 0.35), inset 0 2px 3px rgba(255, 255, 255, 0.8), inset 0 -2px 3px rgba(0, 0, 0, 0.5)",
                  border: "1.2px solid rgba(255, 235, 175, 0.8)",
                  animation: "waxSealPulse 3s ease-in-out infinite alternate",
                }}
              >
                {/* Heart / Emblem inside seal */}
                <span className="text-[17px] text-[#553b0b] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                  ❦
                </span>
              </div>
            </div>

            {/* Instruction: TAP TO OPEN */}
            <div className="flex items-center gap-1.5">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[9.5px] sm:text-[10px] tracking-[0.24em] font-medium text-[#7c664d] uppercase animate-pulse">
                TAP TO OPEN
              </span>
            </div>
          </div>
        ) : (
          /* ========================================================
             OPENED LETTER / CARD STATE WITH TYPEWRITER ANIMATION
             ======================================================== */
          <div
            onClick={handleFastForward}
            className="relative w-full max-w-[325px] sm:max-w-[355px] max-h-[66dvh] sm:max-h-[68dvh] rounded-[16px] p-5 sm:p-6 overflow-y-auto select-text flex flex-col justify-start"
            ref={letterScrollRef}
            style={{
              background:
                "linear-gradient(150deg, #FCF8F0 0%, #FAF5E8 60%, #F4ECE0 100%)",
              boxShadow:
                "0 20px 48px rgba(0, 0, 0, 0.7), 0 0 26px rgba(246, 217, 139, 0.16), inset 0 0 28px rgba(230, 215, 185, 0.4)",
              border: "1px solid rgba(215, 195, 160, 0.65)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              animation:
                vaultState === "OPENING"
                  ? "letterUnfoldEntrance 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                  : undefined,
            }}
          >
            {/* Handwritten Greeting Heading */}
            <h3 className="font-['Caveat',cursive] text-[24px] sm:text-[27px] font-bold text-[#1f1710] leading-tight mb-2.5 sm:mb-3">
              My Dearest Shivii,
            </h3>

            {/* Letter Body Paragraphs */}
            <div className="space-y-3 font-['Caveat',cursive] text-[17.5px] sm:text-[19px] font-semibold text-[#2b2016] leading-[1.62] tracking-[0.01em]">
              {/* Previously completed paragraphs */}
              {typedParagraphs.map((para, idx) => (
                <p key={`para-${idx}`} className="transition-opacity duration-200">
                  {para}
                </p>
              ))}

              {/* Currently typing paragraph */}
              {currentParagraphIndex < PARAGRAPHS.length && (
                <p>
                  {PARAGRAPHS[currentParagraphIndex].slice(0, currentCharIndex)}
                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-[#2b2016] animate-pulse align-middle" />
                </p>
              )}

              {/* Signature */}
              {isSignatureTyped && (
                <div
                  className="pt-2 text-right opacity-0"
                  style={{
                    animation: "signatureReveal 0.6s ease-out forwards",
                  }}
                >
                  <span className="font-['Caveat',cursive] text-[22px] sm:text-[25px] font-bold text-[#1f1710]">
                    {SIGNATURE}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          3. BOTTOM CTA: NEXT → (Appears ONLY after message completes)
          ======================================================== */}
      <footer className="relative z-10 w-full flex justify-center pb-2 sm:pb-3 select-none min-h-[46px]">
        {vaultState === "NEXT_AVAILABLE" && (
          <div
            style={{
              animation: "nextCtaFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <button
              type="button"
              onClick={handleNextClick}
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-2 rounded-full border border-[rgba(255,182,218,0.5)] bg-[rgba(255,235,245,0.12)] text-[#ffd4e5] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] sm:text-[12px] font-medium tracking-[0.18em] uppercase transition-all duration-300 ease-out active:scale-[0.96] hover:border-[rgba(255,182,218,0.85)] hover:bg-[rgba(255,182,218,0.24)] hover:text-white cursor-pointer shadow-[0_0_18px_rgba(255,182,218,0.28),0_0_24px_rgba(246,217,139,0.16)]"
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

      {/* Vault Specific CSS Keyframes */}
      <style jsx global>{`
        @keyframes vaultSceneEntrance {
          0% {
            opacity: 0;
            transform: scale(0.97);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes envelopeFloat {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, -5px, 0);
          }
        }

        @keyframes waxSealPulse {
          0% {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45), 0 0 14px rgba(246, 217, 139, 0.25);
          }
          100% {
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5), 0 0 22px rgba(246, 217, 139, 0.48);
          }
        }

        @keyframes letterUnfoldEntrance {
          0% {
            opacity: 0;
            transform: scale(0.95) translate3d(0, 10px, 0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate3d(0, 0, 0);
          }
        }

        @keyframes signatureReveal {
          0% {
            opacity: 0;
            transform: translate3d(6px, 0, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes nextCtaFadeUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 8px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
