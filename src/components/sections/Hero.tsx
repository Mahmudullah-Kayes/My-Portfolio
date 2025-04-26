"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Status = 'available' | 'busy' | 'offline';

interface HeroSettings {
  status: Status;
  available_text: string;
  busy_text: string;
  offline_text: string;
}

const defaultTexts = {
  available: "I'm available for new projects",
  busy: "I'm really busy right now",
  offline: "I'm currently offline"
};

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [settings, setSettings] = useState<HeroSettings>({
    status: 'available',
    available_text: defaultTexts.available,
    busy_text: defaultTexts.busy,
    offline_text: defaultTexts.offline
  });

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_settings')
        .select('*')
        .limit(1)
        .order('created_at', { ascending: true })
        .single();

      if (error) throw error;
      if (data) {
        setSettings({
          status: data.status || 'available',
          available_text: data.available_text || defaultTexts.available,
          busy_text: data.busy_text || defaultTexts.busy,
          offline_text: data.offline_text || defaultTexts.offline
        });
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchSettings();

    // Subscribe to changes
    const channel = supabase
      .channel('hero_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hero_settings'
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

  if (!isMounted) {
    return null;
  }

  const getStatusIndicator = () => {
    const statusConfig = {
      available: {
        bgColor: 'bg-green-500',
        text: settings.available_text
      },
      busy: {
        bgColor: 'bg-orange-500',
        text: settings.busy_text
      },
      offline: {
        bgColor: 'bg-red-500',
        text: settings.offline_text
      }
    };

    const config = statusConfig[settings.status];
    
    return (
      <div className="inline-flex items-center rounded-full px-4 py-1 mb-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
        <span className={`inline-block w-2 h-2 rounded-full ${config.bgColor} mr-2 animate-pulse`}></span>
        <span className="text-sm font-medium text-slate-200">{config.text}</span>
      </div>
    );
  };

  return (
    <section id="home" className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 py-20 px-4 sm:px-6 lg:px-8">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-600 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left section - Text */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {getStatusIndicator()}
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              <span className="block">Hi, I'm Kayes</span>
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400">Web Developer</span>
            </h1>
            
            <p className="text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-8 text-slate-300">
              I create modern, responsive web applications with cutting-edge technologies. 
              Transforming ideas into exceptional digital experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-8">
              <Link href="#works" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md shadow-purple-900/20 transition-all duration-200 hover:shadow-lg hover:shadow-purple-900/30">
                View My Work
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
          
          {/* Right section - Animated Illustration */}
          <motion.div 
            className="flex-1 max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Animated coding illustration */}
              <div className="absolute inset-0 bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-2xl opacity-30"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full blur-2xl opacity-30"></div>
                
                {/* Window UI */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                {/* Code editor content */}
                <div className="absolute top-8 left-0 right-0 bottom-0 p-6 font-mono text-xs overflow-hidden">
                  <AnimatedCode />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll down indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-slate-400 rounded-full animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};

// Simplified Animated Code component
const AnimatedCode = () => {
  const [typedCode, setTypedCode] = useState("");
  
  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    
    const codeExample = `// Kayes - Full Stack Developer

const techStack = {
  frontend: ["React", "Next.js", "Tailwind CSS"],
  backend: ["Laravel", "Node.js", "Express", "PHP"],
  database: ["MySQL", "MongoDB", "PostgreSQL"],
  tools: ["Git", "VS Code"]
};

// Professional experience
const experience = {
  years: "4+",
  role: "Full Stack Developer",
  industries: ["E-commerce", "FinTech", "Education"]
};

// Professional strengths
const expertise = {
  design: "Modern UI/UX Design",
  code: "Clean Architecture",
  focus: "Performance Optimization",
  approach: "Mobile-First Responsive",
  passion: "Creating Intuitive Interfaces"
};`;
    
    const typeNextCharacter = () => {
      if (currentIndex < codeExample.length) {
        currentText += codeExample[currentIndex];
        setTypedCode(currentText);
        currentIndex++;
        
        // Type faster for spaces and punctuation
        const nextChar = codeExample[currentIndex];
        const delay = nextChar === ' ' || nextChar === ';' || nextChar === ',' ? 5 : 20;
        
        setTimeout(typeNextCharacter, delay);
      }
    };
    
    // Start typing after a small delay
    setTimeout(typeNextCharacter, 500);
    
    return () => {
      currentText = "";
      currentIndex = 0;
    };
  }, []);
  
  const formatCode = () => {
    // Split the code by lines
    const lines = typedCode.split('\n');
    
    return (
      <div>
        {lines.map((line, index) => {
          // Determine syntax highlighting
          let colorClass = 'text-slate-200';
          
          // Comments
          if (line.trim().startsWith('//')) {
            colorClass = 'text-emerald-400';
          } 
          // Headers/Titles
          else if (line.includes('Full Stack Developer')) {
            colorClass = 'text-fuchsia-400 font-semibold';
          }
          // Object keys and property names
          else if (line.match(/[a-zA-Z0-9]+:/)) {
            colorClass = 'text-sky-300';
          }
          // Variable declarations
          else if (line.includes('const ') || line.includes('let ') || line.includes('var ')) {
            colorClass = 'text-purple-400';
          }
          // Arrays
          else if (line.includes('[') && line.includes(']')) {
            colorClass = 'text-amber-300';
          }
          // Strings
          else if (line.includes('"') || line.includes("'")) {
            colorClass = 'text-orange-400';
          }
          // Objects opening/closing
          else if (line.includes('{') || line.includes('}')) {
            colorClass = 'text-pink-400';
          }
          
          return (
            <div key={index} className={`${colorClass} font-mono leading-tight mb-0.5 text-sm whitespace-pre`}>
              {line}
              {index === lines.length - 1 && (
                <span className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 animate-blink-fast align-text-top" />
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="relative h-full">
      <div className="relative font-mono tracking-tight">
        {formatCode()}
      </div>
    </div>
  );
};

export default Hero;