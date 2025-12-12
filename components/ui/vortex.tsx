import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  dotCount?: number;
  ghostCount?: number;
  backgroundColor?: string;
}

interface Dot {
  x: number;
  y: number;
  eaten: boolean;
  size: number;
}

interface Ghost {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface Pacman {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  mouthAngle: number;
  direction: number;
}

export const Vortex = (props: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  const dotsRef = useRef<Dot[]>([]);
  const ghostsRef = useRef<Ghost[]>([]);
  const pacmanRef = useRef<Pacman | null>(null);

  const dotCount = props.dotCount || 100;
  const ghostCount = props.ghostCount || 4;
  const backgroundColor = props.backgroundColor || "#000000";

  let tick = 0;

  const rand = (n: number): number => n * Math.random();

  const setup = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        resize(canvas);
        initDots();
        initGhosts();
        initPacman();
        draw(canvas, ctx);
      }
    }
  };

  const initDots = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    dotsRef.current = [];
    for (let i = 0; i < dotCount; i++) {
      dotsRef.current.push({
        x: rand(canvas.width),
        y: rand(canvas.height),
        eaten: false,
        size: 3 + rand(3),
      });
    }
  };

  const initGhosts = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ghostColors = ["#FF0000", "#FFB8FF", "#00FFFF", "#FFB852"];
    ghostsRef.current = [];

    for (let i = 0; i < ghostCount; i++) {
      ghostsRef.current.push({
        x: rand(canvas.width),
        y: rand(canvas.height),
        vx: (rand(2) - 1) * 2,
        vy: (rand(2) - 1) * 2,
        color: ghostColors[i % ghostColors.length],
        size: 20 + rand(10),
      });
    }
  };

  const initPacman = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    pacmanRef.current = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: 2,
      vy: 0,
      size: 25,
      mouthAngle: 0.2,
      direction: 0,
    };
  };

  const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    tick++;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add retro maze-like grid
    drawGrid(ctx, canvas);

    // Draw dots
    drawDots(ctx);

    // Draw and update ghosts
    drawGhosts(ctx, canvas);

    // Draw and update Pacman
    drawPacman(ctx, canvas);

    animationFrameId.current = window.requestAnimationFrame(() =>
      draw(canvas, ctx)
    );
  };

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    ctx.strokeStyle = "rgba(33, 33, 255, 0.3)";
    ctx.lineWidth = 2;

    const gridSize = 50;

    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const drawDots = (ctx: CanvasRenderingContext2D) => {
    const pacman = pacmanRef.current;

    dotsRef.current.forEach((dot) => {
      if (dot.eaten) {
        // Respawn eaten dots after some time
        if (Math.random() < 0.001) {
          dot.eaten = false;
        }
        return;
      }

      // Check collision with Pacman
      if (pacman) {
        const dx = dot.x - pacman.x;
        const dy = dot.y - pacman.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pacman.size) {
          dot.eaten = true;
          return;
        }
      }

      // Draw dot with glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#FFB852";
      ctx.fillStyle = "#FFB852";
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  };

  const drawGhosts = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    ghostsRef.current.forEach((ghost) => {
      // Update position
      ghost.x += ghost.vx;
      ghost.y += ghost.vy;

      // Bounce off walls
      if (ghost.x < ghost.size || ghost.x > canvas.width - ghost.size) {
        ghost.vx *= -1;
      }
      if (ghost.y < ghost.size || ghost.y > canvas.height - ghost.size) {
        ghost.vy *= -1;
      }

      // Random direction changes
      if (Math.random() < 0.02) {
        ghost.vx = (rand(2) - 1) * 2;
        ghost.vy = (rand(2) - 1) * 2;
      }

      // Draw ghost body
      ctx.shadowBlur = 15;
      ctx.shadowColor = ghost.color;
      ctx.fillStyle = ghost.color;

      // Head (semi-circle)
      ctx.beginPath();
      ctx.arc(
        ghost.x,
        ghost.y - ghost.size / 4,
        ghost.size / 2,
        Math.PI,
        0,
        false
      );

      // Body with wavy bottom
      ctx.lineTo(ghost.x + ghost.size / 2, ghost.y + ghost.size / 3);
      for (let i = 0; i < 3; i++) {
        const waveX = ghost.x + ghost.size / 2 - (i + 1) * (ghost.size / 3);
        const waveY =
          ghost.y + ghost.size / 3 + (i % 2 === 0 ? ghost.size / 6 : 0);
        ctx.lineTo(waveX, waveY);
      }
      ctx.lineTo(ghost.x - ghost.size / 2, ghost.y + ghost.size / 3);
      ctx.closePath();
      ctx.fill();

      // Eyes
      ctx.shadowBlur = 0;
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(
        ghost.x - ghost.size / 5,
        ghost.y - ghost.size / 4,
        ghost.size / 8,
        0,
        Math.PI * 2
      );
      ctx.arc(
        ghost.x + ghost.size / 5,
        ghost.y - ghost.size / 4,
        ghost.size / 8,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Pupils
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(
        ghost.x - ghost.size / 5,
        ghost.y - ghost.size / 4,
        ghost.size / 16,
        0,
        Math.PI * 2
      );
      ctx.arc(
        ghost.x + ghost.size / 5,
        ghost.y - ghost.size / 4,
        ghost.size / 16,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  };

  const drawPacman = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const pacman = pacmanRef.current;
    if (!pacman) return;

    // Update position
    pacman.x += pacman.vx;
    pacman.y += pacman.vy;

    // Wrap around screen
    if (pacman.x < -pacman.size) pacman.x = canvas.width + pacman.size;
    if (pacman.x > canvas.width + pacman.size) pacman.x = -pacman.size;
    if (pacman.y < -pacman.size) pacman.y = canvas.height + pacman.size;
    if (pacman.y > canvas.height + pacman.size) pacman.y = -pacman.size;

    // Change direction randomly
    if (Math.random() < 0.02) {
      const directions = [
        { vx: 2, vy: 0, dir: 0 }, // right
        { vx: -2, vy: 0, dir: Math.PI }, // left
        { vx: 0, vy: 2, dir: Math.PI / 2 }, // down
        { vx: 0, vy: -2, dir: -Math.PI / 2 }, // up
      ];
      const newDir = directions[Math.floor(rand(directions.length))];
      pacman.vx = newDir.vx;
      pacman.vy = newDir.vy;
      pacman.direction = newDir.dir;
    }

    // Animate mouth
    pacman.mouthAngle = 0.2 + Math.abs(Math.sin(tick * 0.1)) * 0.3;

    // Draw Pacman
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#FFFF00";
    ctx.fillStyle = "#FFFF00";
    ctx.beginPath();
    ctx.arc(
      pacman.x,
      pacman.y,
      pacman.size,
      pacman.direction + pacman.mouthAngle,
      pacman.direction + Math.PI * 2 - pacman.mouthAngle
    );
    ctx.lineTo(pacman.x, pacman.y);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Eye
    ctx.fillStyle = "black";
    const eyeX =
      pacman.x + (Math.cos(pacman.direction - Math.PI / 4) * pacman.size) / 2;
    const eyeY =
      pacman.y + (Math.sin(pacman.direction - Math.PI / 4) * pacman.size) / 2;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, pacman.size / 8, 0, Math.PI * 2);
    ctx.fill();
  };

  const resize = (canvas: HTMLCanvasElement) => {
    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      resize(canvas);
      initDots();
      initGhosts();
      initPacman();
    }
  };

  useEffect(() => {
    setup();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("relative h-full w-full", props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute inset-0 z-0 flex h-full w-full items-center justify-center bg-transparent"
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>

      <div className={cn("relative z-10", props.className)}>
        {props.children}
      </div>
    </div>
  );
};
