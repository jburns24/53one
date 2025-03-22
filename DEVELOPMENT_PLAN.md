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

## Progress Tracking - In Progress ✅
- [x] Implement progress tracking
- [x] Add workout completion feature with AMRAP tracking
- [x] Add visualization for workout history
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

## User Settings - To Do
- [ ] Create settings page with user preference sections
- [ ] Implement settings storage in MongoDB

### Workout Preferences
- [ ] Weight Units: Toggle between pounds (lbs) and kilograms (kg)
- [ ] Rounding Preferences: Configure how weights should be rounded (to nearest 5 lbs, 2.5 lbs, etc.)
- [ ] Training Max Percentage: Allow customization of percentage used for training max (default 90%)
- [ ] Accessory Work Templates: Add selection for preferred templates (BBB, FSL, etc.)
- [ ] Rest Timer Duration: Add customizable rest periods between sets

### Program Customization
- [ ] Cycle Length: Option to modify the standard 3+1 week pattern
- [ ] Progression Rate: Customize weight increases after each cycle
- [ ] Deload Strategy: Configure different deload approaches
- [ ] Exercise Substitutions: Allow alternative lifts for main movements

### UI Preferences
- [ ] Dark/Light Mode Toggle: Improve the existing theme switching
- [ ] Dashboard Layout: Allow customization of dashboard widgets
- [ ] Notification Settings: Configure workout reminders
- [ ] Data Visualization: Set preferences for progress charts

### Account Settings
- [ ] Profile Information: Update name, email, profile picture
- [ ] Password Management: Change password, enable 2FA
- [ ] Data Export: Add option to export workout history and PRs
- [ ] Account Deletion: Process to delete account and data

## Future Enhancements - To Do
- [ ] Implement social sharing features
- [ ] Add export functionality for workout plans
- [ ] Create mobile app version
- [ ] Implement workout reminders/notifications
- [ ] Add support for different workout methodologies

## Current Status
The application now has a fully functional workout planning system based on the 5/3/1 methodology. Users can authenticate with Google OAuth, enter their 1RM values, and generate personalized workout plans. The application saves user data to MongoDB and displays the generated workout plans with proper sets, reps, and weights. 

Progress tracking has been implemented, allowing users to mark sets as completed. When all main lift sets are completed, a "Workout Complete" button appears, prompting users to enter the number of reps they performed on their AMRAP set. Once a workout is completed, the interface locks to prevent further changes and displays the recorded AMRAP reps.

The dashboard page has been repurposed to show workout history visualization, including:
1. A line chart tracking 1RM progress for each main lift over time
2. Personal records (PRs) display showing the most weight for the most reps recorded for each lift
3. Theoretical total calculation (sum of estimated 1RMs across all lifts)

The cycle completion logic has been updated to evaluate each lift individually based on AMRAP performance, allowing for selective weight increases. The completion dialog now visually indicates which lifts will increase and which will not using color coding.

Dark mode has been implemented for better user experience. The next step is to create a settings page for user preferences.
