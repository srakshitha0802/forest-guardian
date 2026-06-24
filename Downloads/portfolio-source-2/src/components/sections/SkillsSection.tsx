import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Wrench, Cpu, Megaphone } from 'lucide-react';

const skillCategories = [
  {
    icon: Code,
    title: 'Programming Languages',
    skills: [
      { name: 'JavaScript', level: 'Advanced' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'Python', level: 'Advanced' },
      { name: 'HTML5', level: 'Intermediate' },
      { name: 'CSS3', level: 'Intermediate' },
    ],
  },
  {
    icon: Wrench,
    title: 'Tools & Frameworks',
    skills: [
      { name: 'React.js', level: '' },
      { name: 'Next.js', level: '' },
      { name: 'Node.js', level: '' },
      { name: 'Express', level: '' },
      { name: 'Flask', level: '' },
      { name: 'Git & GitHub', level: '' },
      { name: 'npm', level: '' },
      { name: 'Postman', level: '' },
    ],
  },
  {
    icon: Cpu,
    title: 'Technologies',
    skills: [
      { name: 'MongoDB', level: '' },
      { name: 'PostgreSQL', level: '' },
      { name: 'Prisma ORM', level: '' },
      { name: 'Tailwind CSS', level: '' },
      { name: 'REST APIs', level: '' },
      { name: 'NLP (DistilBERT)', level: '' },
      { name: 'Scikit-learn', level: '' },
      { name: 'TensorFlow.js', level: '' },
      { name: 'SSR/SSG', level: '' },
      { name: 'Web Vitals', level: '' },
    ],
  },
  {
    icon: Megaphone,
    title: 'Others',
    skills: [
      { name: 'Public Speaking', level: '' },
      { name: 'Tech Writing', level: '' },
      { name: 'Event Organization', level: '' },
      { name: 'Problem Solving', level: '' },
    ],
  },
];

function SkillCard({ category, index }: { category: typeof skillCategories[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className="glass-card p-6 md:p-8 h-full group relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      whileHover={{
        borderColor: 'rgba(229, 115, 153, 0.3)',
        transition: { duration: 0.3 },
      }}
    >
      {/* Hover glow effect */}
      <div className="absolute -inset-px bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <category.icon size={22} className="text-primary" />
          </motion.div>
          <h3 className="font-heading text-xl font-semibold">{category.title}</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill, si) => (
            <motion.span
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.12 + si * 0.04 }}
              whileHover={{ scale: 1.08, y: -2 }}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm cursor-default transition-all duration-200 ${
                skill.level === 'Advanced'
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(229,115,153,0.15)]'
                  : skill.level === 'Intermediate'
                    ? 'bg-secondary text-secondary-foreground border border-border'
                    : 'bg-white/5 text-foreground border border-border/50 hover:border-primary/20'
              }`}
            >
              {skill.name}
              {skill.level && (
                <span className="ml-1.5 text-xs opacity-60">({skill.level})</span>
              )}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const SkillsSection: React.FC = () => {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="relative z-10 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">
            Skills & <span className="text-primary">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            A comprehensive toolkit spanning frontend, backend, AI/ML, and DevOps technologies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 card-grid">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
