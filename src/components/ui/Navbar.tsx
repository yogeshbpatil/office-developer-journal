'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '@/lib/auth';
import { User } from '@/models/User';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/login');
  };

  const isActive = (path: string) => {
    return pathname === path ? 'active' : '';
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        <Link href="/dashboard" className="navbar-brand fw-bold text-primary">
          📝 Developer Journal
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/dailylogs" className={`nav-link ${isActive('/dailylogs')}`}>
                Daily Logs
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/dailylogs/create" className={`nav-link ${isActive('/dailylogs/create')}`}>
                Create Log
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/dailylogs/search" className={`nav-link ${isActive('/dailylogs/search')}`}>
                Search
              </Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3">
              Welcome, <strong>{user.name}</strong> ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
