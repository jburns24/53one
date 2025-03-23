import { describe, it, expect } from 'vitest';
import { calculatePRs, type CompletedWorkout } from '../../../src/lib/utils/pr-calculator';

describe('PR Calculator', () => {
  it('should calculate PRs correctly from completed workouts', () => {
    // Arrange
    const completedWorkouts: CompletedWorkout[] = [
      {
        mainLift: { name: 'Squat' },
        sets: [
          { weight: 225, reps: 5 },
          { weight: 275, reps: 3 },
          { weight: 315, reps: 1 }
        ]
      },
      {
        mainLift: { name: 'Bench Press' },
        sets: [
          { weight: 185, reps: 5 },
          { weight: 205, reps: 3 },
          { weight: 225, reps: 1 }
        ]
      },
      {
        mainLift: { name: 'Deadlift' },
        sets: [
          { weight: 315, reps: 5 },
          { weight: 365, reps: 3 },
          { weight: 405, reps: 1 }
        ]
      },
      {
        mainLift: { name: 'Overhead Press' },
        sets: [
          { weight: 95, reps: 5 },
          { weight: 115, reps: 3 },
          { weight: 135, reps: 1 }
        ]
      }
    ];
    
    // Act
    const prs = calculatePRs(completedWorkouts);
    
    // Assert
    // For squat: 315 x 1 has higher e1RM than 275 x 3 or 225 x 5
    expect(prs.squat).toEqual({ weight: 315, reps: 1 });
    
    // For bench: 225 x 1 has higher e1RM than 205 x 3 or 185 x 5
    expect(prs.bench).toEqual({ weight: 225, reps: 1 });
    
    // For deadlift: 405 x 1 has higher e1RM than 365 x 3 or 315 x 5
    expect(prs.deadlift).toEqual({ weight: 405, reps: 1 });
    
    // For press: 135 x 1 has higher e1RM than 115 x 3 or 95 x 5
    expect(prs.press).toEqual({ weight: 135, reps: 1 });
  });
  
  it('should handle variations in lift names', () => {
    // Arrange
    const completedWorkouts: CompletedWorkout[] = [
      {
        mainLift: { name: 'Back Squat' },
        sets: [{ weight: 315, reps: 1 }]
      },
      {
        mainLift: { name: 'Flat Bench Press' },
        sets: [{ weight: 225, reps: 1 }]
      },
      {
        mainLift: { name: 'Conventional Deadlift' },
        sets: [{ weight: 405, reps: 1 }]
      },
      {
        mainLift: { name: 'Standing Overhead Press' },
        sets: [{ weight: 135, reps: 1 }]
      }
    ];
    
    // Act
    const prs = calculatePRs(completedWorkouts);
    
    // Assert
    expect(prs.squat).toEqual({ weight: 315, reps: 1 });
    expect(prs.bench).toEqual({ weight: 225, reps: 1 });
    expect(prs.deadlift).toEqual({ weight: 405, reps: 1 });
    expect(prs.press).toEqual({ weight: 135, reps: 1 });
  });
  
  it('should compare estimated 1RMs to determine PRs', () => {
    // Arrange
    const completedWorkouts: CompletedWorkout[] = [
      // First workout
      {
        mainLift: { name: 'Squat' },
        sets: [{ weight: 225, reps: 5 }] // e1RM = 225 * (1 + 5/30) = 262.5
      },
      // Second workout (higher weight, lower reps)
      {
        mainLift: { name: 'Squat' },
        sets: [{ weight: 275, reps: 1 }] // e1RM = 275 * (1 + 1/30) = 284.17
      },
      // Third workout (lower weight, higher reps)
      {
        mainLift: { name: 'Squat' },
        sets: [{ weight: 245, reps: 8 }] // e1RM = 245 * (1 + 8/30) = 310.33
      }
    ];
    
    // Act
    const prs = calculatePRs(completedWorkouts);
    
    // Assert - The 245x8 should be the PR due to higher e1RM
    expect(prs.squat).toEqual({ weight: 245, reps: 8 });
  });
  
  it('should handle empty or invalid workout data', () => {
    // Arrange
    const completedWorkouts: CompletedWorkout[] = [
      // Missing sets
      {
        mainLift: { name: 'Squat' },
        sets: []
      },
      // Invalid lift name
      {
        mainLift: { name: 'Unknown Exercise' },
        sets: [{ weight: 100, reps: 10 }]
      },
      // Missing weight or reps
      {
        mainLift: { name: 'Bench Press' },
        sets: [{ weight: 0, reps: 5 }]
      }
    ];
    
    // Act
    const prs = calculatePRs(completedWorkouts);
    
    // Assert - All PRs should be default values
    expect(prs).toEqual({
      squat: { weight: 0, reps: 0 },
      bench: { weight: 0, reps: 0 },
      deadlift: { weight: 0, reps: 0 },
      press: { weight: 0, reps: 0 }
    });
  });
});
