import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcut() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl+Shift+F8 (Windows/Linux) or Cmd+Shift+F8 (Mac)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'F8') {
        event.preventDefault();
        
        // Check if user is authenticated (optional - you can customize this)
        const isAuthenticated = !!localStorage.getItem('sb-' + 'ANY_SUPABASE_KEY'); // Adjust based on your auth
        
        if (isAuthenticated) {
          router.push('/dashboard');
        } else {
          router.push('/dashboard/login');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);
}
