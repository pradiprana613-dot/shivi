"use client";

import React, { useEffect, useRef, useState } from "react";

interface SecondDoorCanvasProps {
  isActive: boolean;
  shouldPreload?: boolean;
  fps?: number;
  onComplete?: () => void;
}

const TOTAL_FRAMES = 101;
const INITIAL_PRELOAD_COUNT = 20;
const BUFFER_AHEAD_COUNT = 20;
const DEREFERENCE_BEHIND_COUNT = 15;

function getWebpUrl(frameNum: number): string {
  return `/sec-opt/${frameNum}.webp`;
}

export function SecondDoorCanvas({
  isActive,
  shouldPreload = false,
  fps = 30,
  onComplete,
}: SecondDoorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadingStatusRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const isPlayingRef = useRef(false);
  const isFinishedRef = useRef(false);
  const currentFrameRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Stable callback ref to prevent React re-renders from cancelling the animation loop
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Helper to load a single frame from optimized WebP
  // Synchronous assignment in img.onload eliminates mobile WebKit decode deadlocks
  const fetchFrame = (frameIndex: number): Promise<HTMLImageElement | null> => {
    if (frameIndex < 0 || frameIndex >= TOTAL_FRAMES) {
      return Promise.resolve(null);
    }
    if (framesRef.current[frameIndex]) {
      return Promise.resolve(framesRef.current[frameIndex]);
    }
    if (loadingStatusRef.current[frameIndex]) {
      return Promise.resolve(null);
    }

    loadingStatusRef.current[frameIndex] = true;
    const frameNum = frameIndex + 1;

    return new Promise((resolve) => {
      const img = new Image();
      img.src = getWebpUrl(frameNum);

      img.onload = () => {
        framesRef.current[frameIndex] = img;
        loadingStatusRef.current[frameIndex] = false;

        // If this is Frame 1 and animation hasn't started, draw it immediately to ready the canvas
        if (frameIndex === 0 && canvasRef.current && !isPlayingRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, 728, 1268);
          }
        }
        resolve(img);
      };

      img.onerror = () => {
        loadingStatusRef.current[frameIndex] = false;
        resolve(null);
      };
    });
  };

  // Preload initial frames as soon as shouldPreload or mount occurs
  useEffect(() => {
    let isCancelled = false;

    const preloadInitial = async () => {
      // 1. Immediately fetch and blit Frame 1 so it's ready in 0ms
      await fetchFrame(0);
      if (isCancelled) return;

      // 2. Buffer the first batch in small controlled steps
      for (let i = 1; i < Math.min(TOTAL_FRAMES, INITIAL_PRELOAD_COUNT); i++) {
        if (isCancelled) break;
        await fetchFrame(i);
      }
    };

    if (shouldPreload || isActive) {
      preloadInitial();
    }

    return () => {
      isCancelled = true;
    };
  }, [shouldPreload, isActive]);

  // Main playback loop triggered IMMEDIATELY when isActive turns true
  useEffect(() => {
    if (!isActive || isFinishedRef.current) return;

    // Prevent duplicate animation starts
    if (isPlayingRef.current) return;

    isPlayingRef.current = true;
    setHasStarted(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameInterval = 1000 / fps;
    let lastTime = performance.now();
    currentFrameRef.current = 0;

    // Draw Frame 1 immediately without delay
    const initialImg = framesRef.current[0];
    if (initialImg) {
      ctx.drawImage(initialImg, 0, 0, 728, 1268);
    } else {
      fetchFrame(0).then((img) => {
        if (img && canvasRef.current) {
          const c = canvasRef.current.getContext("2d");
          if (c) c.drawImage(img, 0, 0, 728, 1268);
        }
      });
    }

    const renderLoop = (currentTime: number) => {
      if (isFinishedRef.current) return;

      const elapsed = currentTime - lastTime;

      if (elapsed >= frameInterval) {
        const nextFrameIndex = currentFrameRef.current + 1;

        if (nextFrameIndex >= TOTAL_FRAMES) {
          // Frame 101 reached: HALT and freeze permanently on the final frame
          isFinishedRef.current = true;
          isPlayingRef.current = false;
          if (animFrameIdRef.current) {
            cancelAnimationFrame(animFrameIdRef.current);
            animFrameIdRef.current = null;
          }
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return;
        }

        const targetImg = framesRef.current[nextFrameIndex];

        if (targetImg) {
          currentFrameRef.current = nextFrameIndex;
          lastTime = currentTime - (elapsed % frameInterval);
          ctx.drawImage(targetImg, 0, 0, 728, 1268);

          // Proactively buffer upcoming frames ahead
          const bufferLimit = Math.min(TOTAL_FRAMES, nextFrameIndex + BUFFER_AHEAD_COUNT);
          for (let b = nextFrameIndex + 1; b < bufferLimit; b++) {
            if (!framesRef.current[b] && !loadingStatusRef.current[b]) {
              fetchFrame(b);
            }
          }

          // Dereference frames behind to reclaim mobile RAM while keeping final frame
          const derefThreshold = nextFrameIndex - DEREFERENCE_BEHIND_COUNT;
          if (derefThreshold > 0) {
            for (let d = 0; d < derefThreshold; d++) {
              if (d !== TOTAL_FRAMES - 1 && framesRef.current[d]) {
                framesRef.current[d] = null;
              }
            }
          }
        } else {
          // If next frame is still loading, keep requestAnimationFrame alive
          // Clamp lastTime so that as soon as the image resolves, it draws immediately on the next tick
          lastTime = currentTime - frameInterval;
          fetchFrame(nextFrameIndex);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current && isFinishedRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isActive, fps]);

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none z-[6] overflow-hidden select-none transition-opacity duration-200 ${
        isActive || hasStarted ? "opacity-100" : "opacity-0"
      }`}
    >
      <canvas
        ref={canvasRef}
        width={728}
        height={1268}
        className="w-full h-full object-contain pointer-events-none select-none block"
      />
    </div>
  );
}
