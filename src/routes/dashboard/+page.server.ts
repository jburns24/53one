import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  
  // Placeholder for database check - in a real implementation, 
  // you would check if the user has 1RM data in the database
  // For now, we'll simulate this by always redirecting to the 1RM page
  // Later, this would check a database collection for the user's 1RM data
  
  // Redirect to 1RM page if no data exists
  throw redirect(303, '/dashboard/1rm');
  
  // When we have actual data checking, the code would look like:
  // const user1RMData = await db.collection('userMaxes').findOne({ userId: session.user.id });
  // if (!user1RMData) {
  //   throw redirect(303, '/dashboard/1rm');
  // }
  
  // return {
  //   workoutPlan: await db.collection('workoutPlans').findOne({ userId: session.user.id })
  // };
};
