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

const PROJECTS_PER_PAGE = 8;

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
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-violet-400/50" />
              </div>
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
          
          {/* Industry filters - only show if we have multiple industries */}
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
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {paginatedProjects.map((project, index) => (
            <ClientProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Pagination - Only show if there are multiple pages */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {/* Previous button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700/50 bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page numbers */}
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

            {/* Next button */}
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

// ClientProjectCard component - Premium UI Design
const ClientProjectCard = ({ project, index }: { project: ClientProject, index: number }) => {
  return (
    <motion.div
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md transition-all duration-500 hover:border-violet-400/30 hover:bg-slate-900/60 hover:shadow-[0_20px_50px_-15px_rgba(79,70,229,0.3)]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden">
        {!project.image ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]"></div>
            <div className="relative flex flex-col items-center gap-2 p-4">
              <Globe className="h-8 w-8 text-slate-600" />
              <p className="text-xs text-slate-500 font-medium text-center">{project.client}</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90"></div>
          </>
        )}
        
        {/* Client Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 backdrop-blur-md">
          <Briefcase className="h-3 w-3 text-violet-400" />
          <span className="text-[10px] font-semibold text-slate-200 uppercase tracking-wider">{project.client}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col flex-grow p-5 pt-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2">
          {project.industry}
        </span>
        
        <h3 className="mb-2 text-base font-bold text-white transition-colors duration-300 group-hover:text-violet-300 line-clamp-1">
          {project.title}
        </h3>
        
        {project.description && (
          <p className="mb-4 text-xs text-slate-400 line-clamp-2 flex-grow">
            {project.description}
          </p>
        )}
        
        {project.tech.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map((tech: string, i) => (
              <span 
                key={i} 
                className="rounded-md border border-slate-700/50 bg-slate-800/50 px-2 py-1 text-[10px] font-medium text-slate-300 transition-colors duration-300 group-hover:border-violet-500/30"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="rounded-md border border-slate-700/50 bg-slate-800/50 px-2 py-1 text-[10px] font-medium text-slate-400">
                +{project.tech.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        {(project.live_url || project.case_study_url) && (
          <div className="flex items-center gap-2 mt-auto">
            {project.live_url && (
              <Link 
                href={project.live_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group/btn relative inline-flex items-center justify-center flex-1 overflow-hidden rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300 transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/20 hover:text-violet-200"
              >
                <Globe className="mr-2 h-3.5 w-3.5" />
                <span className="relative z-10">Live</span>
                <ArrowUpRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            )}
            {project.case_study_url && (
              <Link 
                href={project.case_study_url}
                className="inline-flex items-center justify-center flex-1 rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-300 transition-all duration-300 hover:border-slate-600 hover:bg-slate-700/50 hover:text-white"
              >
                Case Study
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};