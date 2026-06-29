"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
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

  // Get unique industries for filter
  const industries = [...new Set(projects.map(p => p.industry))];
  
  // Filter projects by industry
  const filteredProjects = activeIndustry 
    ? projects.filter(p => p.industry === activeIndustry)
    : projects;

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIdx, startIdx + PROJECTS_PER_PAGE);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeIndustry]);

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <section id="client-projects" className="relative py-24 bg-transparent overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div 
              className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Briefcase className="w-4 h-4 mr-2 text-violet-400" />
              <span className="text-sm font-medium text-violet-300">Client Work</span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Projects I've Delivered for{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400">
                Clients
              </span>
            </motion.h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="client-projects" className="relative py-24 bg-transparent overflow-hidden">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent_70%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div 
            className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Briefcase className="w-4 h-4 mr-2 text-violet-400" />
            <span className="text-sm font-medium text-violet-300">Client Work</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Projects I've Delivered for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400">
              Clients
            </span>
          </motion.h2>
          
          {/* Industry filters */}
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
                className={`relative px-5 py-2 rounded-full overflow-hidden transition-all duration-300 text-sm ${
                  activeIndustry === null 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-violet-900/30 border border-indigo-500/50' 
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {activeIndustry === null && (
                  <span className="absolute inset-0 overflow-hidden">
                    <span className="absolute -inset-[100%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-glass-sweep"></span>
                  </span>
                )}
                <span className="relative z-10 font-medium">All Industries</span>
              </button>
              
              {industries.map(industry => (
                <button 
                  key={industry}
                  onClick={() => setActiveIndustry(industry)}
                  className={`relative px-5 py-2 rounded-full overflow-hidden transition-all duration-300 text-sm ${
                    activeIndustry === industry
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-violet-900/30 border border-indigo-500/50' 
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {activeIndustry === industry && (
                    <span className="absolute inset-0 overflow-hidden">
                      <span className="absolute -inset-[100%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-glass-sweep"></span>
                    </span>
                  )}
                  <span className="relative z-10 font-medium">{industry}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Projects grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paginatedProjects.map((project, index) => (
            <ClientProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Pagination - Only show if there are multiple pages */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700/50 bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-300 text-sm ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-violet-900/30 border border-indigo-500/50'
                      : 'bg-slate-900/50 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700/50 bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes glass-sweep {
          0% { transform: translateX(-100%); }
          20% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-glass-sweep {
          animation: glass-sweep 6s ease-out infinite;
        }
      `}</style>
    </section>
  );
}

// ClientProjectCard component - Immersive Premium Redesign
const ClientProjectCard = ({ project, index }: { project: ClientProject, index: number }) => {
  return (
    <motion.div
      className="group relative h-[440px] overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-2xl shadow-black/30 transition-all duration-500 hover:border-violet-500/40 hover:shadow-violet-900/20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-slate-800 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_60%)]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-slate-700" />
            </div>
          </div>
        )}
        {/* Gradient Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Floating Top Elements */}
      <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold text-violet-300 backdrop-blur-md uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse"></span>
          {project.industry}
        </span>
        
        {project.live_url && (
          <Link 
            href={project.live_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/90 backdrop-blur-md transition-all duration-300 hover:bg-violet-500 hover:border-violet-400 hover:rotate-45 hover:scale-110"
            aria-label="Visit live project"
          >
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        )}
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-3">
          <span className="text-sm font-medium text-cyan-400 mb-2 block">
            {project.client}
          </span>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">
            {project.title}
          </h3>
          
          {/* Hidden content that reveals on hover */}
          <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-48 group-hover:opacity-100 transition-all duration-500 ease-out">
            {project.description && (
              <p className="text-sm text-slate-300 mb-4 line-clamp-2 border-l-2 border-violet-500/50 pl-3">
                {project.description}
              </p>
            )}
            
            {project.tech.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech.slice(0, 4).map((tech: string, i) => (
                  <span 
                    key={i} 
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-slate-300 backdrop-blur-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {project.case_study_url && (
              <Link 
                href={project.case_study_url}
                className="inline-flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider"
              >
                Read Case Study
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};