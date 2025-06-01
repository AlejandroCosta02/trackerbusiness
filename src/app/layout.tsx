import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Navbar } from "@/components/navigation/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Business Tracker",
  description: "Track and manage your business finances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
