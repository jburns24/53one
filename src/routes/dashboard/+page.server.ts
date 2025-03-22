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
    
    // Fetch workout history data
    const workoutHistory = await db.collection('workoutPlans')
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Fetch completed workouts for PR calculation
    const completedWorkouts = await db.collection('completedWorkouts')
      .find({ userId: session.user.id })
      .sort({ completedAt: -1 })
      .toArray();
    
    // Convert MongoDB documents to serializable plain objects
    const serializedWorkoutHistory = JSON.parse(JSON.stringify(workoutHistory));
    const serializedCompletedWorkouts = JSON.parse(JSON.stringify(completedWorkouts));
    const serializedUser1RMData = user1RMData ? JSON.parse(JSON.stringify(user1RMData)) : null;
    
    // Calculate PRs and 1RM history
    const prData = calculatePRs(serializedCompletedWorkouts);
    const oneRMHistory = extractOneRMHistory(serializedWorkoutHistory as unknown as WorkoutPlan[]);
    
    return {
      user1RMData: serializedUser1RMData,
      prData,
      oneRMHistory,
      theoreticalTotal: calculateTheoreticalTotal(prData)
    };
  } catch (error) {
    console.error('Error fetching workout history data:', error);
    
    // If there's an error connecting to MongoDB, redirect to the 1RM page as a fallback
    throw redirect(303, '/dashboard/1rm');
  }
};

// Define types for our data structures
type LiftRecord = { weight: number; reps: number };
type PRData = {
  squat: LiftRecord;
  bench: LiftRecord;
  deadlift: LiftRecord;
  press: LiftRecord;
};
type CompletedWorkout = {
  mainLift: { name: string };
  sets: Array<{ weight: number; reps: number }>;
};

// Calculate personal records from completed workouts
function calculatePRs(completedWorkouts: any[]): PRData {
  const prs: PRData = {
    squat: { weight: 0, reps: 0 },
    bench: { weight: 0, reps: 0 },
    deadlift: { weight: 0, reps: 0 },
    press: { weight: 0, reps: 0 }
  };
  
  console.log(`Processing ${completedWorkouts.length} completed workouts for PRs`);
  
  // Process each completed workout
  for (const workout of completedWorkouts) {
    if (!workout.mainLift || !workout.sets) {
      console.log('Skipping workout without mainLift or sets');
      continue;
    }
    
    // Map the workout name to our standard lift names
    let liftName = workout.mainLift.name.toLowerCase();
    
    // Handle variations in lift names
    if (liftName.includes('squat')) liftName = 'squat';
    else if (liftName.includes('bench')) liftName = 'bench';
    else if (liftName.includes('deadlift')) liftName = 'deadlift';
    else if (liftName.includes('press') || liftName.includes('overhead')) liftName = 'press';
    
    if (!(liftName in prs)) {
      console.log(`Skipping unknown lift: ${liftName}`);
      continue;
    }
    
    console.log(`Processing ${workout.sets.length} sets for ${liftName}`);
    
    // Check each set for potential PRs
    for (const set of workout.sets) {
      if (!set.weight || !set.reps) continue;
      
      // Convert to numbers to ensure proper calculation
      const weight = Number(set.weight);
      const reps = Number(set.reps);
      
      console.log(`Evaluating set: ${weight} lbs x ${reps} reps for ${liftName}`);
      
      // Calculate estimated 1RM using Epley formula: weight * (1 + reps/30)
      const estimated1RM = weight * (1 + reps/30);
      
      // Update PR if this set has a higher estimated 1RM
      const currentEstimated1RM = prs[liftName as keyof PRData].weight * (1 + prs[liftName as keyof PRData].reps/30);
      
      if (estimated1RM > currentEstimated1RM) {
        console.log(`New PR for ${liftName}: ${weight} lbs x ${reps} reps (e1RM: ${Math.round(estimated1RM)} lbs)`);
        prs[liftName as keyof PRData] = { weight, reps };
      }
    }
  }
  
  return prs;
}

type DataPoint = { date: string; value: number };
type HistoryData = {
  squat: DataPoint[];
  bench: DataPoint[];
  deadlift: DataPoint[];
  press: DataPoint[];
};
type WorkoutPlan = {
  planId?: string;
  oneRepMaxes?: {
    squat?: number;
    bench?: number;
    deadlift?: number;
    press?: number;
  };
  createdAt?: string | Date;
};

// Extract 1RM history from workout plans
function extractOneRMHistory(workoutHistory: WorkoutPlan[]): HistoryData {
  const history: HistoryData = {
    squat: [],
    bench: [],
    deadlift: [],
    press: []
  };
  
  for (const plan of workoutHistory) {
    if (!plan.oneRepMaxes || !plan.createdAt) {
      console.log('Skipping plan without oneRepMaxes or createdAt:', plan.planId || 'unknown');
      continue;
    }
    
    const date = new Date(plan.createdAt).toISOString().split('T')[0];
    console.log(`Processing plan from ${date} with 1RMs:`, plan.oneRepMaxes);
    
    // Add data points for each lift
    for (const lift of Object.keys(history) as Array<keyof HistoryData>) {
      const value = plan.oneRepMaxes[lift as keyof typeof plan.oneRepMaxes];
      if (value) {
        console.log(`Adding history point for ${lift}: ${value} on ${date}`);
        history[lift].push({
          date,
          value: Number(value)
        });
      }
    }
  }
  
  // Sort data points by date
  for (const lift of Object.keys(history) as Array<keyof HistoryData>) {
    history[lift].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    console.log(`${lift} history points:`, history[lift].length);
  }
  
  return history;
}

// Calculate theoretical total from PRs
function calculateTheoreticalTotal(prData: PRData): number {
  let total = 0;
  
  for (const lift of Object.keys(prData) as Array<keyof PRData>) {
    const { weight, reps } = prData[lift];
    // Calculate estimated 1RM using Epley formula
    const estimated1RM = weight * (1 + reps/30);
    total += Math.round(estimated1RM);
  }
  
  return total;
}
