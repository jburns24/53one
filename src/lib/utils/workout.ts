/**
 * Function to generate a 5/3/1 workout plan based on training maxes
 * @param trainingMaxes Object containing training maxes for squat, bench, deadlift, and press
 * @returns A 4-week workout plan following the 5/3/1 methodology
 */
export function generate531WorkoutPlan(trainingMaxes: { squat: number; bench: number; deadlift: number; press: number }) {
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
                week === 2 ? 3 : // Week 2: 3 reps
                5 // Week 1: 5 reps
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
