import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'select_account'
        }
      }
    }),
  ],
  debug: true,  // Enable debug logging
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
      // Log the redirect attempt
      console.log('Redirect attempt:', {
        url,
        baseUrl,
        allowedUrls: [
          baseUrl,
          'http://localhost:3000',
          'https://trackerbusiness.vercel.app'
        ]
      });

      // Handle both development and production URLs
      const allowedUrls = [
        baseUrl,
        'http://localhost:3000',
        'https://trackerbusiness.vercel.app'
      ];
      
      // If it's a relative URL, prefix it with the base URL
      if (url.startsWith('/')) {
        const finalUrl = `${baseUrl}${url}`;
        console.log('Redirecting to:', finalUrl);
        return finalUrl;
      }
      
      // Check if the URL is allowed
      const urlObject = new URL(url);
      if (allowedUrls.some(allowed => urlObject.origin === allowed)) {
        console.log('Redirecting to allowed URL:', url);
        return url;
      }
      
      // Default fallback
      const fallback = baseUrl + '/dashboard';
      console.log('Falling back to:', fallback);
      return fallback;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}; 