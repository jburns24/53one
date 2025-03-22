import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { clientPromise } from '$lib/server/mongodb';

export const POST: RequestHandler = async ({ request, locals }: { request: Request; locals: App.Locals }) => {
  // Get user session
  const session = await locals.getSession();
  
  // Check if user is authenticated
  if (!session?.user) {
    return json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }
  
  try {
    // Parse request body
    const { workout, planId, completedAt } = await request.json();
    
    // Validate required fields
    if (!workout || !workout.mainLift || !workout.sets) {
      return json({ success: false, message: 'Missing required workout data' }, { status: 400 });
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Save the completed workout with all set information
    await db.collection('completedWorkouts').insertOne({
      userId: session.user.id,
      planId: planId || 'default',
      mainLift: workout.mainLift,
      sets: workout.sets,
      completedAt: completedAt ? new Date(completedAt) : new Date()
    });
    
    return json({ success: true });
  } catch (error) {
    console.error('Error saving completed workout:', error);
    return json({ success: false, message: 'Server error' }, { status: 500 });
  }
};
