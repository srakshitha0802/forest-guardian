import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Layers, Play, Github } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';

const projects = [
  {
    title: 'Moodverse',
    subtitle: 'AI Mental Health Platform',
    stack: ['React.js', 'Node.js', 'MongoDB', 'DistilBERT'],
    description: 'Full-stack sentiment analysis platform with DistilBERT NLP via REST APIs achieving 85% accuracy. Built with a focus on real-time user experience and mental health monitoring.',
    highlights: [
      'Interactive mood tracking dashboards with data visualization',
      'Recognized by Ratan Tata Innovation Hub (RTIH) for innovation',
      'Real-time sentiment analysis pipeline with sub-second inference',
      'User-friendly interface designed for accessibility',
    ],
    color: 'from-rose-500/20 to-pink-500/20',
    accent: '#E57399',
    status: 'Completed',
  },
  {
    title: 'AI Timetable Generator',
    subtitle: 'Automated Scheduling System',
    stack: ['React.js', 'Flask', 'Python', 'REST APIs'],
    description: 'Automated schedule generation system that reduced conflicts by 40% through intelligent constraint-based algorithms. Designed for educational institutions.',
    highlights: [
      'PDF and Excel export functionality for generated schedules',
      'Dynamic editing interface with drag-and-drop support',
      'Multi-constraint optimization for faculty and room availability',
      'Conflict detection and resolution engine',
    ],
    color: 'from-purple-500/20 to-pink-500/20',
    accent: '#C084D1',
    status: 'Completed',
  },
  {
    title: 'Entresst-AI',
    subtitle: 'Career Recommendation Engine',
    stack: ['Next.js', 'TypeScript', 'TensorFlow.js'],
    description: 'Client-side ML inference for career recommendations reducing latency by 50%. Uses personality assessment and skill matching to suggest optimal career paths.',
    highlights: [
      'Optimized Core Web Vitals with SSR and SSG architecture',
      'Client-side TensorFlow.js model inference for privacy',
      'Real-time recommendation scoring with confidence intervals',
      'Progressive web app with offline support',
    ],
    color: 'from-pink-500/20 to-rose-400/20',
    accent: '#F5A0BC',
    status: 'Completed',
  },
  {
    title: 'MandiSense',
    subtitle: 'Agricultural Intelligence',
    stack: ['React.js', 'Node.js', 'MongoDB', 'Chart.js'],
    description: 'Real-time commodity price monitoring platform with mobile-first design for low-bandwidth environments. Helps farmers make data-driven selling decisions.',
    highlights: [
      'Real-time price charts with historical trend analysis',
      'Mobile-first responsive design for rural accessibility',
      'Low-bandwidth optimization with data caching',
      'Multi-market price comparison dashboard',
    ],
    color: 'from-rose-400/20 to-pink-600/20',
    accent: '#D484A8',
    status: 'In Progress',
  },
];

function ProjectDetailCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className="glass-card p-6 md:p-8 group relative overflow-hidden"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: 'easeOut' }}
    >
      <motion.div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${project.color}`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{ background: project.accent }}
      />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Layers size={20} className="text-primary" />
              </motion.div>
              <div>
                <h3 className="font-heading text-xl md:text-2xl font-semibold">{project.title}</h3>
                <p className="text-sm text-primary">{project.subtitle}</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              project.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'Completed' ? 'bg-success' : 'bg-warning'}`} />
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card p-2.5 flex items-center gap-2 text-xs font-medium hover:border-primary/30 transition-colors"
            >
              <Github size={14} />
              <span className="hidden md:inline">Source</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card p-2.5 flex items-center gap-2 text-xs font-medium hover:border-primary/30 transition-colors"
            >
              <ExternalLink size={14} />
              <span className="hidden md:inline">Live Demo</span>
            </motion.button>
          </div>
        </div>

        <p className="text-muted-foreground mb-5 text-pretty leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-3 py-1.5 rounded-md bg-white/5 border border-border/50 text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        <ul className="space-y-2.5">
          {project.highlights.map((highlight, i) => (
            <motion.li
              key={i}
              className="text-sm text-muted-foreground flex items-start gap-2"
              initial={{ opacity: 0, x: -5 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
              {highlight}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

const ProjectsPage: React.FC = () => {
  const videoRef = useRef(null);
  const isVideoInView = useInView(videoRef, { once: true, margin: '-80px' });

  return (
    <PageLayout
      title="Featured Projects"
      subtitle="A showcase of full-stack applications, AI integrations, and innovative solutions built with passion and precision."
    >
      {/* Demo Video */}
      <motion.div
        ref={videoRef}
        className="glass-card p-2 md:p-4 mb-12 overflow-hidden"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={isVideoInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7 }}
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
      <div className="grid grid-cols-1 gap-6 mb-16">
        {projects.map((project, index) => (
          <ProjectDetailCard key={project.title} project={project} index={index} />
        ))}
      </div>

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
    </PageLayout>
  );
};

export default ProjectsPage;
