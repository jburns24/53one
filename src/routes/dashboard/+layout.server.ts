import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  
  // If user is not logged in, redirect to home page
  if (!session?.user) {
    throw redirect(303, '/');
  }
  
  return {
    user: session.user
  };
};
