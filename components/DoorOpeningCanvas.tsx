"use client";

import React, { useEffect, useRef, useState } from "react";

interface DoorOpeningCanvasProps {
  isActive: boolean;
  fps?: number;
  onComplete?: () => void;
  zIndex?: string;
}

const TOTAL_FRAMES = 219;
const INITIAL_PRELOAD_COUNT = 15;
const BUFFER_AHEAD_COUNT = 20;
const DEREFERENCE_BEHIND_COUNT = 15;

function getWebpUrl(frameNum: number): string {
  return `/radhe-opt/${frameNum}.webp`;
}

export function DoorOpeningCanvas({
  isActive,
  fps = 30,
  onComplete,
  zIndex = "z-[4]",
}: DoorOpeningCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadingStatusRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const isPlayingRef = useRef(false);
  const isFinishedRef = useRef(false);
  const currentFrameRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Stable callback ref to prevent React effect cancellation on re-render
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Helper to load a single frame from optimized WebP
  // Note: synchronous onload assignment without await img.decode() prevents mobile WebKit deadlock
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
            ctx.drawImage(img, 0, 0, 1080, 1920);
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

  // Initial preload queue on mount: prioritize Frame 1, then buffer initial batch
  useEffect(() => {
    let isCancelled = false;

    const preloadInitial = async () => {
      // 1. Immediately load Frame 1 first
      await fetchFrame(0);
      if (isCancelled) return;

      // 2. Buffer the first batch in small controlled steps
      for (let i = 1; i < Math.min(TOTAL_FRAMES, INITIAL_PRELOAD_COUNT); i++) {
        if (isCancelled) break;
        await fetchFrame(i);
      }
    };

    preloadInitial();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Main playback loop triggered ONLY when isActive turns true
  useEffect(() => {
    if (!isActive || isFinishedRef.current) return;

    // Avoid duplicate initialization if already playing
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

    // Draw Frame 1 immediately if available
    const initialImg = framesRef.current[0];
    if (initialImg) {
      ctx.drawImage(initialImg, 0, 0, 1080, 1920);
    } else {
      fetchFrame(0).then((img) => {
        if (img && canvasRef.current) {
          const c = canvasRef.current.getContext("2d");
          if (c) c.drawImage(img, 0, 0, 1080, 1920);
        }
      });
    }

    const renderLoop = (currentTime: number) => {
      if (isFinishedRef.current) return;

      const elapsed = currentTime - lastTime;

      if (elapsed >= frameInterval) {
        const nextFrameIndex = currentFrameRef.current + 1;

        if (nextFrameIndex >= TOTAL_FRAMES) {
          // Frame 219 reached: HALT and freeze permanently
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
          ctx.drawImage(targetImg, 0, 0, 1080, 1920);

          // Proactively buffer upcoming frames ahead
          const bufferLimit = Math.min(TOTAL_FRAMES, nextFrameIndex + BUFFER_AHEAD_COUNT);
          for (let b = nextFrameIndex + 1; b < bufferLimit; b++) {
            if (!framesRef.current[b] && !loadingStatusRef.current[b]) {
              fetchFrame(b);
            }
          }

          // Dereference frames far behind to reclaim mobile RAM (preserving final frame)
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
      className={`absolute inset-0 w-full h-full pointer-events-none ${zIndex} overflow-hidden select-none transition-opacity duration-200 ${
        isActive || hasStarted ? "opacity-100" : "opacity-0"
      }`}
    >
      <canvas
        ref={canvasRef}
        width={1080}
        height={1920}
        className="w-full h-full object-contain pointer-events-none select-none block"
      />
    </div>
  );
}
