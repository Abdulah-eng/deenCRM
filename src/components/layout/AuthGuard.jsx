"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      } else {
        setChecking(false);
      }
    }

    checkSession();

    // Listen for auth state changes (e.g., token expiry, sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.replace('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--body-bg, #0f1117)',
        color: 'var(--body-text, #fff)',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(114,57,234,0.2)',
          borderTop: '3px solid #7239ea',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: 14, opacity: 0.6 }}>Authentifizierung wird überprüft...</span>
      </div>
    );
  }

  return children;
}
