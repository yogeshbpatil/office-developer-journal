'use client';

import AuthGuard from '@/components/ui/AuthGuard';
import Navbar from '@/components/ui/Navbar';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  fullPage?: boolean;
}

export default function ProtectedLayout({ children, fullPage = false }: ProtectedLayoutProps) {
  return (
    <AuthGuard>
      <Navbar />
      <main className={`page-container app-main-with-navbar${fullPage ? ' notes-main' : ''}`}>
        {children}
      </main>
    </AuthGuard>
  );
}
