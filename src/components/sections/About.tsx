"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface AboutSettings {
  title: string;
  description: string[];
  image_url: string;
}

const defaultSettings: AboutSettings = {
  title: 'Crafting Digital Experiences with Modern Web Technologies',
  description: [
    'Hello! I\'m [Your Name], a Full Stack Web Developer passionate about creating innovative digital solutions. With expertise in React, Next.js, Laravel, and Node.js, I specialize in building scalable and user-friendly web applications.',
    'My approach combines clean code practices with modern development tools to deliver high-quality solutions. I focus on creating seamless user experiences while ensuring robust and efficient server-side operations.',
    'When I\'m not coding, I\'m constantly exploring new technologies and best practices to stay at the forefront of web development. I believe in writing clean, maintainable code and creating applications that make a difference.'
  ],
  image_url: '/placeholder-profile.jpg' // Using a local placeholder to avoid hydration issues
};

const About = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [settings, setSettings] = useState<AboutSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      console.log('Fetching about settings...');
      const { data, error } = await supabase
        .from('about_settings')
        .select('*')
        .limit(1)
        .order('created_at', { ascending: true })
        .single();

      if (error) {
        console.error('Error fetching about settings:', error);
        throw error;
      }

      console.log('Fetched about settings:', data);
      
      if (data) {
        // Validate image URL
        let imageUrl = data.image_url;
        let isValidUrl = false;

        console.log('Raw image URL from database:', imageUrl);

        if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
          try {
            // Fix any incorrect URLs that might have double .com
            if (imageUrl.includes('i.ibb.co.com')) {
              imageUrl = imageUrl.replace('i.ibb.co.com', 'i.ibb.co');
            }
            new URL(imageUrl); // Check if it's a valid absolute URL
            isValidUrl = true;
            console.log('Database URL is valid:', imageUrl);
          } catch (_) {
            console.warn('Database URL is not a valid absolute URL:', imageUrl);
            isValidUrl = false;
          }
        }

        if (!isValidUrl) {
          console.log('Using default image URL because database URL is invalid or empty.');
          imageUrl = defaultSettings.image_url; 
        }
        
        setSettings({
          title: data.title || defaultSettings.title,
          description: data.description || defaultSettings.description,
          image_url: imageUrl // Use the validated or default URL
        });
        setImageError(null); // Reset error if validation succeeds or defaults are used
        
      } else {
        // Handle case where no data is returned at all
        console.log('No data found, using default settings entirely.');
        setSettings(defaultSettings);
        setImageError(null); // Assuming default image URL is valid
      }
    } catch (error) {
      console.error('Error in fetchSettings:', error);
      // Keep existing settings or default settings, but indicate loading failed
      setImageError('Failed to fetch settings'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchSettings();

    // Subscribe to changes
    const channel = supabase
      .channel('about_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'about_settings'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Don't render anything on server-side to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <section id="about" className="relative py-24 overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background with gradient mesh and particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Mesh gradient blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        </div>
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                             linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400">
            About Me
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/3] lg:aspect-auto lg:h-[540px]"
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
                {imageError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-400">
                    <p>Image not available</p>
                  </div>
                ) : (
                  <Image
                    src={settings.image_url}
                    alt="About Me"
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      console.error('Image failed to load:', settings.image_url);
                      setImageError('Failed to load image');
                    }}
                  />
                )}
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="prose prose-invert max-w-none">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  {settings.title}
                </h3>
                
                <div className="space-y-6 text-slate-300 text-lg">
                  {settings.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                  >
                    Let's Connect
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#works"
                    className="text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    View My Work
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 