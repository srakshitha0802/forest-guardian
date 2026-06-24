import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface Orb {
  size: number;
  x: string;
  y: string;
  delay: number;
  duration: number;
  opacity: number;
  color: string;
}

const darkOrbs: Orb[] = [
  { size: 300, x: '10%', y: '20%', delay: 0, duration: 8, opacity: 0.15, color: 'rgba(229, 115, 153, 0.3)' },
  { size: 200, x: '80%', y: '60%', delay: 2, duration: 10, opacity: 0.12, color: 'rgba(245, 160, 188, 0.25)' },
  { size: 150, x: '60%', y: '15%', delay: 1, duration: 7, opacity: 0.1, color: 'rgba(212, 132, 168, 0.3)' },
  { size: 250, x: '30%', y: '70%', delay: 3, duration: 9, opacity: 0.1, color: 'rgba(229, 115, 153, 0.2)' },
  { size: 180, x: '85%', y: '30%', delay: 1.5, duration: 11, opacity: 0.08, color: 'rgba(245, 160, 188, 0.2)' },
  { size: 120, x: '45%', y: '85%', delay: 0.5, duration: 6, opacity: 0.12, color: 'rgba(212, 132, 168, 0.25)' },
];

const lightOrbs: Orb[] = [
  { size: 300, x: '10%', y: '20%', delay: 0, duration: 8, opacity: 0.08, color: 'rgba(229, 115, 153, 0.25)' },
  { size: 200, x: '80%', y: '60%', delay: 2, duration: 10, opacity: 0.06, color: 'rgba(245, 160, 188, 0.2)' },
  { size: 150, x: '60%', y: '15%', delay: 1, duration: 7, opacity: 0.05, color: 'rgba(212, 132, 168, 0.25)' },
  { size: 250, x: '30%', y: '70%', delay: 3, duration: 9, opacity: 0.05, color: 'rgba(229, 115, 153, 0.15)' },
  { size: 180, x: '85%', y: '30%', delay: 1.5, duration: 11, opacity: 0.04, color: 'rgba(245, 160, 188, 0.15)' },
  { size: 120, x: '45%', y: '85%', delay: 0.5, duration: 6, opacity: 0.06, color: 'rgba(212, 132, 168, 0.2)' },
];

const GlassOrbs: React.FC = () => {
  const { theme } = useTheme();
  const orbs = theme === 'light' ? lightOrbs : darkOrbs;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: orb.opacity,
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{
            opacity: { duration: 2, delay: orb.delay },
            x: { duration: orb.duration, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: orb.duration * 0.8, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      ))}
    </div>
  );
};

export default GlassOrbs;
