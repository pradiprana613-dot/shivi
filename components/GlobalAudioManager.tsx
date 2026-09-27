"use client";

import { useEffect } from "react";

// Persistent global singleton across React component lifecycle & client transitions
let globalAudio: HTMLAudioElement | null = null;
let isAudioStarted = false;
let isPlayStarting = false;

function getOrCreateAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;

  if (!globalAudio) {
    globalAudio = new Audio("/Audio.mpeg");
    globalAudio.loop = true;
    globalAudio.volume = 0.4;
    globalAudio.preload = "auto";
    if (typeof window !== "undefined") {
      (window as Window & { __globalAudio?: HTMLAudioElement | null }).__globalAudio = globalAudio;
    }

    // Seamless loop safeguard: automatically loop seamlessly if browser ends
    globalAudio.addEventListener("ended", () => {
      if (globalAudio) {
        globalAudio.currentTime = 0;
        globalAudio.play().catch(() => {});
      }
    });
  }

  return globalAudio;
}

export function GlobalAudioManager() {
  useEffect(() => {
    // If audio is already active and playing, no need to attach gesture listeners
    if (isAudioStarted && globalAudio && !globalAudio.paused) {
      return;
    }

    const audio = getOrCreateAudio();
    if (!audio) return;

    const gestureEvents = [
      "pointerdown",
      "touchstart",
      "touchend",
      "click",
      "keydown",
    ] as const;

    let cleanupDone = false;

    const removeGestureListeners = () => {
      if (cleanupDone) return;
      cleanupDone = true;

      const captureOptions: EventListenerOptions = { capture: true };
      gestureEvents.forEach((event) => {
        window.removeEventListener(event, unlockAndPlay, captureOptions);
        document.removeEventListener(event, unlockAndPlay, captureOptions);
      });
    };

    const unlockAndPlay = () => {
      if (isAudioStarted || isPlayStarting) {
        if (isAudioStarted) {
          removeGestureListeners();
        }
        return;
      }

      const currentAudio = getOrCreateAudio();
      if (!currentAudio) return;

      if (!currentAudio.paused) {
        isAudioStarted = true;
        removeGestureListeners();
        return;
      }

      isPlayStarting = true;

      const playPromise = currentAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isAudioStarted = true;
            isPlayStarting = false;
            removeGestureListeners();
          })
          .catch(() => {
            isPlayStarting = false;
            // Kept active so next user gesture can retry unlock
          });
      }
    };

    // Attach listeners with capture: true on both window and document to intercept
    // the first user gesture before any child component might call stopPropagation
    gestureEvents.forEach((event) => {
      window.addEventListener(event, unlockAndPlay, { capture: true, passive: true });
      document.addEventListener(event, unlockAndPlay, { capture: true, passive: true });
    });

    // Check if the browser allows unprompted playback immediately (e.g., if autoplay is permitted)
    if (!isAudioStarted && !isPlayStarting) {
      const initialTry = audio.play();
      if (initialTry !== undefined) {
        initialTry
          .then(() => {
            isAudioStarted = true;
            removeGestureListeners();
          })
          .catch(() => {
            // Expected on modern browsers: waiting for first user gesture
          });
      }
    }

    // Auto-resume on tab visibility return if audio was previously started
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        isAudioStarted &&
        globalAudio &&
        globalAudio.paused
      ) {
        globalAudio.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      removeGestureListeners();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Completely headless: zero DOM elements, zero UI controls, zero visual footprint
  return null;
}
