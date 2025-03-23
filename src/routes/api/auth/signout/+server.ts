import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, cookies }) => {
  // Clear the session cookie
  const sessionCookieName = process.env.NODE_ENV === 'development' 
    ? 'next-auth.session-token'
    : '__Secure-next-auth.session-token';
  
  cookies.delete(sessionCookieName, {
    path: '/',
  });
  
  // Clear any other auth-related cookies
  cookies.delete('__Secure-next-auth.callback-url', { path: '/' });
  cookies.delete('__Secure-next-auth.csrf-token', { path: '/' });
  cookies.delete('next-auth.callback-url', { path: '/' });
  cookies.delete('next-auth.csrf-token', { path: '/' });
  
  // Redirect to home page after signout
  return redirect(303, '/');
};
