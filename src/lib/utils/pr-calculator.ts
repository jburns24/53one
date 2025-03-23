/**
 * Types for PR data
 */
export interface PR {
  weight: number;
  reps: number;
}

export interface PRData {
  squat: PR;
  bench: PR;
  deadlift: PR;
  press: PR;
}

export interface CompletedWorkout {
  mainLift: {
    name: string;
  };
  sets: Array<{
    weight: number;
    reps: number;
  }>;
}

/**
 * Calculates personal records from completed workouts
 * Uses the Epley formula: weight * (1 + reps/30) to estimate 1RM
 * 
 * @param completedWorkouts Array of completed workouts
 * @returns Object containing PRs for each lift
 */
export function calculatePRs(completedWorkouts: CompletedWorkout[]): PRData {
  const prs: PRData = {
    squat: { weight: 0, reps: 0 },
    bench: { weight: 0, reps: 0 },
    deadlift: { weight: 0, reps: 0 },
    press: { weight: 0, reps: 0 }
  };
  
  // Process each completed workout
  for (const workout of completedWorkouts) {
    if (!workout.mainLift || !workout.sets) {
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
      continue;
    }
    
    // Check each set for potential PRs
    for (const set of workout.sets) {
      if (!set.weight || !set.reps) continue;
      
      // Convert to numbers to ensure proper calculation
      const weight = Number(set.weight);
      const reps = Number(set.reps);
      
      // Calculate estimated 1RM using Epley formula: weight * (1 + reps/30)
      const estimated1RM = weight * (1 + reps/30);
      
      // Update PR if this set has a higher estimated 1RM
      const currentEstimated1RM = prs[liftName as keyof PRData].weight * (1 + prs[liftName as keyof PRData].reps/30);
      
      if (estimated1RM > currentEstimated1RM) {
        prs[liftName as keyof PRData] = { weight, reps };
      }
    }
  }
  
  return prs;
}
