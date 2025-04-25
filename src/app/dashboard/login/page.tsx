"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function DashboardLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = localStorage.getItem('dashboard_auth');
    if (isAuthenticated === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    setLoading(true);
    setError('');

    // Simple password check
    if (password === '200410154') {
      localStorage.setItem('dashboard_auth', 'true');
      router.push('/dashboard');
    } else {
      setError('Invalid password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-900 rounded-xl border border-slate-800">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-purple-500" />
          <h2 className="mt-6 text-3xl font-bold text-white">Dashboard Access</h2>
          <p className="mt-2 text-sm text-slate-400">Enter password to continue</p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-slate-800 placeholder-slate-500 text-white bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button
            onClick={handleLogin}
            disabled={loading || !password}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </Button>
        </div>
      </div>
    </div>
  );
} 