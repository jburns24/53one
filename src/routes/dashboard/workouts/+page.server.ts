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

    // Fetch user's maxes and workout plan from the database
    const userMaxes = await db.collection('userMaxes').findOne({ userId: session.user.id });
    const workoutPlan = await db.collection('workoutPlans').findOne({ userId: session.user.id });

    // Get the current plan ID
    const planId = workoutPlan?.planId || 'default';

    // Fetch workout progress data for the current plan
    const progressData = await db.collection('workoutProgress')
      .find({ userId: session.user.id, planId: planId })
      .toArray();

    // Convert MongoDB documents to plain JavaScript objects to avoid serialization issues
    const serializedProgressData = progressData.map(item => ({
      userId: item.userId,
      week: item.week,
      day: item.day,
      mainLift: item.mainLift,
      setIndex: item.setIndex,
      completed: item.completed,
      amrapReps: item.amrapReps,
      workoutCompleted: item.workoutCompleted,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null
    }));

    // If no workout plan exists, redirect to the 1RM page
    if (!userMaxes || !workoutPlan) {
      throw redirect(303, '/dashboard/1rm');
    }

    // Return the data from MongoDB
    return {
      trainingMaxes: userMaxes.trainingMaxes,
      weeks: workoutPlan.plan,
      progress: serializedProgressData,
      planId: planId
    };
  } catch (error) {
    console.error('Error fetching workout data:', error);

    // If there's an error connecting to MongoDB, redirect to the 1RM page
    throw redirect(303, '/dashboard/1rm');
  }
};
