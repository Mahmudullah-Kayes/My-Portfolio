"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ContactModal from './ContactModal';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Client Work', href: '#client-projects' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#works' },
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Add shadow and background when scrolled
      setScrolled(window.scrollY > 20);

      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (section === 'home') {
            // For home section, check if we're at the top of the page
            return rect.top <= 100 && window.scrollY < window.innerHeight;
          }
          // For other sections
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu when clicking a link
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when opening contact modal
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 py-4 sm:px-6"
      >
        {/* Desktop Navigation */}
        <nav 
          className={`hidden md:flex ${
            scrolled
              ? 'bg-slate-900/60 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.95)] ring-1 ring-teal-300/15'
              : 'bg-slate-900/35 ring-1 ring-white/10'
          } relative overflow-hidden rounded-full border border-slate-200/10 backdrop-blur-xl transition-all duration-300 px-6 py-3`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(45,212,191,0.15),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(99,102,241,0.15),transparent_35%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    activeSection === item.href.substring(1)
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {activeSection === item.href.substring(1) && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-white/5" />
                  )}
                  {item.name}
                  {activeSection === item.href.substring(1) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={openContactModal}
                className="relative overflow-hidden rounded-full border border-teal-300/30 bg-gradient-to-r from-teal-400/90 to-indigo-600/90 px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:from-teal-400 hover:to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30"
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                Let's Talk
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden w-full max-w-sm">
          <div 
            className={`flex items-center justify-between ${
              scrolled
                ? 'bg-slate-900/70 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.95)] ring-1 ring-teal-300/15'
                : 'bg-slate-900/45 ring-1 ring-white/10'
            } relative overflow-hidden rounded-full border border-slate-200/10 backdrop-blur-xl transition-all duration-300 px-4 py-3`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.12),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(99,102,241,0.12),transparent_35%)]" />
            {/* Logo/Brand */}
            <div className="relative z-10 flex items-center">
              <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">Kayes</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="relative z-10 rounded-lg p-2 text-slate-300 transition-colors hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-4 right-4 top-full mt-2 overflow-hidden rounded-2xl border border-slate-200/10 bg-slate-900/85 shadow-xl shadow-slate-900/50 ring-1 ring-teal-300/10 backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`block px-6 py-3 text-base font-medium transition-colors border-l-4 ${
                          activeSection === item.href.substring(1)
                            ? 'border-teal-400 bg-slate-800/55 text-white'
                            : 'border-transparent text-slate-300 hover:border-slate-500 hover:bg-slate-800/35 hover:text-white'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Contact Button in Mobile Menu */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.1 }}
                    className="px-6 py-3"
                  >
                    <button
                      onClick={openContactModal}
                      className="w-full rounded-xl border border-teal-300/25 bg-gradient-to-r from-teal-400/90 to-indigo-600/90 px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:from-teal-400 hover:to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30"
                    >
                      Let's Talk
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default Navbar; 