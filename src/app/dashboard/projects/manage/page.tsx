"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ProjectsList, ProjectForm } from '@/components/dashboard/projects';
import { Plus, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from 'sonner';

// Types
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'web' | 'app';
  isLongImage: boolean;
  tech: string[];
  links: {
    live: string;
    github?: string;
  }
}

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial form state
  const emptyProject: Project = {
    id: 0,
    title: "",
    description: "",
    image: "",
    isLongImage: true,
    category: "web",
    tech: [],
    links: {
      live: "",
      github: ""
    }
  };

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching projects from Supabase...');
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Projects fetched successfully:', data);
        
        // If no data or empty array, just set empty projects
        if (!data || data.length === 0) {
          setProjects([]);
          return;
        }
        
        // Transform data from Supabase format to our app format
        const formattedProjects: Project[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          image: item.image || '',
          category: item.category as 'web' | 'app',
          isLongImage: item.is_long_image || false,
          tech: item.tech || [],
          links: {
            live: item.live_url || '',
            github: item.github_url || ''
          }
        }));
        
        setProjects(formattedProjects);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(`Failed to load projects: ${err?.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Add or edit project
  const handleAddEdit = (project: Project | null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  // Delete project
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state after successful deletion
      setProjects(projects.filter(project => project.id !== id));
      toast.success('Project deleted successfully.');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save project (create or update)
  const handleSave = async (savedProject: Project) => {
    setIsSubmitting(true);
    try {
      // Convert from our app format to Supabase format
      const supabaseProject = {
        title: savedProject.title,
        description: savedProject.description,
        image: savedProject.image,
        category: savedProject.category,
        is_long_image: savedProject.isLongImage,
        tech: savedProject.tech,
        live_url: savedProject.links.live,
        github_url: savedProject.links.github,
        updated_at: new Date().toISOString()
      };
      
      if (editingProject) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(supabaseProject)
          .eq('id', editingProject.id);
          
        if (error) throw error;
        
        // Update local state
        setProjects(projects.map(p => p.id === editingProject.id ? 
          { ...savedProject, id: editingProject.id } : p));
      } else {
        // Add new project
        const { data, error } = await supabase
          .from('projects')
          .insert([{ ...supabaseProject, created_at: new Date().toISOString() }])
          .select();
          
        if (error) throw error;
        
        // Add the new project to local state with the ID from Supabase
        const newProject: Project = {
          ...savedProject,
          id: data[0].id
        };
        
        setProjects([newProject, ...projects]);
      }
      
      setIsModalOpen(false);
      setEditingProject(null);
      toast.success(editingProject ? 'Project updated successfully.' : 'Project added successfully.');
    } catch (err) {
      console.error('Error saving project:', err);
      toast.error('Failed to save project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
        <div>
          <div className="flex items-center mb-1">
            <Link href="/dashboard" className="mr-3 text-slate-400 hover:text-white">
              <ArrowLeft size={18} />
            </Link>
            <h2 className="text-white text-xl font-semibold">Manage Projects</h2>
          </div>
          <p className="text-slate-400 text-sm">Add, edit and delete portfolio projects</p>
        </div>
        <button 
          onClick={() => handleAddEdit(null)}
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors duration-200"
        >
          <Plus size={18} className="mr-2" />
          Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-900/40 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-8 text-center">
          <div className="text-slate-400 mb-4">No projects found</div>
          <button 
            onClick={() => handleAddEdit(null)}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors duration-200"
          >
            <Plus size={18} className="mr-2" />
            Add Your First Project
          </button>
        </div>
      ) : (
        <ProjectsList 
          projects={projects}
          onEdit={handleAddEdit}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <ProjectForm
          project={editingProject}
          defaultProject={emptyProject}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </DashboardLayout>
  );
} 