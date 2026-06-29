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
            className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
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

// --- Minimalist Glassmorphism Card ---
const ClientProjectCard = ({ project, index }: { project: ClientProject, index: number }) => {
  return (
    <motion.div
      className="group flex flex-col h-full rounded-xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
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
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        )}
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Tech stack overlaid on image bottom - Always visible */}
        {project.tech.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
            {project.tech.slice(0, 3).map((tech: string, i) => (
              <span 
                key={i} 
                className="rounded-full border border-white/10 bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono font-medium text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content Body - Clean and Minimal */}
      <div className="relative flex flex-col flex-grow p-5 pt-4">
        {/* Client Name */}
        <span className="text-[10px] font-semibold text-violet-400 tracking-widest uppercase mb-2 truncate">
          {project.client}
        </span>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-4 tracking-tight leading-snug flex-grow transition-colors duration-300 group-hover:text-violet-300">
          {project.title}
        </h3>
        
        {/* Actions - Compact and clean */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
          {project.live_url && (
            <Link 
              href={project.live_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-white text-black text-[11px] font-bold transition-all duration-300 hover:bg-violet-500 hover:text-white"
            >
              <Globe className="mr-1.5 h-3 w-3" />
              Live Site
            </Link>
          )}
          
          {project.case_study_url && (
            <Link 
              href={project.case_study_url}
              className="inline-flex items-center px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-slate-300 text-[11px] font-semibold transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              Case Study
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};