import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, FileText, Mic, Award } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';

const researchData = {
  ieee: [
    { title: 'Pruning for Precision: Leveraging Feature Selection for Thyroid Diagnostic Models', venue: 'ICSSCNA 2026', type: 'Conference' },
    { title: 'Closing the Yield Gap: Computer Vision Pipeline for Banana Disease Detection', venue: 'ICAISS 2026', type: 'Conference' },
    { title: 'Caching-Aware Anycast Evaluation: DNS vs CDN Deployments', venue: 'MPCON 2026', type: 'Conference' },
    { title: 'Variational Autoencoder-Based Framework for Sepsis Detection in ICU', venue: 'ICCIDS 2026', type: 'Conference' },
    { title: 'AI-Enabled IoT Framework for Next-Hour Residential Load Forecasting', venue: 'SILCON 2025', type: 'Conference' },
    { title: 'Hybrid Learning Models for Early Cancer Gene Detection', venue: 'ICE2CPT 2025', type: 'Conference' },
  ],
  journals: [
    { title: 'Unlocking the Power of Machine Learning for Diabetes Prediction: A Comparative Evaluation', venue: 'Research Paper, 2026', publisher: 'Journal of Advancement in Parallel Computing', doi: '10.5281/zenodo.17275393', date: '06/10/2025' },
    { title: 'A New Dimension in Metaheuristics: A Survey of Quantum-Inspired Evolutionary Search', venue: 'Research Survey, 2026', publisher: 'Journal of Network Security and Data Mining', doi: '10.5281/zenodo.17367616', date: '16/10/2025' },
    { title: 'Smart Energy Forecasting: Harnessing Machine Learning for Consumption Prediction', venue: 'Research Paper, 2026', publisher: 'Advancement of Computer Technology and its Applications', doi: '10.5281/zenodo.17482704', date: '30/10/2025' },
    { title: 'Empowering Farmers: AI Solutions for Early Pomegranate Disease Detection', venue: 'Research Paper, 2026', publisher: 'Journal of Advance Research in Mobile Computing', doi: '10.5281/zenodo.17284996', date: '07/10/2025' },
    { title: 'Echoes in the Metaverse: Optimized Speech-NLP Models for Immersive Digital Twin Interaction', venue: 'Research Paper, 2026', publisher: 'Journal of Advancement in Parallel Computing', doi: '10.5281/zenodo.17275615', date: '06/10/2025' },
  ],
  presentations: [
    { title: 'CO2 Impact on Temperature', venue: 'E2A-2025, NIT Silchar', type: 'Oral Presentation' },
    { title: 'Inflation Forecasting with ML', venue: 'I-SMAC 2025, Nepal', type: 'Oral Presentation' },
  ],
};

const achievements = [
  { title: 'Future Founder – Ratan Tata Innovation Hub (RTIH)', detail: '' },
  { title: 'National Finalist – Smart India Hackathon', detail: 'Government of India initiative' },
  { title: 'National Finalist – Codex 3.0 Hackathon', detail: '' },
  { title: 'Winner – Idea Fusion Innovation Competition', detail: '50+ teams competed' },
  { title: 'Top 15 Finalist – IEEE Road Safety Innovation Challenge', detail: '' },
  { title: 'Multiple IEEE Publications During Undergraduate Studies', detail: '6 conference papers published' },
];

function ResearchCard({
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

const ResearchPage: React.FC = () => {
  return (
    <PageLayout
      title="Research & Publications"
      subtitle="Academic contributions spanning healthcare AI, computer vision, IoT forecasting, networking systems, and predictive analytics."
    >
      {/* Publications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* IEEE */}
        <ResearchCard icon={BookOpen} title="IEEE Publications" delay={0}>
          <div className="space-y-4">
            {researchData.ieee.map((item, i) => (
              <motion.div
                key={item.title}
                className="border-l-2 border-primary/30 pl-4 group/item hover:border-primary/60 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <p className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{item.venue}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{item.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </ResearchCard>

        {/* Journals */}
        <ResearchCard icon={FileText} title="Journal Publications" delay={0.1}>
          <div className="space-y-4">
            {researchData.journals.map((item, i) => (
              <motion.div
                key={item.title}
                className="border-l-2 border-primary/30 pl-4 group/item hover:border-primary/60 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
              >
                <p className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.publisher}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">DOI: {item.doi}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </ResearchCard>

        {/* Presentations */}
        <ResearchCard icon={Mic} title="Presentations" delay={0.2}>
          <div className="space-y-4">
            {researchData.presentations.map((item, i) => (
              <motion.div
                key={item.title}
                className="border-l-2 border-primary/30 pl-4 group/item hover:border-primary/60 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <p className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{item.venue}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{item.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </ResearchCard>
      </div>

      {/* Achievements */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3 text-balance">
          Achievements & <span className="text-primary">Recognitions</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {achievements.map((item, i) => (
          <motion.div
            key={item.title}
            className="glass-card p-5 flex items-start gap-3 group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ borderColor: 'rgba(229, 115, 153, 0.25)' }}
          >
            <Award size={18} className="text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              {item.detail && <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        className="glass-card p-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '6', label: 'IEEE Papers' },
            { value: '5', label: 'Journal Articles' },
            { value: '2', label: 'Presentations' },
            { value: '6', label: 'Achievements' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl md:text-4xl font-bold text-primary font-heading">{stat.value}</span>
              <span className="text-sm text-muted-foreground mt-1">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default ResearchPage;
