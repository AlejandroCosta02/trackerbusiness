'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <div className="h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-indigo-100/30 via-transparent to-purple-100/30 animate-slow-spin" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-purple-100/20 animate-slow-pulse" />
      </div>
      
      {/* Decorative blurred circles */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob z-0" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob delay-2000 z-0" />
      <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob delay-4000 z-0" />

      <div className="relative z-1 flex flex-col h-full justify-between py-6">
        {/* Hero Section */}
        <div className="flex-none">
          <div className="px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-300% animate-gradient bg-clip-text text-transparent">
                  Track Your Business Growth
                </h1>
                <p className="mt-4 text-lg leading-8 text-gray-600 animate-fade-in">
                  Gain complete control over your finances with a powerful, all-in-one business tracking solution. Monitor investments, track expenses, and analyze profits effortlessly. Make smarter decisions and drive success with real-time insights at your fingertips.
                </p>
                <div className="mt-6 flex items-center justify-center animate-fade-in delay-500">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                  >
                    <Image
                      src="/google.svg"
                      alt="Google logo"
                      width={20}
                      height={20}
                      className="mr-3"
                    />
                    Get Started with Google
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="flex-none w-full mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Investment Feature */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-50 h-[180px] flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Investments</h3>
                  <p className="text-sm text-gray-600">Track and optimize your returns with comprehensive investment monitoring and analysis tools.</p>
                </div>
              </div>

              {/* Expenses Feature */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-50 h-[180px] flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Expenses</h3>
                  <p className="text-sm text-gray-600">See where your money goes at a glance with intuitive expense tracking and categorization.</p>
                </div>
              </div>

              {/* Profits Feature */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-50 h-[180px] flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Profits</h3>
                  <p className="text-sm text-gray-600">Make data-driven decisions to grow your business with real-time profit analytics and insights.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
