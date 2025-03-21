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
  
  // Calculate 1RM values from training maxes (TM is 90% of 1RM)
  const oneRepMaxes = {
    squat: Math.round(workoutPlan.trainingMaxes.squat / 0.9),
    bench: Math.round(workoutPlan.trainingMaxes.bench / 0.9),
    deadlift: Math.round(workoutPlan.trainingMaxes.deadlift / 0.9),
    press: Math.round(workoutPlan.trainingMaxes.press / 0.9)
  };
  
  // Use a plain object for tracking completed sets
  let completedSets: Record<string, boolean> = {};
  
  // Import onMount for initialization
  import { onMount } from 'svelte';
  
  // Initialize from progress data
  if (data.progress) {
    data.progress.forEach((item: any) => {
      const key = `${item.week}-${item.day}-${item.mainLift}-${item.setIndex}`;
      completedSets[key] = item.completed;
    });
  }
  
  // Function to check if a set is completed
  function isSetCompleted(week: number, day: number, liftName: string, setIndex: number): boolean {
    const key = `${week}-${day}-${liftName}-${setIndex}`;
    return completedSets[key] === true;
  }
  
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
  
  // Create a reactive variable to track UI updates
  let completedSetsArray: Array<{key: string, completed: boolean}> = [];
  
  // Reactive statement to rebuild the array when completedSets changes
  $: {
    completedSetsArray = Object.entries(completedSets).map(([key, completed]) => ({ key, completed }));
  }
  
  // Function to toggle set completion status
  async function toggleSetCompletion(setIndex: number) {
    if (!currentWorkout) return;
    
    const key = `${currentWeek}-${currentDay}-${currentWorkout.mainLift.name}-${setIndex}`;
    const isCompleted = completedSets[key] === true;
    
    // Create a new object to trigger reactivity
    const newCompletedSets = { ...completedSets };
    newCompletedSets[key] = !isCompleted;
    completedSets = newCompletedSets;
    
    try {
      const response = await fetch('/api/workouts/track-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          week: currentWeek,
          day: currentDay,
          mainLift: currentWorkout.mainLift.name,
          setIndex,
          completed: !isCompleted
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        // Revert UI change if API call failed
        const revertedSets = { ...completedSets };
        revertedSets[key] = isCompleted;
        completedSets = revertedSets;
        console.error('Failed to update set completion status');
      }
    } catch (error) {
      // Revert UI change on error
      const revertedSets = { ...completedSets };
      revertedSets[key] = isCompleted;
      completedSets = revertedSets;
      console.error('Error updating set completion:', error);
    }
  }
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
      <h3 class="font-medium mb-1">Squat</h3>
      <div class="flex flex-col gap-1">
        <div>
          <p class="text-2xl font-bold">{oneRepMaxes.squat} lbs</p>
          <p class="text-xs text-muted-foreground">1 Rep Max</p>
        </div>
        <div class="mt-2 pt-2 border-t border-border">
          <p class="text-lg font-medium">{workoutPlan.trainingMaxes.squat} lbs</p>
          <p class="text-xs text-muted-foreground">Training Max (90%)</p>
        </div>
      </div>
    </div>
    <div class="bg-card rounded-lg p-4 border border-border">
      <h3 class="font-medium mb-1">Bench Press</h3>
      <div class="flex flex-col gap-1">
        <div>
          <p class="text-2xl font-bold">{oneRepMaxes.bench} lbs</p>
          <p class="text-xs text-muted-foreground">1 Rep Max</p>
        </div>
        <div class="mt-2 pt-2 border-t border-border">
          <p class="text-lg font-medium">{workoutPlan.trainingMaxes.bench} lbs</p>
          <p class="text-xs text-muted-foreground">Training Max (90%)</p>
        </div>
      </div>
    </div>
    <div class="bg-card rounded-lg p-4 border border-border">
      <h3 class="font-medium mb-1">Deadlift</h3>
      <div class="flex flex-col gap-1">
        <div>
          <p class="text-2xl font-bold">{oneRepMaxes.deadlift} lbs</p>
          <p class="text-xs text-muted-foreground">1 Rep Max</p>
        </div>
        <div class="mt-2 pt-2 border-t border-border">
          <p class="text-lg font-medium">{workoutPlan.trainingMaxes.deadlift} lbs</p>
          <p class="text-xs text-muted-foreground">Training Max (90%)</p>
        </div>
      </div>
    </div>
    <div class="bg-card rounded-lg p-4 border border-border">
      <h3 class="font-medium mb-1">Overhead Press</h3>
      <div class="flex flex-col gap-1">
        <div>
          <p class="text-2xl font-bold">{oneRepMaxes.press} lbs</p>
          <p class="text-xs text-muted-foreground">1 Rep Max</p>
        </div>
        <div class="mt-2 pt-2 border-t border-border">
          <p class="text-lg font-medium">{workoutPlan.trainingMaxes.press} lbs</p>
          <p class="text-xs text-muted-foreground">Training Max (90%)</p>
        </div>
      </div>
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
                  <th class="px-4 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {#each currentWorkout.mainLift.sets as set, i}
                  <tr 
                    class="border-b border-border cursor-pointer transition-all duration-200 
                    {isSetCompleted(currentWeek, currentDay, currentWorkout.mainLift.name, i) 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'hover:bg-muted/50 dark:hover:bg-muted/20'}"
                  >
                    <td class="px-4 py-3">{i + 1}</td>
                    <td class="px-4 py-3 font-bold">{set.weight}</td>
                    <td class="px-4 py-3">
                      <span class="flex items-center gap-2">
                        {set.reps}{i === currentWorkout.mainLift.sets.length - 1 ? '+' : ''}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-muted-foreground">{(set.percentage * 100).toFixed(0)}%</td>
                    <td class="px-4 py-3 text-right">
                      <button 
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
                        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                        disabled:pointer-events-none disabled:opacity-50 h-9 px-3
                        {isSetCompleted(currentWeek, currentDay, currentWorkout.mainLift.name, i) 
                          ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600' 
                          : 'border border-input bg-background hover:bg-muted/80 hover:text-accent-foreground'}"
                        on:click={() => toggleSetCompletion(i)}
                      >
                        {#if isSetCompleted(currentWeek, currentDay, currentWorkout.mainLift.name, i)}
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                            <path d="M20 6L9 17l-5-5"></path>
                          </svg>
                          Completed
                        {:else}
                          Mark Complete
                        {/if}
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-sm text-muted-foreground">
            The "+" indicates that the last set is an AMRAP (As Many Reps As Possible) set. Use the buttons to toggle completion status for each set.
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
                  <th class="px-4 py-2 text-right">Status</th>
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
