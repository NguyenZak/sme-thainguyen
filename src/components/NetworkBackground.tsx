"use client";

import { useEffect, useRef } from "react";

interface NodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  zLayer: number; // 1 (Deep Background), 2 (Midground), 3 (Foreground)
  color: string;
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle nodes setup across 3 depth layers
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const particles: NodeParticle[] = [];
    const colors = ["#22C55E", "#10B981", "#F59E0B", "#34D399", "#A7F3D0"];

    for (let i = 0; i < particleCount; i++) {
      const zLayer = Math.random() < 0.3 ? 1 : Math.random() < 0.7 ? 2 : 3;
      const speedMultiplier = zLayer === 1 ? 0.3 : zLayer === 2 ? 0.6 : 0.9;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speedMultiplier,
        vy: (Math.random() - 0.5) * speedMultiplier,
        radius: zLayer === 1 ? 1.2 : zLayer === 2 ? 2.0 : 3.2,
        zLayer,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Mouse coordinates for 3D parallax depth tracking
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      // Smooth lerp mouse positioning for parallax depth
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const parallaxX = (mouse.x - width / 2) * 0.04;
      const parallaxY = (mouse.y - height / 2) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw 3D Radial Depth Spotlight Beams
      const radialGlow = ctx.createRadialGradient(
        width / 2 + parallaxX * 0.5,
        height * 0.35 + parallaxY * 0.5,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      radialGlow.addColorStop(0, "rgba(34, 197, 94, 0.18)");
      radialGlow.addColorStop(0.5, "rgba(11, 48, 38, 0.4)");
      radialGlow.addColorStop(1, "rgba(5, 26, 20, 0.9)");

      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Sort particles by depth layer so background renders first
      particles.sort((a, b) => a.zLayer - b.zLayer);

      // 2. Draw Nodes & Connectivity Streams with Parallax Depth Offset
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on canvas bounds
        if (p.x < -20 || p.x > width + 20) p.vx *= -1;
        if (p.y < -20 || p.y > height + 20) p.vy *= -1;

        // Parallax offset calculated based on Z layer
        const layerParallaxFactor = p.zLayer === 1 ? 0.2 : p.zLayer === 2 ? 0.6 : 1.2;
        const renderX = p.x + parallaxX * layerParallaxFactor;
        const renderY = p.y + parallaxY * layerParallaxFactor;

        // Render particle point with layer-specific opacity & blur
        const layerOpacity = p.zLayer === 1 ? 0.4 : p.zLayer === 2 ? 0.75 : 0.95;

        ctx.beginPath();
        ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.zLayer === 3 ? 12 : p.zLayer === 2 ? 6 : 0;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = layerOpacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;

        // Connect nodes on same or adjacent depth layers
        const maxDist = p.zLayer === 3 ? 150 : 120;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (Math.abs(p.zLayer - p2.zLayer) > 1) continue;

          const p2ParallaxFactor = p2.zLayer === 1 ? 0.2 : p2.zLayer === 2 ? 0.6 : 1.2;
          const p2RenderX = p2.x + parallaxX * p2ParallaxFactor;
          const p2RenderY = p2.y + parallaxY * p2ParallaxFactor;

          const dx = renderX - p2RenderX;
          const dy = renderY - p2RenderY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35 * layerOpacity;
            ctx.beginPath();
            ctx.moveTo(renderX, renderY);
            ctx.lineTo(p2RenderX, p2RenderY);
            ctx.strokeStyle = p.zLayer === 3 ? `rgba(245, 158, 11, ${alpha})` : `rgba(34, 197, 94, ${alpha})`;
            ctx.lineWidth = p.zLayer === 3 ? 1.2 : 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor with golden laser beam
        const mdx = renderX - mouse.x;
        const mdy = renderY - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 190 && p.zLayer >= 2) {
          const malpha = (1 - mdist / 190) * 0.75;
          ctx.beginPath();
          ctx.moveTo(renderX, renderY);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(245, 158, 11, ${malpha})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
}
