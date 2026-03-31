"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, Facebook } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ContactSettings {
  email: string;
  social_links: {
    github: string;
    linkedin: string;
    whatsapp: string;
    twitter?: string;
    facebook: string;
  };
}

const defaultSettings: ContactSettings = {
  email: 'your.email@example.com',
  social_links: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    whatsapp: 'https://wa.me/yourwhatsappphonenumber',
    facebook: 'https://facebook.com/yourusername'
  }
};

export default function Footer() {
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings);

  const normalizeWhatsAppHref = (value?: string) => {
    if (!value) return '';
    const trimmed = value.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;

    const cleaned = trimmed.replace(/[^\d+]/g, '').replace(/^\+/, '');
    return cleaned ? `https://wa.me/${cleaned}` : '';
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_settings')
          .select('email, social_links')
          .limit(1)
          .order('created_at', { ascending: true })
          .single();

        if (error) throw error;

        if (data) {
          const links = (data.social_links || {}) as ContactSettings['social_links'];
          const legacyWhatsapp = links.whatsapp || links.twitter || '';

          setSettings({
            email: data.email || defaultSettings.email,
            social_links: {
              github: links.github || defaultSettings.social_links.github,
              linkedin: links.linkedin || defaultSettings.social_links.linkedin,
              whatsapp: normalizeWhatsAppHref(legacyWhatsapp) || defaultSettings.social_links.whatsapp,
              facebook: links.facebook || defaultSettings.social_links.facebook,
            },
          });
        }
      } catch (error) {
        // Silently handle error and use default settings
      }
    };

    fetchSettings();

    // Subscribe to changes
    const channel = (supabase.channel('contact_settings_changes') as any)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_settings'
        },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const socialLinks = [
    {
      name: 'GitHub',
      href: settings.social_links.github,
      icon: <Github className="w-5 h-5" />
    },
    {
      name: 'LinkedIn',
      href: settings.social_links.linkedin,
      icon: <Linkedin className="w-5 h-5" />
    },
    {
      name: 'WhatsApp',
      href: settings.social_links.whatsapp,
      icon: (
        <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.393L4 29l7.828-2.05C13.37 27.634 14.67 28 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.19 0-2.36-.207-3.47-.613l-.25-.09-4.65 1.217 1.24-4.53-.16-.24C7.23 18.13 6.5 16.6 6.5 15c0-5.238 4.262-9.5 9.5-9.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5zm5.13-6.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.18.05-.35-.02-.49-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.35-.26.28-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 5.02 4.22.7.24 1.25.38 1.68.48.71.15 1.36.13 1.87.08.57-.06 1.75-.72 2-1.41.25-.69.25-1.28.18-1.41-.07-.13-.25-.2-.53-.34z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      href: settings.social_links.facebook,
      icon: <Facebook className="w-5 h-5" />
    },
    {
      name: 'Email',
      href: `mailto:${settings.email}`,
      icon: <Mail className="w-5 h-5" />
    }
  ];

  return (
    <footer className="relative py-12 overflow-hidden border-t border-slate-800 bg-transparent">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Copyright and Links */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                <Link 
                  href="#home" 
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="#about" 
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="#works" 
                  className="hover:text-white transition-colors"
                >
                  Works
                </Link>
              </div>
              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} Kayes. All rights reserved.
              </p>
            </div>

            {/* Right side - Social Links */}
            <div className="flex justify-start md:justify-end gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 