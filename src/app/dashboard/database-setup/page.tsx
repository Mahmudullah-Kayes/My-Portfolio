"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleCheck, CircleAlert, Database } from 'lucide-react';

export default function DatabaseSetupPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  async function createProjectsTable() {
    setIsCreating(true);
    setMessage(null);
    
    try {
      const supabase = createClient();
      
      // Try to create the projects table directly
      const { error } = await supabase.rpc('create_projects_table');
      
      if (error) {
        throw error;
      }
      
      setMessage({
        type: 'success',
        text: 'Projects table created successfully! You can now add projects in the Works section.'
      });
    } catch (error: any) {
      console.error('Error creating projects table:', error);
      
      setMessage({
        type: 'error',
        text: `Unable to create projects table: ${error.message}. You may need to create it manually in the Supabase dashboard.`
      });
    } finally {
      setIsCreating(false);
    }
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Database Setup</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Supabase Database Setup</CardTitle>
          <CardDescription>
            Set up your database tables to store project data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This will create the necessary tables in your Supabase database to store your projects information.
          </p>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Required tables:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Projects - Stores your portfolio projects</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Manual setup instructions:</h3>
            <p className="text-sm text-muted-foreground mb-2">
              If automatic setup fails, follow these steps in your Supabase dashboard:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Go to your Supabase project dashboard</li>
              <li>Navigate to the SQL Editor</li>
              <li>Run the following SQL:</li>
            </ol>
            <pre className="bg-secondary p-3 my-3 rounded text-xs overflow-auto">
{`-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  tech_stack TEXT[],
  category TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Enable all operations for authenticated users only" 
ON projects FOR ALL TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create a storage bucket for project images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true);

-- Set up storage policy
CREATE POLICY "Allow public read access to project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Allow authenticated users to upload project images"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'project-images');
`}
            </pre>
          </div>
          
          <Button 
            onClick={createProjectsTable}
            disabled={isCreating}
            className="w-full"
          >
            <Database className="mr-2 h-4 w-4" />
            {isCreating ? 'Setting up...' : 'Setup Database'}
          </Button>
          
          {message && (
            <Alert className="mt-4" variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? (
                <CircleCheck className="h-4 w-4" />
              ) : (
                <CircleAlert className="h-4 w-4" />
              )}
              <AlertTitle>
                {message.type === 'success' ? 'Success' : 'Error'}
              </AlertTitle>
              <AlertDescription>
                {message.text}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 