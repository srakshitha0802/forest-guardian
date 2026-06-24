import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, MapPin, ChevronDown, Sparkles } from 'lucide-react';
import AnimatedText from '@/components/AnimatedText';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Silently ignore autoplay restrictions; user can still see first frame
      });
    }
  }, []);

  const handleScrollDown = () => {
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fallback animated background - always visible behind video */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(229,115,153,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(245,160,188,0.08) 0%, transparent 50%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--card)) 50%, hsl(var(--background)) 100%)',
        }}
      />

      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-[1]"
      >
        <source src="/3D_pink_lotus.mp4" type="video/mp4" />
      </video>

      {/* Solid dark overlay for readability */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/90 z-[2]"
      />

      {/* Radial glow behind text */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(circle, rgba(229,115,153,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Floating mini glass particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full glass-card z-[2]"
          style={{
            width: 20 + i * 8,
            height: 20 + i * 8,
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 180, 360],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-medium text-primary tracking-wider uppercase">
            Portfolio 2026
          </span>
          <Sparkles size={16} className="text-primary" />
        </motion.div>

        {/* Animated Name */}
        <div className="mb-4">
          <AnimatedText
            text="Semala "
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance"
            delay={0.3}
            staggerDelay={0.05}
          />
          <AnimatedText
            text="Rakshitha"
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary text-balance"
            delay={0.6}
            staggerDelay={0.06}
          />
        </div>

        {/* Title with shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-lg md:text-2xl text-muted-foreground mb-8 font-heading font-light">
            Full Stack Developer — AI Integrations
          </p>
        </motion.div>

        {/* Contact info with staggered entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground mb-10"
        >
          {[
            { icon: Mail, text: 'srakshitha912@gmail.com' },
            { icon: Phone, text: '+91 86399 75744' },
            { icon: MapPin, text: 'Kurnool, Andhra Pradesh, India' },
          ].map((item, i) => (
            <motion.span
              key={item.text}
              className="flex items-center gap-2 glass-card px-3 py-1.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.6 + i * 0.1 }}
            >
              <item.icon size={14} className="text-primary" />
              {item.text}
            </motion.span>
          ))}
        </motion.div>

        {/* Social Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.9 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          {[
            { icon: Github, label: 'GitHub', href: 'https://github.com/srakshitha0802' },
            { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/rakshithasemala' },
          ].map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card px-6 py-3 flex items-center gap-2 text-sm font-medium hover:bg-white/10 transition-all group"
              whileHover={{ scale: 1.05, borderColor: 'rgba(229, 115, 153, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2 + i * 0.15 }}
            >
              <social.icon size={18} className="group-hover:text-primary transition-colors" />
              {social.label}
            </motion.a>
          ))}
        </motion.div>

        {/* Floating Stats Cards with enhanced animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { label: 'Projects', value: '10+', icon: '💻' },
            { label: 'Publications', value: '7', icon: '📚' },
            { label: 'Hackathons', value: '5+', icon: '🏆' },
            { label: 'CGPA', value: '8.5', icon: '🎓' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4 text-center relative overflow-hidden group"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 2.4 + i * 0.12, type: 'spring' }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="relative z-10">
                <div className="font-heading text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer z-10"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-wider uppercase">Scroll</span>
          <ChevronDown size={24} />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
