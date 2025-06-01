'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface BusinessData {
  name: string;
  description: string;
  industry: string;
  foundedDate: string;
  logo?: string;
}

interface BusinessFormProps {
  onSubmit: (data: BusinessData) => void;
  initialData?: BusinessData;
}

export default function BusinessForm({ onSubmit, initialData }: BusinessFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<BusinessData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    industry: initialData?.industry || '',
    foundedDate: initialData?.foundedDate || new Date().toISOString().split('T')[0],
    logo: initialData?.logo || ''
  });
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.logo || '');

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      // Create a preview URL for the selected image
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Convert the image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Verify the base64 string is valid
        if (base64String && base64String.startsWith('data:image/')) {
          setFormData(prev => ({ ...prev, logo: base64String }));
          console.log('Logo updated successfully');
        } else {
          alert('Failed to process the image. Please try another one.');
        }
      };
      reader.onerror = () => {
        alert('Error reading the image file. Please try another one.');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing the image. Please try another one.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.logo && !formData.logo.startsWith('data:image/')) {
        alert('Invalid image format. Please upload the image again.');
        return;
      }
      console.log('Submitting form data with logo:', formData.logo ? 'Logo present' : 'No logo');
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="space-y-6">
        {/* Logo Upload Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Business Logo
          </label>
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Business logo"
                    width={96}
                    height={96}
                    className="h-24 w-24 object-cover"
                  />
                ) : (
                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Upload Logo
              </button>
              <p className="mt-1 text-xs text-gray-500">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
            Business Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white py-2.5"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your business name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your business"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-semibold text-gray-900 mb-2">
            Industry
          </label>
          <input
            type="text"
            id="industry"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white py-2.5"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="Enter your industry"
          />
        </div>

        <div>
          <label htmlFor="foundedDate" className="block text-sm font-semibold text-gray-900 mb-2">
            Founded Date
          </label>
          <input
            type="date"
            id="foundedDate"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white py-2.5"
            value={formData.foundedDate}
            onChange={(e) => setFormData({ ...formData, foundedDate: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
} 