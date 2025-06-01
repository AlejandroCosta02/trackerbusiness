import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      // Handle both development and production URLs
      const allowedUrls = [
        baseUrl,
        'http://localhost:3000',
        'https://trackerbusiness.vercel.app'
      ];
      
      // If it's a relative URL, prefix it with the base URL
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Check if the URL is allowed
      const urlObject = new URL(url);
      if (allowedUrls.some(allowed => urlObject.origin === allowed)) {
        return url;
      }
      
      // Default fallback
      return baseUrl + '/dashboard';
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}; 