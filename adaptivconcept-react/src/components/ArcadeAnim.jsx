import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * ArcadeAnim
 * - Creates a semi-transparent, dark, retro-arcade animated backdrop inside a div.arcade-anim
 * - Prefers p5.js if available (dynamic import). Falls back to a native canvas renderer.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createNativeRenderer({ canvas, container, density = 1, colorBoost = 1 }) {
  const ctx = canvas.getContext("2d");
  let raf = 0;
  let t0 = performance.now();
  const rand = mulberry32(1337);

  const stars = [];
  const particles = [];
  const grid = {
    phase: 0,
  };

  const makeStars = (w, h, count) => {
    stars.length = 0;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: rand() * w,
        y: rand() * h,
        z: rand(),
        r: 0.3 + rand() * 1.2,
        v: 0.15 + rand() * 0.7,
        tw: rand() * Math.PI * 2,
      });
    }
  };

  const makeParticles = (w, h, count) => {
    particles.length = 0;
    for (let i = 0; i < count; i++) {
      const hue = (rand() * 360) | 0;
      particles.push({
        x: rand() * w,
        y: rand() * h,
        vx: (rand() - 0.5) * 0.35,
        vy: (rand() - 0.5) * 0.35,
        hue,
        life: rand() * 260,
        size: 1.2 + rand() * 2.8,
      });
    }
  };

  const resize = () => {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const W = Math.max(1, Math.floor(rect.width));
    const H = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const starCount = Math.floor((W * H) / 9000 * density);
    const particleCount = Math.floor((W * H) / 22000 * density);
    makeStars(W, H, clamp(starCount, 60, 360));
    makeParticles(W, H, clamp(particleCount, 16, 90));
  };

  const drawGradient = (W, H, time) => {
    const g = ctx.createRadialGradient(W * 0.55, H * 0.35, 0, W * 0.55, H * 0.35, Math.max(W, H));
    const a1 = 0.55;
    const a2 = 0.25;
    const a3 = 0.16;
    g.addColorStop(0, `rgba(18, 12, 32, ${a1})`);
    g.addColorStop(0.45, `rgba(6, 20, 36, ${a2})`);
    g.addColorStop(1, `rgba(0, 0, 0, ${a3})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const cx = W * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.00027)));
    const cy = H * (0.25 + 0.55 * (0.5 + 0.5 * Math.cos(time * 0.00019)));
    const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.85);
    g2.addColorStop(0, `rgba(0, 255, 210, ${0.07 * colorBoost})`);
    g2.addColorStop(0.55, `rgba(255, 0, 210, ${0.05 * colorBoost})`);
    g2.addColorStop(1, `rgba(0, 0, 0, 0)`);
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);
  };

  const drawStars = (W, H, dt) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const s of stars) {
      s.tw += dt * 0.0025;
      s.x += (0.15 + 0.55 * s.z) * s.v;
      s.y += (0.05 + 0.25 * s.z) * s.v;
      if (s.x > W + 20) s.x = -20;
      if (s.y > H + 20) s.y = -20;

      const tw = 0.55 + 0.45 * Math.sin(s.tw);
      const alpha = (0.12 + 0.22 * s.z) * tw;
      const size = s.r * (0.7 + 1.6 * s.z);
      const hue = (200 + 140 * s.z + 40 * Math.sin(s.tw * 0.7)) % 360;
      ctx.fillStyle = `hsla(${hue}, 100%, ${70 + 10 * s.z}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${alpha * 0.55})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, size * 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const drawParticles = (W, H, dt) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const p of particles) {
      p.life -= dt * 0.03;
      const n1 = Math.sin((p.x + p.y) * 0.006 + t0 * 0.0003);
      const n2 = Math.cos((p.x - p.y) * 0.006 + t0 * 0.0002);

      p.vx += n1 * 0.0012;
      p.vy += n2 * 0.0012;
      p.x += p.vx * dt * 0.06;
      p.y += p.vy * dt * 0.06;
      p.vx *= 0.996;
      p.vy *= 0.996;

      if (p.x < -40) p.x = W + 40;
      if (p.x > W + 40) p.x = -40;
      if (p.y < -40) p.y = H + 40;
      if (p.y > H + 40) p.y = -40;

      if (p.life <= 0) {
        p.x = rand() * W;
        p.y = rand() * H;
        p.vx = (rand() - 0.5) * 0.35;
        p.vy = (rand() - 0.5) * 0.35;
        p.hue = (rand() * 360) | 0;
        p.life = 220 + rand() * 260;
        p.size = 1.2 + rand() * 3.2;
      }

      const alpha = (0.08 + 0.12 * Math.sin((p.life + t0 * 0.2) * 0.02)) * colorBoost;
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `hsla(${p.hue}, 100%, 65%, ${alpha * 0.55})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 14, p.y - p.vy * 14);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawGrid = (W, H, dt) => {
    grid.phase += dt * 0.00055;
    const horizon = H * 0.55;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    const band = ctx.createLinearGradient(0, horizon, 0, H);
    band.addColorStop(0, `rgba(0, 255, 210, ${0.02 * colorBoost})`);
    band.addColorStop(0.6, `rgba(180, 80, 255, ${0.03 * colorBoost})`);
    band.addColorStop(1, `rgba(0, 0, 0, 0)`);
    ctx.fillStyle = band;
    ctx.fillRect(0, horizon, W, H - horizon);

    ctx.strokeStyle = `rgba(80, 240, 255, ${0.08 * colorBoost})`;
    ctx.lineWidth = 1;

    const rows = 18;
    for (let i = 0; i < rows; i++) {
      const p = i / (rows - 1);
      const y = horizon + (H - horizon) * Math.pow(p, 1.6);
      const shift = (grid.phase * 260) % 28;
      ctx.beginPath();
      ctx.moveTo(0, y + shift * (0.015 + p * 0.015));
      ctx.lineTo(W, y + shift * (0.015 + p * 0.015));
      ctx.stroke();
    }

    const cols = 24;
    const centerX = W / 2;
    for (let i = 0; i < cols; i++) {
      const xN = (i / (cols - 1)) * 2 - 1;
      const xTop = centerX + xN * W * 0.08;
      const xBot = centerX + xN * W * 0.65;
      ctx.beginPath();
      ctx.moveTo(xTop, horizon);
      ctx.lineTo(xBot, H);
      ctx.stroke();
    }

    ctx.restore();
  };

  const drawScanlines = (W, H) => {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0,0,0,0.14)";
    const step = 3;
    for (let y = 0; y < H; y += step) {
      ctx.fillRect(0, y, W, 1);
    }
    ctx.restore();
  };

  const drawVignette = (W, H) => {
    ctx.save();
    const g = ctx.createRadialGradient(W * 0.5, H * 0.42, Math.min(W, H) * 0.25, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  };

  const draw = (time) => {
    const rect = container.getBoundingClientRect();
    const W = Math.max(1, Math.floor(rect.width));
    const H = Math.max(1, Math.floor(rect.height));
    const dt = time - t0;
    t0 = time;

    ctx.clearRect(0, 0, W, H);
    drawGradient(W, H, time);
    drawStars(W, H, dt);
    drawParticles(W, H, dt);
    drawGrid(W, H, dt);
    drawScanlines(W, H);
    drawVignette(W, H);

    raf = requestAnimationFrame(draw);
  };

  const start = () => {
    stop();
    resize();
    raf = requestAnimationFrame(draw);
  };

  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  return { start, stop, resize };
}

function createP5Sketch({ container, density = 1, colorBoost = 1 }) {
  return function (p) {
    let stars = [];
    let particles = [];
    let horizon = 0;

    const rebuild = () => {
      const W = container.clientWidth || 800;
      const H = container.clientHeight || 420;
      horizon = H * 0.55;
      const starCount = clamp(Math.floor((W * H) / 9000 * density), 80, 520);
      const particleCount = clamp(Math.floor((W * H) / 22000 * density), 18, 140);
      stars = Array.from({ length: starCount }).map(() => ({
        x: p.random(W),
        y: p.random(H),
        z: p.random(),
        r: p.random(0.3, 1.4),
        v: p.random(0.15, 0.85),
        tw: p.random(p.TWO_PI),
      }));
      particles = Array.from({ length: particleCount }).map(() => ({
        x: p.random(W),
        y: p.random(H),
        vx: p.random(-0.18, 0.18),
        vy: p.random(-0.18, 0.18),
        hue: p.random(0, 360),
        life: p.random(220, 520),
        size: p.random(1.2, 4.2),
      }));
    };

    p.setup = () => {
      const W = container.clientWidth || 800;
      const H = container.clientHeight || 420;
      const c = p.createCanvas(W, H);
      c.parent(container);
      p.noStroke();
      p.colorMode(p.HSL, 360, 100, 100, 1);
      rebuild();
    };

    p.windowResized = () => {
      const W = container.clientWidth || 800;
      const H = container.clientHeight || 420;
      p.resizeCanvas(W, H);
      rebuild();
    };

    const gradient = (W, H, time) => {
      p.blendMode(p.BLEND);
      p.background(0, 0, 0, 0);
      for (let i = 0; i < 5; i++) {
        const a = 0.12 + i * 0.03;
        p.fill(260, 55, 16, a);
        p.rect(0, 0, W, H);
      }
      const cx = W * (0.2 + 0.6 * (0.5 + 0.5 * p.sin(time * 0.00027)));
      const cy = H * (0.25 + 0.55 * (0.5 + 0.5 * p.cos(time * 0.00019)));
      p.blendMode(p.ADD);
      for (let r = Math.max(W, H) * 0.85; r > 0; r -= Math.max(W, H) * 0.06) {
        const k = r / (Math.max(W, H) * 0.85);
        p.fill(170, 100, 60, 0.03 * (1 - k) * colorBoost);
        p.circle(cx, cy, r);
        p.fill(310, 100, 60, 0.02 * (1 - k) * colorBoost);
        p.circle(W - cx * 0.35, H - cy * 0.55, r * 0.92);
      }
    };

    const drawStars = (W, H, dt) => {
      p.blendMode(p.ADD);
      for (const s of stars) {
        s.tw += dt * 0.0025;
        s.x += (0.15 + 0.55 * s.z) * s.v;
        s.y += (0.05 + 0.25 * s.z) * s.v;
        if (s.x > W + 20) s.x = -20;
        if (s.y > H + 20) s.y = -20;

        const tw = 0.55 + 0.45 * p.sin(s.tw);
        const alpha = (0.12 + 0.22 * s.z) * tw;
        const size = s.r * (0.7 + 1.6 * s.z);
        const hue = (200 + 140 * s.z + 40 * p.sin(s.tw * 0.7)) % 360;

        p.fill(hue, 100, 72, alpha);
        p.circle(s.x, s.y, size * 2);
        p.fill(hue, 100, 62, alpha * 0.55);
        p.circle(s.x, s.y, size * 6);
      }
    };

    const drawParticles = (W, H, dt, time) => {
      p.blendMode(p.ADD);
      for (const q of particles) {
        q.life -= dt * 0.03;
        const n1 = p.sin((q.x + q.y) * 0.006 + time * 0.0003);
        const n2 = p.cos((q.x - q.y) * 0.006 + time * 0.0002);
        q.vx += n1 * 0.0012;
        q.vy += n2 * 0.0012;
        q.x += q.vx * dt * 0.06;
        q.y += q.vy * dt * 0.06;
        q.vx *= 0.996;
        q.vy *= 0.996;

        if (q.x < -40) q.x = W + 40;
        if (q.x > W + 40) q.x = -40;
        if (q.y < -40) q.y = H + 40;
        if (q.y > H + 40) q.y = -40;

        if (q.life <= 0) {
          q.x = p.random(W);
          q.y = p.random(H);
          q.vx = p.random(-0.18, 0.18);
          q.vy = p.random(-0.18, 0.18);
          q.hue = p.random(0, 360);
          q.life = p.random(220, 520);
          q.size = p.random(1.2, 4.2);
        }

        const alpha = (0.08 + 0.12 * p.sin((q.life + time * 0.2) * 0.02)) * colorBoost;
        p.fill(q.hue, 100, 70, alpha);
        p.circle(q.x, q.y, q.size * 2);
        p.stroke(q.hue, 100, 62, alpha * 0.55);
        p.strokeWeight(1);
        p.line(q.x, q.y, q.x - q.vx * 14, q.y - q.vy * 14);
        p.noStroke();
      }
    };

    const drawGrid = (W, H, time) => {
      const phase = (time * 0.00055) % 1;
      p.blendMode(p.ADD);
      for (let i = 0; i < 10; i++) {
        const a = 0.007 * (1 - i / 10) * colorBoost;
        p.fill(175, 100, 60, a);
        p.rect(0, horizon + i * 2, W, (H - horizon) - i * 2);
      }

      p.stroke(185, 100, 65, 0.12 * colorBoost);
      p.strokeWeight(1);
      const rows = 18;
      for (let i = 0; i < rows; i++) {
        const pr = i / (rows - 1);
        const y = horizon + (H - horizon) * Math.pow(pr, 1.6);
        const shift = (phase * 260) % 28;
        p.line(0, y + shift * (0.015 + pr * 0.015), W, y + shift * (0.015 + pr * 0.015));
      }
      const cols = 24;
      const centerX = W / 2;
      for (let i = 0; i < cols; i++) {
        const xN = (i / (cols - 1)) * 2 - 1;
        const xTop = centerX + xN * W * 0.08;
        const xBot = centerX + xN * W * 0.65;
        p.line(xTop, horizon, xBot, H);
      }

      p.noStroke();
    };

    const scanlines = (W, H) => {
      p.blendMode(p.MULTIPLY);
      p.fill(0, 0, 0, 0.14);
      for (let y = 0; y < H; y += 3) p.rect(0, y, W, 1);
    };

    const vignette = (W, H) => {
      p.blendMode(p.MULTIPLY);
      for (let r = 0; r < 1; r += 0.06) {
        const a = 0.05 + r * 0.07;
        p.fill(0, 0, 0, a);
        p.rect(r * W * 0.5, r * H * 0.5, W * (1 - r), H * (1 - r), 18);
      }
    };

    p.draw = () => {
      const W = p.width;
      const H = p.height;
      const dt = p.deltaTime;
      const time = p.millis();

      gradient(W, H, time);
      drawStars(W, H, dt);
      drawParticles(W, H, dt, time);
      drawGrid(W, H, time);
      scanlines(W, H);
      vignette(W, H);
    };
  };
}

const ArcadeAnim = ({
  className = "",
  useP5 = true,
  density = 1,
  colorBoost = 1,
  style = {},
  children,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const nativeRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let stopped = false;

    const startNative = () => {
      const native = createNativeRenderer({ canvas, container, density, colorBoost });
      nativeRef.current = native;
      native.start();
      const onResize = () => native.resize();
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        native.stop();
        nativeRef.current = null;
      };
    };

    const startP5 = async () => {
      try {
        const mod = await import("p5");
        if (stopped) return () => {};
        const P5 = mod.default ?? mod;
        const sketch = createP5Sketch({ container, density, colorBoost });
        canvas.style.display = "none";
        p5InstanceRef.current = new P5(sketch);
        return () => {
          try {
            p5InstanceRef.current?.remove?.();
          } catch {}
          p5InstanceRef.current = null;
          canvas.style.display = "block";
        };
      } catch (e) {
        return startNative();
      }
    };

    let cleanup = () => {};

    if (reducedMotion) {
      const native = createNativeRenderer({ canvas, container, density, colorBoost });
      nativeRef.current = native;
      native.resize();
      const ctx = canvas.getContext("2d");
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      cleanup = () => {
        native.stop();
        nativeRef.current = null;
      };
      return cleanup;
    }

    (async () => {
      cleanup = (useP5 ? await startP5() : startNative()) || (() => {});
    })();

    return () => {
      stopped = true;
      cleanup?.();
    };
  }, [useP5, density, colorBoost, reducedMotion]);

  return (
    <div ref={containerRef} className={`arcade-anim ${className}`} style={style}>
      <canvas ref={canvasRef} className="arcade-anim__canvas" aria-hidden="true" />
      <div className="arcade-wrapper-content">{children}</div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .arcade-anim {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          background: rgba(8, 8, 12, 0.32);
          box-shadow: 0 24px 80px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.06);
          backdrop-filter: blur(10px) saturate(140%);
          -webkit-backdrop-filter: blur(10px) saturate(140%);
        }
        /* Target all canvases (native and p5) to stay in background */
        .arcade-anim canvas {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          pointer-events: none !important;
          z-index: 0 !important;
          opacity: 0.92;
        }
        .arcade-wrapper-content {
          position: relative;
          z-index: 2;
          color: rgba(255,255,255,0.92);
        }
        .arcade-anim::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(1200px 700px at 50% 30%, rgba(255,255,255,0.07), rgba(255,255,255,0) 55%),
            radial-gradient(900px 520px at 20% 15%, rgba(0,255,210,0.08), rgba(0,0,0,0) 60%),
            radial-gradient(900px 520px at 80% 25%, rgba(255,0,210,0.06), rgba(0,0,0,0) 60%),
            radial-gradient(900px 520px at 50% 85%, rgba(160,110,255,0.07), rgba(0,0,0,0) 62%),
            radial-gradient(800px 500px at 50% 50%, rgba(0,0,0,0), rgba(0,0,0,0.7));
          mix-blend-mode: screen;
          opacity: 0.9;
        }
        .arcade-anim::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            repeating-linear-gradient(to bottom, rgba(0,0,0,0.0) 0px, rgba(0,0,0,0.0) 2px, rgba(0,0,0,0.18) 3px),
            linear-gradient(90deg, rgba(255,0,120,0.03), rgba(0,255,220,0.03));
          opacity: 0.55;
          mix-blend-mode: multiply;
          filter: saturate(140%);
        }
      `}} />
    </div>
  );
};

export default ArcadeAnim;
