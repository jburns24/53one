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
    const { week, day, setIndex, completed, mainLift } = await request.json();
    
    // Validate required fields
    if (week === undefined || day === undefined || setIndex === undefined || completed === undefined || !mainLift) {
      return json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Create a unique identifier for this set
    const setId = `${week}-${day}-${mainLift}-${setIndex}`;
    
    // Update or create progress entry
    await db.collection('workoutProgress').updateOne(
      { 
        userId: session.user.id,
        setId
      },
      { 
        $set: { 
          userId: session.user.id,
          week,
          day,
          mainLift,
          setIndex,
          completed,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    return json({ success: true });
  } catch (error) {
    console.error('Error tracking workout progress:', error);
    return json({ success: false, message: 'Server error' }, { status: 500 });
  }
};
