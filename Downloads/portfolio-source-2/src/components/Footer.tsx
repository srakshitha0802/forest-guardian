import React from 'react';
import { Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-border/30 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold">
              <span className="text-primary">S</span>Rakshitha
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-muted-foreground">
            <a
              href="mailto:srakshitha912@gmail.com"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail size={16} />
              srakshitha912@gmail.com
            </a>
            <a
              href="tel:+918639975744"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone size={16} />
              +91 86399 75744
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              Kurnool, India
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/srakshitha0802"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/rakshithasemala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/20 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Semala Rakshitha. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
