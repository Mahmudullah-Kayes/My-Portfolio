'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

// Simple debounce function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Define special handling for logos that need custom filters
const technologies = [
  { name: 'React', logo: '/logos/react.svg' },
  { name: 'Next.js', logo: '/logos/nextjs.svg' },
  { name: 'Node.js', logo: '/logos/node-js-svgrepo-com.svg' },
  { name: 'JavaScript', logo: '/logos/javascript.svg' },
  { name: 'MongoDB', logo: '/logos/mongodb.svg' },
  { name: 'MySQL', logo: '/logos/mysql-logo-svgrepo-com.svg' },
  { name: 'PHP', logo: '/logos/php.svg' },
  { name: 'Laravel', logo: '/logos/laravel-svgrepo-com.svg' },
];

export default function TechStack() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Keep the same debounced callback reference for proper cleanup
    const debouncedCheckMobile = debounce(checkMobile, 200);
    window.addEventListener('resize', debouncedCheckMobile);

    return () => {
      window.removeEventListener('resize', debouncedCheckMobile);
    };
  }, []);

  useEffect(() => {
    if (!innerRef.current || !outerRef.current) return;

    // Create a true seamless infinite loop
    const setupAnimation = () => {
      const container = innerRef.current!;
      
      // Clear any existing content first
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      // Create original items
      technologies.forEach((tech, index) => {
        const div = document.createElement('div');
        div.className = 'tech-item flex items-center mx-4 sm:mx-8 group transition-all duration-300 hover:scale-110';
        
        div.innerHTML = `
          <div class="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] relative flex-shrink-0">
            <img 
              src="${tech.logo}" 
              alt="${tech.name}" 
              class="object-contain w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
            />
          </div>
          <span class="ml-3 text-sm sm:text-base text-gray-300 font-medium group-hover:text-teal-300 transition-colors duration-300 font-['Noto_Sans']">${tech.name}</span>
        `;
        container.appendChild(div);
      });
      
      // Duplicate all items 3 times to ensure we have enough for a seamless loop
      const originalItems = Array.from(container.children);
      for (let i = 0; i < 3; i++) {
        originalItems.forEach(item => {
          const clone = item.cloneNode(true);
          container.appendChild(clone);
        });
      }
      
      // Calculate the width of the original set of items
      const itemsWidth = technologies.length * (isMobile ? 150 : 180); // logo + text + margins
      
      // Set initial position
      gsap.set(container, { x: 0 });
      
      // Kill any existing animation
      if (animationRef.current) {
        animationRef.current.kill();
      }
      
      // Create the infinite loop animation with a special onComplete
      animationRef.current = gsap.timeline({ repeat: -1 });
      animationRef.current.to(container, {
        x: -itemsWidth,
        duration: isMobile ? 40 : 60, // Adjust speed based on device
        ease: "linear",
        onComplete: () => {
          gsap.set(container, { x: 0 });
        }
      });
      
      return animationRef.current;
    };
    
    // Initialize animation
    setupAnimation();
    
    // Handle resize
    const handleResize = debounce(() => {
      setupAnimation();
    }, 300);
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <section className="py-16 overflow-hidden bg-transparent relative">
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-['Noto_Sans'] bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">
            Technologies I Work With
          </h2>

          <p className="text-gray-300 text-center max-w-2xl mx-auto mb-12">
            I specialize in modern web technologies that enable creating fast, responsive, and user-friendly applications.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          ref={outerRef}
          className="relative overflow-hidden container mx-auto"
          style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
          }}
        >
          <div 
            ref={innerRef}
            className="flex items-center py-8"
            style={{ willChange: 'transform' }}
          >
            {/* Items will be created dynamically in useEffect */}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 