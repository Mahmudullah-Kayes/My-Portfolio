"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  ImageIcon,
  User,
  Mail
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  // Start with default values for server rendering
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Mark that we've hydrated
    setIsClient(true);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Manage Works', href: '/dashboard/works', icon: FolderKanban },
    { name: 'Hero Section', href: '/dashboard/hero', icon: ImageIcon },
    { name: 'About Section', href: '/dashboard/about', icon: User },
    { name: 'Contact Section', href: '/dashboard/contact', icon: Mail },
  ];

  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem('dashboard_auth');
      router.push('/dashboard/login');
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-950">
      {/* Mobile sidebar overlay - only show on client */}
      {isClient && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800/50 transition-transform duration-300 ease-in-out transform ${
          !isClient || !sidebarOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        } lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/50">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-white font-semibold text-lg">Dashboard</span>
            </Link>
            {isClient && (
              <button 
                className="p-1 text-slate-400 hover:text-white lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive 
                      ? 'bg-slate-800/80 text-white' 
                      : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  {item.name}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4 text-slate-500" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-slate-800/50">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800/40 hover:text-white transition-colors duration-150"
            >
              <LogOut className="h-5 w-5 mr-3 text-slate-400" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-slate-900 border-b border-slate-800/50 h-16 flex items-center px-4 lg:px-6">
          {isClient && (
            <button
              className="p-1 mr-4 text-slate-400 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          )}
          <h1 className="text-xl font-semibold text-white">
            {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
          </h1>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 