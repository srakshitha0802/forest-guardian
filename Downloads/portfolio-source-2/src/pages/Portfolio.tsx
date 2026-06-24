import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleBackground from '@/components/ParticleBackground';
import GlassOrbs from '@/components/GlassOrbs';
import CursorGlow from '@/components/CursorGlow';
import FloatingFlower from '@/components/FloatingFlower';
import LotusVideoBackground from '@/components/LotusVideoBackground';
import ScrollToTop from '@/components/ScrollToTop';
import SparkleEffect from '@/components/SparkleEffect';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import InteractiveRobot from '@/components/sections/InteractiveRobot';
import FishingGame from '@/components/sections/FishingGame';
import ResearchSection from '@/components/sections/ResearchSection';
import ModelViewerSection from '@/components/sections/ModelViewerSection';
import ContactSection from '@/components/sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

const Portfolio: React.FC = () => {
  useEffect(() => {
    // Parallax effect for section headings
    const headings = document.querySelectorAll('.section-heading');
    headings.forEach((heading) => {
      gsap.fromTo(
        heading,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
    });

    // Staggered reveal for cards
    const cardGrids = document.querySelectorAll('.card-grid');
    cardGrids.forEach((grid) => {
      const cards = grid.querySelectorAll('.glass-card');
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden transition-colors duration-500">
      <LotusVideoBackground />
      <ParticleBackground />
      <SparkleEffect />
      <CursorGlow />
      <GlassOrbs />
      <FloatingFlower />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        {/* Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <SkillsSection />
        {/* Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <ExperienceSection />
        {/* Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <ProjectsSection />
        {/* Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <InteractiveRobot />
        {/* Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <FishingGame />
        {/* Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <ResearchSection />
        {/* Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <ModelViewerSection />
        {/* Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Portfolio;
