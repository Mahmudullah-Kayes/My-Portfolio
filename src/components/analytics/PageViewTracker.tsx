'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/utils/analytics';
import { pageview } from '@/lib/analytics';

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Don't track views for dashboard routes
    if (!pathname.startsWith('/dashboard')) {
      // Track in Supabase
      trackPageView(pathname);
      
      // Track in Google Analytics
      const url = pathname + searchParams.toString();
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
} 