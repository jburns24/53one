import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { clientPromise } from '$lib/server/mongodb';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  
  // Ensure user is authenticated
  if (!session?.user) {
    throw redirect(303, '/');
  }
  
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch user's maxes from the database
    const userMaxes = await db.collection('userMaxes').findOne({ userId: session.user.id });
    
    // Check if user has an existing workout plan
    const workoutPlan = await db.collection('workoutPlans').findOne({ userId: session.user.id });
    const hasWorkoutPlan = !!workoutPlan;
    
    console.log('1RM Page Load - User ID:', session.user.id);
    console.log('1RM Page Load - User Maxes Found:', !!userMaxes);
    console.log('1RM Page Load - Has Workout Plan:', hasWorkoutPlan);
    
    if (userMaxes) {
      console.log('1RM Values:', {
        squat: userMaxes.squat,
        bench: userMaxes.bench,
        deadlift: userMaxes.deadlift,
        press: userMaxes.press
      });
    }
    
    // Return the data from MongoDB (or null if not found)
    return {
      userMaxes: userMaxes ? {
        squat: userMaxes.squat || 0,
        bench: userMaxes.bench || 0,
        deadlift: userMaxes.deadlift || 0,
        press: userMaxes.press || 0
      } : null,
      hasWorkoutPlan
    };
  } catch (error) {
    console.error('Error fetching user maxes:', error);
    
    // Return null if there's an error
    return { userMaxes: null };
  }
};
