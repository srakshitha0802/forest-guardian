import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, Download, BadgeCheck, Award, ExternalLink, Mic } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';

const journalCertificates = [
  {
    title: 'Optimized Feature Selection on Breast Cancer Prevention Identifier and Classification',
    publisher: 'Advancement of Computer Technology and its Applications',
    volume: '09',
    issue: '01',
    year: '2026',
    eissn: '2584-1262',
    doi: '10.5281/zenodo.17173678',
    date: '22/09/2025',
    pdf: '/6.png',
  },
  {
    title: 'Echoes in the Metaverse: Optimized Speech-NLP Models for Immersive Digital Twin Interaction',
    publisher: 'Journal of Advancement in Parallel Computing',
    volume: '09',
    issue: '01',
    year: '2026',
    eissn: '3048-5665',
    doi: '10.5281/zenodo.17275615',
    date: '06/10/2025',
    pdf: '/1.pdf',
  },
  {
    title: 'Smart Energy Forecasting: Harnessing Machine Learning for Consumption Prediction',
    publisher: 'Advancement of Computer Technology and its Applications',
    volume: '09',
    issue: '01',
    year: '2026',
    eissn: '2584-1262',
    doi: '10.5281/zenodo.17482704',
    date: '30/10/2025',
    pdf: '/2.pdf',
  },
  {
    title: 'Unlocking the Power of Machine Learning for Diabetes Prediction: A Comparative Evaluation',
    publisher: 'Research and Reviews: Advancement in Robotics',
    volume: '09',
    issue: '01',
    year: '2026',
    eissn: '3048-6416',
    doi: '10.5281/zenodo.17275393',
    date: '06/10/2025',
    pdf: '/3.pdf',
  },
  {
    title: 'Empowering Farmers: AI Solutions for Early Pomegranate Disease Detection',
    publisher: 'Journal of Advance Research in Mobile Computing',
    volume: '08',
    issue: '01',
    year: '2026',
    eissn: '3048-8893',
    doi: '10.5281/zenodo.17284996',
    date: '07/10/2025',
    pdf: '/4.pdf',
  },
  {
    title: 'A New Dimension in Metaheuristics: A Survey of Quantum-Inspired Evolutionary Search',
    publisher: 'Journal of Network Security and Data Mining',
    volume: '09',
    issue: '01',
    year: '2026',
    eissn: '3048-5169',
    doi: '10.5281/zenodo.17367616',
    date: '16/10/2025',
    pdf: '/5.pdf',
  },
];

const presentationCertificates = [
  {
    title: 'Forecasting and Interpreting Inflation Trends: A Machine Learning Framework for Consumer Price Index Analysis',
    venue: '9th International Conference on I-SMAC (IoT in Social, Mobile, Analytics and Cloud)',
    organizer: 'Tribhuvan University, Purwanchal Campus, Nepal',
    date: '8-10 October 2025',
    image: '/Presentation-1.png',
  },
  {
    title: 'Quantifying the Impact of Atmospheric CO2 on Global Temperature Anomalies: A Time-Series Analysis',
    venue: '5th International Conference on Emerging Electronics and Automation (E2A-2025)',
    organizer: 'National Institute of Technology Silchar, Assam, India',
    date: '17-19 December 2025',
    pdf: '/Presentation-2.pdf',
  },
];

const courseCertifications = [
  { name: 'Artificial Intelligence Fundamentals', issuer: 'IBM', year: '2025' },
  { name: 'Cybersecurity Fundamentals', issuer: 'IBM', year: '2025' },
  { name: 'Build AI Agents', issuer: 'IBM', year: '2025' },
  { name: 'MERN Stack Full Stack Development', issuer: 'SmartBridge', year: '2025' },
  { name: 'AI Virtual Internship', issuer: 'AICTE', year: '2025' },
  { name: 'Generative AI', issuer: 'GUVI', year: '2025' },
  { name: 'Digital Skills: Web Analytics', issuer: 'Accenture (FutureLearn)', year: '2024', score: '91%' },
  { name: 'Quantum Computing', issuer: 'Wiser', year: '2025' },
];

function CertificateCard({ cert, index }: { cert: (typeof journalCertificates)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="glass-card p-5 md:p-6 group relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ borderColor: 'rgba(229, 115, 153, 0.3)', y: -3 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-primary" />
            </div>
            <div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                Certificate of Publication
              </span>
              <p className="text-xs text-muted-foreground mt-1">{cert.publisher}</p>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-medium text-foreground mb-3 leading-relaxed text-pretty">
          {cert.title}
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-xs">
            <span className="text-muted-foreground">Volume:</span>{' '}
            <span className="text-foreground font-medium">{cert.volume}</span>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Issue:</span>{' '}
            <span className="text-foreground font-medium">{cert.issue}</span>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Year:</span>{' '}
            <span className="text-foreground font-medium">{cert.year}</span>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">e-ISSN:</span>{' '}
            <span className="text-foreground font-medium">{cert.eissn}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[10px] text-muted-foreground">DOI:</span>
          <a
            href={`https://doi.org/${cert.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-primary hover:underline flex items-center gap-1"
          >
            {cert.doi}
            <ExternalLink size={10} />
          </a>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <span className="text-xs text-muted-foreground">Published: {cert.date}</span>
          <motion.a
            href={cert.pdf}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium hover:border-primary/30 transition-colors"
          >
            <Download size={12} />
            View PDF
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

const CertificatesPage: React.FC = () => {
  return (
    <PageLayout
      title="Certificates & Publications"
      subtitle="Official certificates of publication and professional certifications validating academic contributions and technical expertise."
    >
      {/* Journal Publication Certificates */}
      <motion.div
        className="flex items-center gap-2 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Award size={18} className="text-primary" />
        <h2 className="font-heading text-xl font-semibold">Journal Publication Certificates</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {journalCertificates.map((cert, index) => (
          <CertificateCard key={cert.doi} cert={cert} index={index} />
        ))}
      </div>

      {/* Presentation Certificates */}
      <motion.div
        className="flex items-center gap-2 mb-6"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Mic size={18} className="text-primary" />
        <h2 className="font-heading text-xl font-semibold">Presentation Certificates</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {presentationCertificates.map((cert, i) => (
          <motion.div
            key={cert.title}
            className="glass-card p-5 md:p-6 group relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ borderColor: 'rgba(229, 115, 153, 0.3)' }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mic size={18} className="text-primary" />
                </div>
                <div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                    Certificate of Presentation
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-foreground mb-3 leading-relaxed text-pretty">
                {cert.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-1">{cert.venue}</p>
              <p className="text-xs text-muted-foreground mb-3">{cert.organizer}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <span className="text-xs text-muted-foreground">{cert.date}</span>
                {'image' in cert && cert.image ? (
                  <motion.a
                    href={cert.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-card px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium hover:border-primary/30 transition-colors"
                  >
                    <Download size={12} />
                    View Certificate
                  </motion.a>
                ) : (
                  <motion.a
                    href={cert.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-card px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium hover:border-primary/30 transition-colors"
                  >
                    <Download size={12} />
                    View PDF
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course Certifications */}
      <motion.div
        className="flex items-center gap-2 mb-6"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <BadgeCheck size={18} className="text-primary" />
        <h2 className="font-heading text-xl font-semibold">Professional Certifications</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {courseCertifications.map((cert, i) => (
          <motion.div
            key={cert.name}
            className="glass-card p-4 flex items-center gap-3 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ borderColor: 'rgba(229, 115, 153, 0.25)' }}
          >
            <BadgeCheck size={18} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{cert.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{cert.issuer}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{cert.year}</span>
                {'score' in cert && cert.score && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success">{cert.score}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
};

export default CertificatesPage;
