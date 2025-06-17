'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { pageview } from '@/lib/analytics';

export default function GoogleAnalytics({ 
  GA_MEASUREMENT_ID 
}: { 
  GA_MEASUREMENT_ID?: string 
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      console.warn('Google Analytics Measurement ID is missing');
      setError('Missing GA_MEASUREMENT_ID');
      return;
    }
    
    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  // For debugging only - remove in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('GA_MEASUREMENT_ID:', GA_MEASUREMENT_ID);
    }
  }, [GA_MEASUREMENT_ID]);

  if (!GA_MEASUREMENT_ID) {
    // For debugging only - remove in production
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="fixed bottom-0 right-0 bg-red-500 text-white p-2 text-xs z-50">
          GA_MEASUREMENT_ID missing
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          setIsLoaded(true);
          console.log('Google Analytics script loaded');
        }}
        onError={(e) => {
          setError('Failed to load GA script');
          console.error('Google Analytics failed to load:', e);
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
        onLoad={() => {
          console.log('Google Analytics config loaded');
        }}
      />
      {/* For debugging only - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 right-0 bg-green-500 text-white p-2 text-xs z-50">
          GA: {isLoaded ? 'Loaded' : 'Loading...'} {error ? `Error: ${error}` : ''}
        </div>
      )}
    </>
  );
} 