import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../../../src/routes/api/workouts/create-plan/+server';
import { generate531WorkoutPlan } from '../../../../../src/lib/utils/workout';

// Mock the workout generator
vi.mock('../../../../../src/lib/utils/workout', () => ({
  generate531WorkoutPlan: vi.fn().mockReturnValue([
    { week: 1, workouts: [] },
    { week: 2, workouts: [] },
    { week: 3, workouts: [] },
    { week: 4, workouts: [] }
  ])
}));

// Mock MongoDB client
vi.mock('../../../../../src/lib/server/mongodb', () => {
  const mockUpdateOne = vi.fn().mockResolvedValue({ acknowledged: true });
  const mockCollection = vi.fn().mockReturnValue({
    updateOne: mockUpdateOne
  });
  const mockDb = vi.fn().mockReturnValue({
    collection: mockCollection
  });
  const mockClient = {
    db: mockDb
  };
  return {
    clientPromise: Promise.resolve(mockClient)
  };
});

describe('Create Workout Plan API', () => {
  let mockRequest: Request;
  let mockLocals: App.Locals;
  let mockFormData: FormData;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock form data
    mockFormData = new FormData();
    mockFormData.append('squat', '315');
    mockFormData.append('bench', '225');
    mockFormData.append('deadlift', '405');
    mockFormData.append('press', '135');
    
    // Mock request with form data
    mockRequest = {
      formData: vi.fn().mockResolvedValue(mockFormData)
    } as unknown as Request;
    
    // Mock locals with session
    mockLocals = {
      getSession: vi.fn().mockResolvedValue({
        user: { id: 'test-user-id' }
      })
    } as unknown as App.Locals;
    
    // Mock Date.now for predictable planId generation
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });
  
  it('should create a workout plan successfully', async () => {
    // Act
    const response = await POST({ request: mockRequest, locals: mockLocals } as any);
    
    // Assert
    expect(response.status).toBe(303); // Redirect status
    expect(response.headers.get('Location')).toBe('/dashboard/1rm?success=true');
    
    // Verify workout plan generation
    expect(generate531WorkoutPlan).toHaveBeenCalledWith({
      squat: 284, // 315 * 0.9 rounded
      bench: 203, // 225 * 0.9 rounded
      deadlift: 365, // 405 * 0.9 rounded
      press: 122 // 135 * 0.9 rounded
    });
    
    // Verify MongoDB interactions
    const { clientPromise } = await import('../../../../../src/lib/server/mongodb');
    const client = await clientPromise;
    const mockCollection = client.db().collection;
    
    // Check userMaxes collection update
    expect(mockCollection).toHaveBeenCalledWith('userMaxes');
    expect(mockCollection().updateOne).toHaveBeenCalledWith(
      { userId: 'test-user-id' },
      { 
        $set: { 
          squat: 315, 
          bench: 225, 
          deadlift: 405, 
          press: 135,
          trainingMaxes: {
            squat: 284,
            bench: 203,
            deadlift: 365,
            press: 122
          },
          updatedAt: expect.any(Date)
        }
      },
      { upsert: true }
    );
    
    // Check workoutPlans collection update
    expect(mockCollection).toHaveBeenCalledWith('workoutPlans');
    expect(mockCollection().updateOne).toHaveBeenCalledWith(
      { userId: 'test-user-id' },
      { 
        $set: { 
          plan: expect.any(Array),
          planId: expect.stringContaining('1234567890-'),
          oneRepMaxes: {
            squat: 315,
            bench: 225,
            deadlift: 405,
            press: 135
          },
          createdAt: expect.any(Date)
        }
      },
      { upsert: true }
    );
  });
  
  it('should return 401 if user is not authenticated', async () => {
    // Arrange
    mockLocals.getSession = vi.fn().mockResolvedValue(null);
    
    // Act
    const response = await POST({ request: mockRequest, locals: mockLocals } as any);
    const data = await response.json();
    
    // Assert
    expect(response.status).toBe(401);
    expect(data).toEqual({ error: 'Unauthorized' });
  });
  
  it('should return 400 if lift values are invalid', async () => {
    // Arrange - set invalid values
    const invalidFormData = new FormData();
    invalidFormData.append('squat', '0');
    invalidFormData.append('bench', '225');
    invalidFormData.append('deadlift', '405');
    invalidFormData.append('press', '135');
    
    mockRequest.formData = vi.fn().mockResolvedValue(invalidFormData);
    
    // Act
    const response = await POST({ request: mockRequest, locals: mockLocals } as any);
    const data = await response.json();
    
    // Assert
    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'All lifts must have values greater than 0' });
  });
  
  it('should handle server errors', async () => {
    // Arrange
    const mockError = new Error('Database error');
    mockRequest.formData = vi.fn().mockRejectedValue(mockError);
    
    // Act
    const response = await POST({ request: mockRequest, locals: mockLocals } as any);
    const data = await response.json();
    
    // Assert
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to generate workout plan' });
  });
});
