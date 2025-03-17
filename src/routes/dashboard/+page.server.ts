import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { clientPromise } from '$lib/server/mongodb';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Ensure user is authenticated
    if (!session?.user?.id) {
      throw redirect(303, '/');
    }
    
    // Check if the user has 1RM data in the database
    const user1RMData = await db.collection('userMaxes').findOne({ userId: session.user.id });
    
    // Redirect to 1RM page if no data exists
    if (!user1RMData) {
      throw redirect(303, '/dashboard/1rm');
    }
    
    // If user has 1RM data, redirect to workouts page
    throw redirect(303, '/dashboard/workouts');
  } catch (error) {
    console.error('Error checking user data:', error);
    
    // If there's an error connecting to MongoDB, redirect to the 1RM page as a fallback
    throw redirect(303, '/dashboard/1rm');
  }
};
