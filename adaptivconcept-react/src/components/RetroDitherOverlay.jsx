import React, { useEffect, useMemo, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex) => {
  const normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    return normalized.split("").map((char) => parseInt(char + char, 16));
  }

  if (normalized.length === 6) {
    return [0, 2, 4].map((index) => parseInt(normalized.slice(index, index + 2), 16));
  }

  return [255, 102, 0];
};

const RetroDitherOverlay = ({ className = "" }) => {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, target: 0 });
  const ripplesRef = useRef([]);
  const frameRef = useRef(null);
  const wallpaperRef = useRef({ source: null, image: null });

  const {
    themeColor,
    isRetroDitherEnabled,
    retroDitherStrength,
    retroDitherPixelSize,
    retroDitherScanlines,
    retroDitherClickWave,
  } = useTheme();

  const accentRgb = useMemo(() => hexToRgb(themeColor.value), [themeColor.value]);

  useEffect(() => {
    if (!isRetroDitherEnabled) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let sampleCanvas = null;
    let sampleContext = null;
    let samplePixels = null;
    let columns = 0;
    let rows = 0;
    let cellSize = 0;
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const updateWallpaperSample = () => {
      const image = wallpaperRef.current.image;
      if (!image || !columns || !rows) return;

      sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = columns;
      sampleCanvas.height = rows;
      sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) return;

      const scale = Math.max(columns / image.naturalWidth, rows / image.naturalHeight);
      const imageWidth = image.naturalWidth * scale;
      const imageHeight = image.naturalHeight * scale;
      sampleContext.clearRect(0, 0, columns, rows);
      sampleContext.drawImage(image, (columns - imageWidth) / 2, 0, imageWidth, imageHeight);
      samplePixels = sampleContext.getImageData(0, 0, columns, rows).data;
    };

    const loadWallpaper = () => {
      const source = document.querySelector("[data-wallpaper-source]")?.dataset.wallpaperSource;
      if (!source || source === wallpaperRef.current.source) return;

      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (wallpaperRef.current.source !== source) return;
        wallpaperRef.current.image = image;
        updateWallpaperSample();
      };
      image.src = source;
      wallpaperRef.current = { source, image: null };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      cellSize = Math.max(3, Math.round(retroDitherPixelSize * dpr));
      columns = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
      updateWallpaperSample();
    };

    const draw = (time) => {
      frameCount += 1;
      if (time - lastFpsUpdate >= 500) {
        window.dispatchEvent(
          new CustomEvent("retro-dither-fps", {
            detail: Math.round((frameCount * 1000) / (time - lastFpsUpdate)),
          }),
        );
        frameCount = 0;
        lastFpsUpdate = time;
      }

      ctx.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const ease = 1 - Math.exp(-0.03);
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;
      pointer.active += (pointer.target - pointer.active) * ease;

      const radius = 0.2 + retroDitherStrength * 0.4;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * cellSize;
          const y = row * cellSize;
          const centerX = x + cellSize * 0.5;
          const centerY = y + cellSize * 0.5;
          const nx = centerX / width;
          const ny = centerY / height;
          const dx = nx - pointer.x;
          const dy = ny - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const lens = clamp(1 - dist / radius, 0, 1);

          let rippleIntensity = 0;
          for (const ripple of ripplesRef.current) {
            const rippleDx = nx - ripple.x;
            const rippleDy = ny - ripple.y;
            const rippleDist = Math.sqrt(rippleDx * rippleDx + rippleDy * rippleDy);
            const age = (time * 0.001 - ripple.t) / 0.9;
            const wave = Math.exp(-age * 1.4) * Math.exp(-(rippleDist * rippleDist) / (0.18 + age * 0.08));
            rippleIntensity = Math.max(rippleIntensity, wave * retroDitherClickWave * 0.9);
          }

          const pixelIndex = (row * columns + column) * 4;
          const luminance = samplePixels
            ? (samplePixels[pixelIndex] * 0.2126 + samplePixels[pixelIndex + 1] * 0.7152 + samplePixels[pixelIndex + 2] * 0.0722) / 255
            : 0;
          const previousLuminance = samplePixels && column > 0
            ? (samplePixels[pixelIndex - 4] * 0.2126 + samplePixels[pixelIndex - 3] * 0.7152 + samplePixels[pixelIndex - 2] * 0.0722) / 255
            : luminance;
          const contour = Math.abs(luminance - previousLuminance);
          const interaction = lens * pointer.active * 0.45 + rippleIntensity * 0.7;
          const density = clamp((luminance * 0.55 + contour * 1.8 + interaction) * retroDitherStrength, 0, 1);
          const bayer = ((column & 1) + ((row & 1) << 1)) / 4;

          if (density > bayer) {
            const alpha = 0.08 + density * 0.3;
            ctx.fillStyle = luminance > 0.5
              ? `rgba(0, 0, 0, ${alpha})`
              : `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, ${alpha})`;
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
      }

      if (retroDitherScanlines > 0.01) {
        ctx.globalAlpha = clamp(retroDitherScanlines, 0, 1) * 0.18;
        ctx.fillStyle = "#ffffff";
        for (let y = 0; y < height; y += 2) {
          ctx.fillRect(0, y, width, 1);
        }
        ctx.globalAlpha = 1;
      }

      for (const ripple of ripplesRef.current) {
        const age = (time * 0.001 - ripple.t) / 0.9;
        const progress = clamp(age, 0, 1);
        const rippleRadius = (0.04 + progress * 0.46) * Math.min(width, height);

        ctx.beginPath();
        ctx.arc(ripple.x * width, ripple.y * height, rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, ${(1 - progress) * retroDitherClickWave * 0.65})`;
        ctx.lineWidth = Math.max(1, dpr * 1.5);
        ctx.stroke();
      }

      ripplesRef.current = ripplesRef.current.filter((ripple) => (time * 0.001 - ripple.t) < 0.9);
      frameRef.current = requestAnimationFrame(draw);
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.tx = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
      pointerRef.current.ty = clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
      pointerRef.current.target = 1;
    };

    const handlePointerLeave = () => {
      pointerRef.current.target = 0;
    };

    const handlePointerDown = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
      const y = clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
      ripplesRef.current.push({ x, y, t: performance.now() / 1000 });
      if (ripplesRef.current.length > 4) ripplesRef.current.shift();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const wallpaperObserver = new MutationObserver(loadWallpaper);
    const wallpaperContainer = document.querySelector("[data-wallpaper-source]");
    if (wallpaperContainer) {
      wallpaperObserver.observe(wallpaperContainer, { attributes: true, attributeFilter: ["data-wallpaper-source"] });
    }
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, true);
    window.addEventListener("pointerleave", handlePointerLeave, true);
    window.addEventListener("pointerdown", handlePointerDown, true);

    resize();
    loadWallpaper();
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.dispatchEvent(new CustomEvent("retro-dither-fps", { detail: 0 }));
      resizeObserver.disconnect();
      wallpaperObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("pointerleave", handlePointerLeave, true);
      window.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [accentRgb, isRetroDitherEnabled, retroDitherStrength, retroDitherPixelSize, retroDitherScanlines, retroDitherClickWave]);

  if (!isRetroDitherEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-[2] h-screen w-screen ${className}`}
      aria-hidden="true"
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        opacity: 0.95,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

export default RetroDitherOverlay;
