"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AboutSettings {
  id: string;
  title: string;
  description: string[];
  image_url: string;
}

export default function AboutSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AboutSettings>({
    id: '00000000-0000-0000-0000-000000000001',
    title: '',
    description: ['', '', ''],
    image_url: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('about_settings')
        .select('*')
        .limit(1)
        .order('created_at', { ascending: true })
        .single();

      if (error) throw error;

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      // Handle error silently, keep default settings
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('about_settings')
        .upsert(settings, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      toast.success('About settings saved successfully.');
    } catch (error) {
      toast.error('Failed to save about settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setSettings(prev => ({
      ...prev,
      description: prev.description.map((text, i) => i === index ? value : text)
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">About Section Settings</h1>
            <p className="text-slate-400 mt-2">
              Manage your about section content
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Image Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Image URL
                  </label>
                  <Input
                    value={settings.image_url}
                    onChange={(e) => setSettings(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="Enter image URL"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Content Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Title
                  </label>
                  <Input
                    value={settings.title}
                    onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter title"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Description Paragraphs
                  </label>
                  {settings.description.map((text, index) => (
                    <Textarea
                      key={index}
                      value={text}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      placeholder={`Enter paragraph ${index + 1}`}
                      className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 