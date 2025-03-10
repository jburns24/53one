import { clientPromise } from './mongodb';
import type { ObjectId } from 'mongodb';

export interface WorkoutData {
  userId: string;
  squat: number;
  deadlift: number;
  benchPress: number;
  overheadPress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSchedule {
  userId: string;
  weeklyWorkouts: {
    day: string;
    exercises: {
      name: string;
      sets: number;
      reps: number;
      weight: number;
    }[];
  }[];
  createdAt: Date;
}

export async function saveWorkoutData(workoutData: Omit<WorkoutData, 'createdAt' | 'updatedAt'>) {
  const client = await clientPromise;
  const db = client.db('53one');
  
  const now = new Date();
  const result = await db.collection('workoutData').insertOne({
    ...workoutData,
    createdAt: now,
    updatedAt: now
  });
  
  return result;
}

export async function getLatestWorkoutData(userId: string) {
  const client = await clientPromise;
  const db = client.db('53one');
  
  return db.collection('workoutData').findOne(
    { userId },
    { sort: { updatedAt: -1 } }
  );
}

export async function generateWorkoutSchedule(userId: string) {
  const workoutData = await getLatestWorkoutData(userId);
  
  if (!workoutData) {
    throw new Error('No workout data found for user');
  }
  
  const schedule: Omit<WorkoutSchedule, 'createdAt'> = {
    userId,
    weeklyWorkouts: [
      {
        day: 'Monday',
        exercises: [
          {
            name: 'Squat',
            sets: 5,
            reps: 5,
            weight: Math.round(workoutData.squat * 0.8 / 5) * 5 // 80% of 1RM, rounded to nearest 5
          },
          {
            name: 'Bench Press',
            sets: 5,
            reps: 5,
            weight: Math.round(workoutData.benchPress * 0.8 / 5) * 5
          }
        ]
      },
      {
        day: 'Wednesday',
        exercises: [
          {
            name: 'Deadlift',
            sets: 3,
            reps: 5,
            weight: Math.round(workoutData.deadlift * 0.8 / 5) * 5
          },
          {
            name: 'Overhead Press',
            sets: 5,
            reps: 5,
            weight: Math.round(workoutData.overheadPress * 0.8 / 5) * 5
          }
        ]
      },
      {
        day: 'Friday',
        exercises: [
          {
            name: 'Squat',
            sets: 5,
            reps: 5,
            weight: Math.round(workoutData.squat * 0.75 / 5) * 5 // 75% of 1RM for variation
          },
          {
            name: 'Bench Press',
            sets: 5,
            reps: 5,
            weight: Math.round(workoutData.benchPress * 0.75 / 5) * 5
          }
        ]
      }
    ]
  };
  
  const client = await clientPromise;
  const db = client.db('53one');
  
  const result = await db.collection('workoutSchedules').insertOne({
    ...schedule,
    createdAt: new Date()
  });
  
  return { ...schedule, _id: result.insertedId };
}

export async function getLatestWorkoutSchedule(userId: string) {
  const client = await clientPromise;
  const db = client.db('53one');
  
  return db.collection('workoutSchedules').findOne(
    { userId },
    { sort: { createdAt: -1 } }
  );
}
