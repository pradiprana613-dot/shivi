"use client";

import React, { useEffect, useRef, useState } from "react";

interface FinalDoorCanvasProps {
  isActive: boolean;
  shouldPreload?: boolean;
  fps?: number;
  onComplete?: () => void;
  zIndex?: string;
}

const TOTAL_FRAMES = 150;
const INITIAL_PRELOAD_COUNT = 40;
const BUFFER_AHEAD_COUNT = 40;
const DEREFERENCE_BEHIND_COUNT = 30;

function getWebpUrl(frameNum: number): string {
  return `/prd-opt/${frameNum}.webp`;
}

function getPngUrl(frameNum: number): string {
  const padded = frameNum.toString().padStart(3, "0");
  return `/prd/ezgif-frame-${padded}.png`;
}

export function FinalDoorCanvas({
  isActive,
  shouldPreload = false,
  fps = 24,
  onComplete,
  zIndex = "z-[35]",
}: FinalDoorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadingStatusRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const isPlayingRef = useRef(false);
  const isFinishedRef = useRef(false);
  const currentFrameRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Stable callback ref
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Load a single frame with WebP preference and verified PNG fallback
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

        // If Frame 1 is loaded and animation hasn't started, draw it immediately to ready canvas in 0ms
        if (frameIndex === 0 && canvasRef.current && !isPlayingRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, 1080, 1920);
          }
        }
        resolve(img);
      };

      img.onerror = () => {
        // Fallback to original PNG if WebP fails
        const fallbackImg = new Image();
        fallbackImg.src = getPngUrl(frameNum);
        fallbackImg.onload = () => {
          framesRef.current[frameIndex] = fallbackImg;
          loadingStatusRef.current[frameIndex] = false;
          if (frameIndex === 0 && canvasRef.current && !isPlayingRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              ctx.drawImage(fallbackImg, 0, 0, 1080, 1920);
            }
          }
          resolve(fallbackImg);
        };
        fallbackImg.onerror = () => {
          loadingStatusRef.current[frameIndex] = false;
          resolve(null);
        };
      };
    });
  };

  // Preload initial batch of frames as soon as shouldPreload or mount occurs
  useEffect(() => {
    let isCancelled = false;

    const preloadInitial = async () => {
      // 1. Immediately fetch and blit Frame 1 so it's ready in 0ms
      await fetchFrame(0);
      if (isCancelled) return;

      // 2. Buffer the first 40 frames in parallel batches of 5 for maximum speed
      for (let i = 1; i < Math.min(TOTAL_FRAMES, INITIAL_PRELOAD_COUNT); i += 5) {
        if (isCancelled) break;
        const batch = [];
        for (let j = i; j < Math.min(TOTAL_FRAMES, i + 5); j++) {
          batch.push(fetchFrame(j));
        }
        await Promise.all(batch);
      }
    };

    if (shouldPreload || isActive) {
      preloadInitial();
    }

    return () => {
      isCancelled = true;
    };
  }, [shouldPreload, isActive]);

  // Continuous background preloader for subsequent frames once initial batch finishes
  useEffect(() => {
    let isCancelled = false;

    const preloadRest = async () => {
      await new Promise((r) => setTimeout(r, 400));
      for (let i = INITIAL_PRELOAD_COUNT; i < TOTAL_FRAMES; i += 5) {
        if (isCancelled) break;
        const batch = [];
        for (let j = i; j < Math.min(TOTAL_FRAMES, i + 5); j++) {
          if (!framesRef.current[j] && !loadingStatusRef.current[j]) {
            batch.push(fetchFrame(j));
          }
        }
        await Promise.all(batch);
      }
    };

    if (shouldPreload || isActive) {
      preloadRest();
    }

    return () => {
      isCancelled = true;
    };
  }, [shouldPreload, isActive]);

  // Main playback loop triggered when isActive turns true
  useEffect(() => {
    if (!isActive || isFinishedRef.current) return;
    if (isPlayingRef.current) return;

    isPlayingRef.current = true;
    setHasStarted(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const frameInterval = 1000 / fps;
    let lastTime = performance.now();
    currentFrameRef.current = 0;

    // Draw Frame 1 immediately with 0 blank frame
    const initialImg = framesRef.current[0];
    if (initialImg) {
      ctx.drawImage(initialImg, 0, 0, 1080, 1920);
    } else {
      fetchFrame(0).then((img) => {
        if (img && canvasRef.current) {
          const c = canvasRef.current.getContext("2d", { alpha: false });
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
          // Frame 150 reached: HALT and freeze permanently
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

          // Dereference frames far behind to reclaim memory, PRESERVING the final frame
          const derefThreshold = nextFrameIndex - DEREFERENCE_BEHIND_COUNT;
          if (derefThreshold > 0) {
            for (let d = 0; d < derefThreshold; d++) {
              if (d !== TOTAL_FRAMES - 1 && framesRef.current[d]) {
                framesRef.current[d] = null;
              }
            }
          }
        } else {
          // If next frame is still decoding/fetching, hold current frame and keep loop active
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
      className={`absolute inset-0 w-full h-full pointer-events-none ${zIndex} overflow-hidden select-none transition-opacity duration-300 ${
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
