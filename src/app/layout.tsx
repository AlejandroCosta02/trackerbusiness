import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Navbar } from "@/components/navigation/Navbar";
import { Metadata } from 'next';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Business Tracker - Track Your Business Finances',
  description: 'A modern web application for tracking business investments, expenses, and profits in real-time.',
  keywords: 'business tracker, finance management, expense tracking, profit monitoring, business analytics',
  authors: [{ name: 'Alex Costa' }],
  openGraph: {
    title: 'Business Tracker',
    description: 'Track your business finances with ease',
    url: 'https://trackerbusiness.vercel.app',
    siteName: 'Business Tracker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Business Tracker Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Tracker',
    description: 'Track your business finances with ease',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-gradient-to-b from-indigo-50 via-white to-indigo-50`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 w-full overflow-y-auto">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
