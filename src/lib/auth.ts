import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
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
      console.log('Redirect attempt:', { url, baseUrl });
      
      // If it's a relative URL, prefix it with the base URL
      if (url.startsWith('/')) {
        const finalUrl = `${baseUrl}${url}`;
        console.log('Redirecting to relative URL:', finalUrl);
        return finalUrl;
      }
      
      // If the URL is the base URL or starts with it, allow it
      if (url.startsWith(baseUrl)) {
        console.log('Redirecting to base URL:', url);
        return url;
      }
      
      // Default to dashboard
      const defaultUrl = `${baseUrl}/dashboard`;
      console.log('Redirecting to default:', defaultUrl);
      return defaultUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}; 