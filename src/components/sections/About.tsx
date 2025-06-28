"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Rocket, Zap, Globe, Heart, Coffee, GraduationCap, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface AboutSettings {
  title: string;
  description: string[];
  image_url: string;
}

interface HeroSettings {
  status: 'available' | 'busy' | 'offline';
  available_text: string;
  busy_text: string;
  offline_text: string;
}

const defaultSettings: AboutSettings = {
  title: 'Building Digital Universes, One Line at a Time',
  description: [
    'Hey there! I\'m Kayes, a passionate Full Stack Developer who believes code is poetry and every project is a new adventure in the digital cosmos.',
    'I specialize in crafting modern web applications that don\'t just work—they inspire. From sleek frontends that users love to robust backends that scale, I build digital experiences that matter.',
    'When I\'m not exploring new technologies or debugging at 3 AM (with coffee, obviously), you\'ll find me thinking about how to make the web a more beautiful and functional place.'
  ],
  image_url: '/placeholder-profile.jpg'
};

const About = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [settings, setSettings] = useState<AboutSettings>(defaultSettings);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    status: 'available',
    available_text: "Available for projects",
    busy_text: "Currently busy",
    offline_text: "Currently offline"
  });
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'education' | 'experience'>('education');

  const fetchSettings = async () => {
    try {
      // Fetch about settings
      const aboutResult = await supabase
        .from('about_settings')
        .select('*')
        .limit(1)
        .order('created_at', { ascending: true })
        .single();

      // Fetch hero settings for status
      const heroResult = await supabase
        .from('hero_settings')
        .select('*')
        .limit(1)
        .order('created_at', { ascending: true })
        .single();

      // Handle about settings
      if (aboutResult.error) {
        // Keep existing settings or default settings, but indicate loading failed
        setImageError('Failed to fetch settings'); 
      } else if (aboutResult.data) {
        const imageUrl = aboutResult.data.image_url;
        
        // Simple URL validation
        const isValidUrl = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
        
        if (isValidUrl) {
          // Valid URL from database
        } else {
          // Invalid or empty URL, use default
        }
        
        setSettings({
          title: aboutResult.data.title || defaultSettings.title,
          description: aboutResult.data.description || defaultSettings.description,
          image_url: imageUrl // Use the validated or default URL
        });
        setImageError(null); // Reset error if validation succeeds or defaults are used
      } else {
        // Handle case where no data is returned at all
        setSettings(defaultSettings);
        setImageError(null); // Assuming default image URL is valid
      }

      // Handle hero settings
      if (heroResult.error) {
        // Keep default settings
      } else if (heroResult.data) {
        setHeroSettings({
          status: heroResult.data.status || 'available',
          available_text: heroResult.data.available_text || "Available for projects",
          busy_text: heroResult.data.busy_text || "Currently busy",
          offline_text: heroResult.data.offline_text || "Currently offline"
        });
      }
    } catch (error) {
      // Keep existing settings or default settings, but indicate loading failed
      setImageError('Failed to fetch settings'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchSettings();
  }, []);

  // Don't render anything on server-side to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <section id="about" className="relative py-24 overflow-hidden bg-gradient-to-r from-[#1A2942] to-[#131F35]">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative py-24 overflow-hidden bg-[#0B0D17]">
      {/* Minimal background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Know More About Me
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Left Side - Profile (1/3) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="text-center lg:text-left">
                {/* Profile Image */}
                <div className="w-full max-w-sm h-80 mx-auto lg:mx-0 mb-8 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    {imageError ? (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Code2 className="w-12 h-12 mx-auto mb-3" />
                          <p className="text-lg font-semibold">Kayes</p>
                          <p className="text-sm opacity-70">Full Stack Developer</p>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={settings.image_url}
                        alt="Kayes - Full Stack Developer"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        priority
                        onError={() => setImageError('Failed to load image')}
                      />
                    )}
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="text-3xl font-bold text-white mb-2">Mahmudullah Kayes</h3>
                <p className="text-xl text-blue-400 mb-6">Full Stack Developer</p>
                
                {/* Status */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="relative mb-8"
                >
                  <div className={`inline-flex items-center gap-3 px-6 py-3 backdrop-blur-sm rounded-2xl shadow-lg transition-all duration-300 group ${
                    heroSettings.status === 'available' 
                      ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-600/5 to-emerald-500/10 border border-emerald-500/30 shadow-emerald-500/10 hover:shadow-emerald-500/20'
                      : heroSettings.status === 'busy'
                      ? 'bg-gradient-to-r from-orange-500/10 via-orange-600/5 to-orange-500/10 border border-orange-500/30 shadow-orange-500/10 hover:shadow-orange-500/20'
                      : 'bg-gradient-to-r from-red-500/10 via-red-600/5 to-red-500/10 border border-red-500/30 shadow-red-500/10 hover:shadow-red-500/20'
                  }`}>
                    {/* Animated pulse ring */}
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${
                        heroSettings.status === 'available' 
                          ? 'bg-emerald-400' 
                          : heroSettings.status === 'busy'
                          ? 'bg-orange-400'
                          : 'bg-red-400'
                      }`}></div>
                      <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-75 ${
                        heroSettings.status === 'available' 
                          ? 'bg-emerald-400' 
                          : heroSettings.status === 'busy'
                          ? 'bg-orange-400'
                          : 'bg-red-400'
                      }`}></div>
                    </div>
                    <span className={`text-sm font-semibold tracking-wide ${
                      heroSettings.status === 'available' 
                        ? 'text-emerald-400' 
                        : heroSettings.status === 'busy'
                        ? 'text-orange-400'
                        : 'text-red-400'
                    }`}>
                      {heroSettings.status === 'available' 
                        ? heroSettings.available_text
                        : heroSettings.status === 'busy'
                        ? heroSettings.busy_text
                        : heroSettings.offline_text
                      }
                    </span>
                    {/* Subtle glow effect */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      heroSettings.status === 'available' 
                        ? 'bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent'
                        : heroSettings.status === 'busy'
                        ? 'bg-gradient-to-r from-transparent via-orange-500/5 to-transparent'
                        : 'bg-gradient-to-r from-transparent via-red-500/5 to-transparent'
                    }`}></div>
                  </div>
                </motion.div>


              </div>
            </motion.div>

            {/* Right Side - Content (2/3) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="space-y-8">
                {/* Description */}
                <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                  {settings.description.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                {/* Education/Experience Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="pt-6"
                >
                  {/* Glass Effect Flip Toggle */}
                  <div className="relative mb-6">
                    <div className="relative bg-gradient-to-r from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 max-w-sm overflow-hidden shadow-2xl shadow-black/50">
                      {/* Glass Sliding Background */}
                      <div 
                        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] backdrop-blur-md border border-white/20 rounded-xl transition-all duration-500 ease-out shadow-2xl ${
                          activeTab === 'education' 
                            ? 'left-1.5 bg-gradient-to-br from-blue-500/30 via-blue-600/20 to-blue-700/30 shadow-blue-500/50' 
                            : 'left-[calc(50%+3px)] bg-gradient-to-br from-purple-500/30 via-purple-600/20 to-purple-700/30 shadow-purple-500/50'
                        }`}
                      />
                      
                      {/* Inner Glass Highlight */}
                      <div 
                        className={`absolute top-2 w-[calc(50%-8px)] h-1 rounded-full transition-all duration-500 ease-out ${
                          activeTab === 'education' 
                            ? 'left-2 bg-gradient-to-r from-transparent via-blue-300/60 to-transparent' 
                            : 'left-[calc(50%+2px)] bg-gradient-to-r from-transparent via-purple-300/60 to-transparent'
                        }`}
                      />
                      
                      {/* Flip Container */}
                      <div className="relative flex">
                        <button
                          onClick={() => setActiveTab('education')}
                          className={`relative flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-300 z-10 group ${
                            activeTab === 'education'
                              ? 'text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <GraduationCap className={`w-5 h-5 transition-all duration-300 ${
                            activeTab === 'education' 
                              ? 'scale-110 drop-shadow-lg' 
                              : 'group-hover:scale-105'
                          }`} />
                          <span className={`text-sm font-bold tracking-wide ${
                            activeTab === 'education' ? 'drop-shadow-lg' : ''
                          }`}>Education</span>
                        </button>
                        
                        <button
                          onClick={() => setActiveTab('experience')}
                          className={`relative flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-300 z-10 group ${
                            activeTab === 'experience'
                              ? 'text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Briefcase className={`w-5 h-5 transition-all duration-300 ${
                            activeTab === 'experience' 
                              ? 'scale-110 drop-shadow-lg' 
                              : 'group-hover:scale-105'
                          }`} />
                          <span className={`text-sm font-bold tracking-wide ${
                            activeTab === 'experience' ? 'drop-shadow-lg' : ''
                          }`}>Experience</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Flip Content Container */}
                  <div className="relative overflow-hidden">
                    <div className="space-y-3">
                      {activeTab === 'education' && (
                        <motion.div
                          key="education"
                          initial={{ opacity: 0, rotateY: 90 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          exit={{ opacity: 0, rotateY: -90 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="space-y-6"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <div className="border-l-2 border-blue-500/50 pl-4">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-lg font-semibold text-white mb-1">
                                  Bachelor's in Computer Science
                                </h4>
                                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-2">
                                  <GraduationCap className="w-4 h-4" />
                                  Northern University Bangladesh
                                  <span className="text-slate-500">•</span>
                                  <span className="text-slate-400">2025-2028</span>
                                </div>
                                <p className="text-slate-300 text-sm">
                                  Subject: Computer Science and Engineering
                                </p>
                              </div>
                              
                              <div className="h-px bg-gradient-to-r from-blue-500/30 to-transparent"></div>
                              
                              <div>
                                <h4 className="text-lg font-semibold text-white mb-1">
                                  Completed Diploma in Computer Science
                                </h4>
                                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-2">
                                <GraduationCap className="w-4 h-4" />
                                  Shyamoli Ideal Polytechnic Institute
                                  <span className="text-slate-500">•</span>
                                  <span className="text-slate-400">2020-2024</span>
                                </div>
                                <p className="text-slate-300 text-sm">
                                  Subject: Computer Science
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'experience' && (
                        <motion.div
                          key="experience"
                          initial={{ opacity: 0, rotateY: 90 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          exit={{ opacity: 0, rotateY: -90 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="space-y-6"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <div className="border-l-2 border-purple-500/50 pl-4">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-lg font-semibold text-white mb-1">
                                  Full Stack Developer
                                </h4>
                                <div className="flex items-center gap-2 text-purple-400 text-sm font-medium mb-2">
                                  <Briefcase className="w-4 h-4" />
                                  Atolyn
                                  <span className="text-slate-500">•</span>
                                  <span className="text-slate-400">2024-Present</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-blue-300 text-xs font-medium">Next.js</span>
                                  <span className="text-slate-500 leading-none">•</span>
                                  <span className="text-green-300 text-xs font-medium">Laravel</span>
                                  <span className="text-slate-500 leading-none">•</span>
                                  <span className="text-purple-300 text-xs font-medium">MySQL</span>
                                </div>
                              </div>
                              
                              <div className="h-px bg-gradient-to-r from-purple-500/30 to-transparent"></div>
                              
                              <div>
                                <h4 className="text-lg font-semibold text-white mb-1">
                                  Frontend Developer
                                </h4>
                                <div className="flex items-center gap-2 text-purple-400 text-sm font-medium mb-2">
                                  <Code2 className="w-4 h-4" />
                                  Freelancer
                                  <span className="text-slate-500">•</span>
                                  <span className="text-slate-400">2021-2023</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-red-300 text-xs font-medium">React</span>
                                  <span className="text-slate-500 leading-none">•</span>
                                  <span className="text-yellow-300 text-xs font-medium">Tailwind CSS</span>
                                  <span className="text-slate-500 leading-none">•</span>
                                  <span className="text-blue-300 text-xs font-medium">Bootstrap</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 