import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
  // Use getSession from Auth.js instead of auth.validate
  return {
    session: await locals.getSession()
  };
}) satisfies LayoutServerLoad;
