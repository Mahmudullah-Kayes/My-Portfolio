"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import Image from 'next/image';

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
        setCurrentPage(1); // Reset to first page
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
      <section id="client-projects" className="py-24 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div 
              className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-violet-900/30 border border-violet-700/30"
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Briefcase className="w-4 h-4 mr-2 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">Client Work</span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 1, y: 20 }}
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
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="client-projects" className="py-24 bg-transparent">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div 
            className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-violet-900/30 border border-violet-700/30"
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Briefcase className="w-4 h-4 mr-2 text-violet-400" />
            <span className="text-sm font-medium text-violet-400">Client Work</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 1, y: 20 }}
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
              className="flex flex-wrap justify-center gap-3 mb-12"
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button 
                onClick={() => setActiveIndustry(null)}
                className={`relative px-6 py-2 rounded-full overflow-hidden transition-all duration-300 ${
                  activeIndustry === null 
                    ? 'bg-gradient-to-r from-indigo-800 to-violet-900 text-white shadow-lg shadow-violet-900/20 border border-indigo-700/50' 
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {activeIndustry === null && (
                  <span className="absolute inset-0 overflow-hidden">
                    <span className="absolute -inset-[100%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-glass-sweep"></span>
                  </span>
                )}
                <span className={`relative z-10 font-medium ${activeIndustry === null ? 'text-cyan-50' : ''}`}>All Industries</span>
              </button>
              
              {industries.map(industry => (
                <button 
                  key={industry}
                  onClick={() => setActiveIndustry(industry)}
                  className={`relative px-6 py-2 rounded-full overflow-hidden transition-all duration-300 ${
                    activeIndustry === industry
                      ? 'bg-gradient-to-r from-indigo-800 to-violet-900 text-white shadow-lg shadow-violet-900/20 border border-indigo-700/50' 
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {activeIndustry === industry && (
                    <span className="absolute inset-0 overflow-hidden">
                      <span className="absolute -inset-[100%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-glass-sweep"></span>
                    </span>
                  )}
                  <span className={`relative z-10 font-medium ${activeIndustry === industry ? 'text-cyan-50' : ''}`}>{industry}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
              className="p-2 rounded-lg border border-slate-700/50 bg-slate-900/50 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>

            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-indigo-800 to-violet-900 text-white shadow-lg shadow-violet-900/20 border border-indigo-700/50'
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
              className="p-2 rounded-lg border border-slate-700/50 bg-slate-900/50 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        )}
      </div>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes glass-sweep {
          0% {
            transform: translateX(-100%);
          }
          20% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-glass-sweep {
          animation: glass-sweep 6s ease-out infinite;
        }
      `}</style>
    </section>
  );
}

// ClientProjectCard component - Simplified without modal
const ClientProjectCard = ({ project, index }: { project: ClientProject, index: number }) => {
  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/10 bg-slate-900/35 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] ring-1 ring-teal-300/10 backdrop-blur-md transition-all duration-300 hover:border-teal-300/25 hover:shadow-[0_26px_60px_-30px_rgba(20,184,166,0.28)]"
      initial={{ opacity: 1, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(45,212,191,0.14),transparent_35%),radial-gradient(circle_at_90%_85%,rgba(99,102,241,0.14),transparent_40%)] opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      {/* Project image - 16:9 aspect ratio with Next.js Image optimization */}
      <div className="relative w-full overflow-hidden pt-[56.25%]">
        <div className="absolute inset-0 overflow-hidden">
          {!project.image ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <p className="text-lg text-white/70 font-medium px-6 py-3 bg-slate-900/50 backdrop-blur-sm rounded-lg text-center">
                {project.client}
              </p>
            </div>
          ) : (
            <>
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                <div className="rounded-lg border border-white/15 bg-slate-900/55 px-4 py-2 text-sm text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  Click to visit site
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Project details */}
      <div className="relative z-10 bg-gradient-to-b from-slate-900/0 to-slate-950/80 p-6">
        {/* Client name */}
        <span className="font-medium text-teal-300 text-sm">
          {project.client}
        </span>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mt-2 mb-2 line-clamp-2">
          {project.title}
        </h3>
        
        {/* Description - Limited to 2 lines */}
        <p className="mb-4 text-slate-200/90 text-sm line-clamp-2">
          {project.description}
        </p>
        
        {/* Divider */}
        <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200/20 to-transparent"></div>
        
        {/* Tech stack */}
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 3).map((tech: string, i) => (
              <span 
                key={i} 
                className="rounded-full border border-slate-500/30 bg-slate-900/55 px-3 py-1 text-xs font-medium text-slate-200 transition-all duration-300 hover:border-teal-300/40 hover:bg-slate-800/70"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="rounded-full border border-slate-500/30 bg-slate-900/55 px-3 py-1 text-xs font-medium text-slate-200">
                +{project.tech.length - 3}
              </span>
            )}
          </div>
        </div>
        
        {/* Action button - Only Live Site */}
        {project.live_url && (
          <Link 
            href={project.live_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group/btn relative inline-flex items-center justify-center w-full overflow-hidden rounded-lg border border-indigo-500/40 bg-gradient-to-r from-teal-500/25 to-indigo-500/35 px-6 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:border-teal-300/60 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            {/* Glass sweep animation overlay */}
            <span className="absolute inset-0 overflow-hidden">
              <span className="absolute -inset-[100%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-glass-sweep"></span>
            </span>
            
            <Globe className="relative z-10 mr-2 h-4 w-4 text-teal-200 transition-transform group-hover/btn:scale-110" />
            <span className="relative z-10 font-semibold tracking-wide text-teal-50">Visit Live Site</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
};