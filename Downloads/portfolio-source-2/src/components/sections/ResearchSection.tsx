import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { BookOpen, FileText, Mic, Award, Trophy, BadgeCheck, GraduationCap, ArrowRight } from 'lucide-react';

const researchData = {
  ieee: [
    { title: 'Pruning for Precision: Leveraging Feature Selection for Thyroid Diagnostic Models', venue: 'ICSSCNA 2026' },
    { title: 'Closing the Yield Gap: Computer Vision Pipeline for Banana Disease Detection', venue: 'ICAISS 2026' },
    { title: 'Caching-Aware Anycast Evaluation: DNS vs CDN Deployments', venue: 'MPCON 2026' },
    { title: 'Variational Autoencoder-Based Framework for Sepsis Detection in ICU', venue: 'ICCIDS 2026' },
    { title: 'AI-Enabled IoT Framework for Next-Hour Residential Load Forecasting', venue: 'SILCON 2025' },
    { title: 'Hybrid Learning Models for Early Cancer Gene Detection', venue: 'ICE2CPT 2025' },
  ],
  journals: [
    { title: 'Learning for Diabetes Prediction: A Comparative Evaluation', venue: 'Research Paper, 2026' },
    { title: 'A New Dimension in Metaheuristics: Quantum-Inspired Evolutionary Search', venue: 'Research Survey, 2026' },
  ],
  presentations: [
    { title: 'CO2 Impact on Temperature', venue: 'E2A-2025, NIT Silchar' },
    { title: 'Inflation Forecasting with ML', venue: 'I-SMAC 2025, Nepal' },
  ],
};

const achievements = [
  { title: 'Future Founder – Ratan Tata Innovation Hub (RTIH)', detail: '' },
  { title: 'National Finalist – Smart India Hackathon', detail: '' },
  { title: 'National Finalist – Codex 3.0 Hackathon', detail: '' },
  { title: 'Winner – Idea Fusion Innovation Competition', detail: '50+ teams' },
  { title: 'Top 15 Finalist – IEEE Road Safety Innovation Challenge', detail: '' },
  { title: 'Multiple IEEE Publications During Undergraduate Studies', detail: '' },
];

const certifications = [
  'Artificial Intelligence Fundamentals – IBM',
  'Cybersecurity Fundamentals – IBM',
  'Build AI Agents – IBM',
  'MERN Stack Full Stack Development – SmartBridge',
  'AI Virtual Internship – AICTE',
  'Generative AI – GUVI',
  'Web Analytics – Accenture',
  'Quantum Computing – Wiser',
];

function AnimatedCard({
  children,
  icon: Icon,
  title,
  delay,
}: {
  children: React.ReactNode;
  icon: React.ElementType;
  title: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className="glass-card p-6 h-full group relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={{ borderColor: 'rgba(229, 115, 153, 0.25)', y: -3 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <motion.div
            className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon size={20} className="text-primary" />
          </motion.div>
          <h3 className="font-heading text-lg font-semibold">{title}</h3>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

const ResearchSection: React.FC = () => {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });
  const eduRef = useRef(null);
  const isEduInView = useInView(eduRef, { once: true, margin: '-80px' });

  return (
    <section id="research" className="relative z-10 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Research & Publications */}
        <motion.div
          ref={headingRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">
            Research & <span className="text-primary">Publications</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Academic contributions spanning healthcare AI, computer vision, IoT forecasting, networking systems, and predictive analytics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 card-grid">
          {/* IEEE */}
          <AnimatedCard icon={BookOpen} title="IEEE Publications" delay={0}>
            <div className="space-y-4">
              {researchData.ieee.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="border-l-2 border-primary/30 pl-4 group/item hover:border-primary/60 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isHeadingInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <p className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.venue}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedCard>

          {/* Journals */}
          <AnimatedCard icon={FileText} title="Journal Publications" delay={0.1}>
            <div className="space-y-4">
              {researchData.journals.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="border-l-2 border-primary/30 pl-4 group/item hover:border-primary/60 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isHeadingInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <p className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.venue}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedCard>

          {/* Presentations */}
          <AnimatedCard icon={Mic} title="Presentations" delay={0.2}>
            <div className="space-y-4">
              {researchData.presentations.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="border-l-2 border-primary/30 pl-4 group/item hover:border-primary/60 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isHeadingInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <p className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.venue}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedCard>
        </div>

        {/* Achievements */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">
            Achievements & <span className="text-primary">Certifications</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Recognitions and professional certifications demonstrating commitment to excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 card-grid">
          {/* Achievements */}
          <AnimatedCard icon={Trophy} title="Achievements" delay={0}>
            <div className="space-y-3">
              {achievements.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="flex items-start gap-3 group/item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isHeadingInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <Award size={16} className="text-primary mt-1 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    {item.detail && (
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedCard>

          {/* Certifications */}
          <AnimatedCard icon={BadgeCheck} title="Certifications" delay={0.1}>
            <div className="space-y-3">
              {certifications.slice(0, 4).map((cert, i) => (
                <motion.div
                  key={cert}
                  className="flex items-start gap-3 group/item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isHeadingInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <BadgeCheck
                    size={16}
                    className="text-primary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform"
                  />
                  <p className="text-sm text-foreground">{cert}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border/30">
              <Link
                to="/certificates"
                className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
              >
                See All Certificates & Publications
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimatedCard>
        </div>

        {/* See More Research */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/research"
            className="inline-flex items-center gap-2 glass-card px-6 py-3 text-sm font-medium hover:border-primary/30 transition-colors group"
          >
            See All Research & Publications
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Education */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">
            <span className="text-primary">Education</span>
          </h2>
        </motion.div>

        <motion.div
          ref={eduRef}
          className="glass-card p-8 max-w-2xl mx-auto relative overflow-hidden group"
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={isEduInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          whileHover={{ borderColor: 'rgba(229, 115, 153, 0.25)' }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  B.Tech, Computer Science & Engineering
                </h3>
                <p className="text-primary font-medium">Ravindra College of Engineering for Women</p>
                <p className="text-sm text-muted-foreground mt-1">Kurnool, Andhra Pradesh</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">2024 – 2028</p>
                <motion.div
                  className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  <GraduationCap size={14} />
                  CGPA: 8.5/10
                </motion.div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/30">
              <p className="text-sm text-muted-foreground mb-3">Languages:</p>
              <div className="flex flex-wrap gap-2">
                {['English', 'Telugu', 'Hindi'].map((lang) => (
                  <motion.span
                    key={lang}
                    whileHover={{ scale: 1.08, y: -1 }}
                    className="text-xs px-3 py-1 rounded-full bg-white/5 border border-border/50 text-muted-foreground hover:border-primary/20 transition-colors cursor-default"
                  >
                    {lang}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResearchSection;
