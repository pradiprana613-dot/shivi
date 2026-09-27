"use client";

import React, { useState } from "react";

interface BirthdayChronicleProps {
  isVisible: boolean;
  onNavigate?: (destination: "garden" | "sky" | "day") => void;
  onNext?: () => void;
}

export function BirthdayChronicle({ isVisible, onNavigate, onNext }: BirthdayChronicleProps) {
  const [activeTab, setActiveTab] = useState<"garden" | "sky" | "day">("day");
  const [isExiting, setIsExiting] = useState(false);

  if (!isVisible) {
    return null;
  }

  const handleTabClick = (tab: "garden" | "sky" | "day") => {
    setActiveTab(tab);
    if (onNavigate) {
      onNavigate(tab);
    }
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

  return (
    <div
      className={`absolute inset-0 z-50 overflow-y-auto overflow-x-hidden select-text text-[#F3EBDD] bg-[#030718]/95 backdrop-blur-md transition-all duration-600 ease-out ${
        isExiting ? "opacity-0 scale-[0.98] pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        animation: !isExiting ? "chroniclePageEntrance 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards" : undefined,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Background Starry Dust & Subtle Golden Radiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[340px] h-[220px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(246, 217, 139, 0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-10 right-0 w-[280px] h-[280px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(232, 200, 117, 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main Newspaper Sheet Container */}
      <div className="relative w-full max-w-[370px] sm:max-w-[410px] mx-auto px-4 sm:px-6 pt-6 pb-12 flex flex-col">
        {/* ========================================================
            1. NEWSPAPER MASTHEAD
            ======================================================== */}
        <header className="flex flex-col items-center text-center">
          {/* Top Sub-Banner */}
          <div className="flex items-center justify-between w-full border-b border-[rgba(246,217,139,0.3)] pb-1.5 mb-2 text-[9px] sm:text-[10px] tracking-[0.24em] uppercase text-[#DDBE72] font-['Plus_Jakarta_Sans',sans-serif] font-light">
            <span>Special Edition</span>
            <span className="text-[#F6D98B] font-medium">• SHIVI DAY •</span>
            <span>Est. Today</span>
          </div>

          {/* Main Title: The Birthday Chronicle */}
          <h1
            className="font-['Playfair_Display',serif] text-[27px] sm:text-[32px] font-bold tracking-[0.06em] text-[#F6D98B] uppercase leading-tight py-1"
            style={{
              textShadow:
                "0 1px 3px rgba(0, 0, 0, 0.9), 0 0 16px rgba(246, 217, 139, 0.28)",
            }}
          >
            The Birthday Chronicle
          </h1>

          {/* Issue & Date Line with Double Hairline Rules */}
          <div className="w-full flex items-center justify-between border-t border-b border-[rgba(246,217,139,0.25)] py-1.5 my-2 text-[8.5px] sm:text-[9.5px] tracking-[0.2em] uppercase text-[rgba(235,230,220,0.75)] font-['Plus_Jakarta_Sans',sans-serif]">
            <span>Vol. 1 • No. 1</span>
            <span className="text-[#E8C875]">The Cosmic Edition</span>
            <span>28° N • 77° E</span>
          </div>
        </header>

        {/* ========================================================
            2. BREAKING NEWS HEADLINE
            ======================================================== */}
        <section className="my-3 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[rgba(246,217,139,0.4)] bg-[rgba(246,217,139,0.08)] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F6D98B] animate-pulse" />
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[9px] sm:text-[9.5px] font-semibold tracking-[0.2em] text-[#F6D98B] uppercase">
              Breaking News
            </span>
          </div>

          <h2
            className="font-['Playfair_Display',serif] text-[19px] sm:text-[22px] font-semibold tracking-[0.03em] text-[#FAF6EE] leading-snug max-w-[320px]"
            style={{
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.9), 0 0 12px rgba(255, 255, 255, 0.15)",
            }}
          >
            THE WORLD JUST GOT A LITTLE BRIGHTER.
          </h2>
        </section>

        {/* ========================================================
            3. CHAPTER NAVIGATION PILLS: [ GARDEN ] [ THE SKY ] [ THE DAY ]
            ======================================================== */}
        <nav
          className="flex items-center justify-center gap-2 sm:gap-2.5 my-3 select-none"
          aria-label="Story Chapters"
        >
          <button
            type="button"
            onClick={() => handleTabClick("garden")}
            className="px-3 py-1 rounded-full text-[10px] sm:text-[10.5px] tracking-[0.16em] uppercase font-['Plus_Jakarta_Sans',sans-serif] font-medium border border-[rgba(246,217,139,0.25)] bg-[rgba(16,22,48,0.4)] text-[rgba(235,230,220,0.75)] hover:border-[#F6D98B] hover:text-[#F6D98B] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            [ Garden ]
          </button>

          <button
            type="button"
            onClick={() => handleTabClick("sky")}
            className="px-3 py-1 rounded-full text-[10px] sm:text-[10.5px] tracking-[0.16em] uppercase font-['Plus_Jakarta_Sans',sans-serif] font-medium border border-[rgba(246,217,139,0.25)] bg-[rgba(16,22,48,0.4)] text-[rgba(235,230,220,0.75)] hover:border-[#F6D98B] hover:text-[#F6D98B] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            [ The Sky ]
          </button>

          <button
            type="button"
            onClick={() => handleTabClick("day")}
            className="px-3 py-1 rounded-full text-[10px] sm:text-[10.5px] tracking-[0.16em] uppercase font-['Plus_Jakarta_Sans',sans-serif] font-medium border border-[#F6D98B] bg-[rgba(246,217,139,0.15)] text-[#F6D98B] shadow-[0_0_10px_rgba(246,217,139,0.2)] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            [ The Day ]
          </button>
        </nav>

        {/* Thin Gold Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(246,217,139,0.3)] to-transparent my-2" />

        {/* ========================================================
            4. SPECIAL REPORT
            ======================================================== */}
        <article className="my-3 text-center sm:text-left flex flex-col items-center">
          <div className="w-full flex items-center justify-center gap-2 mb-2.5">
            <span className="w-8 h-px bg-[rgba(246,217,139,0.3)]" />
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] sm:text-[10.5px] font-semibold tracking-[0.22em] text-[#DDBE72] uppercase">
              Special Report
            </span>
            <span className="w-8 h-px bg-[rgba(246,217,139,0.3)]" />
          </div>

          <div className="font-['Playfair_Display',serif] italic text-[13.5px] sm:text-[14.5px] leading-[1.8] text-[#F3EBDD] text-center max-w-[310px] sm:max-w-[335px] space-y-1">
            <p>Some days simply pass.</p>
            <p>Some days become memories.</p>
            <p>And then there are days that somehow feel</p>
            <p>a little more magical than the rest.</p>
            <p className="pt-2 text-[#FAF6EE] font-normal not-italic tracking-[0.02em]">
              Shivi’s birthday was one of those days.
            </p>
          </div>
        </article>

        {/* Thin Gold Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(246,217,139,0.3)] to-transparent my-2" />

        {/* ========================================================
            5. WORLDWIDE REPORT (Metrics & Indicators)
            ======================================================== */}
        <section className="my-3 flex flex-col items-center w-full">
          <div className="w-full flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-[rgba(246,217,139,0.3)]" />
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] sm:text-[10.5px] font-semibold tracking-[0.22em] text-[#DDBE72] uppercase">
              Worldwide Report
            </span>
            <span className="w-8 h-px bg-[rgba(246,217,139,0.3)]" />
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-[310px] sm:max-w-[335px] text-center">
            <div className="flex flex-col items-center py-2 px-1 rounded-lg border border-[rgba(246,217,139,0.25)] bg-[rgba(16,22,48,0.45)]">
              <span className="text-[11px] sm:text-[11.5px] font-['Plus_Jakarta_Sans',sans-serif] text-[rgba(235,230,220,0.85)] font-light">
                Happiness
              </span>
              <span className="text-[14px] font-semibold text-[#F6D98B] mt-0.5">
                ↑
              </span>
            </div>

            <div className="flex flex-col items-center py-2 px-1 rounded-lg border border-[rgba(246,217,139,0.25)] bg-[rgba(16,22,48,0.45)]">
              <span className="text-[11px] sm:text-[11.5px] font-['Plus_Jakarta_Sans',sans-serif] text-[rgba(235,230,220,0.85)] font-light">
                Smiles
              </span>
              <span className="text-[14px] font-semibold text-[#F6D98B] mt-0.5">
                ↑
              </span>
            </div>

            <div className="flex flex-col items-center py-2 px-1 rounded-lg border border-[rgba(246,217,139,0.25)] bg-[rgba(16,22,48,0.45)]">
              <span className="text-[11px] sm:text-[11.5px] font-['Plus_Jakarta_Sans',sans-serif] text-[rgba(235,230,220,0.85)] font-light">
                Magic
              </span>
              <span className="text-[14px] font-semibold text-[#F6D98B] mt-0.5">
                ↑
              </span>
            </div>
          </div>

          {/* Reason Badge */}
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(246,217,139,0.4)] bg-[rgba(246,217,139,0.1)]">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10.5px] sm:text-[11px] text-[rgba(235,230,220,0.8)] tracking-[0.1em] font-light">
              Reason:
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] sm:text-[12.5px] font-bold text-[#F6D98B] tracking-[0.2em]">
              SHIVI
            </span>
          </div>
        </section>

        {/* Thin Gold Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(246,217,139,0.3)] to-transparent my-2" />

        {/* ========================================================
            6. PULL QUOTE & BYLINE
            ======================================================== */}
        <footer className="mt-3 flex flex-col items-center text-center">
          <blockquote className="font-['Playfair_Display',serif] italic text-[14px] sm:text-[15px] leading-relaxed text-[#FAF6EE] max-w-[290px] sm:max-w-[320px]">
            “Perhaps the universe was simply making room for someone special.”
          </blockquote>

          <cite className="font-['Plus_Jakarta_Sans',sans-serif] not-italic text-[10px] sm:text-[10.5px] tracking-[0.18em] uppercase text-[#DDBE72] mt-2 block">
            — The Birthday Chronicle
          </cite>
        </footer>

        {/* ========================================================
            7. NEXT CTA BUTTON (Matches pink/cream birthday aesthetic)
            ======================================================== */}
        <div className="mt-6 sm:mt-7 flex justify-center pb-2 select-none">
          <button
            type="button"
            onClick={handleNextClick}
            className="group relative inline-flex items-center justify-center gap-2 px-7 py-2 rounded-full border border-[rgba(255,182,218,0.45)] bg-[rgba(255,235,245,0.1)] text-[#ffd4e5] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] sm:text-[12px] font-medium tracking-[0.18em] uppercase transition-all duration-300 ease-out active:scale-[0.96] hover:border-[rgba(255,182,218,0.8)] hover:bg-[rgba(255,182,218,0.22)] hover:text-white cursor-pointer shadow-[0_0_16px_rgba(255,182,218,0.25)]"
            style={{
              animation: "chronicleNextPulse 3.5s ease-in-out infinite alternate",
            }}
            aria-label="Continue to Message Vault"
          >
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">NEXT</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1 text-[13px]">
              →
            </span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes chroniclePageEntrance {
          0% {
            opacity: 0;
            transform: translate3d(0, 16px, 0) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes chronicleNextPulse {
          0%,
          100% {
            border-color: rgba(255, 182, 218, 0.45);
            box-shadow: 0 0 14px rgba(255, 182, 218, 0.22);
            transform: translateY(0);
          }
          50% {
            border-color: rgba(255, 182, 218, 0.75);
            box-shadow: 0 0 22px rgba(255, 182, 218, 0.42);
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
}
