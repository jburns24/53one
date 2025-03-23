import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../../../src/routes/api/workouts/save-completed/+server';

// Mock MongoDB client
vi.mock('../../../../../src/lib/server/mongodb', () => {
  const mockInsertOne = vi.fn().mockResolvedValue({ acknowledged: true });
  const mockCollection = vi.fn().mockReturnValue({
    insertOne: mockInsertOne
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

describe('Save Completed Workout API', () => {
  let mockRequest: Request;
  let mockLocals: App.Locals;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock request with workout data
    mockRequest = {
      json: vi.fn().mockResolvedValue({
        workout: {
          mainLift: 'squat',
          sets: [
            { weight: 225, reps: 5 },
            { weight: 250, reps: 5 },
            { weight: 275, reps: 5 }
          ]
        },
        planId: 'test-plan-id',
        completedAt: '2025-03-22T12:00:00Z'
      })
    } as unknown as Request;
    
    // Mock locals with session
    mockLocals = {
      getSession: vi.fn().mockResolvedValue({
        user: { id: 'test-user-id' }
      })
    } as unknown as App.Locals;
  });
  
  it('should save a completed workout successfully', async () => {
    // Act
    const response = await POST({ request: mockRequest, locals: mockLocals } as any);
    const data = await response.json();
    
    // Assert
    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
    
    // Verify MongoDB interaction
    const { clientPromise } = await import('../../../../../src/lib/server/mongodb');
    const client = await clientPromise;
    const mockCollection = client.db().collection;
    
    expect(mockCollection).toHaveBeenCalledWith('completedWorkouts');
    expect(mockCollection().insertOne).toHaveBeenCalledWith({
      userId: 'test-user-id',
      planId: 'test-plan-id',
      mainLift: 'squat',
      sets: [
        { weight: 225, reps: 5 },
        { weight: 250, reps: 5 },
        { weight: 275, reps: 5 }
      ],
      completedAt: expect.any(Date)
    });
  });
  
  it('should return 401 if user is not authenticated', async () => {
    // Arrange
    mockLocals.getSession = vi.fn().mockResolvedValue(null);
    
    // Act
    const response = await POST({ request: mockRequest, locals: mockLocals } as any);
    const data = await response.json();
    
    // Assert
    expect(response.status).toBe(401);
    expect(data).toEqual({ success: false, message: 'Not authenticated' });
  });
  
  it('should return 400 if workout data is missing', async () => {
    // Arrange
    mockRequest.json = vi.fn().mockResolvedValue({
      // Missing workout data
      planId: 'test-plan-id'
    });
    
    // Act
    const response = await POST({ request: mockRequest, locals: mockLocals } as any);
    const data = await response.json();
    
    // Assert
    expect(response.status).toBe(400);
    expect(data).toEqual({ success: false, message: 'Missing required workout data' });
  });
  
  it('should handle server errors', async () => {
    // Arrange
    const mockError = new Error('Database error');
    mockRequest.json = vi.fn().mockRejectedValue(mockError);
    
    // Act
    const response = await POST({ request: mockRequest, locals: mockLocals } as any);
    const data = await response.json();
    
    // Assert
    expect(response.status).toBe(500);
    expect(data).toEqual({ success: false, message: 'Server error' });
  });
});
