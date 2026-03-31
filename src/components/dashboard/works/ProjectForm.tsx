"use client";

import { useState, useRef, useEffect } from 'react';
import { X, Save, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/app/dashboard/works/page';
import { toast } from 'sonner';

interface ProjectFormProps {
  project: Project | null;
  defaultProject: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const ProjectForm = ({ 
  project, 
  defaultProject,
  onSave, 
  onCancel 
}: ProjectFormProps) => {
  // Add mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize form with either editing project or empty one
  const [formData, setFormData] = useState<Project>(
    project ? { ...project } : { ...defaultProject }
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [newTech, setNewTech] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // For file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'links') {
        setFormData({
          ...formData,
          links: {
            ...formData.links,
            [child]: value
          }
        });
      }
    } else if (name === 'isClientProject') {
      // Toggle client project status
      const isClient = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        isClientProject: isClient,
        // Reset client and industry if toggling off
        client: isClient ? formData.client : '',
        industry: isClient ? formData.industry : ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'isLongImage' ? (e.target as HTMLInputElement).checked : value
      });
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset state
    setUploadError('');
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        setUploadError('File must be an image');
        setIsUploading(false);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image must be less than 5MB');
        setIsUploading(false);
        return;
      }
      
      // For now, just simulate upload and use a placeholder URL
      // In a real implementation, you would upload to your server or a service
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
      
      // Create a fake URL (in production, replace with actual upload)
      const timestamp = typeof window !== 'undefined' ? Date.now() : 'ssr';
      const fakeUrl = `/placeholder-${timestamp}.png`;
      
      // Update form with new image URL
      setFormData({
        ...formData,
        image: fakeUrl
      });
      
      // Set progress to complete
      setUploadProgress(100);
    } catch (error: any) {
      setUploadError(error.message || 'Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger file input click
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // Handle technology tags
  const addTech = () => {
    if (newTech.trim() && !formData.tech.includes(newTech.trim())) {
      setFormData({
        ...formData,
        tech: [...formData.tech, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      tech: formData.tech.filter(t => t !== tech)
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pass the form data back to parent component
      onSave(formData);
    } catch (error: any) {
      toast.error('Failed to save project. Please try again.');
      setIsLoading(false);
    }
  };

  // Only render the form when mounted on client side
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-800 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {project ? 'Edit Project' : 'Add New Project'}
          </h3>
          <button 
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Project Type Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <div>
                <h4 className="font-medium text-white">Project Type</h4>
                <p className="text-sm text-slate-400">Select the type of project you're adding</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${!formData.isClientProject ? 'text-white' : 'text-slate-400'}`}>
                  Personal
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isClientProject"
                    checked={formData.isClientProject}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
                <span className={`text-sm ${formData.isClientProject ? 'text-white' : 'text-slate-400'}`}>
                  Client
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="My Project"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Brief description of your project"
              />
            </div>

            {/* Client-specific fields */}
            {formData.isClientProject && (
              <>
                {/* Client Name */}
                <div>
                  <label htmlFor="client" className="block text-sm font-medium text-slate-300 mb-1">
                    Client Name <span className="text-slate-400 text-xs">(or "Confidential Client")</span>
                  </label>
                  <input
                    type="text"
                    id="client"
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                    required={formData.isClientProject}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Company Name or 'Confidential Client'"
                  />
                  <div className="mt-1 flex items-center">
                    <input
                      type="checkbox"
                      id="confidential-client"
                      className="h-4 w-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-800"
                      onChange={() => setFormData({...formData, client: "Confidential Client"})}
                    />
                    <label htmlFor="confidential-client" className="ml-2 text-xs text-slate-400">
                      Use "Confidential Client" instead
                    </label>
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-1">
                    Industry
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    required={formData.isClientProject}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Industry</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="fintech">FinTech</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="technology">Technology</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            {/* Image Upload/URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Project Image
              </label>
              
              {/* Image Preview */}
              {formData.image && (
                <div className="mb-3 relative">
                  <div className="w-full h-40 bg-slate-800 rounded-md overflow-hidden relative">
                    <img 
                      src={formData.image} 
                      alt="Project preview" 
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, image: ''})}
                      className="absolute top-2 right-2 p-1 bg-red-900/80 hover:bg-red-800 rounded-full text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Image input methods */}
              <div className="flex flex-col space-y-3">
                {/* URL input */}
                <div className="flex">
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-l-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-r-md text-white transition-colors"
                  >
                    <ImageIcon size={16} />
                  </button>
                </div>
                
                {/* OR Divider */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1 h-px bg-slate-700"></div>
                  <span className="text-slate-500 text-sm">OR</span>
                  <div className="flex-1 h-px bg-slate-700"></div>
                </div>
                
                {/* File upload */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleClickUpload}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-dashed border-slate-600 rounded-md text-slate-300 transition-colors"
                  >
                    {isUploading ? (
                      <div className="flex items-center">
                        <Loader2 size={16} className="animate-spin mr-2" />
                        <span>Uploading... {uploadProgress}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Upload size={16} className="mr-2" />
                        <span>Upload Image</span>
                      </div>
                    )}
                  </button>
                  
                  {uploadError && (
                    <p className="mt-1 text-red-400 text-sm">{uploadError}</p>
                  )}
                  
                  <p className="text-xs text-slate-500 mt-1">
                    Image must be less than 5MB. PNG, JPG, WEBP formats supported.
                  </p>
                </div>
              </div>
            </div>

            {/* Category - only show for non-client projects */}
            {!formData.isClientProject && (
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="web">Web</option>
                  <option value="app">App</option>
                </select>
              </div>
            )}

            {/* Long Image Toggle - only show for non-client projects */}
            {!formData.isClientProject && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isLongImage"
                  name="isLongImage"
                  checked={formData.isLongImage}
                  onChange={(e) => setFormData({...formData, isLongImage: e.target.checked})}
                  className="h-4 w-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-800"
                />
                <label htmlFor="isLongImage" className="ml-2 block text-sm text-slate-300">
                  Long scrollable image (for full-page website screenshots)
                </label>
              </div>
            )}

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Technologies Used
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-l-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="React, Next.js, etc."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-r-md text-white transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tech.map(tech => (
                  <span 
                    key={tech} 
                    className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-slate-800 text-slate-300"
                  >
                    {tech}
                    <button 
                      type="button" 
                      onClick={() => removeTech(tech)}
                      className="ml-1 text-slate-500 hover:text-slate-300"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Live Demo Link */}
            <div>
              <label htmlFor="links.live" className="block text-sm font-medium text-slate-300 mb-1">
                Live Demo URL
              </label>
              <input
                type="url"
                id="links.live"
                name="links.live"
                value={formData.links.live}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/project"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Project
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm; 