import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

const experiences = [
  {
    company: 'IncuxAI (Startup)',
    role: 'Full Stack Developer',
    type: 'Remote / In-office',
    period: 'May 2026 – Jul 2026',
    highlights: [
      'Developed core frontend modules using React.js and TypeScript, improving UI responsiveness by 25%',
      'Built and deployed RESTful APIs with Node.js/Express and MongoDB, handling 1k+ daily requests',
      'Integrated third-party authentication (OAuth) and real-time data sync for internal dashboards',
      'Shipped 3 major features in 2 months in an agile startup environment',
    ],
  },
  {
    company: 'SmartBridge',
    role: 'Full Stack Developer Intern',
    type: 'Remote',
    period: '2025',
    highlights: [
      'Architected DocSpot, a full-stack health platform automating doctor-patient scheduling',
      'Engineered secure REST APIs with Node.js/Express (JWT, scheduling)',
      'Designed MongoDB schemas for transactional consistency',
      'Built reusable React components with clean state management',
    ],
  },
  {
    company: 'AICTE Virtual Internship (EduSkills)',
    role: 'AI Developer Intern',
    type: 'Remote',
    period: '2024',
    highlights: [
      'Built AI chatbot using Python and NLP (intent recognition, tokenization)',
      'Improved query resolution speed by 30%',
      'Prototyped AI customer support automation',
    ],
  },
];

function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
    >
      {/* Timeline Dot with pulse */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
          />
          <div className="w-4 h-4 rounded-full bg-primary border-4 border-background relative z-10" />
        </div>
      </div>

      {/* Content Card */}
      <div className={`md:w-1/2 pl-10 md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
        <motion.div
          className="glass-card p-6 group relative overflow-hidden"
          whileHover={{
            borderColor: 'rgba(229, 115, 153, 0.25)',
            y: -4,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {exp.company}
                </h3>
                <p className="text-primary font-medium text-sm">{exp.role}</p>
              </div>
              <motion.div
                className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Briefcase size={18} className="text-primary" />
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5 glass-card px-2 py-1">
                <Calendar size={12} className="text-primary" />
                {exp.period}
              </span>
              <span className="flex items-center gap-1.5 glass-card px-2 py-1">
                <MapPin size={12} className="text-primary" />
                {exp.type}
              </span>
            </div>

            <ul className="space-y-2.5">
              {exp.highlights.map((highlight, i) => (
                <motion.li
                  key={i}
                  className="text-sm text-muted-foreground flex items-start gap-2.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                >
                  <span className="w-2 h-2 rounded-full bg-primary/60 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(229,115,153,0.4)]" />
                  <span className="text-pretty">{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="hidden md:block md:w-1/2" />
    </motion.div>
  );
}

const ExperienceSection: React.FC = () => {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="relative z-10 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={headingRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">
            Work <span className="text-primary">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Professional journey across startups, internships, and impactful projects.
          </p>
        </motion.div>

        <div className="relative">
          {/* Animated Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px">
            <div className="w-full h-full bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary to-primary/60"
              initial={{ height: '0%' }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>

          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.company} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
