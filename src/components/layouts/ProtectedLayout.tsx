'use client';

import AuthGuard from '@/components/ui/AuthGuard';
import Navbar from '@/components/ui/Navbar';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <AuthGuard>
      <Navbar />
      <main className="page-container app-main-with-navbar">
        {children}
      </main>
    </AuthGuard>
  );
}
