'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white/80 backdrop-blur-md shadow-sm will-change-transform">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/" 
                className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 transition-colors duration-300"
              >
                Business Tracker
              </Link>
            </div>
            {session && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className={`border-transparent text-gray-600 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 hover:border-indigo-600 text-sm font-medium transition-all duration-300 ${
                    pathname === '/dashboard' ? 'border-indigo-600 text-indigo-600' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/business"
                  className={`border-transparent text-gray-600 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 hover:border-indigo-600 text-sm font-medium transition-all duration-300 ${
                    pathname === '/business' ? 'border-indigo-600 text-indigo-600' : ''
                  }`}
                >
                  Business Profile
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="hidden sm:inline-block text-sm text-gray-600">
                  {session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                  isHomePage 
                  ? 'text-indigo-600 bg-white hover:bg-white/90 border border-indigo-100' 
                  : 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-transparent'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 