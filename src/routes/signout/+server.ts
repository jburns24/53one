import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

// This is a fallback route for compatibility with Docker environment
export const GET: RequestHandler = async () => {
  // Redirect to our custom signout handler
  return redirect(303, '/api/auth/signout');
};
