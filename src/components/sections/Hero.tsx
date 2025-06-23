"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Github, Linkedin, Phone, Facebook, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ClientOnly from '@/components/ClientOnly';

type Status = 'available' | 'busy' | 'offline';

interface HeroSettings {
  status: Status;
  available_text: string;
  busy_text: string;
  offline_text: string;
}

interface ContactSettings {
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  social_links: {
    github: string;
    linkedin: string;
    twitter: string;
    facebook: string;
  };
}

const defaultTexts = {
  available: "I'm available for new projects",
  busy: "I'm really busy right now",
  offline: "I'm currently offline"
};

const defaultContactSettings: ContactSettings = {
  title: '',
  description: '',
  email: '',
  phone: '',
  location: '',
  social_links: {
    github: '',
    linkedin: '',
    twitter: '',
    facebook: ''
  }
};

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [settings, setSettings] = useState<HeroSettings>({
    status: 'available',
    available_text: defaultTexts.available,
    busy_text: defaultTexts.busy,
    offline_text: defaultTexts.offline
  });
  const [contactSettings, setContactSettings] = useState<ContactSettings>(defaultContactSettings);

  const fetchContactSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .limit(1)
        .order('created_at', { ascending: true })
        .single();

      if (error) throw error;

      if (data) {
        setContactSettings(data);
      }
    } catch (error) {
      // Silently handle error and use default settings
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchContactSettings();
  }, []);

  if (!isMounted) {
    return null;
  }

  const getStatusIndicator = () => {
    const statusConfig = {
      available: {
        bgColor: 'bg-emerald-400',
        text: settings.available_text,
        dotColor: 'bg-emerald-400',
        textColor: 'text-emerald-300'
      },
      busy: {
        bgColor: 'bg-amber-400',
        text: settings.busy_text,
        dotColor: 'bg-amber-400',
        textColor: 'text-amber-300'
      },
      offline: {
        bgColor: 'bg-red-400',
        text: settings.offline_text,
        dotColor: 'bg-red-400',
        textColor: 'text-red-300'
      }
    };

    return statusConfig[settings.status];
  };

  return (
    <section 
      id="home" 
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Animated Space Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-black to-black"></div>
        <div className="absolute inset-0">
          <ClientOnly>
            <StarField />
            <FloatingParticles isMounted={isMounted} />
            <CosmicDust isMounted={isMounted} />
            <SolarWind />
          </ClientOnly>
          <GlowOrbs />
          <SubtleNebula />
          <PlanetaryOrbs />
          <AuroraEffects />
          <GravitationalLensing />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
          
          {/* Main Content */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Professional Title */}
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-800/40 via-gray-900/60 to-gray-800/40 border border-gray-600/30 backdrop-blur-md shadow-2xl">
                <div className="relative">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                  <div className="absolute inset-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-ping opacity-20"></div>
                </div>
                <p className="text-gray-300 font-medium text-xs sm:text-sm tracking-wide">
                  Full Stack Developer
                </p>
              </div>
              
              {/* Name & Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-tight">
                Hi, I'm <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block sm:inline">Kayes</span>
              </h1>
              
              <h2 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-light text-gray-300 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                I build Full Stack Web Applications For Your Business
              </h2>
            </div>
            
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-row gap-3 sm:gap-6 w-full max-w-sm sm:max-w-none mx-auto justify-center">
            <a 
              href="#client-projects" 
              className="flex items-center justify-center px-4 sm:px-8 py-2.5 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl text-white font-medium hover:bg-white/20 hover:border-white/30 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base whitespace-nowrap"
            >
              View Work
            </a>
            
            <a 
              href={`https://wa.me/${contactSettings.phone.replace(/[^\d]/g, '')}?text=Hi%20Kayes,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-5 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-lg sm:rounded-xl text-white font-semibold text-sm sm:text-lg transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 border border-blue-400/30 overflow-hidden whitespace-nowrap"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-animation skew-x-12"></div>
              
              {/* Pulsing Glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl animate-pulse"></div>
              
              <span className="relative z-10 flex items-center justify-center font-bold tracking-wide">
                Hire Me
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
              </span>
              
              {/* Corner Highlights */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>
          
          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-4 sm:pt-6 opacity-80 px-4 sm:px-0">
            <span className="px-2 sm:px-3 py-1 text-xs font-medium text-gray-400 bg-gray-800/50 rounded-full border border-gray-700/50">
              React
            </span>
            <span className="px-2 sm:px-3 py-1 text-xs font-medium text-gray-400 bg-gray-800/50 rounded-full border border-gray-700/50">
              Next Js
            </span>
            <span className="px-2 sm:px-3 py-1 text-xs font-medium text-gray-400 bg-gray-800/50 rounded-full border border-gray-700/50">
              Tailwind CSS
            </span>
            <span className="px-2 sm:px-3 py-1 text-xs font-medium text-gray-400 bg-gray-800/50 rounded-full border border-gray-700/50">
              Laravel
            </span>
          </div>
          
          {/* Social Links */}
          <div className="pt-6 sm:pt-10">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
                <span className="text-sm font-medium text-gray-400 px-4">Connect with me</span>
                <div className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-8">
                <SocialLink 
                  href={`mailto:${contactSettings.email}`} 
                  icon={<Mail size={24} />} 
                  label="Email"
                  color="hover:text-purple-400"
                />
                <SocialLink 
                  href={contactSettings.social_links.github} 
                  icon={<Github size={24} />} 
                  label="GitHub"
                  color="hover:text-gray-300"
                />
                <SocialLink 
                  href={contactSettings.social_links.linkedin} 
                  icon={<Linkedin size={24} />} 
                  label="LinkedIn"
                  color="hover:text-blue-400"
                />
                <SocialLink 
                  href={contactSettings.social_links.twitter} 
                  icon={<Phone size={24} />} 
                  label="WhatsApp"
                  color="hover:text-green-400"
                />
                <SocialLink 
                  href={contactSettings.social_links.facebook} 
                  icon={<Facebook size={24} />} 
                  label="Facebook"
                  color="hover:text-blue-500"
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(12deg);
          }
          100% {
            transform: translateX(100%) skewX(12deg);
          }
        }

        .shimmer-animation {
          animation: shimmer 3s ease-in-out infinite;
          animation-delay: 1s;
        }

        @keyframes gentleTwinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.2); 
          }
        }

        @keyframes floatUp {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }

        @keyframes gentleGlow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }

        @keyframes subtleWave {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 0.05;
          }
          33% {
            transform: translateX(30px) translateY(-20px) rotate(120deg);
            opacity: 0.1;
          }
          66% {
            transform: translateX(-20px) translateY(30px) rotate(240deg);
            opacity: 0.08;
          }
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: gentleTwinkle 4s ease-in-out infinite;
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          animation: floatUp 15s linear infinite;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(20px);
          animation: gentleGlow 8s ease-in-out infinite;
        }

        .nebula-subtle {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation: subtleWave 25s ease-in-out infinite;
        }



        @keyframes cosmicFloat {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translateX(20px) translateY(-15px) rotate(90deg);
            opacity: 0.4;
          }
          50% {
            transform: translateX(40px) translateY(10px) rotate(180deg);
            opacity: 0.6;
          }
          75% {
            transform: translateX(10px) translateY(25px) rotate(270deg);
            opacity: 0.3;
          }
        }

        @keyframes planetRotate {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 0.1;
          }
        }

        @keyframes auroraFlow {
          0%, 100% {
            transform: translateX(-50%) translateY(0) skewX(0deg);
            opacity: 0.05;
          }
          33% {
            transform: translateX(-40%) translateY(-20px) skewX(5deg);
            opacity: 0.15;
          }
          66% {
            transform: translateX(-60%) translateY(-10px) skewX(-5deg);
            opacity: 0.1;
          }
        }

        @keyframes starCluster {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1) rotate(180deg);
          }
        }

        @keyframes solarWindFlow {
          0% {
            transform: translateX(-100px) translateY(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(calc(100vw + 100px)) translateY(-20px);
            opacity: 0;
          }
        }

        @keyframes gravitationalBend {
          0%, 100% {
            transform: scaleX(1) scaleY(1);
            opacity: 0.3;
          }
          50% {
            transform: scaleX(1.3) scaleY(0.7);
            opacity: 0.7;
          }
        }





        .cosmic-dust {
          position: absolute;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: cosmicFloat 20s ease-in-out infinite;
        }

        .planetary-orb {
          position: absolute;
          border-radius: 50%;
          animation: planetRotate 45s linear infinite;
        }

        .aurora {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: auroraFlow 15s ease-in-out infinite;
        }

        .star-cluster {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
          animation: starCluster 6s ease-in-out infinite;
        }

        .solar-wind-particle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 200, 100, 0.6) 20%, 
            rgba(255, 150, 50, 0.8) 50%, 
            rgba(255, 100, 0, 0.4) 80%, 
            transparent 100%
          );
          animation: solarWindFlow 8s linear infinite;
          filter: blur(1px);
        }

        .gravitational-lens {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.1);
          background: radial-gradient(ellipse at center, 
            transparent 30%, 
            rgba(200, 220, 255, 0.1) 40%, 
            transparent 60%
          );
          animation: gravitationalBend 15s ease-in-out infinite;
          filter: blur(2px);
        }


      `}</style>
    </section>
  );
};



// Enhanced Social Link
interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const SocialLink = ({ href, icon, label, color }: SocialLinkProps) => {
  return (
    <div className="group relative">
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800/30 border border-gray-700/50 text-gray-500 hover:scale-110 hover:border-gray-600/70 transition-all duration-300 backdrop-blur-sm ${color}`}
        aria-label={label}
      >
        {icon}
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </a>
      
      {/* Enhanced tooltip - hidden on mobile */}
      <div className="hidden sm:block absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <div className="bg-gray-900/90 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-700/50 backdrop-blur-sm whitespace-nowrap">
          {label}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/90 border-b border-r border-gray-700/50 rotate-45"></div>
        </div>
      </div>
    </div>
  );
};



// Enhanced Star Field with clusters and varying brightness
const StarField = () => {
  const stars = Array.from({ length: 120 }, (_, i) => {
    const size = Math.random() * 2 + 0.3;
    const brightness = Math.random() * 0.8 + 0.2;
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      brightness,
      delay: Math.random() * 6
    };
  });

  // Create star clusters
  const clusters = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 6
  }));

  return (
    <div className="absolute inset-0 z-10">
      {/* Individual stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.brightness,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
      {/* Star clusters */}
      {clusters.map(cluster => (
        <div
          key={`cluster-${cluster.id}`}
          className="star-cluster"
          style={{
            left: `${cluster.x}%`,
            top: `${cluster.y}%`,
            width: `${cluster.size}px`,
            height: `${cluster.size}px`,
            animationDelay: `${cluster.delay}s`
          }}
        />
      ))}
    </div>
  );
};

// Floating particles that drift upward
const FloatingParticles = ({ isMounted }: { isMounted: boolean }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    size: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Only generate random particles on the client side
    const generatedParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 15,
      duration: 12 + Math.random() * 8
    }));
    setParticles(generatedParticles);
  }, []);

  // Don't render anything during SSR
  if (!isMounted || particles.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-5">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// Soft glowing orbs for ambient lighting
const GlowOrbs = () => {
  const orbs = [
    {
      id: 1,
      x: 20,
      y: 15,
      size: 120,
      color: 'rgba(59, 130, 246, 0.15)',
      delay: 0,
      duration: 8
    },
    {
      id: 2,
      x: 80,
      y: 75,
      size: 100,
      color: 'rgba(147, 51, 234, 0.12)',
      delay: 3,
      duration: 10
    },
    {
      id: 3,
      x: 10,
      y: 80,
      size: 90,
      color: 'rgba(6, 182, 212, 0.1)',
      delay: 6,
      duration: 9
    }
  ];

  return (
    <div className="absolute inset-0 z-1">
      {orbs.map(orb => (
        <div
          key={orb.id}
          className="glow-orb"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: orb.color,
            animationDelay: `${orb.delay}s`,
            animationDuration: `${orb.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// Enhanced nebula effect with more colors
const SubtleNebula = () => {
  const nebulae = [
    {
      id: 1,
      x: 30,
      y: 25,
      size: 200,
      color: 'rgba(59, 130, 246, 0.04)',
      delay: 0,
      duration: 25
    },
    {
      id: 2,
      x: 70,
      y: 60,
      size: 180,
      color: 'rgba(147, 51, 234, 0.035)',
      delay: 8,
      duration: 30
    },
    {
      id: 3,
      x: 15,
      y: 75,
      size: 150,
      color: 'rgba(6, 182, 212, 0.03)',
      delay: 15,
      duration: 35
    }
  ];

  return (
    <div className="absolute inset-0 z-0">
      {nebulae.map(nebula => (
        <div
          key={nebula.id}
          className="nebula-subtle"
          style={{
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            width: `${nebula.size}px`,
            height: `${nebula.size}px`,
            background: nebula.color,
            animationDelay: `${nebula.delay}s`,
            animationDuration: `${nebula.duration}s`
          }}
        />
      ))}
    </div>
  );
};



// Cosmic dust particles for atmosphere
const CosmicDust = ({ isMounted }: { isMounted: boolean }) => {
  const [dustParticles, setDustParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Only generate random particles on the client side
    const generatedDust = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 10
    }));
    setDustParticles(generatedDust);
  }, []);

  // Don't render anything during SSR
  if (!isMounted || dustParticles.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-2">
      {dustParticles.map(dust => (
        <div
          key={dust.id}
          className="cosmic-dust"
          style={{
            left: `${dust.x}%`,
            top: `${dust.y}%`,
            width: `${dust.size}px`,
            height: `${dust.size}px`,
            animationDelay: `${dust.delay}s`,
            animationDuration: `${dust.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// Planetary orbs in the distance
const PlanetaryOrbs = () => {
  const planets = [
    {
      id: 1,
      x: 5,
      y: 20,
      size: 40,
      color: 'radial-gradient(circle at 30% 30%, rgba(255, 100, 100, 0.15), rgba(150, 50, 150, 0.08))',
      delay: 0,
      duration: 60
    },
    {
      id: 2,
      x: 90,
      y: 80,
      size: 25,
      color: 'radial-gradient(circle at 30% 30%, rgba(100, 150, 255, 0.12), rgba(50, 100, 200, 0.06))',
      delay: 20,
      duration: 80
    },
    {
      id: 3,
      x: 85,
      y: 15,
      size: 15,
      color: 'radial-gradient(circle at 30% 30%, rgba(150, 255, 150, 0.1), rgba(100, 200, 100, 0.05))',
      delay: 40,
      duration: 50
    }
  ];

  return (
    <div className="absolute inset-0 z-1">
      {planets.map(planet => (
        <div
          key={planet.id}
          className="planetary-orb"
          style={{
            left: `${planet.x}%`,
            top: `${planet.y}%`,
            width: `${planet.size}px`,
            height: `${planet.size}px`,
            background: planet.color,
            animationDelay: `${planet.delay}s`,
            animationDuration: `${planet.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// Aurora-like effects for ambiance
const AuroraEffects = () => {
  const auroras = [
    {
      id: 1,
      x: 20,
      y: 10,
      width: 300,
      height: 100,
      color: 'linear-gradient(45deg, rgba(0, 255, 150, 0.08), rgba(100, 200, 255, 0.05))',
      delay: 0,
      duration: 18
    },
    {
      id: 2,
      x: 60,
      y: 70,
      width: 250,
      height: 80,
      color: 'linear-gradient(-45deg, rgba(255, 100, 200, 0.06), rgba(150, 100, 255, 0.04))',
      delay: 9,
      duration: 22
    }
  ];

  return (
    <div className="absolute inset-0 z-0">
      {auroras.map(aurora => (
        <div
          key={aurora.id}
          className="aurora"
          style={{
            left: `${aurora.x}%`,
            top: `${aurora.y}%`,
            width: `${aurora.width}px`,
            height: `${aurora.height}px`,
            background: aurora.color,
            animationDelay: `${aurora.delay}s`,
            animationDuration: `${aurora.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// Solar wind - charged particles from the sun
const SolarWind = () => {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    y: Math.random() * 80 + 10,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 8
  }));

  return (
    <div className="absolute inset-0 z-8">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="solar-wind-particle"
          style={{
            top: `${particle.y}%`,
            left: '-100px',
            width: `${particle.size * 30}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

// Gravitational lensing - bending of spacetime
const GravitationalLensing = () => {
  const lenses = [
    {
      id: 1,
      x: 30,
      y: 40,
      size: 80,
      delay: 0
    },
    {
      id: 2,
      x: 70,
      y: 60,
      size: 60,
      delay: 5
    }
  ];

  return (
    <div className="absolute inset-0 z-5">
      {lenses.map(lens => (
        <div
          key={lens.id}
          className="gravitational-lens"
          style={{
            left: `${lens.x}%`,
            top: `${lens.y}%`,
            width: `${lens.size}px`,
            height: `${lens.size}px`,
            animationDelay: `${lens.delay}s`
          }}
        />
      ))}
    </div>
  );
};



export default Hero;