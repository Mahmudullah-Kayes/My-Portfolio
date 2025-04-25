"use client";

// This file is needed for Next.js routing and to provide consistent layout
// We're making it a client component to avoid hydration errors

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false); // Start as false for SSR
  
  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    // Only set loading and check authentication on the client
    if (pathname !== '/dashboard/login') {
      setLoading(true);
      
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem('dashboard_auth') === 'true';
      
      // If not authenticated and not on login page, redirect to login
      if (!isAuthenticated) {
        router.push('/dashboard/login');
      } else {
        setLoading(false);
      }
    }
  }, [router, pathname]);
  
  // Show loading state only on client after hydration
  if (isClient && loading && pathname !== '/dashboard/login') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return <div className="min-h-screen bg-slate-950">{children}</div>;
} 