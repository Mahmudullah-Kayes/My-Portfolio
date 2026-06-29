"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Briefcase, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

interface ClientProject {
  id: number;
  title: string;
  description: string;
  client: string;
  industry: string;
  image: string;
  tech: string[];
  live_url?: string;
  case_study_url?: string;
}

interface ProjectItem {
  id: number;
  title: string;
  description?: string;
  client?: string;
  industry?: string;
  image?: string;
  tech?: string[];
  live_url?: string;
  case_study_url?: string;
  created_at: string;
  is_client_project: boolean;
}

const PROJECTS_PER_PAGE = 6;

export default function ClientProjects() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchClientProjects() {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await (supabase as SupabaseClient)
          .from('projects')
          .select('*')
          .eq('is_client_project', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedProjects: ClientProject[] = data.map((item: ProjectItem) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          client: item.client || 'Confidential Client',
          industry: item.industry || 'Technology',
          image: item.image || '',
          tech: item.tech || [],
          live_url: item.live_url || '',
          case_study_url: item.case_study_url || undefined
        }));
        
        setProjects(formattedProjects);
        setCurrentPage(1);
      } catch (err) {
        setError('Failed to load client projects');
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchClientProjects();
  }, []);

  const industries = [...new Set(projects.map(p => p.industry))];
  const filteredProjects = activeIndustry 
    ? projects.filter(p => p.industry === activeIndustry)
    : projects;

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIdx, startIdx + PROJECTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeIndustry]);

  if (error) return null;

  if (isLoading) {
    return (
      <section id="client-projects" className="relative py-24 bg-transparent overflow-hidden">
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
    <section id="client-projects" className="relative py-24 bg-transparent overflow-hidden">
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
            <Briefcase className="w-4 h-4 mr-2 text-violet-400" />
            <span className="text-xs font-medium text-slate-300 tracking-wider uppercase">Client Work</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Projects I've Delivered for Clients
          </motion.h2>
          
          {industries.length > 1 && (
            <motion.div 
              className="flex flex-wrap justify-center gap-2.5 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button 
                onClick={() => setActiveIndustry(null)}
                className={`px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                  activeIndustry === null 
                    ? 'bg-white text-black shadow-lg' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                }`}
              >
                All
              </button>
              
              {industries.map(industry => (
                <button 
                  key={industry}
                  onClick={() => setActiveIndustry(industry)}
                  className={`px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                    activeIndustry === industry
                      ? 'bg-white text-black shadow-lg' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paginatedProjects.map((project, index) => (
            <ClientProjectCard key={project.id} project={project} index={index} />
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
}

// --- Premium Glassmorphism Card ---
const ClientProjectCard = ({ project, index }: { project: ClientProject, index: number }) => {
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
          </div>
        )}
      </div>

      {/* Content Body - Clean and Minimal */}
      <div className="relative flex flex-col flex-grow p-5 pt-4 z-10">
        {/* Client Name */}
        <span className="text-[10px] font-semibold text-violet-400 tracking-widest uppercase mb-2 truncate">
          {project.client}
        </span>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-4 tracking-tight leading-snug flex-grow transition-colors duration-300 group-hover:text-violet-300">
          {project.title}
        </h3>
        
        {/* Actions */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          {project.live_url && (
            <Link
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="login-btn-outer"
              aria-label="View Live Site"
            >
              <div className="login-btn-inner">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g data-name="Layer 2" id="Layer_2">
                    <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z" />
                  </g>
                </svg>
                <p>Live</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Login Button Styles ── */
const styles = `
.login-btn-outer {
  width: 125px;
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

.login-btn-outer:hover,
.login-btn-outer:focus {
  background-color: rgba(46, 142, 255, 0.7);
  box-shadow: 0 0 10px rgba(46, 142, 255, 0.5);
  outline: none;
}

.login-btn-inner {
  width: 121px;
  height: 37px;
  border-radius: 11px;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  font-weight: 600;
  font-size: 12.5px;
  font-family: inherit;
}

.login-btn-icon {
  width: 20px;
  height: 20px;
  fill: #fff;
  stroke: #fff;
  flex-shrink: 0;
}
`;