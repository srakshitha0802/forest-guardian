import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Layers, Play, ArrowRight } from 'lucide-react';

const projects = [
  {
    title: 'Moodverse',
    subtitle: 'AI Mental Health Platform',
    stack: ['React.js', 'Node.js', 'MongoDB', 'DistilBERT'],
    description: 'Full-stack sentiment analysis platform with DistilBERT NLP via REST APIs achieving 85% accuracy.',
    highlights: [
      'Interactive mood tracking dashboards',
      'Recognized by Ratan Tata Innovation Hub (RTIH)',
      'Real-time sentiment analysis pipeline',
    ],
    color: 'from-rose-500/20 to-pink-500/20',
    accent: '#E57399',
  },
  {
    title: 'AI Timetable Generator',
    subtitle: 'Automated Scheduling System',
    stack: ['React.js', 'Flask', 'Python', 'REST APIs'],
    description: 'Automated schedule generation system that reduced conflicts by 40% through intelligent algorithms.',
    highlights: [
      'PDF/Excel export functionality',
      'Dynamic editing and conflict resolution',
      'Multi-constraint optimization',
    ],
    color: 'from-purple-500/20 to-pink-500/20',
    accent: '#C084D1',
  },
  {
    title: 'Entresst-AI',
    subtitle: 'Career Recommendation Engine',
    stack: ['Next.js', 'TypeScript', 'TensorFlow.js'],
    description: 'Client-side ML inference for career recommendations reducing latency by 50%.',
    highlights: [
      'Optimized Core Web Vitals with SSR/SSG',
      'Client-side model inference',
      'Real-time recommendation scoring',
    ],
    color: 'from-pink-500/20 to-rose-400/20',
    accent: '#F5A0BC',
  },
  {
    title: 'MandiSense',
    subtitle: 'Agricultural Intelligence',
    stack: ['React.js', 'Node.js', 'MongoDB', 'Chart.js'],
    description: 'Real-time commodity price monitoring platform with mobile-first design for low-bandwidth environments.',
    highlights: [
      'Real-time price charts with Chart.js',
      'Mobile-first responsive design',
      'Low-bandwidth optimization',
    ],
    color: 'from-rose-400/20 to-pink-600/20',
    accent: '#D484A8',
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className="glass-card p-6 h-full cursor-pointer group relative overflow-hidden"
      initial={{ opacity: 0, y: 60, rotateX: 5 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      whileHover={{
        rotateX: 2,
        rotateY: -2,
        y: -6,
        transition: { duration: 0.3 },
      }}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${project.color}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Corner glow */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{ background: project.accent }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Layers size={20} className="text-primary" />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 15 }}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink size={18} />
          </motion.div>
        </div>

        <h3 className="font-heading text-xl font-semibold mb-1">{project.title}</h3>
        <p className="text-sm text-primary mb-3">{project.subtitle}</p>
        <p className="text-sm text-muted-foreground mb-4 text-pretty">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map((tech) => (
            <motion.span
              key={tech}
              whileHover={{ scale: 1.08, y: -1 }}
              className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-border/50 text-muted-foreground hover:border-primary/20 transition-colors cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </div>

        <ul className="space-y-2">
          {project.highlights.map((highlight, i) => (
            <motion.li
              key={i}
              className="text-xs text-muted-foreground flex items-start gap-2"
              initial={{ opacity: 0, x: -5 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1 shrink-0" />
              {highlight}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

const ProjectsSection: React.FC = () => {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });
  const videoRef = useRef(null);
  const isVideoInView = useInView(videoRef, { once: true, margin: '-80px' });

  return (
    <section id="projects" className="relative z-10 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={headingRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            A showcase of full-stack applications, AI integrations, and innovative solutions.
          </p>
        </motion.div>

        {/* Demo Video */}
        <motion.div
          ref={videoRef}
          className="glass-card p-2 md:p-4 mb-12 max-w-3xl mx-auto overflow-hidden group"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isVideoInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50">
            <video controls preload="metadata" className="w-full h-full">
              <source src="/portfolio.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Play size={14} className="text-primary ml-0.5" />
              </div>
              <span className="text-xs font-medium text-foreground bg-black/50 px-2 py-1 rounded">
                Portfolio Demo Reel
              </span>
            </div>
          </div>
        </motion.div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 card-grid mb-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* See More */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 glass-card px-6 py-3 text-sm font-medium hover:border-primary/30 transition-colors group"
          >
            See All Projects
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Workspace Gallery */}
        <motion.div
          className="glass-card p-6 md:p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary tracking-wider uppercase">
              Workspace
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              className="relative rounded-lg overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/desktop.jpg"
                alt="Pink themed desktop setup"
                className="w-full h-56 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-medium text-foreground">Development Station</span>
              </div>
            </motion.div>
            <motion.div
              className="relative rounded-lg overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/laptop.jpg"
                alt="Pink themed laptop workspace"
                className="w-full h-56 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-medium text-foreground">Creative Space</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
