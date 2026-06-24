import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Github, Linkedin, CheckCircle } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });
  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, margin: '-80px' });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <section id="contact" className="relative z-10 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={headingRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Open to collaborations, internships, and full-time opportunities in full-stack and AI development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            ref={formRef}
            className="md:col-span-2"
            initial={{ opacity: 0, x: -40 }}
            animate={isFormInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="glass-card p-6 h-full relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <h3 className="font-heading text-lg font-semibold mb-6">Contact Information</h3>

                <div className="space-y-5">
                  {[
                    { icon: Mail, label: 'Email', value: 'srakshitha912@gmail.com', href: 'mailto:srakshitha912@gmail.com' },
                    { icon: Phone, label: 'Phone', value: '+91 86399 75744', href: 'tel:+918639975744' },
                  ].map((item) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group/link"
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover/link:bg-primary/20 transition-colors">
                        <item.icon size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm text-foreground">{item.value}</p>
                      </div>
                    </motion.a>
                  ))}

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm text-foreground">Kurnool, Andhra Pradesh, India</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/30">
                  <p className="text-sm text-muted-foreground mb-4">Social Links</p>
                  <div className="flex items-center gap-3">
                    {[
                      { icon: Github, href: 'https://github.com/srakshitha0802', label: 'GitHub' },
                      { icon: Linkedin, href: 'https://linkedin.com/in/rakshithasemala', label: 'LinkedIn' },
                    ].map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                        aria-label={social.label}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <social.icon size={18} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, x: 40 }}
            animate={isFormInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="glass-card p-6 relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle size={48} className="text-primary mb-4" />
                    </motion.div>
                    <h3 className="font-heading text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground">
                      Thank you for reaching out. I will get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full bg-transparent border-b ${
                          errors.name ? 'border-red-400' : 'border-border/50'
                        } px-2 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors`}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-400 mt-1"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-transparent border-b ${
                          errors.email ? 'border-red-400' : 'border-border/50'
                        } px-2 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-400 mt-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full bg-transparent border-b ${
                          errors.message ? 'border-red-400' : 'border-border/50'
                        } px-2 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none`}
                        placeholder="Tell me about your project or opportunity..."
                      />
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-400 mt-1"
                        >
                          {errors.message}
                        </motion.p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(229, 115, 153, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <Send size={16} />
                      Send Message
                    </motion.button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
