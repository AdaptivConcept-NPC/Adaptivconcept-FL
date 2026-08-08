import React, { useEffect, useRef } from "react";
import p5 from "p5";
import { useTheme } from "../context/ThemeContext";

const GeometricBackground = () => {
  const { isP5AnimatedEnabled } = useTheme();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isP5AnimatedEnabled) return undefined;
    let p5Instance;

    const sketch = (p) => {
      let shapes = [];
      let colors = [];
      let spawnPos;
      const MAX_SHAPES = 150; // Tripled for significant volume

      class Shape {
        constructor() {
          this.reset();
        }

        reset() {
          this.origin = spawnPos.copy();
          this.pos = spawnPos.copy();
          // Varied speeds for layering depth
          this.vel = p5.Vector.random2D().mult(p.random(0.2, 1.8)); 
          this.acc = p.createVector(0, 0);
          this.baseSize = p.random(3, 18);
          this.size = this.baseSize;
          this.angle = p.random(p.TWO_PI);
          this.rotationSpeed = p.random(-0.03, 0.03);
          this.type = p.random(["cube", "cone", "pixel"]); // Added "pixel" for detail
          this.color = p.random(colors);
          this.life = 255;
          this.decay = p.random(0.2, 0.8); // Slower decay for more persistent volume
        }

        update() {
          this.vel.add(this.acc);
          this.pos.add(this.vel);
          this.acc.mult(0);
          
          this.angle += this.rotationSpeed;
          this.life -= this.decay;

          let d = p.dist(this.pos.x, this.pos.y, this.origin.x, this.origin.y);
          this.size = this.baseSize + (d * 0.15); // Slightly faster scaling

          if (this.life <= 0 || this.isOffScreen()) {
            this.reset();
          }
        }

        isOffScreen() {
          const margin = this.size * 3;
          return (
            this.pos.x < -margin ||
            this.pos.x > p.width + margin ||
            this.pos.y < -margin ||
            this.pos.y > p.height + margin
          );
        }

        display() {
          p.push();
          p.translate(this.pos.x, this.pos.y);
          p.rotate(this.angle);
          
          let c = p.color(this.color);
          c.setAlpha(this.life);
          p.fill(c);
          p.noStroke();

          if (this.type === "cube") {
            p.rectMode(p.CENTER);
            p.rect(0, 0, this.size, this.size);
          } else if (this.type === "cone") {
            p.triangle(
              0, -this.size / 1.5,
              -this.size / 2, this.size / 2,
              this.size / 2, this.size / 2
            );
          } else {
            // Tiny "pixel" detail
            p.rect(0, 0, this.size * 0.4, this.size * 0.4);
          }
          p.pop();
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style("display", "block");
        spawnPos = p.createVector(p.width / 2, p.height / 2);

        colors = [
          p.color(255, 255, 255, 100), // White
          p.color(255, 77, 0, 140),   // Adaptiv Orange
          p.color(200, 200, 200, 80),  // Light Gray
          p.color(20, 20, 20, 160),    // Dark Coal
        ];

        for (let i = 0; i < MAX_SHAPES; i++) {
          shapes.push(new Shape());
        }
      };

      p.draw = () => {
        p.clear();
        
        let nx = p.noise(p.frameCount * 0.004) * p.width;
        let ny = p.noise(p.frameCount * 0.004 + 1000) * p.height;
        spawnPos.set(nx, ny);

        // Core glow
        let pulse = p.sin(p.frameCount * 0.03) * 12;
        p.noStroke();
        p.fill(255, 77, 0, 12);
        p.ellipse(spawnPos.x, spawnPos.y, 70 + pulse, 70 + pulse);

        shapes.forEach((s) => {
          s.update();
          s.display();
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    p5Instance = new p5(sketch, containerRef.current);

    return () => {
      p5Instance.remove();
    };
  }, [isP5AnimatedEnabled]);

  if (!isP5AnimatedEnabled) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ mixBlendMode: "overlay", opacity: 0.6 }}
    />
  );
};

export default GeometricBackground;
