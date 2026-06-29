"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  isLongImage: boolean;
  category: 'web' | 'app';
  tech: string[];
  live_url?: string;
  github_url?: string;
}

interface ProjectItem {
  id: number;
  title: string;
  description?: string;
  image?: string;
  is_long_image?: boolean;
  category?: string;
  tech?: string[];
  live_url?: string;
  github_url?: string;
  created_at: string;
  is_client_project: boolean;
}

const PROJECTS_PER_PAGE = 6;

const Works = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'web' | 'app'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        setError(null);
        
        // FIX: Cast to SupabaseClient here
        const { data, error } = await (supabase as SupabaseClient)
          .from('projects')
          .select('*')
          .eq('is_client_project', false)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedProjects: Project[] = (data || []).map((item: ProjectItem) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          image: item.image || '',
          isLongImage: item.is_long_image || false,
          category: (item.category as 'web' | 'app') || 'web',
          tech: item.tech || [],
          live_url: item.live_url || undefined,
          github_url: item.github_url || undefined
        }));
        
        setProjects(formattedProjects);
        setCurrentPage(1);
      } catch (err) {
        setError('Failed to load projects');
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIdx, startIdx + PROJECTS_PER_PAGE);

  if (error) return null;

  if (isLoading) {
    return (
      <section id="works" className="relative py-24 bg-transparent overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section id="works" className="relative py-24 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div 
            className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Globe className="w-4 h-4 mr-2 text-violet-400" />
            <span className="text-xs font-medium text-slate-300 tracking-wider uppercase">Personal Work</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My Personal Projects
          </motion.h2>

          <motion.p 
            className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore projects I've built to experiment with new technologies, solve interesting problems, and showcase my skills.
          </motion.p>
          
          {/* Filter Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2.5 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {['all', 'web', 'app'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat as 'all' | 'web' | 'app')}
                className={`px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium capitalize ${
                  activeCategory === cat
                    ? 'bg-white text-black shadow-lg' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat === 'all' ? 'All Projects' : `${cat}s`}
              </button>
            ))}
          </motion.div>
        </div>
        
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paginatedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex items-center justify-center w-9 h-9 rounded-lg font-medium transition-all duration-300 text-sm ${
                    currentPage === page
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// --- Premium Glassmorphism Card ---
const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  return (
    <motion.div
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-violet-400/30 hover:shadow-[0_8px_32px_rgba(139,92,246,0.15)]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {/* Glass edge top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent z-20" />
      {/* Ambient inner glow on hover */}
      <div className="pointer-events-none absolute -inset-px bg-gradient-to-b from-violet-500/0 via-violet-500/0 to-violet-500/0 group-hover:from-violet-500/5 group-hover:to-violet-500/0 transition-all duration-500 rounded-2xl" />

      {/* Strict 16:9 Image Ratio */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        {!project.image ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]">
            <Globe className="w-10 h-10 text-slate-700" />
          </div>
        ) : (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        )}
        
        {/* Deep gradient overlay for readability of tech pills */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Tech stack overlaid on image bottom - Always visible */}
        {project.tech.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
            {project.tech.slice(0, 3).map((tech: string, i) => (
              <span 
                key={i} 
                className="rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-medium text-slate-200"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-medium text-slate-200">
                +{project.tech.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Body - Clean and Minimal */}
      <div className="relative flex flex-col flex-grow p-5 pt-4 z-10">
        {/* Category Type */}
        <span className="text-[10px] font-semibold text-violet-400 tracking-widest uppercase mb-2 truncate">
          {project.category === 'web' ? 'Web App' : 'Application'}
        </span>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-4 tracking-tight leading-snug flex-grow transition-colors duration-300 group-hover:text-violet-300">
          {project.title}
        </h3>
        
        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-auto pt-4 border-t border-white/5">
          {project.github_url && (
            <Link
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-300"
              aria-label="View Source Code"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </Link>
          )}

          {project.live_url && (
            <Link
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="visit-btn-outer"
              aria-label="Visit Live Site"
            >
              <div className="visit-btn-inner">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1 -4 10 15.3 15.3 0 0 1 -4 -10 15.3 15.3 0 0 1 4 -10z"></path>
                </svg>
                <p>Visit Site</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Visit Button Styles ── */
const styles = `
.visit-btn-outer {
  width: 120px;
  height: 41px;
  border-radius: 13px;
  cursor: pointer;
  transition: 0.3s ease;
  background: linear-gradient(
    to bottom right,
    #2e8eff 0%,
    rgba(46, 142, 255, 0) 30%
  );
  background-color: rgba(46, 142, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.visit-btn-outer:hover,
.visit-btn-outer:focus {
  background-color: rgba(46, 142, 0.7);
  box-shadow: 0 0 10px rgba(46, 142, 255, 0.5);
  outline: none;
}

.visit-btn-inner {
  width: 116px;
  height: 37px;
  border-radius: 11px;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  font-family: inherit;
}

.visit-btn-inner svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #fff;
  flex-shrink: 0;
}
`;

if (typeof document !== 'undefined') {
  const existingId = 'visit-btn-styles';
  if (!document.getElementById(existingId)) {
    const tag = document.createElement('style');
    tag.id = existingId;
    tag.textContent = styles;
    document.head.appendChild(tag);
  }
}

export default Works;