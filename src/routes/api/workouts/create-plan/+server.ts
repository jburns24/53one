import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clientPromise } from '$lib/server/mongodb';
import { generate531WorkoutPlan } from '$lib/utils/workout';

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
    
    // Generate a unique plan ID (timestamp + random string)
    const planId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Save the generated workout plan with the unique plan ID
    await db.collection('workoutPlans').updateOne(
      { userId: session.user.id },
      { 
        $set: { 
          plan: workoutPlan,
          planId: planId,
          oneRepMaxes: {
            squat,
            bench,
            deadlift,
            press
          },
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    // Redirect to the 1RM page with updated values
    return new Response(null, {
      status: 303,
      headers: {
        Location: '/dashboard/1rm?success=true'
      }
    });
  } catch (error) {
    console.error('Error generating workout plan:', error);
    return json({ error: 'Failed to generate workout plan' }, { status: 500 });
  }
};


