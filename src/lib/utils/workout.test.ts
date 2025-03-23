import { describe, it, expect } from 'vitest';
import { generate531WorkoutPlan } from './workout';

describe('531 Workout Plan Generator', () => {
  const testTrainingMaxes = {
    squat: 300,
    bench: 200,
    deadlift: 400,
    press: 150
  };

  it('should generate a 4-week workout plan', () => {
    const plan = generate531WorkoutPlan(testTrainingMaxes);
    
    // Check overall structure
    expect(plan).toHaveLength(4); // 4 weeks
    expect(plan[0].week).toBe(1);
    expect(plan[0].workouts).toHaveLength(4); // 4 workouts per week
  });

  it('should calculate correct weights based on percentages', () => {
    const plan = generate531WorkoutPlan(testTrainingMaxes);
    
    // Week 1 (5/5/5) - Squat day
    const week1SquatDay = plan[0].workouts[0];
    expect(week1SquatDay.mainLift.name).toBe('squat');
    
    // Check weights for week 1 squat (65%, 75%, 85%)
    expect(week1SquatDay.mainLift.sets[0].weight).toBe(195); // 300 * 0.65 = 195
    expect(week1SquatDay.mainLift.sets[1].weight).toBe(225); // 300 * 0.75 = 225
    expect(week1SquatDay.mainLift.sets[2].weight).toBe(255); // 300 * 0.85 = 255
    
    // Week 3 (5/3/1) - Bench day
    const week3BenchDay = plan[2].workouts[2];
    expect(week3BenchDay.mainLift.name).toBe('bench');
    
    // Check reps for week 3 bench (5/3/1)
    expect(week3BenchDay.mainLift.sets[0].reps).toBe(5);
    expect(week3BenchDay.mainLift.sets[1].reps).toBe(3);
    expect(week3BenchDay.mainLift.sets[2].reps).toBe(1);
    
    // Week 4 (Deload) - Deadlift day
    const week4DeadliftDay = plan[3].workouts[1];
    expect(week4DeadliftDay.mainLift.name).toBe('deadlift');
    
    // Check weights for week 4 deadlift (40%, 50%, 60%)
    expect(week4DeadliftDay.mainLift.sets[0].weight).toBe(160); // 400 * 0.4 = 160
    expect(week4DeadliftDay.mainLift.sets[1].weight).toBe(200); // 400 * 0.5 = 200
    expect(week4DeadliftDay.mainLift.sets[2].weight).toBe(240); // 400 * 0.6 = 240
  });

  it('should round weights to nearest 5', () => {
    // Create training maxes with values that won't round evenly
    const oddTrainingMaxes = {
      squat: 293,
      bench: 187,
      deadlift: 372,
      press: 143
    };
    
    const plan = generate531WorkoutPlan(oddTrainingMaxes);
    
    // Week 1 - Bench day
    const benchDay = plan[0].workouts[2];
    
    // 187 * 0.65 = 121.55, should round to 120
    expect(benchDay.mainLift.sets[0].weight % 5).toBe(0);
    
    // Week 2 - Press day
    const pressDay = plan[1].workouts[3];
    
    // 143 * 0.7 = 100.1, should round to 100
    expect(pressDay.mainLift.sets[0].weight % 5).toBe(0);
  });

  it('should follow the correct exercise rotation', () => {
    const plan = generate531WorkoutPlan(testTrainingMaxes);
    
    // Week 1 exercise rotation
    expect(plan[0].workouts[0].mainLift.name).toBe('squat');
    expect(plan[0].workouts[1].mainLift.name).toBe('deadlift');
    expect(plan[0].workouts[2].mainLift.name).toBe('bench');
    expect(plan[0].workouts[3].mainLift.name).toBe('press');
    
    // Secondary lifts should follow the pattern
    expect(plan[0].workouts[0].secondaryLift.name).toBe('bench');
    expect(plan[0].workouts[1].secondaryLift.name).toBe('press');
    expect(plan[0].workouts[2].secondaryLift.name).toBe('squat');
    expect(plan[0].workouts[3].secondaryLift.name).toBe('deadlift');
  });

  it('should include assistance work for each workout', () => {
    const plan = generate531WorkoutPlan(testTrainingMaxes);
    
    // Check that each workout has assistance exercises
    plan.forEach(week => {
      week.workouts.forEach(workout => {
        expect(workout.assistance).toBeDefined();
        expect(workout.assistance.length).toBeGreaterThan(0);
      });
    });
  });
});
