import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { sequence } from '@sveltejs/kit/hooks';
import type { SvelteKitAuthConfig } from '@auth/sveltekit';

// Import MongoDB client for both Docker and production environments
let clientPromise;
// Check if we're in Docker (will have MongoDB URI with mongodb:27017) or production
const isDocker = env.MONGODB_URI?.includes('mongodb:27017');
const isProduction = process.env.NODE_ENV === 'production';

// Import MongoDB client if we're in Docker or production
if (isDocker || isProduction) {
  // Import MongoDB client
  const { clientPromise: mongoClient } = await import('./mongodb');
  clientPromise = mongoClient;
}

// Create auth configuration with the correct secret
const authConfig = {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || '',
      // Only add development-specific configuration when in development mode
      ...(process.env.NODE_ENV === 'development' ? {
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      } : {})
    })
  ],
  // Use MongoDB adapter in Docker or production, use JWT in local development for easier testing
  ...(clientPromise ? { adapter: MongoDBAdapter(clientPromise) } : {}),
  // Add debug mode for development
  debug: process.env.NODE_ENV === 'development',
  // Only disable secure cookies in development
  ...(process.env.NODE_ENV === 'development' ? {
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax' as 'lax',
          path: "/",
          secure: false
        }
      }
    }
  } : {}),
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
  // We'll handle custom routes ourselves rather than using the pages config
};

// Create the SvelteKitAuth handler
const authHandler = SvelteKitAuth(authConfig as SvelteKitAuthConfig);

// Custom handle function to add any additional server-side logic
const customHandle: Handle = async ({ event, resolve }) => {
  // You can add custom server-side logic here if needed
  return resolve(event);
};

// Export the handle function for hooks.server.ts
// Use sequence to combine multiple handlers if needed
export const handle = sequence(authHandler.handle as Handle, customHandle);
