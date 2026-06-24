import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const LotusVideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Silently ignore autoplay restrictions
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
      {/* Animated fallback gradient - always visible */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 40% 30%, rgba(229,115,153,0.08) 0%, transparent 60%), radial-gradient(ellipse at 60% 70%, rgba(245,160,188,0.05) 0%, transparent 50%)',
        }}
      />

      <motion.video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <source src="/Lotus_blooming.mp4" type="video/mp4" />
      </motion.video>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--background)) 0%, transparent 30%, transparent 70%, hsl(var(--background)) 100%)',
        }}
      />
      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background)) 80%)',
        }}
      />
    </div>
  );
};

export default LotusVideoBackground;
