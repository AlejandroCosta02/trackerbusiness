'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : process.env.NODE_ENV === 'production'
          ? 'https://trackerbusiness.vercel.app'
          : 'http://localhost:3000';

      const result = await signIn("google", {
        callbackUrl: `${baseUrl}/dashboard`,
        redirect: true,
      });

      if (result?.error) {
        setError(result.error);
        console.error('Sign in error:', result.error);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred during sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Business Tracker
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your business finances
          </p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div className="mt-8 space-y-4">
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Image
              src="/google.svg"
              alt="Google logo"
              width={20}
              height={20}
              className="mr-2"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
} 