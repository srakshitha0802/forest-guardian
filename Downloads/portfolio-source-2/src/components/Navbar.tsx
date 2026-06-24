import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const navItems = [
  { label: 'Home', href: '#hero', path: '/' },
  { label: 'Skills', href: '#skills', path: '/' },
  { label: 'Experience', href: '#experience', path: '/' },
  { label: 'Projects', href: '#projects', path: '/projects' },
  { label: 'Research', href: '#research', path: '/research' },
  { label: '3D Model', href: '#model', path: '/' },
  { label: 'Contact', href: '#contact', path: '/' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsMobileOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isPageNav = !isHome && item.path === '/';
    const isCurrentPage = location.pathname === item.path && item.path !== '/';

    // On sub-pages, home anchor links navigate back to home
    if (isPageNav) {
      return (
        <Link
          to="/"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
          onClick={() => setIsMobileOpen(false)}
        >
          {item.label}
        </Link>
      );
    }

    // Anchor links on home page
    if (item.path === '/') {
      return (
        <a
          href={item.href}
          onClick={(e) => handleAnchorClick(e, item.href)}
          className={`text-sm font-medium transition-colors duration-200 ${
            isCurrentPage ? 'text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          {item.label}
        </a>
      );
    }

    // Page links
    return (
      <Link
        to={item.path}
        className={`text-sm font-medium transition-colors duration-200 ${
          isCurrentPage ? 'text-primary' : 'text-muted-foreground hover:text-primary'
        }`}
        onClick={() => setIsMobileOpen(false)}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            to="/"
            onClick={() => setIsMobileOpen(false)}
            className="font-heading text-lg font-bold text-foreground tracking-tight"
          >
            <span className="text-primary">S</span>Rakshitha
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="glass-card p-2 flex items-center justify-center"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={18} className="text-primary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={18} className="text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Toggle + Theme */}
          <div className="flex items-center gap-2 md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 text-foreground"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <button
              className="text-foreground p-2"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink item={item} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
