"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function DashboardRoot() {
  const router = useRouter();

  useEffect(() => {
    async function redirectToRoleDashboard() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const roleRoutes = {
        'admin': '/admin/dashboard',
        'manager': '/manager/dashboard',
        'sales': '/sales/dashboard',
        'crew': '/crew/dashboard',
        'finance': '/finance/dashboard',
      };

      router.replace(roleRoutes[profile?.role] || '/manager/dashboard');
    }
    redirectToRoleDashboard();
  }, [router]);

  return null;
}
