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
    
    // If no workout plan exists, redirect to the 1RM page
    if (!userMaxes || !workoutPlan) {
      throw redirect(303, '/dashboard/1rm');
    }
    
    // Return the data from MongoDB
    return {
      trainingMaxes: userMaxes.trainingMaxes,
      weeks: workoutPlan.plan
    };
  } catch (error) {
    console.error('Error fetching workout data:', error);
    
    // If there's an error connecting to MongoDB, redirect to the 1RM page
    throw redirect(303, '/dashboard/1rm');
  }
};

// Function to generate placeholder workout plan data
function generatePlaceholderWorkoutPlan(trainingMaxes: { squat: number; bench: number; deadlift: number; press: number }) {
  // 5/3/1 percentages for each week
  const weekOnePercentages = [0.65, 0.75, 0.85];
  const weekTwoPercentages = [0.70, 0.80, 0.90];
  const weekThreePercentages = [0.75, 0.85, 0.95];
  const weekFourPercentages = [0.40, 0.50, 0.60]; // Deload week
  
  // Exercise rotation for the 4-week cycle
  const exerciseRotation = [
    { main: 'squat', secondary: 'bench' },
    { main: 'deadlift', secondary: 'press' },
    { main: 'bench', secondary: 'squat' },
    { main: 'press', secondary: 'deadlift' }
  ];
  
  // Generate the 4-week plan
  const weeks = [];
  
  for (let week = 1; week <= 4; week++) {
    const workouts = [];
    const percentages = week === 1 ? weekOnePercentages : 
                        week === 2 ? weekTwoPercentages : 
                        week === 3 ? weekThreePercentages : 
                        weekFourPercentages;
    
    // Each week has 4 workout days
    for (let day = 1; day <= 4; day++) {
      const rotation = exerciseRotation[day - 1];
      const mainLift = rotation.main;
      const secondaryLift = rotation.secondary;
      
      const mainTM = trainingMaxes[mainLift as keyof typeof trainingMaxes];
      const secondaryTM = trainingMaxes[secondaryLift as keyof typeof trainingMaxes];
      
      // Calculate sets for main lift
      const mainSets = percentages.map(percentage => {
        const weight = Math.round(mainTM * percentage / 5) * 5; // Round to nearest 5
        return {
          percentage,
          weight,
          reps: week === 3 ? (percentage === 0.75 ? 5 : percentage === 0.85 ? 3 : 1) : 
                week === 4 ? 5 : // Deload week
                week === 2 ? 3 : // Week 2 (3/3/3)
                5 // Week 1 (5/5/5)
        };
      });
      
      // Calculate sets for secondary lift (5x10 at 50% for BBB)
      const secondarySets = Array(5).fill(null).map(() => ({
        percentage: 0.5,
        weight: Math.round(secondaryTM * 0.5 / 5) * 5,
        reps: 10
      }));
      
      workouts.push({
        day,
        mainLift: {
          name: mainLift,
          sets: mainSets
        },
        secondaryLift: {
          name: secondaryLift,
          sets: secondarySets
        },
        assistance: [
          // Example assistance work
          { name: 'Pull-ups', sets: 5, reps: 10 },
          { name: 'Ab Wheel', sets: 5, reps: 10 }
        ]
      });
    }
    
    weeks.push({
      week,
      workouts
    });
  }
  
  return weeks;
}
