import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { clientPromise } from './mongodb';
import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// Create auth configuration with the correct secret
const authConfig = {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, user }: { session: any, user: any }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  // AUTH_SECRET is just a random string used to encrypt cookies and sessions
  // For development, you can use any random string
  // For production, use a secure random string
  secret: env.AUTH_SECRET || 'this_is_a_dev_secret_do_not_use_in_production'
};

// Get the auth handler from SvelteKitAuth
const auth = SvelteKitAuth(authConfig);

// Export the handle function for hooks.server.ts
export const handle = auth.handle as unknown as Handle;

