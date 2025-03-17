import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clientPromise } from '$lib/server/mongodb';

export const POST: RequestHandler = async ({ request, locals }) => {
  // Get the current user session
  const session = await locals.getSession();
  
  // Ensure user is authenticated
  if (!session?.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Parse the form data
    const formData = await request.formData();
    const squat = Number(formData.get('squat'));
    const bench = Number(formData.get('bench'));
    const deadlift = Number(formData.get('deadlift'));
    const press = Number(formData.get('press'));
    
    // Validate the input
    if (squat <= 0 || bench <= 0 || deadlift <= 0 || press <= 0) {
      return json({ error: 'All lifts must have values greater than 0' }, { status: 400 });
    }
    
    // Calculate training maxes (90% of 1RM)
    const trainingMaxes = {
      squat: Math.round(squat * 0.9),
      bench: Math.round(bench * 0.9),
      deadlift: Math.round(deadlift * 0.9),
      press: Math.round(press * 0.9)
    };
    
    // Generate the 4-week workout plan
    const workoutPlan = generate531WorkoutPlan(trainingMaxes);
    
    // Connect to MongoDB and save the data
    const client = await clientPromise;
    const db = client.db();
    
    // Save user's 1RM values and training maxes
    await db.collection('userMaxes').updateOne(
      { userId: session.user.id },
      { 
        $set: { 
          squat, bench, deadlift, press,
          trainingMaxes,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    // Save the generated workout plan
    await db.collection('workoutPlans').updateOne(
      { userId: session.user.id },
      { 
        $set: { 
          plan: workoutPlan,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    return json({ 
      success: true, 
      trainingMaxes,
      workoutPlan
    });
  } catch (error) {
    console.error('Error generating workout plan:', error);
    return json({ error: 'Failed to generate workout plan' }, { status: 500 });
  }
};

// Function to generate a 5/3/1 workout plan based on training maxes
function generate531WorkoutPlan(trainingMaxes: { squat: number; bench: number; deadlift: number; press: number }) {
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
  const plan = [];
  
  for (let week = 1; week <= 4; week++) {
    const weekPlan = [];
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
                5 // Weeks 1 and 2
        };
      });
      
      // Calculate sets for secondary lift (5x10 at 50% for BBB)
      const secondarySets = Array(5).fill({
        percentage: 0.5,
        weight: Math.round(secondaryTM * 0.5 / 5) * 5,
        reps: 10
      });
      
      weekPlan.push({
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
    
    plan.push({
      week,
      workouts: weekPlan
    });
  }
  
  return plan;
}
