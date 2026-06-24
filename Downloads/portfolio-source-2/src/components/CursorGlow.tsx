import React, { useEffect, useRef } from 'react';

const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let rafId: number;
    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      currentX += dx * 0.08;
      currentY += dy * 0.08;

      glow.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
      style={{
        background: 'radial-gradient(circle, rgba(229, 115, 153, 0.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
        willChange: 'transform',
      }}
    />
  );
};

export default CursorGlow;
