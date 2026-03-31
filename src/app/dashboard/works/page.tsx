"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ProjectForm, ProjectsList } from '@/components/dashboard/works';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Define Project type
export type Project = {
  id?: number;
  title: string;
  description: string;
  image: string;
  category: string;
  tech: string[];
  isLongImage?: boolean;
  links: {
    live: string;
    github?: string;
    case_study?: string;
  };
  isClientProject?: boolean;
  client?: string;
  industry?: string;
};

export default function WorksPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Default empty project
  const defaultProject: Project = {
    title: '',
    description: '',
    image: '',
    category: 'web',
    tech: [],
    isLongImage: false,
    links: {
      live: '',
      github: '',
    },
    isClientProject: false,
    client: '',
    industry: '',
  };

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects from Supabase
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data if needed
      const formattedProjects = data.map((project: any) => ({
        ...project,
        links: {
          live: project.live_url || '',
          github: project.github_url || '',
          case_study: project.case_study_url || '',
        },
        isLongImage: project.is_long_image || false,
        isClientProject: project.is_client_project || false,
      }));

      setProjects(formattedProjects);
    } catch (error: any) {
      console.error('Error fetching projects:', error.message);
      toast.error('Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save project to Supabase
  const saveProject = async (project: Project) => {
    setIsSaving(true);
    try {
      const projectData = {
        title: project.title,
        description: project.description,
        image: project.image,
        category: project.category,
        tech: project.tech,
        is_long_image: project.isLongImage,
        live_url: project.links.live,
        github_url: project.links.github,
        case_study_url: project.links.case_study,
        is_client_project: project.isClientProject,
        client: project.client,
        industry: project.industry,
      };

      let result;

      if (project.id) {
        // Update existing project
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);
      } else {
        // Insert new project
        result = await supabase
          .from('projects')
          .insert(projectData);
      }

      if (result.error) {
        throw result.error;
      }

      // Refresh projects list
      await fetchProjects();
      
      // Close form
      setIsFormOpen(false);
      setEditingProject(null);
      toast.success(project.id ? 'Project updated successfully.' : 'Project added successfully.');
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(`Failed to save project: ${error.message}`);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Delete project
  const deleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh projects list
      await fetchProjects();
      toast.success('Project deleted successfully.');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error(`Failed to delete project: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Edit project
  const editProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6 flex justify-between items-center">
        <h2 className="text-white text-xl font-semibold">Projects</h2>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors duration-200"
        >
          <Plus size={18} className="mr-2" />
          Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={40} className="animate-spin text-purple-500" />
        </div>
      ) : isSaving || deletingId !== null ? (
        <div className="flex justify-center items-center h-24">
          <div className="inline-flex items-center gap-2 text-slate-300">
            <Loader2 size={18} className="animate-spin" />
            <span>{isSaving ? 'Saving project...' : 'Deleting project...'}</span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
          <div className="flex mb-6">
            <div className="bg-slate-800 p-2 rounded-lg flex space-x-2">
              <button 
                className={`px-3 py-1 rounded-md ${!activeFilter ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                onClick={() => setActiveFilter(null)}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${activeFilter === 'personal' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                onClick={() => setActiveFilter('personal')}
              >
                Personal
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${activeFilter === 'client' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                onClick={() => setActiveFilter('client')}
              >
                Client
              </button>
            </div>
          </div>
          <ProjectsList 
            projects={projects.filter(p => {
              if (activeFilter === 'personal') return !p.isClientProject;
              if (activeFilter === 'client') return p.isClientProject;
              return true;
            })} 
            onEdit={editProject} 
            onDelete={deleteProject} 
          />
        </div>
      )}

      {isFormOpen && (
        <ProjectForm
          project={editingProject}
          defaultProject={defaultProject}
          onSave={saveProject}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProject(null);
          }}
        />
      )}
    </DashboardLayout>
  );
} 