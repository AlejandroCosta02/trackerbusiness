import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Navbar } from "@/components/navigation/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Business Tracker",
  description: "Track and manage your business finances",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full overflow-x-hidden`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col relative">
            <Navbar />
            <main className="flex-1 pt-16 w-full">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
