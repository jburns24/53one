import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// Only import MongoDB client in production mode
let clientPromise;
if (process.env.NODE_ENV !== 'development') {
  // Dynamic import to avoid connection errors in development
  const { clientPromise: mongoClient } = await import('./mongodb');
  clientPromise = mongoClient;
}

// Create auth configuration with the correct secret
const authConfig = {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  // Use MongoDB adapter only in production, use JWT in development for easier testing
  ...(process.env.NODE_ENV !== 'development' && clientPromise ? { adapter: MongoDBAdapter(clientPromise) } : {}),
  // Add debug mode for development
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    session: ({ session, user, token }: { session: any, user: any, token: any }) => {
      if (session.user) {
        // If using JWT in development, get the ID from the token
        if (process.env.NODE_ENV === 'development' && token) {
          session.user.id = token.sub;
        } else if (user) {
          // If using adapter in production, get the ID from the user
          session.user.id = user.id;
        }
      }
      return session;
    }
  },
  // AUTH_SECRET is just a random string used to encrypt cookies and sessions
  // For development, you can use any random string
  // For production, use a secure random string
  secret: env.AUTH_SECRET || 'this_is_a_dev_secret_do_not_use_in_production',
  // Add CSRF protection configuration
  trustHost: true
};

// Get the auth handler from SvelteKitAuth
const auth = SvelteKitAuth(authConfig);

// Export the handle function for hooks.server.ts
export const handle = auth.handle as unknown as Handle;

