'use client';

import { useEffect, useState } from 'react';

export default function GADebugger() {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [gaId, setGaId] = useState<string | null>(null);
  const [isGtagDefined, setIsGtagDefined] = useState(false);

  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;

    const checkGA = () => {
      setGaId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null);
      
      // Check if gtag is defined
      if (typeof window !== 'undefined') {
        setIsGtagDefined(typeof (window as any).gtag === 'function');
      }
      
      // Check if GA script is loaded
      const gaScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
      if (gaScript) {
        setStatus('loaded');
      } else {
        setStatus('error');
      }
    };

    // Wait a bit for scripts to load
    const timer = setTimeout(checkGA, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-0 left-0 bg-gray-800 text-white p-3 text-xs z-50 font-mono">
      <h3 className="font-bold mb-1">GA Debug:</h3>
      <ul>
        <li>
          Measurement ID: {gaId ? 
            <span className="text-green-400">{gaId}</span> : 
            <span className="text-red-400">Missing</span>}
        </li>
        <li>
          Script: {status === 'loaded' ? 
            <span className="text-green-400">Loaded</span> : 
            <span className="text-red-400">Not loaded</span>}
        </li>
        <li>
          gtag function: {isGtagDefined ? 
            <span className="text-green-400">Defined</span> : 
            <span className="text-red-400">Not defined</span>}
        </li>
      </ul>
    </div>
  );
} 