import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden transition-colors duration-500">
      <Navbar />
      <main className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3 text-balance">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground max-w-2xl text-pretty">{subtitle}</p>
            )}
          </motion.div>
          {children}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default PageLayout;
