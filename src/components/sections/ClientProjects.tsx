"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Building, Briefcase, Award, X, Globe } from 'lucide-react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import React from 'react';

interface ClientProject {
  id: number;
  title: string;
  description: string;
  client: string;
  industry: string;
  image: string;
  tech: string[];
  links?: {
    live: string;
    case_study?: string;
  }
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

export default function ClientProjects() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClientProjects() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Type assertion to help TypeScript understand the supabase client
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
          links: {
            live: item.live_url || '',
            case_study: item.case_study_url || undefined
          }
        }));
        
        setProjects(formattedProjects);
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

  if (error) {
    return null; // Don't show section if there's an error
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

  // Don't render the section if there are no client projects
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ClientProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* Add animation keyframes */}
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

// ClientProjectCard component - enhanced version of ProjectCard from Works.tsx
const ClientProjectCard = ({ project, index }: { project: ClientProject, index: number }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/10 bg-slate-900/35 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] ring-1 ring-teal-300/10 backdrop-blur-md transition-all duration-300 hover:border-teal-300/25 hover:shadow-[0_26px_60px_-30px_rgba(20,184,166,0.28)]"
      initial={{ opacity: 1, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => setIsModalOpen(true)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(45,212,191,0.14),transparent_35%),radial-gradient(circle_at_90%_85%,rgba(99,102,241,0.14),transparent_40%)] opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      {/* Project image - 16:9 aspect ratio */}
      <div className="relative w-full overflow-hidden pt-[56.25%]">
        {/* Image container */}
        <div className="absolute inset-0 overflow-hidden">
          {!project.image ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <p className="text-lg text-white/70 font-medium px-6 py-3 bg-slate-900/50 backdrop-blur-sm rounded-lg">
                {project.client}
              </p>
            </div>
          ) : (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-top bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${project.image})` }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                <div className="rounded-lg border border-white/15 bg-slate-900/55 px-4 py-2 text-sm text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  Click to view details
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Project details - Enhanced design */}
      <div className="relative z-10 bg-gradient-to-b from-slate-900/0 to-slate-950/80 p-6">
        {/* Client name */}
        <span className="font-medium text-teal-300">
          {project.client}
        </span>
        
        {/* Title with Noto Sans font */}
        <h3 className="text-xl font-bold text-white mt-2 mb-2 font-['Noto_Sans']">
          {project.title}
        </h3>
        
        {/* Description - Limited to single line */}
        <p className="mb-4 truncate text-slate-200/90">
          {project.description}
        </p>
        
        {/* Divider */}
        <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200/20 to-transparent"></div>
        
        {/* Tech stack with improved visual */}
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
                +{project.tech.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        {/* Action buttons - Enhanced */}
        <div className="flex items-center justify-end gap-3">
          {project.links?.live && (
            <Link 
              href={project.links.live} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-indigo-500/40 bg-gradient-to-r from-teal-500/25 to-indigo-500/35 px-6 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:border-teal-300/60 hover:shadow-lg hover:shadow-indigo-500/30"
              onClick={(e) => e.stopPropagation()} // Prevent modal from opening when clicking the button
            >
              {/* Glass angle animation overlay */}
              <span className="absolute inset-0 overflow-hidden">
                <span className="absolute -inset-[100%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-glass-sweep"></span>
              </span>
              
              <Globe className="relative z-10 mr-2 h-4 w-4 text-teal-200" />
              <span className="relative z-10 font-semibold tracking-wide text-teal-50">Live Site</span>
            </Link>
          )}
          
          {/* View Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-all duration-300 border border-slate-700/50 hover:border-slate-500/80"
          >
            <span>Details</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Project Modal */}
      {isModalOpen && (
        <ProjectModal 
          project={project}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </motion.div>
  );
};

// ProjectModal component
const ProjectModal = ({ project, onClose }: { project: ClientProject, onClose: () => void }) => {
  // Create portal for the modal
  const [mounted, setMounted] = useState(false);
  const backdropRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add escape key listener
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Add click outside listener
    const handleClickOutside = (e: MouseEvent) => {
      if (backdropRef.current === e.target) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, project.title]);

  if (!mounted) return null;

  // Try rendering without portal first to debug
  const modalContent = (
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      {/* Close Button - Positioned outside modal content for guaranteed accessibility */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        className="fixed top-4 right-4 z-[60] p-3 bg-red-600/95 hover:bg-red-500/95 rounded-full transition-all duration-200 backdrop-blur-sm border border-red-500/50 shadow-2xl"
        style={{ 
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none'
        }}
        aria-label="Close modal"
        type="button"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Modal container with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col my-auto"
      >
        {/* Content container - Single scrollable area on mobile */}
        <div className="h-full overflow-y-auto">
          <div className="lg:flex lg:min-h-full">
            {/* Left side: Project details */}
            <div className="lg:w-2/3 p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              {/* Project title with gradient */}
              <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-700/50 pr-12">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400">
                    {project.title}
                  </span>
                </h2>
              </div>
              
              {/* Project description */}
              <div className="bg-slate-900/70 rounded-xl p-4 sm:p-6 border border-slate-700/40">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Project Overview</span>
                </h3>
                
                <div className="prose prose-invert prose-slate max-w-none pl-3 sm:pl-4 border-l-2 border-cyan-800/50">
                  <p className="text-sm sm:text-base text-slate-300 whitespace-pre-line leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
              
              {/* Project highlights - moved to bottom */}
              <div className="mt-6 sm:mt-8 bg-slate-900/70 rounded-xl p-4 sm:p-6 border border-slate-700/40">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">Key Highlights</span>
                </h3>
                
                <ul className="space-y-2 sm:space-y-3 pl-3 sm:pl-4 border-l-2 border-violet-800/50">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-cyan-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </span>
                    <span className="text-sm sm:text-base text-slate-300">
                      Successfully delivered project for {project.industry} industry client
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-cyan-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </span>
                    <span className="text-sm sm:text-base text-slate-300">
                      Utilized {project.tech.length} different technologies to create a comprehensive solution
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-cyan-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </span>
                    <span className="text-sm sm:text-base text-slate-300">
                      {project.links?.live ? "Deployed to production with live site available" : "Delivered project to client specifications"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
            {/* Right side: Image, tech stack, links */}
            <div className="lg:w-1/3 bg-slate-800/50 border-t lg:border-t-0 lg:border-l border-slate-700/50 flex flex-col lg:h-full">
            {/* Image - 16:9 aspect ratio */}
            <div className="relative w-full pt-[56.25%] overflow-hidden mt-4 sm:mt-6 lg:mt-8 mx-4 sm:mx-6 lg:mx-0 rounded-lg lg:rounded-none">
              {project.image ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <Building className="w-16 h-16 text-slate-600" />
                </div>
              )}
            </div>
            
            {/* Tech stack and details */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              {/* Client info card */}
              <div className="mb-4 sm:mb-6 bg-slate-900/70 rounded-xl p-3 sm:p-4 border border-slate-700/40">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Client</span>
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-slate-300 pl-3 sm:pl-4 border-l-2 border-cyan-800/50">
                  {project.client}
                </p>
              </div>
              
              {/* Industry info card */}
              <div className="mb-4 sm:mb-6 bg-slate-900/70 rounded-xl p-3 sm:p-4 border border-slate-700/40">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">Industry</span>
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-slate-300 pl-3 sm:pl-4 border-l-2 border-violet-800/50">
                  {project.industry}
                </p>
              </div>
              
              {/* Tech stack info card */}
              <div className="mb-6 sm:mb-8 bg-slate-900/70 rounded-xl p-3 sm:p-4 border border-slate-700/40">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Technology Stack</span>
                </h3>
                
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pl-3 sm:pl-4 border-l-2 border-blue-800/50">
                  {project.tech.map((tech: string, i) => (
                    <span 
                      key={i} 
                      className="px-2 sm:px-3 py-1 text-xs font-medium bg-slate-800/80 text-slate-300 rounded-full border border-slate-700/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col gap-2 sm:gap-3 mt-auto pb-2">
                {project.links?.live && (
                  <Link 
                    href={project.links.live} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-800 to-violet-900 rounded-lg text-white font-medium overflow-hidden group border border-indigo-700/50 w-full"
                    onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                  >
                    {/* Glass angle animation overlay */}
                    <span className="absolute inset-0 overflow-hidden">
                      <span className="absolute -inset-[100%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-glass-sweep"></span>
                    </span>
                    
                    <Globe className="w-3 sm:w-4 h-3 sm:h-4 mr-1.5 sm:mr-2 relative z-10 text-cyan-300" />
                    <span className="relative z-10 text-cyan-50 font-semibold tracking-wide text-sm sm:text-base">View Live Site</span>
                  </Link>
                )}
                
                {project.links?.case_study && (
                  <Link 
                    href={project.links.case_study} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900 rounded-lg text-white font-medium overflow-hidden group border border-slate-700/50 w-full"
                    onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                  >
                    {/* Glass angle animation overlay */}
                    <span className="absolute inset-0 overflow-hidden">
                      <span className="absolute -inset-[100%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-glass-sweep"></span>
                    </span>
                    
                    <span className="relative z-10 text-violet-200 font-semibold tracking-wide text-sm sm:text-base">Read Case Study</span>
                    <ArrowRight className="ml-1.5 sm:ml-2 w-3 sm:w-4 h-3 sm:h-4 relative z-10 text-violet-300" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}; 