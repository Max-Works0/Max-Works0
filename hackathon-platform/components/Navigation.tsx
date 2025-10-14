'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { user, userData, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold hover:text-purple-200 transition">
            🚀 HackathonHub
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className={`hover:text-purple-200 transition ${isActive('/') ? 'font-bold' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/teams" 
              className={`hover:text-purple-200 transition ${isActive('/teams') ? 'font-bold' : ''}`}
            >
              Teams
            </Link>
            
            {user ? (
              <>
                {userData?.role === 'admin' || userData?.role === 'organizer' ? (
                  <Link 
                    href="/dashboard" 
                    className={`hover:text-purple-200 transition ${isActive('/dashboard') ? 'font-bold' : ''}`}
                  >
                    Dashboard
                  </Link>
                ) : null}
                <Link 
                  href="/register" 
                  className={`hover:text-purple-200 transition ${isActive('/register') ? 'font-bold' : ''}`}
                >
                  Register
                </Link>
                <span className="text-purple-200">{userData?.name}</span>
                <button
                  onClick={logout}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="hover:text-purple-200 transition"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
