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
          response_type: "code",
        }
      },
      checks: ["pkce", "state"],
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  useSecureCookies: true,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
      
      // Always use the production URL for callbacks in production
      const prodUrl = 'https://trackerbusiness.vercel.app';
      const effectiveBaseUrl = process.env.NODE_ENV === 'production' ? prodUrl : baseUrl;
      
      // If it's a relative URL, prefix it with the base URL
      if (url.startsWith('/')) {
        const finalUrl = `${effectiveBaseUrl}${url}`;
        console.log('Redirecting to relative URL:', finalUrl);
        return finalUrl;
      }
      
      // If the URL is the base URL or starts with it, allow it
      if (url.startsWith(effectiveBaseUrl)) {
        console.log('Redirecting to base URL:', url);
        return url;
      }
      
      // Default to dashboard
      const defaultUrl = `${effectiveBaseUrl}/dashboard`;
      console.log('Redirecting to default:', defaultUrl);
      return defaultUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}; 