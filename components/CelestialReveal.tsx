"use client";

import React, { useState } from "react";

interface CelestialRevealProps {
  isVisible: boolean;
  onNext?: () => void;
}

export function CelestialReveal({ isVisible, onNext }: CelestialRevealProps) {
  const [isExiting, setIsExiting] = useState(false);

  if (!isVisible) {
    return null;
  }

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      if (onNext) {
        onNext();
      }
    }, 600);
  };

  // Very subtle, thin dark navy starlight contour to ensure crisp readability over bright stars
  const subtleNavyShadow =
    "0 1px 2px rgba(2, 7, 26, 0.95), 0 0 4px rgba(2, 7, 26, 0.85), 0 0 8px rgba(2, 7, 26, 0.7)";

  return (
    <>
      {/* ========================================================
          CELESTIAL INFORMATION REVEAL
          - 100% transparent typography floating naturally directly over the night sky
          - Zero cards, boxes, panels, dark rectangles, borders, or glassmorphism
          - Preserves full visibility of golden crescent moon, constellation lines & Milky Way
          - Celestial color palette: warm champagne-gold, soft muted gold, soft ivory, and champagne
          - Subtle thin dark navy shadow behind letters for clean starlight legibility
          - Staggered line-by-line sequential reveal
          - Elegant "Next →" celestial CTA button fading in after text
          ======================================================== */}
      <div
        className={`absolute inset-0 pointer-events-none z-40 select-none overflow-hidden flex flex-col justify-end items-center transition-opacity duration-600 ease-out ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
        aria-label="The Exact Sky on Shivi's Day"
      >
        <div
          className="w-full max-w-[320px] sm:max-w-[345px] px-4 flex flex-col items-center text-center pb-[3.5%] sm:pb-[4.5%]"
          style={{
            transform: "translateZ(0)",
          }}
        >
          {/* 1. Main Title: warm champagne-gold (#F6D98B) */}
          <h2
            className="opacity-0 font-['Playfair_Display',serif] font-medium text-[16.5px] sm:text-[18.5px] tracking-[0.04em] text-[#F6D98B]"
            style={{
              animation: "celestialItemReveal 1.0s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards",
              textShadow: subtleNavyShadow,
            }}
          >
            The Exact Sky on Shivi&apos;s Day
          </h2>

          {/* 2. Coordinates: soft muted gold (#DDBE72) */}
          <div
            className="opacity-0 font-['Plus_Jakarta_Sans',sans-serif] font-light text-[9.5px] sm:text-[10px] tracking-[0.28em] text-[#DDBE72] flex items-center justify-center gap-2 mt-1.5"
            style={{
              animation: "celestialItemReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 1.45s forwards",
              textShadow: "0 1px 2px rgba(2, 7, 26, 0.95), 0 0 4px rgba(2, 7, 26, 0.85)",
            }}
          >
            <span>28° N</span>
            <span className="text-[#DDBE72] text-[8px] opacity-90 leading-none">•</span>
            <span>77° E</span>
          </div>

          {/* 3. Poetic Sentence: soft ivory (#F3EBDD) */}
          <p
            className="opacity-0 font-['Playfair_Display',serif] italic font-normal text-[13px] sm:text-[14px] leading-relaxed text-[#F3EBDD] max-w-[285px] sm:max-w-[310px] mx-auto mt-3.5 sm:mt-4"
            style={{
              animation: "celestialItemReveal 1.0s cubic-bezier(0.16, 1, 0.3, 1) 2.3s forwards",
              textShadow: subtleNavyShadow,
            }}
          >
            The stars were positioned with supreme tenderness…
          </p>

          {/* 4. Romantic Description: soft ivory (#F3EBDD), line by line */}
          <div className="flex flex-col items-center mt-3 sm:mt-3.5 space-y-0.5 max-w-[290px] sm:max-w-[315px] mx-auto">
            {/* Line 1 */}
            <p
              className="opacity-0 font-['Playfair_Display',serif] italic font-light text-[12px] sm:text-[12.8px] leading-[1.65] text-[#F3EBDD]"
              style={{
                animation: "celestialItemReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 3.3s forwards",
                textShadow:
                  "0 1px 2px rgba(2, 7, 26, 0.95), 0 0 4px rgba(2, 7, 26, 0.85), 0 0 6px rgba(2, 7, 26, 0.65)",
              }}
            >
              Some nights are beautiful.
            </p>

            {/* Line 2 */}
            <p
              className="opacity-0 font-['Playfair_Display',serif] italic font-light text-[12px] sm:text-[12.8px] leading-[1.65] text-[#F3EBDD]"
              style={{
                animation: "celestialItemReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 4.1s forwards",
                textShadow:
                  "0 1px 2px rgba(2, 7, 26, 0.95), 0 0 4px rgba(2, 7, 26, 0.85), 0 0 6px rgba(2, 7, 26, 0.65)",
              }}
            >
              Some nights become unforgettable.
            </p>

            {/* Line 3 */}
            <p
              className="opacity-0 font-['Playfair_Display',serif] italic font-light text-[12px] sm:text-[12.8px] leading-[1.65] text-[#F3EBDD]"
              style={{
                animation: "celestialItemReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 4.9s forwards",
                textShadow:
                  "0 1px 2px rgba(2, 7, 26, 0.95), 0 0 4px rgba(2, 7, 26, 0.85), 0 0 6px rgba(2, 7, 26, 0.65)",
              }}
            >
              And somehow, the sky on Shivi&apos;s day
            </p>

            {/* Line 4 */}
            <p
              className="opacity-0 font-['Playfair_Display',serif] italic font-light text-[12px] sm:text-[12.8px] leading-[1.65] text-[#F3EBDD]"
              style={{
                animation: "celestialItemReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 5.7s forwards",
                textShadow:
                  "0 1px 2px rgba(2, 7, 26, 0.95), 0 0 4px rgba(2, 7, 26, 0.85), 0 0 6px rgba(2, 7, 26, 0.65)",
              }}
            >
              felt a little more magical than usual.
            </p>
          </div>

          {/* 5. Two Small Elegant Details: elegant warm gold (#E8C875) */}
          <div className="flex flex-col items-center gap-1 sm:gap-1.5 mt-3.5 sm:mt-4">
            {/* Moon Phase */}
            <div
              className="opacity-0 flex items-center justify-center gap-1.5 text-[11px] sm:text-[11.5px] tracking-[0.05em]"
              style={{
                animation: "celestialItemReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 6.7s forwards",
                textShadow: "0 1px 2px rgba(2, 7, 26, 0.95), 0 0 4px rgba(2, 7, 26, 0.85)",
              }}
            >
              <span className="text-[#DDBE72] font-light font-['Plus_Jakarta_Sans',sans-serif]">
                Moon Phase:
              </span>
              <span className="text-[#E8C875] font-medium font-['Plus_Jakarta_Sans',sans-serif]">
                Golden Crescent
              </span>
            </div>

            {/* Radiance Index */}
            <div
              className="opacity-0 flex items-center justify-center gap-1.5 text-[11px] sm:text-[11.5px] tracking-[0.05em]"
              style={{
                animation: "celestialItemReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 7.5s forwards",
                textShadow: "0 1px 2px rgba(2, 7, 26, 0.95), 0 0 4px rgba(2, 7, 26, 0.85)",
              }}
            >
              <span className="text-[#DDBE72] font-light font-['Plus_Jakarta_Sans',sans-serif]">
                Radiance Index:
              </span>
              <span className="text-[#E8C875] font-medium font-['Plus_Jakarta_Sans',sans-serif]">
                100%
              </span>
            </div>
          </div>

          {/* 6. Final Poetic Line: soft champagne/ivory (#F0DFC0) */}
          <p
            className="opacity-0 font-['Playfair_Display',serif] italic font-normal text-[12.5px] sm:text-[13.5px] tracking-[0.03em] text-[#F0DFC0] mt-3.5 sm:mt-4.5"
            style={{
              animation: "celestialItemReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 8.5s forwards",
              textShadow:
                "0 1px 2px rgba(2, 7, 26, 0.95), 0 0 5px rgba(2, 7, 26, 0.85), 0 0 10px rgba(2, 7, 26, 0.7)",
            }}
          >
            Perhaps the universe was celebrating too.
          </p>

          {/* 7. Next CTA Button */}
          <div
            className="opacity-0 mt-4 sm:mt-5 pointer-events-auto"
            style={{
              animation: "celestialItemReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) 9.9s forwards",
            }}
          >
            <button
              type="button"
              onClick={handleNextClick}
              className="group relative inline-flex items-center justify-center gap-1.5 px-5 py-1.5 sm:px-6 sm:py-2 rounded-full border border-[rgba(246,217,139,0.36)] bg-[rgba(2,7,26,0.48)] text-[#F6D98B] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] sm:text-[12px] font-medium tracking-[0.14em] uppercase transition-all duration-300 ease-out active:scale-[0.96] hover:border-[rgba(246,217,139,0.68)] hover:bg-[rgba(16,22,48,0.58)] cursor-pointer"
              style={{
                boxShadow:
                  "0 0 12px rgba(246, 217, 139, 0.14), inset 0 1px 1px rgba(255, 255, 255, 0.18)",
                animation: "ctaCelestialPulse 4s ease-in-out 11s infinite alternate",
              }}
              aria-label="Continue to next section"
            >
              <span className="drop-shadow-[0_1px_3px_rgba(2,7,26,0.95)]">Next</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 text-[12px]">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes celestialItemReveal {
          0% {
            opacity: 0;
            transform: translate3d(0, 8px, 0) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes ctaCelestialPulse {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            border-color: rgba(246, 217, 139, 0.36);
            box-shadow: 0 0 10px rgba(246, 217, 139, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.16);
          }
          50% {
            transform: translate3d(0, -2px, 0);
            border-color: rgba(246, 217, 139, 0.58);
            box-shadow: 0 0 18px rgba(246, 217, 139, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.24);
          }
        }
      `}</style>
    </>
  );
}
