import React, { useEffect, useRef } from 'react';

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

const SparkleEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let sparkles: Sparkle[] = [];
    const maxSparkles = 30;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createSparkle = (): Sparkle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      speedY: Math.random() * -1.5 - 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      life: 0,
      maxLife: Math.random() * 200 + 100,
    });

    const drawStar = (cx: number, cy: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(0, -size);
        ctx.moveTo(0, -size);
        ctx.lineTo(0, size);
        ctx.rotate((Math.PI / 2));
      }
      ctx.strokeStyle = `rgba(229, 115, 153, ${opacity})`;
      ctx.lineWidth = size * 0.3;
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new sparkles
      if (sparkles.length < maxSparkles && Math.random() < 0.05) {
        sparkles.push(createSparkle());
      }

      sparkles = sparkles.filter((sparkle) => {
        sparkle.y += sparkle.speedY;
        sparkle.x += Math.sin(sparkle.life * 0.02) * 0.5;
        sparkle.rotation += sparkle.rotationSpeed;
        sparkle.life++;

        const lifeRatio = sparkle.life / sparkle.maxLife;
        const fadeOpacity = sparkle.opacity * (1 - Math.abs(lifeRatio * 2 - 1));

        if (sparkle.life >= sparkle.maxLife || sparkle.y < -10) {
          return false;
        }

        drawStar(sparkle.x, sparkle.y, sparkle.size, sparkle.rotation, fadeOpacity);
        return true;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[2]"
      style={{ opacity: 0.5 }}
    />
  );
};

export default SparkleEffect;
