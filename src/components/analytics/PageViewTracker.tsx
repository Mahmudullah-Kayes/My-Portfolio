'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-01XWVE5YTT';

  useEffect(() => {
    // Don't track views for dashboard routes
    if (!pathname.startsWith('/dashboard')) {
      const timeoutId = window.setTimeout(() => {
        void import('@/lib/utils/analytics')
          .then(({ trackPageView }) => trackPageView(pathname))
          .catch((error) => {
            console.error('Failed to load page view tracking:', error);
          });
      }, 2000);
      
      // Track in Google Analytics if gtag is available
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        const url = pathname + searchParams.toString();
        window.gtag('config', gaId, {
          page_path: url,
        });
      }

      return () => window.clearTimeout(timeoutId);
    }
  }, [pathname, searchParams, gaId]);

  return null;
} 