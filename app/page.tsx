"use client";

import { SecretClueModal } from "@/components/SecretClueModal";
import { DoorOpeningCanvas } from "@/components/DoorOpeningCanvas";
import { SecondDoorCanvas } from "@/components/SecondDoorCanvas";
import { NextDoorSection } from "@/components/NextDoorSection";
import { DoKnockSection } from "@/components/DoKnockSection";
import { FinalDoorCanvas } from "@/components/FinalDoorCanvas";
import { CelestialReveal } from "@/components/CelestialReveal";
import { BirthdayChronicle } from "@/components/BirthdayChronicle";
import { MessageVault } from "@/components/MessageVault";
import { FourBalloonsSection } from "@/components/FourBalloonsSection";
import { BirthdayClimaxCake } from "@/components/BirthdayClimaxCake";

import React, { useEffect, useState } from "react";

// Reusable Realistic Birthday Balloon Component
function BirthdayBalloon({
  left,
  top,
  width = 34,
  height = 42,
  colorGradient,
  delay = "0s",
  dur = "6s",
  swayDur = "4s",
  isPopping = false,
}: {
  left: string;
  top: string;
  width?: number;
  height?: number;
  colorGradient: string;
  delay?: string;
  dur?: string;
  swayDur?: string;
  isPopping?: boolean;
}) {
  return (
    <div
      className="absolute pointer-events-none select-none z-10"
      style={{
        left,
        top,
        width: `${width}px`,
        height: `${height + 38}px`,
        animation: isPopping
          ? "none"
          : `balloonGentleHover ${dur} ease-in-out ${delay} infinite`,
      }}
    >
      {/* Balloon Body */}
      <div
        className="relative w-full rounded-[50%_50%_50%_50%_/_42%_42%_58%_58%] overflow-visible"
        style={{
          height: `${height}px`,
          background: colorGradient,
          boxShadow: `0 8px 18px rgba(0, 0, 0, 0.35), inset -3px -5px 10px rgba(0, 0, 0, 0.25), inset 4px 5px 8px rgba(255, 255, 255, 0.65)`,
          animation: isPopping ? "balloonPopBurst 0.45s cubic-bezier(0.1, 0.9, 0.2, 1) forwards" : undefined,
        }}
      >
        {/* Shiny Highlight Reflection */}
        <div
          className="absolute rounded-full"
          style={{
            top: "14%",
            left: "18%",
            width: `${Math.round(width * 0.24)}px`,
            height: `${Math.round(height * 0.34)}px`,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 100%)",
            transform: "rotate(-25deg)",
            opacity: isPopping ? 0 : 1,
            transition: "opacity 0.1s",
          }}
        />

        {/* Balloon Knot */}
        <div
          className="absolute left-1/2 -bottom-[3px] -translate-x-1/2"
          style={{
            width: "5px",
            height: "4px",
            background: colorGradient,
            borderRadius: "1px 1px 3px 3px",
            filter: "brightness(0.85)",
            opacity: isPopping ? 0 : 1,
            transition: "opacity 0.1s",
          }}
        />

        {/* Tiny Celebratory Balloon Fragments on Pop */}
        {isPopping && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {[
              { x: "-20px", y: "-18px", w: 3, h: 3, rot: "15deg" },
              { x: "22px", y: "-16px", w: 4, h: 2, rot: "-30deg" },
              { x: "-24px", y: "12px", w: 3, h: 4, rot: "45deg" },
              { x: "23px", y: "14px", w: 4, h: 3, rot: "-20deg" },
              { x: "0px", y: "-25px", w: 3, h: 3, rot: "0deg" },
            ].map((frag, idx) => (
              <div
                key={`frag-${idx}`}
                className="absolute rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  width: `${frag.w}px`,
                  height: `${frag.h}px`,
                  marginLeft: `-${Math.round(frag.w / 2)}px`,
                  marginTop: `-${Math.round(frag.h / 2)}px`,
                  background: colorGradient,
                  boxShadow: "0 0 4px rgba(255, 255, 255, 0.6)",
                  transform: `rotate(${frag.rot})`,
                  animation: "balloonFragmentBurst 0.45s cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
                  // @ts-ignore
                  "--frag-x": frag.x,
                  "--frag-y": frag.y,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thin Curving String */}
      <svg
        className="w-full"
        style={{
          height: "38px",
          marginTop: "-1px",
          animation: isPopping ? "none" : `stringWave ${swayDur} ease-in-out infinite alternate`,
          transformOrigin: "top center",
          opacity: isPopping ? 0 : 1,
          transition: "opacity 0.15s ease-out",
        }}
        viewBox="0 0 30 38"
        fill="none"
      >
        <path
          d="M 15 0 Q 11 12 18 22 T 14 38"
          stroke="rgba(255, 255, 255, 0.55)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Reusable Glowing Butterfly Component
function GlowingButterfly({
  left,
  top,
  size = 18,
  animFlight,
  flightDur = "5s",
  flapDur = "0.38s",
  glowDur = "4s",
  delay = "0s",
}: {
  left: string;
  top: string;
  size?: number;
  animFlight: string;
  flightDur?: string;
  flapDur?: string;
  glowDur?: string;
  delay?: string;
}) {
  return (
    <div
      className="absolute pointer-events-none select-none z-15"
      style={{
        left,
        top,
        width: `${size}px`,
        height: `${Math.round(size * 0.9)}px`,
        marginLeft: `-${Math.round(size / 2)}px`,
        marginTop: `-${Math.round(size * 0.45)}px`,
        animation: `${animFlight} ${flightDur} ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ animation: `butterflyGlowLuminous ${glowDur} ease-in-out infinite` }}
      >
        {/* Left wing */}
        <div
          className="absolute"
          style={{
            left: "1px",
            top: "1px",
            width: `${Math.round(size * 0.44)}px`,
            height: `${Math.round(size * 0.75)}px`,
            transformOrigin: "right center",
            animation: `wingFlapFast ${flapDur} ease-in-out infinite alternate`,
          }}
        >
          <svg viewBox="0 0 10 16" className="w-full h-full">
            <path
              d="M10,8 C1,2 0,6 2,12 C4,16 9,14 10,8 Z"
              fill="rgba(255, 245, 252, 0.92)"
              style={{ filter: "drop-shadow(0 0 5px rgba(255, 180, 225, 0.95))" }}
            />
          </svg>
        </div>
        {/* Center glowing body */}
        <div
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: "22%",
            transform: "translateX(-50%)",
            width: "2px",
            height: `${Math.round(size * 0.5)}px`,
            backgroundColor: "#ffffff",
            boxShadow: "0 0 6px rgba(255, 255, 255, 1)",
          }}
        />
        {/* Right wing */}
        <div
          className="absolute"
          style={{
            right: "1px",
            top: "1px",
            width: `${Math.round(size * 0.44)}px`,
            height: `${Math.round(size * 0.75)}px`,
            transformOrigin: "left center",
            animation: `wingFlapAlt ${flapDur} ease-in-out infinite alternate`,
          }}
        >
          <svg viewBox="0 0 10 16" className="w-full h-full">
            <path
              d="M0,8 C9,2 10,6 8,12 C6,16 1,14 0,8 Z"
              fill="rgba(255, 245, 252, 0.92)"
              style={{ filter: "drop-shadow(0 0 5px rgba(255, 180, 225, 0.95))" }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [balloonState, setBalloonState] = useState<"floating" | "popping" | "gone">("floating");
  const [isDoorAnimating, setIsDoorAnimating] = useState(false);
  const [isDoorFinished, setIsDoorFinished] = useState(false);

  const [isSecondDoorAnimating, setIsSecondDoorAnimating] = useState(false);
  const [isSecondDoorFinished, setIsSecondDoorFinished] = useState(false);
  const [isFinalDoorAnimating, setIsFinalDoorAnimating] = useState(false);
  const [isFinalDoorFinished, setIsFinalDoorFinished] = useState(false);

  const handleDoorComplete = React.useCallback(() => {
    setIsDoorFinished(true);
  }, []);

  const handleSecondDoorComplete = React.useCallback(() => {
    setIsSecondDoorFinished(true);
  }, []);

  const handleSequenceComplete = React.useCallback(() => {
    setIsFinalDoorAnimating(true);
  }, []);

  const handleFinalDoorComplete = React.useCallback(() => {
    setIsFinalDoorFinished(true);
  }, []);

  const handleNextDoor = React.useCallback(() => {
    // Start sec animation immediately on the same tap; prevent duplicate starts
    setIsSecondDoorAnimating((prev) => (prev ? prev : true));
  }, []);

  const [isChronicleVisible, setIsChronicleVisible] = useState(false);
  const [isMessageVaultVisible, setIsMessageVaultVisible] = useState(false);
  const [isFourBalloonsVisible, setIsFourBalloonsVisible] = useState(false);
  const [isClimaxCakeVisible, setIsClimaxCakeVisible] = useState(false);

  const handleOpenChronicle = React.useCallback(() => {
    setIsChronicleVisible(true);
  }, []);

  const handleOpenMessageVault = React.useCallback(() => {
    setIsMessageVaultVisible(true);
  }, []);

  const handleMessageVaultNext = React.useCallback(() => {
    // Transition to the Four Balloon Surprise section
    setIsFourBalloonsVisible(true);
  }, []);

  const handleFourBalloonsNext = React.useCallback(() => {
    // Transition to the Climax Birthday Cake scene
    setIsClimaxCakeVisible(true);
  }, []);

  const handleClimaxReplay = React.useCallback(() => {
    // Smooth reset back to beginning (enchanted garden scene)
    setIsClimaxCakeVisible(false);
    setIsFourBalloonsVisible(false);
    setIsMessageVaultVisible(false);
    setIsChronicleVisible(false);
    setIsFinalDoorAnimating(false);
    setIsFinalDoorFinished(false);
    setIsSecondDoorAnimating(false);
    setIsSecondDoorFinished(false);
    setIsDoorAnimating(false);
    setIsDoorFinished(false);
    setBalloonState("floating");
  }, []);

  const handleChronicleNavigate = React.useCallback((destination: "garden" | "sky" | "day") => {
    if (destination === "sky") {
      setIsChronicleVisible(false);
      setIsMessageVaultVisible(false);
      setIsFourBalloonsVisible(false);
      setIsClimaxCakeVisible(false);
    } else if (destination === "garden") {
      setIsChronicleVisible(false);
      setIsMessageVaultVisible(false);
      setIsFourBalloonsVisible(false);
      setIsClimaxCakeVisible(false);
      setIsFinalDoorAnimating(false);
      setIsFinalDoorFinished(false);
      setIsSecondDoorAnimating(false);
      setIsSecondDoorFinished(false);
      setIsDoorAnimating(false);
      setIsDoorFinished(false);
      setBalloonState("floating");
    }
  }, []);

  const handlePasswordSuccess = () => {
    setIsPasswordModalOpen(false);
    // 1. Immediately trigger the balloon pop animation
    setBalloonState("popping");

    // 2. As soon as the 500ms pop completes, remove balloons from DOM and start door opening
    setTimeout(() => {
      setBalloonState("gone");
      setIsDoorAnimating(true);
    }, 500);
  };
  // Micro-parallax on floating festive layer only
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isDoorAnimating && !isDoorFinished) return;
      if (e.gamma !== null && e.beta !== null) {
        const tiltX = Math.max(-4, Math.min(4, e.gamma * 0.2));
        const tiltY = Math.max(-4, Math.min(4, (e.beta - 45) * 0.2));
        document.documentElement.style.setProperty("--tilt-x", `${tiltX}px`);
        document.documentElement.style.setProperty("--tilt-y", `${tiltY}px`);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDoorAnimating && !isDoorFinished) return;
      const tiltX = ((e.clientX / window.innerWidth) - 0.5) * 6;
      const tiltY = ((e.clientY / window.innerHeight) - 0.5) * 6;
      document.documentElement.style.setProperty("--tilt-x", `${tiltX}px`);
      document.documentElement.style.setProperty("--tilt-y", `${tiltY}px`);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isDoorAnimating, isDoorFinished]);

  const handleOpenDoor = () => {
    setIsPasswordModalOpen(true);
  };

  return (
    <main className="w-screen min-h-[100dvh] flex items-center justify-center bg-[#02071a] overflow-hidden m-0 p-0 select-none">
      <div className="relative w-full max-w-[min(100vw,calc(100dvh*9/16))] aspect-[9/16] overflow-hidden select-none">
        
        {/* ==========================================
            LAYER 1: BASE HERO ARTWORK (100% UNCHANGED)
            The source-of-truth poster remains completely untouched.
            ========================================== */}
        <img
          src="/hero.jpg"
          alt="Happy Birthday Shivi"
          className="w-full h-full object-contain block pointer-events-none select-none z-0"
          draggable={false}
          fetchPriority="high"
        />

        {/* Seamless 219-Frame Door Opening Animation (1 -> 219, permanently holds frame 219) */}
        <DoorOpeningCanvas
          isActive={isDoorAnimating}
          fps={30}
          onComplete={handleDoorComplete}
        />

        {/* Seamless 101-Frame Next Door Animation (1 -> 101, permanently holds frame 101) */}
        <SecondDoorCanvas
          isActive={isSecondDoorAnimating}
          shouldPreload={isDoorFinished}
          fps={30}
          onComplete={handleSecondDoorComplete}
        />

        {/* Seamless 150-Frame Final Door Opening Animation from /prd/ triggered after 3rd Knock */}
        <FinalDoorCanvas
          isActive={isFinalDoorAnimating}
          shouldPreload={isDoorFinished || isSecondDoorFinished}
          fps={24}
          zIndex="z-[35]"
          onComplete={handleFinalDoorComplete}
        />

        {/* Final Celestial Information Reveal: Gracefully emerges on top of Frame 150 */}
        <CelestialReveal
          isVisible={isFinalDoorFinished && !isChronicleVisible}
          onNext={handleOpenChronicle}
        />

        {/* The Birthday Chronicle: Special Edition • Shivi Day */}
        <BirthdayChronicle
          isVisible={isChronicleVisible && !isMessageVaultVisible}
          onNavigate={handleChronicleNavigate}
          onNext={handleOpenMessageVault}
        />

        {/* Curator's Special Vault: The Sealed Personal Letter */}
        <MessageVault
          isVisible={isMessageVaultVisible && !isFourBalloonsVisible}
          onNext={handleMessageVaultNext}
        />

        {/* Four Balloon Surprise: "YOU ARE SO SPECIAL" */}
        <FourBalloonsSection
          isVisible={isFourBalloonsVisible && !isClimaxCakeVisible}
          onNext={handleFourBalloonsNext}
        />

        {/* The Final Climax: 3D Interactive Birthday Cake & Celebration */}
        <BirthdayClimaxCake
          isVisible={isClimaxCakeVisible}
          onReplay={handleClimaxReplay}
        />


        {/* ==========================================
            LAYER 2: ATMOSPHERIC DOOR & SKY ILLUMINATION
            ========================================== */}
        {/* Door Frame Warm Light Shimmer */}
        {!isDoorAnimating && (
          <div
            className="absolute pointer-events-none rounded-t-[14px] z-5"
            style={{
              left: "29.2%",
              top: "27.8%",
              width: "41.6%",
              height: "45.2%",
              boxShadow: "inset 0 0 30px rgba(255, 220, 180, 0.35), 0 0 25px rgba(255, 190, 140, 0.25)",
              animation: "doorShimmer 5.5s ease-in-out infinite",
              mixBlendMode: "screen",
            }}
          />
        )}

        {/* Twinkling Night Sky Stars */}
        {[
          { left: "10.5%", top: "5.2%", size: "3px", dur: "4.2s", delay: "0.2s" },
          { left: "25.5%", top: "3.6%", size: "2.5px", dur: "5.5s", delay: "1.4s" },
          { left: "37.2%", top: "9.0%", size: "2px", dur: "6.0s", delay: "2.8s" },
          { left: "48.0%", top: "2.5%", size: "3.5px", dur: "4.8s", delay: "0.8s" },
          { left: "67.8%", top: "4.0%", size: "2px", dur: "4.4s", delay: "1.9s" },
          { left: "76.5%", top: "12.0%", size: "3px", dur: "6.2s", delay: "3.2s" },
          { left: "84.5%", top: "6.8%", size: "3px", dur: "5.1s", delay: "0.5s" },
        ].map((star, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full pointer-events-none z-5"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              backgroundColor: "#ffffff",
              boxShadow: "0 0 6px rgba(255, 255, 255, 1), 0 0 12px rgba(190, 220, 255, 0.8)",
              animation: `starTwinkleGentle ${star.dur} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}

        {/* ==========================================
            LAYER 3: TEXT ENTRANCE REVEALS & VIBRANT SHIVI GLOW
            ========================================== */}
        {/* 1. “Happy Birthday” Starlight Reveal */}
        <div
          className="absolute pointer-events-none z-25"
          style={{
            left: "27%",
            top: "6.2%",
            width: "46%",
            height: "3.6%",
            background: "radial-gradient(ellipse at center, rgba(255, 240, 250, 0.35) 0%, transparent 75%)",
            animation: "entranceFadeUpFestive 0.9s ease-out forwards",
            mixBlendMode: "screen",
          }}
        />

        {/* 2. “Shivi” Neon Bloom Entrance */}
        <div
          className="absolute pointer-events-none z-25"
          style={{
            left: "21.5%",
            top: "8.2%",
            width: "49%",
            height: "11.5%",
            background: "radial-gradient(ellipse at 50% 55%, rgba(255, 115, 195, 0.45) 0%, rgba(255, 20, 147, 0.2) 45%, transparent 75%)",
            animation: "entranceShiviFestive 1.2s ease-out 0.3s forwards",
            mixBlendMode: "screen",
          }}
        />

        {/* 3. Supporting Message Reveal */}
        <div
          className="absolute pointer-events-none z-25"
          style={{
            left: "19%",
            top: "19.2%",
            width: "62%",
            height: "5.8%",
            background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.22) 0%, transparent 75%)",
            animation: "entranceFadeUpFestive 0.8s ease-out 0.7s forwards",
            mixBlendMode: "screen",
          }}
        />

        {/* 4. Side Notes Gentle Reveal */}
        <div
          className="absolute pointer-events-none z-25"
          style={{
            left: "5%",
            top: "5%",
            width: "25%",
            height: "12%",
            background: "radial-gradient(ellipse at center, rgba(255, 230, 245, 0.18) 0%, transparent 70%)",
            animation: "entranceFadeUpFestive 1s ease-out 1.1s forwards",
            mixBlendMode: "screen",
          }}
        />
        <div
          className="absolute pointer-events-none z-25"
          style={{
            right: "5%",
            top: "4%",
            width: "25%",
            height: "12%",
            background: "radial-gradient(ellipse at center, rgba(255, 230, 245, 0.18) 0%, transparent 70%)",
            animation: "entranceFadeUpFestive 1s ease-out 1.1s forwards",
            mixBlendMode: "screen",
          }}
        />

        {/* 9. “Shivi” Continuous Radiant Neon Glow */}
        <div
          className="absolute pointer-events-none z-25"
          style={{
            left: "21%",
            top: "8.0%",
            width: "50%",
            height: "12%",
            background: "radial-gradient(ellipse at 50% 55%, rgba(255, 115, 195, 0.65) 0%, rgba(255, 20, 147, 0.28) 45%, transparent 75%)",
            animation: "shiviVibrantGlow 3.2s ease-in-out infinite",
            animationDelay: "1.5s",
            mixBlendMode: "screen",
          }}
        />

        {/* ==========================================
            LAYER 4: FLOATING FESTIVE BALLOONS (10 BALLOONS)
            Flanking the left and right borders gracefully.
            Upon password unlock, all balloons pop smoothly in celebration and disappear.
            ========================================== */}
        {balloonState !== "gone" && (
          <>
            {/* Left Flank Balloons */}
            <BirthdayBalloon
              left="5%"
              top="46%"
              width={34}
              height={43}
              colorGradient="radial-gradient(circle at 35% 30%, #ffa3cd 0%, #ec4899 65%, #be185d 100%)"
              delay="0s"
              dur="5.8s"
              swayDur="4.1s"
              isPopping={balloonState === "popping"}
            />
            <BirthdayBalloon
              left="14%"
              top="60%"
              width={30}
              height={38}
              colorGradient="radial-gradient(circle at 35% 30%, #e9d5ff 0%, #c084fc 65%, #7e22ce 100%)"
              delay="1.2s"
              dur="6.5s"
              swayDur="3.7s"
              isPopping={balloonState === "popping"}
            />
            <BirthdayBalloon
              left="4%"
              top="73%"
              width={35}
              height={44}
              colorGradient="radial-gradient(circle at 35% 30%, #fecdd3 0%, #f43f5e 65%, #be123c 100%)"
              delay="2.4s"
              dur="6.1s"
              swayDur="4.5s"
              isPopping={balloonState === "popping"}
            />
            <BirthdayBalloon
              left="13%"
              top="34%"
              width={28}
              height={36}
              colorGradient="radial-gradient(circle at 35% 30%, #ffedd5 0%, #fb923c 65%, #c2410c 100%)"
              delay="0.7s"
              dur="5.3s"
              swayDur="3.9s"
              isPopping={balloonState === "popping"}
            />
            <BirthdayBalloon
              left="16%"
              top="82%"
              width={32}
              height={40}
              colorGradient="radial-gradient(circle at 35% 30%, #ffffff 0%, #f1f5f9 65%, #cbd5e1 100%)"
              delay="3.1s"
              dur="6.8s"
              swayDur="4.3s"
              isPopping={balloonState === "popping"}
            />

            {/* Right Flank Balloons */}
            <BirthdayBalloon
              left="86%"
              top="44%"
              width={35}
              height={44}
              colorGradient="radial-gradient(circle at 35% 30%, #fecdd3 0%, #f43f5e 65%, #9f1239 100%)"
              delay="1.5s"
              dur="6.2s"
              swayDur="4.2s"
              isPopping={balloonState === "popping"}
            />
            <BirthdayBalloon
              left="77%"
              top="58%"
              width={31}
              height={39}
              colorGradient="radial-gradient(circle at 35% 30%, #ddd6fe 0%, #a855f7 65%, #6b21a8 100%)"
              delay="0.4s"
              dur="5.7s"
              swayDur="3.8s"
              isPopping={balloonState === "popping"}
            />
            <BirthdayBalloon
              left="88%"
              top="72%"
              width={30}
              height={38}
              colorGradient="radial-gradient(circle at 35% 30%, #fed7aa 0%, #fb923c 65%, #9a3412 100%)"
              delay="2.8s"
              dur="6.6s"
              swayDur="4.6s"
              isPopping={balloonState === "popping"}
            />
            <BirthdayBalloon
              left="81%"
              top="33%"
              width={33}
              height={42}
              colorGradient="radial-gradient(circle at 35% 30%, #fbcfe8 0%, #f472b6 65%, #db2777 100%)"
              delay="1.9s"
              dur="5.9s"
              swayDur="4.0s"
              isPopping={balloonState === "popping"}
            />
            <BirthdayBalloon
              left="76%"
              top="83%"
              width={29}
              height={37}
              colorGradient="radial-gradient(circle at 35% 30%, #f5d0fe 0%, #d946ef 65%, #86198f 100%)"
              delay="3.5s"
              dur="6.4s"
              swayDur="4.4s"
              isPopping={balloonState === "popping"}
            />
          </>
        )}

        {/* ==========================================
            LAYER 5: 6 GLOWING FESTIVE BUTTERFLIES
            ========================================== */}
        <div className={`transition-opacity duration-300 ${isDoorAnimating && !isDoorFinished ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          {/* Butterfly 1: Original Left Butterfly */}
          <GlowingButterfly
            left="13.5%"
            top="52.9%"
            size={19}
            animFlight="butterflyFlyFree1"
            flightDur="5.4s"
            flapDur="0.36s"
            glowDur="4.2s"
            delay="0s"
          />

          {/* Butterfly 2: Original Right Butterfly */}
          <GlowingButterfly
            left="85.5%"
            top="60.8%"
            size={19}
            animFlight="butterflyFlyFree2"
            flightDur="6.6s"
            flapDur="0.42s"
            glowDur="4.8s"
            delay="0.8s"
          />

          {/* Butterfly 3: Lower Left Garden Flower Meadow */}
          <GlowingButterfly
            left="18%"
            top="76%"
            size={16}
            animFlight="butterflyFlyFree3"
            flightDur="6.0s"
            flapDur="0.34s"
            glowDur="4.5s"
            delay="1.6s"
          />

          {/* Butterfly 4: Lower Right Garden Flower Meadow */}
          <GlowingButterfly
            left="82%"
            top="73%"
            size={17}
            animFlight="butterflyFlyFree1"
            flightDur="5.8s"
            flapDur="0.40s"
            glowDur="5.0s"
            delay="2.3s"
          />

          {/* Butterfly 5: Upper Left Door Vine */}
          <GlowingButterfly
            left="23%"
            top="34%"
            size={15}
            animFlight="butterflyFlyFree2"
            flightDur="7.0s"
            flapDur="0.38s"
            glowDur="4.1s"
            delay="1.2s"
          />

          {/* Butterfly 6: Right Sunset Ridge */}
          <GlowingButterfly
            left="87%"
            top="38%"
            size={16}
            animFlight="butterflyFlyFree3"
            flightDur="6.2s"
            flapDur="0.35s"
            glowDur="4.6s"
            delay="2.9s"
          />
        </div>

        {/* ==========================================
            LAYER 6: FLOATING PARTICLES (WITH MICRO-PARALLAX)
            Hearts, Confetti, Petals, Sparkles & Bursts
            ========================================== */}
        <div
          className={`absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 ${
            isDoorAnimating && !isDoorFinished ? "opacity-0" : "opacity-100"
          }`}
          style={{
            transform: "translate3d(var(--tilt-x, 0px), var(--tilt-y, 0px), 0)",
            transition: "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {/* 2. MANY FLOATING HEARTS (Continuous Romantic Stream) */}
          {[
            { char: "♡", left: "6%", top: "90%", dur: "7.8s", delay: "0s", size: 14, color: "#ff80ab" },
            { char: "♥", left: "91%", top: "86%", dur: "8.5s", delay: "1.1s", size: 13, color: "#ff4081" },
            { char: "❤", left: "15%", top: "82%", dur: "7.2s", delay: "2.2s", size: 12, color: "#f48fb1" },
            { char: "♡", left: "81%", top: "92%", dur: "8.8s", delay: "3.3s", size: 15, color: "#ea80fc" },
            { char: "♥", left: "8%", top: "78%", dur: "7.5s", delay: "4.4s", size: 16, color: "#ffffff" },
            { char: "♡", left: "89%", top: "75%", dur: "8.2s", delay: "5.5s", size: 12, color: "#f06292" },
            { char: "❤", left: "19%", top: "88%", dur: "7.9s", delay: "6.6s", size: 13, color: "#ce93d8" },
            { char: "♥", left: "78%", top: "85%", dur: "8.6s", delay: "7.7s", size: 14, color: "#ff80ab" },
            { char: "♡", left: "5%", top: "68%", dur: "7.6s", delay: "8.8s", size: 15, color: "#f8bbd0" },
            { char: "❤", left: "93%", top: "65%", dur: "8.4s", delay: "9.9s", size: 13, color: "#ec407a" },
            { char: "♥", left: "12%", top: "60%", dur: "7.4s", delay: "11.0s", size: 11, color: "#ffffff" },
            { char: "♡", left: "84%", top: "56%", dur: "8.7s", delay: "12.1s", size: 14, color: "#e1bee7" },
          ].map((heart, i) => (
            <span
              key={`stream-heart-${i}`}
              className="absolute pointer-events-none select-none font-serif"
              style={{
                left: heart.left,
                top: heart.top,
                fontSize: `${heart.size}px`,
                color: heart.color,
                textShadow: `0 0 7px ${heart.color}, 0 0 14px rgba(255, 105, 180, 0.7)`,
                animation: `heartFloatContinuous ${heart.dur} ease-in-out infinite`,
                animationDelay: heart.delay,
              }}
            >
              {heart.char}
            </span>
          ))}

          {/* 4. BIRTHDAY PARTY CONFETTI */}
          {[
            { left: "15%", dur: "9.5s", delay: "0.2s", bg: "#fbbf24", w: 5, h: 8 },
            { left: "28%", dur: "11.0s", delay: "1.8s", bg: "#ec4899", w: 6, h: 6, isCircle: true },
            { left: "42%", dur: "10.2s", delay: "3.2s", bg: "#c084fc", w: 5, h: 9 },
            { left: "58%", dur: "12.5s", delay: "0.9s", bg: "#f43f5e", w: 6, h: 7 },
            { left: "72%", dur: "9.8s", delay: "2.5s", bg: "#ffffff", w: 4, h: 7 },
            { left: "85%", dur: "11.5s", delay: "4.1s", bg: "#fbbf24", w: 5, h: 8 },
            { left: "20%", dur: "10.8s", delay: "5.4s", bg: "#d946ef", w: 6, h: 6, isCircle: true },
            { left: "35%", dur: "12.0s", delay: "6.7s", bg: "#f43f5e", w: 5, h: 8 },
            { left: "65%", dur: "10.5s", delay: "7.9s", bg: "#fbbf24", w: 5, h: 7 },
            { left: "80%", dur: "11.8s", delay: "8.6s", bg: "#a855f7", w: 6, h: 8 },
          ].map((conf, i) => (
            <div
              key={`confetti-${i}`}
              className="absolute pointer-events-none"
              style={{
                left: conf.left,
                top: "4%",
                width: `${conf.w}px`,
                height: `${conf.h}px`,
                backgroundColor: conf.bg,
                borderRadius: conf.isCircle ? "50%" : "1px",
                boxShadow: `0 0 5px ${conf.bg}`,
                animation: `confettiFall ${conf.dur} linear infinite`,
                animationDelay: conf.delay,
              }}
            />
          ))}

          {/* 7. FLOWER PETALS (9 Petals) */}
          {[
            { left: "16%", top: "18%", delay: "0s", dur: "11.5s", size: 10 },
            { left: "74%", top: "22%", delay: "2.2s", dur: "13.5s", size: 12 },
            { left: "25%", top: "30%", delay: "4.5s", dur: "12.2s", size: 9 },
            { left: "86%", top: "15%", delay: "6.8s", dur: "14.0s", size: 11 },
            { left: "10%", top: "38%", delay: "8.5s", dur: "12.8s", size: 10 },
            { left: "68%", top: "34%", delay: "10.2s", dur: "13.2s", size: 11 },
            { left: "22%", top: "52%", delay: "12.0s", dur: "12.0s", size: 9 },
            { left: "80%", top: "48%", delay: "13.8s", dur: "13.6s", size: 12 },
            { left: "14%", top: "66%", delay: "15.5s", dur: "11.8s", size: 10 },
          ].map((petal, i) => (
            <div
              key={`festive-petal-${i}`}
              className="absolute pointer-events-none"
              style={{
                left: petal.left,
                top: petal.top,
                width: `${petal.size}px`,
                height: `${Math.round(petal.size * 1.45)}px`,
                borderRadius: "60% 0 60% 40%",
                background: "linear-gradient(135deg, rgba(255, 195, 215, 0.95) 0%, rgba(255, 105, 180, 0.65) 100%)",
                boxShadow: "0 0 6px rgba(255, 182, 193, 0.8)",
                animation: `petalTumbleFall ${petal.dur} ease-in-out infinite`,
                animationDelay: petal.delay,
              }}
            />
          ))}

          {/* 5. MAGIC SPARKLES (16 Sparkles placed across key celebration zones) */}
          {[
            // Around Shivi
            { left: "24%", top: "8.8%", size: 9, dur: "3.6s", delay: "0.2s" },
            { left: "70%", top: "15.5%", size: 10, dur: "4.2s", delay: "1.3s" },
            { left: "48%", top: "6.0%", size: 8, dur: "3.9s", delay: "2.1s" },
            // Door edges & vines
            { left: "29%", top: "38%", size: 7, dur: "4.4s", delay: "0.8s" },
            { left: "70%", top: "45%", size: 8, dur: "4.8s", delay: "2.6s" },
            { left: "50%", top: "27%", size: 8, dur: "4.0s", delay: "1.7s" },
            // Around balloons
            { left: "11%", top: "45%", size: 9, dur: "4.3s", delay: "0.5s" },
            { left: "88%", top: "42%", size: 9, dur: "4.7s", delay: "2.9s" },
            // Near butterflies
            { left: "16%", top: "54%", size: 7, dur: "3.8s", delay: "1.5s" },
            { left: "83%", top: "59%", size: 8, dur: "4.1s", delay: "3.3s" },
            // Lower flower meadow
            { left: "15%", top: "84%", size: 10, dur: "4.5s", delay: "1.1s" },
            { left: "85%", top: "81%", size: 10, dur: "4.9s", delay: "2.7s" },
            { left: "24%", top: "89%", size: 8, dur: "3.7s", delay: "3.6s" },
            { left: "76%", top: "87%", size: 8, dur: "4.3s", delay: "0.9s" },
            // Near CTA button
            { left: "30%", top: "80%", size: 8, dur: "3.5s", delay: "1.9s" },
            { left: "70%", top: "80%", size: 9, dur: "4.0s", delay: "2.4s" },
          ].map((sparkle, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute pointer-events-none"
              style={{
                left: sparkle.left,
                top: sparkle.top,
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`,
                animation: `sparkleBurstTwinkle ${sparkle.dur} ease-in-out infinite`,
                animationDelay: sparkle.delay,
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path
                  d="M12,0 L14.8,9.2 L24,12 L14.8,14.8 L12,24 L9.2,14.8 L0,12 L9.2,9.2 Z"
                  fill="rgba(255, 250, 230, 1)"
                  style={{ filter: "drop-shadow(0 0 4px rgba(255, 230, 170, 0.95))" }}
                />
              </svg>
            </div>
          ))}

          {/* 6. GLOWING LOVE DUST MOTES */}
          {[
            { left: "12%", top: "80%", dur: "6.2s", delay: "0.4s" },
            { left: "86%", top: "78%", dur: "7.1s", delay: "1.8s" },
            { left: "20%", top: "70%", dur: "6.6s", delay: "3.2s" },
            { left: "80%", top: "68%", dur: "7.5s", delay: "4.6s" },
            { left: "15%", top: "62%", dur: "6.4s", delay: "2.2s" },
            { left: "85%", top: "54%", dur: "7.0s", delay: "5.1s" },
          ].map((mote, i) => (
            <div
              key={`lovedust-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: mote.left,
                top: mote.top,
                width: "3px",
                height: "3px",
                backgroundColor: "#ffffff",
                boxShadow: "0 0 6px rgba(255, 180, 225, 1), 0 0 12px rgba(255, 105, 180, 0.8)",
                animation: `loveDustFloat ${mote.dur} ease-in-out infinite`,
                animationDelay: mote.delay,
              }}
            />
          ))}

          {/* 8. BIRTHDAY LIGHT BURSTS (Occasional Expanding Radiance) */}
          {[
            { left: "14%", top: "52%", delay: "0s" },
            { left: "84%", top: "59%", delay: "3.5s" },
            { left: "48%", top: "25%", delay: "7.0s" },
            { left: "70%", top: "16%", delay: "10.5s" },
          ].map((burst, i) => (
            <div
              key={`burst-${i}`}
              className="absolute pointer-events-none rounded-full"
              style={{
                left: burst.left,
                top: burst.top,
                width: "40px",
                height: "40px",
                marginLeft: "-20px",
                marginTop: "-20px",
                background: "radial-gradient(circle, rgba(255, 255, 230, 0.95) 0%, rgba(255, 190, 225, 0.6) 45%, transparent 75%)",
                animation: "birthdayLightBurst 14s ease-in-out infinite",
                animationDelay: burst.delay,
                mixBlendMode: "screen",
              }}
            />
          ))}
        </div>

        {/* ==========================================
            LAYER 7: CTA BUTTON & INTERACTIVE LAYER
            ========================================== */}
        {/* Breathing pink glow aura with high festive luminescence */}
        {!isDoorAnimating && (
          <div
            className="absolute pointer-events-none rounded-full z-30 overflow-hidden"
          style={{
            left: "30.5%",
            top: "79.2%",
            width: "39%",
            height: "4.8%",
            animation: "ctaButtonFestiveGlow 3.0s ease-in-out infinite",
          }}
        >
          {/* Subtle Occasional Highlight Shimmer Sweep across the button */}
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.65) 50%, transparent 100%)",
              animation: "ctaSweepShimmer 4.8s ease-in-out infinite",
            }}
          />
        </div>
        )}

        {/* Seamless Transparent Interactive Layer with Tap Feedback */}
        {!isDoorAnimating && (
          <button
            id="open-the-door-button"
          type="button"
          onClick={handleOpenDoor}
          aria-label="Open The Door"
          className="absolute cursor-pointer bg-transparent border-none outline-none focus:outline-none rounded-full active:scale-[0.982] transition-transform duration-150 ease-out z-35"
          style={{
            left: "30.5%",
            top: "79.2%",
            width: "39%",
            height: "4.8%",
            WebkitTapHighlightColor: "transparent",
          }}
        />
        )}

        {/* Secret Clue / Password Modal */}
        <SecretClueModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onUnlocked={handlePasswordSuccess}
        />

        {/* Next Door Bottom Section: Smoothly reveals after Frame 219 finishes */}
        <NextDoorSection
          isVisible={isDoorFinished && !isSecondDoorFinished}
          isExiting={isSecondDoorAnimating}
          onNextDoor={handleNextDoor}
        />

        {/* Do Knock Bottom Section: Smoothly reveals after Frame 101 finishes */}
        <DoKnockSection
          isVisible={isSecondDoorFinished && !isFinalDoorFinished}
          isExiting={isFinalDoorAnimating}
          onSequenceComplete={handleSequenceComplete}
        />
      </div>
    </main>
  );
}
