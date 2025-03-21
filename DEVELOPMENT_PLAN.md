<context>
## Project Specifications

**53one Workout App**
- A SvelteKit-based workout planning application focused on implementing Jim Wendler's 5/3/1 strength training program
- Built with SvelteKit 2.16.0, Svelte 5.0.0, TypeScript, and MongoDB
- Features Google OAuth authentication via @auth/sveltekit
- Designed to help users track lifts, generate personalized 5/3/1 workout schedules, and monitor progress

## Jim Wendler's 5/3/1 Program Specifics

### Core Principles
- **Focus on Four Compound Lifts**: Overhead Press, Back Squat, Bench Press, and Deadlift
- **Progressive Overload**: Structured progression based on percentages of training max
- **Submaximal Lifting**: Uses 90% of 1RM as "training max" to ensure consistent progress
- **Simplicity**: Straightforward program that's easy to understand and implement

### Program Structure
1. **Calculate Training Max**: 90% of 1RM for each lift
2. **Four-Week Cycle**:
   - **Week 1 (5/5/5+)**:
     - Set 1: 5 reps at 65% of training max
     - Set 2: 5 reps at 75% of training max
     - Set 3: 5+ reps at 85% of training max (AMRAP)
   - **Week 2 (3/3/3+)**:
     - Set 1: 3 reps at 70% of training max
     - Set 2: 3 reps at 80% of training max
     - Set 3: 3+ reps at 90% of training max (AMRAP)
   - **Week 3 (5/3/1+)**:
     - Set 1: 5 reps at 75% of training max
     - Set 2: 3 reps at 85% of training max
     - Set 3: 1+ reps at 95% of training max (AMRAP)
   - **Week 4 (Deload)**:
     - Set 1: 5 reps at 40% of training max
     - Set 2: 5 reps at 50% of training max
     - Set 3: 5 reps at 60% of training max
3. **Progression**: After each cycle, increase training max
   - Squat and Deadlift: +5kg/10lbs
   - Bench Press and Overhead Press: +2.5kg/5lbs

### Assistance Work
- Additional exercises after main lifts
- Common variations include:
  - **Boring But Big (BBB)**: 5 sets of 10 reps at 50% of training max
  - **Simplest Strength Template**: Focused assistance exercises

### Weekly Schedule Example
- **Day 1**: Squat + assistance
- **Day 2**: Bench Press + assistance
- **Day 3**: Rest
- **Day 4**: Deadlift + assistance
- **Day 5**: Overhead Press + assistance
- **Day 6-7**: Rest
</context>

# 53one Workout App - TODO List

## Project Setup ✅
- [x] Initialize SvelteKit project
- [x] Configure TypeScript
- [x] Set up environment variables
- [x] Create MongoDB connection
- [x] Set up Google OAuth authentication
- [x] Fix authentication issues with Auth.js integration

## Authentication ✅
- [x] Set up Google OAuth provider
- [x] Configure Auth.js with SvelteKit
- [x] Create login/logout functionality
- [x] Set up session handling
- [x] Connect authentication to MongoDB

## Database Setup ✅
- [x] Set up MongoDB connection
- [x] Configure MongoDB adapter for Auth.js
- [x] Create user collection for authentication

## User Interface ✅
- [x] Create landing page
- [x] Design responsive layout with Tailwind CSS
- [x] Implement dark mode toggle
- [x] Create responsive navigation

## Workout Data Input ✅
- [x] Create form for 1RM input
  - [x] Squat
  - [x] Deadlift
  - [x] Overhead Press
  - [x] Bench Press
- [x] Implement form validation
- [x] Create database schema for workout data
- [x] Implement data saving functionality

## Workout Schedule Generation ✅
- [x] Design algorithm for workout schedule generation
- [x] Create schedule display component
- [x] Implement weekly view
- [x] Create database schema for saved schedules

## User Dashboard ✅
- [x] Design dashboard layout
- [x] Create navigation between dashboard sections
- [x] Implement protected routes
- [x] Display user information

## Progress Tracking - To Do
- [ ] Implement progress tracking
- [ ] Add visualization for workout history
- [ ] Create settings page for user preferences

## Testing - To Do
- [ ] Set up testing framework
- [ ] Write unit tests for core functionality
- [ ] Implement integration tests
- [ ] Create end-to-end tests for critical user flows

## Deployment - To Do
- [ ] Configure production environment variables
- [ ] Set up CI/CD pipeline
- [ ] Optimize for production
- [ ] Deploy to hosting platform
- [ ] Set up monitoring and error tracking

## Future Enhancements - To Do
- [ ] Implement social sharing features
- [ ] Add export functionality for workout plans
- [ ] Create mobile app version
- [ ] Implement workout reminders/notifications
- [ ] Add support for different workout methodologies

## Current Status
The application now has a fully functional workout planning system based on the 5/3/1 methodology. Users can authenticate with Google OAuth, enter their 1RM values, and generate personalized workout plans. The application saves user data to MongoDB and displays the generated workout plans with proper sets, reps, and weights. Dark mode has been implemented for better user experience. The next steps include implementing progress tracking and workout history visualization.
