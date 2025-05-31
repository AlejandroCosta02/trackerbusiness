'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BusinessForm from '@/components/business/BusinessForm';

interface Business {
  name: string;
  description: string;
  industry: string;
  foundedDate: string;
  logo?: string;
}

export default function BusinessProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch('/api/business', {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.length > 0) {
          setBusiness(data[0]);
        }
      } catch (error) {
        console.error('Error fetching business:', error);
      }
    };

    if (session) {
      fetchBusiness();
    }
  }, [session]);

  const handleSubmit = async (formData: Business) => {
    try {
      console.log('Submitting business data:', formData);
      
      const response = await fetch('/api/business', {
        method: business ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          industry: formData.industry,
          foundedDate: formData.foundedDate,
          logo: formData.logo
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save business: ${response.status}`);
      }

      const savedBusiness = await response.json();
      setBusiness(savedBusiness);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving business:', error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-lg rounded-xl">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {business ? 'Edit Business Profile' : 'Create Business Profile'}
              </h1>
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <BusinessForm
              onSubmit={handleSubmit}
              initialData={business || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 