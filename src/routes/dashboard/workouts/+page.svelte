<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import { derived, writable } from 'svelte/store';
  
  export let data: PageData;
  
  // Get workout plan data from the server
  let workoutPlan = {
    trainingMaxes: data.trainingMaxes,
    weeks: data.weeks
  };
  
  // Function to format lift names for display
  function formatLiftName(name: string): string {
    const names: Record<string, string> = {
      'squat': 'Squat',
      'bench': 'Bench Press',
      'deadlift': 'Deadlift',
      'press': 'Overhead Press'
    };
    return names[name] || name;
  }
  
  // Current week and day being viewed
  let currentWeek = 1;
  let currentDay = 1;
  
  // Get current workout based on selected week and day
  $: currentWorkout = workoutPlan.weeks?.[currentWeek - 1]?.workouts?.[currentDay - 1] || null;
</script>

<div class="max-w-4xl mx-auto">
  <div class="mb-8">
    <h1 class="text-3xl font-bold mb-2">Your 5/3/1 Workout Plan</h1>
    <p class="text-muted-foreground">
      Based on your 1RM values, here's your personalized 4-week 5/3/1 workout plan.
      Follow the prescribed sets, reps, and weights for optimal progress.
    </p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div class="bg-card rounded-lg p-4 border border-border">
      <h3 class="font-medium text-muted-foreground mb-1">Squat TM</h3>
      <p class="text-2xl font-bold">{workoutPlan.trainingMaxes.squat} lbs</p>
    </div>
    <div class="bg-card rounded-lg p-4 border border-border">
      <h3 class="font-medium text-muted-foreground mb-1">Bench TM</h3>
      <p class="text-2xl font-bold">{workoutPlan.trainingMaxes.bench} lbs</p>
    </div>
    <div class="bg-card rounded-lg p-4 border border-border">
      <h3 class="font-medium text-muted-foreground mb-1">Deadlift TM</h3>
      <p class="text-2xl font-bold">{workoutPlan.trainingMaxes.deadlift} lbs</p>
    </div>
    <div class="bg-card rounded-lg p-4 border border-border">
      <h3 class="font-medium text-muted-foreground mb-1">Press TM</h3>
      <p class="text-2xl font-bold">{workoutPlan.trainingMaxes.press} lbs</p>
    </div>
  </div>
  
  <div class="bg-card rounded-lg border border-border overflow-hidden">
    <div class="p-4 border-b border-border bg-muted/50">
      <div class="flex flex-wrap gap-2">
        <div class="flex-1">
          <label for="week-select" class="block text-sm font-medium text-muted-foreground mb-1">Week</label>
          <select 
            id="week-select" 
            bind:value={currentWeek}
            class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={1}>Week 1 (5/5/5)</option>
            <option value={2}>Week 2 (3/3/3)</option>
            <option value={3}>Week 3 (5/3/1)</option>
            <option value={4}>Week 4 (Deload)</option>
          </select>
        </div>
        
        <div class="flex-1">
          <label for="day-select" class="block text-sm font-medium text-muted-foreground mb-1">Workout</label>
          <select 
            id="day-select" 
            bind:value={currentDay}
            class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={1}>Day 1 (Squat)</option>
            <option value={2}>Day 2 (Deadlift)</option>
            <option value={3}>Day 3 (Bench)</option>
            <option value={4}>Day 4 (Press)</option>
          </select>
        </div>
      </div>
    </div>
    
    {#if currentWorkout}
      <div class="p-6">
        <div class="mb-8">
          <h2 class="text-xl font-bold mb-4">Main Lift: {formatLiftName(currentWorkout.mainLift.name)}</h2>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-muted/50 border-b border-border">
                  <th class="px-4 py-2 text-left">Set</th>
                  <th class="px-4 py-2 text-left">Weight (lbs)</th>
                  <th class="px-4 py-2 text-left">Reps</th>
                  <th class="px-4 py-2 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {#each currentWorkout.mainLift.sets as set, i}
                  <tr class="border-b border-border">
                    <td class="px-4 py-3">{i + 1}</td>
                    <td class="px-4 py-3 font-bold">{set.weight}</td>
                    <td class="px-4 py-3">{set.reps}{i === currentWorkout.mainLift.sets.length - 1 ? '+' : ''}</td>
                    <td class="px-4 py-3 text-muted-foreground">{(set.percentage * 100).toFixed(0)}%</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-sm text-muted-foreground">
            The "+" indicates that the last set is an AMRAP (As Many Reps As Possible) set.
          </p>
        </div>
        
        <div class="mb-8">
          <h2 class="text-xl font-bold mb-4">Secondary Lift: {formatLiftName(currentWorkout.secondaryLift.name)}</h2>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-muted/50 border-b border-border">
                  <th class="px-4 py-2 text-left">Set</th>
                  <th class="px-4 py-2 text-left">Weight (lbs)</th>
                  <th class="px-4 py-2 text-left">Reps</th>
                  <th class="px-4 py-2 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {#each currentWorkout.secondaryLift.sets as set, i}
                  <tr class="border-b border-border">
                    <td class="px-4 py-3">{i + 1}</td>
                    <td class="px-4 py-3 font-bold">{set.weight}</td>
                    <td class="px-4 py-3">{set.reps}</td>
                    <td class="px-4 py-3 text-muted-foreground">{(set.percentage * 100).toFixed(0)}%</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h2 class="text-xl font-bold mb-4">Assistance Work</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-muted/30 rounded-lg p-4 border border-border">
              <h3 class="font-medium mb-2">Pull</h3>
              <ul class="space-y-2">
                <li class="flex justify-between">
                  <span>Pull-ups or Rows</span>
                  <span class="text-muted-foreground">5 sets of 10 reps</span>
                </li>
                <li class="flex justify-between">
                  <span>Face Pulls</span>
                  <span class="text-muted-foreground">5 sets of 15-20 reps</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-muted/30 rounded-lg p-4 border border-border">
              <h3 class="font-medium mb-2">Core/Abs</h3>
              <ul class="space-y-2">
                <li class="flex justify-between">
                  <span>Ab Wheel</span>
                  <span class="text-muted-foreground">5 sets of 10-15 reps</span>
                </li>
                <li class="flex justify-between">
                  <span>Hanging Leg Raises</span>
                  <span class="text-muted-foreground">5 sets of 10-15 reps</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="p-6 text-center">
        <p>Workout data not available. Please select a different week or day.</p>
      </div>
    {/if}
  </div>
  
  <div class="mt-8 bg-muted/30 rounded-lg p-6 border border-border">
    <h2 class="text-xl font-bold mb-4">5/3/1 Program Notes</h2>
    <ul class="space-y-3">
      <li class="flex gap-2">
        <span class="text-primary font-bold">•</span>
        <span>Always warm up properly before starting your working sets.</span>
      </li>
      <li class="flex gap-2">
        <span class="text-primary font-bold">•</span>
        <span>The last set of each main lift is an AMRAP (As Many Reps As Possible) set.</span>
      </li>
      <li class="flex gap-2">
        <span class="text-primary font-bold">•</span>
        <span>Rest 2-3 minutes between main lift sets, and 60-90 seconds for assistance work.</span>
      </li>
      <li class="flex gap-2">
        <span class="text-primary font-bold">•</span>
        <span>After completing the 4-week cycle, increase your Training Max by 5-10 lbs for upper body lifts and 10-15 lbs for lower body lifts.</span>
      </li>
      <li class="flex gap-2">
        <span class="text-primary font-bold">•</span>
        <span>Week 4 is a deload week. Don't skip it - recovery is essential for long-term progress.</span>
      </li>
    </ul>
  </div>
  
  <div class="mt-6 flex justify-between">
    <a 
      href="/dashboard/1rm" 
      class="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors"
    >
      Update 1RM Values
    </a>
    
    <button 
      class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      Print Workout
    </button>
  </div>
</div>
