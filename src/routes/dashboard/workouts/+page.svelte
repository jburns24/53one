<script lang="ts">
  import { page } from "$app/stores";
  import type { PageData } from "./$types";
  import { writable } from "svelte/store";
  import { Confetti } from "svelte-confetti";

  const { data } = $props<{ data: PageData }>();

  // Get workout plan data from the server
  let workoutPlan = {
    trainingMaxes: data.trainingMaxes,
    weeks: data.weeks,
  };

  // Store the current plan ID
  let currentPlanId = data.planId;

  // Calculate 1RM values from training maxes (TM is 90% of 1RM)
  // Using Math.floor to ensure we don't round up and cause the +1 issue
  const oneRepMaxes = {
    squat: Math.floor(workoutPlan.trainingMaxes.squat / 0.9),
    bench: Math.floor(workoutPlan.trainingMaxes.bench / 0.9),
    deadlift: Math.floor(workoutPlan.trainingMaxes.deadlift / 0.9),
    press: Math.floor(workoutPlan.trainingMaxes.press / 0.9),
  };

  // Use a plain object for tracking completed sets
  let completedSets = $state<Record<string, boolean>>({});

  // Track AMRAP reps
  let amrapReps = $state<Record<string, number>>({});

  // Show/hide AMRAP dialog
  let showAmrapDialog = $state(false);
  let amrapRepsInput = $state(0);

  // State for controlling confetti animation
  let showConfetti = $state(false);

  // Show/hide cycle completion dialog
  let showCycleCompletionDialog = $state(false);
  let cycleSuccessful = $state(false);
  let failedWorkouts = $state<
    Array<{
      week: number;
      day: number;
      lift: string;
      expected: number;
      actual: number;
    }>
  >([]);

  // Track workout completion status
  let workoutCompleted = $state<Record<string, boolean>>({});

  // Import onMount for initialization
  import { onMount } from "svelte";

  // Initialize from progress data
  if (data.progress) {
    data.progress.forEach((item: any) => {
      const key = `${item.week}-${item.day}-${item.mainLift}-${item.setIndex}`;
      completedSets[key] = item.completed;

      // Initialize AMRAP reps if available
      if (item.amrapReps !== undefined) {
        amrapReps[`${item.week}-${item.day}-${item.mainLift}`] = item.amrapReps;
      }

      // Initialize workout completion status
      if (item.workoutCompleted) {
        const workoutKey = `${item.week}-${item.day}`;
        workoutCompleted[workoutKey] = true;
      }
    });
  }

  // Determine the initial week and day to display
  let initialWeek = 1;
  let initialDay = 1;

  if (workoutPlan && workoutPlan.weeks) {
    let foundIncomplete = false;
    for (let weekIdx = 0; weekIdx < workoutPlan.weeks.length; weekIdx++) {
      const weekNumber = weekIdx + 1;
      const weekData = workoutPlan.weeks[weekIdx];
      if (weekData && weekData.workouts) {
        for (let dayIdx = 0; dayIdx < weekData.workouts.length; dayIdx++) {
          const dayNumber = dayIdx + 1;
          // isWorkoutCompleted function is defined further down in the script
          if (!isWorkoutCompleted(weekNumber, dayNumber)) {
            initialWeek = weekNumber;
            initialDay = dayNumber;
            foundIncomplete = true;
            break;
          }
        }
      }
      if (foundIncomplete) {
        break;
      }
    }
  }

  // Function to check if a set is completed
  function isSetCompleted(
    week: number,
    day: number,
    liftName: string,
    setIndex: number,
  ): boolean {
    const key = `${week}-${day}-${liftName}-${setIndex}`;
    return completedSets[key] === true;
  }

  // Function to check if workout is completed
  function isWorkoutCompleted(week: number, day: number): boolean {
    const key = `${week}-${day}`;
    return workoutCompleted[key] === true;
  }

  // Function to check if all workouts in the plan are completed
  function areAllWorkoutsCompleted(): boolean {
    // Check all 4 weeks and all 4 days per week
    for (let week = 1; week <= 4; week++) {
      for (let day = 1; day <= 4; day++) {
        if (!isWorkoutCompleted(week, day)) {
          return false;
        }
      }
    }
    return true;
  }

  // Track which lifts met their AMRAP requirements
  let liftSuccess = $state<Record<string, boolean>>({
    squat: true,
    bench: true,
    deadlift: true,
    press: true,
  });

  // Function to check if a specific lift met all its AMRAP requirements
  function didLiftMeetAmrapMinimums(liftName: string): boolean {
    // Week 1: 5+ sets, Week 2: 3+ sets, Week 3: 1+ sets
    // Week 4 is deload, no AMRAP sets to check
    const minimumReps: Record<number, number> = {
      1: 5, // Week 1: 5+ sets
      2: 3, // Week 2: 3+ sets
      3: 1, // Week 3: 1+ sets
    };

    for (let week = 1; week <= 3; week++) {
      for (let day = 1; day <= 4; day++) {
        // Get the workout for this week/day
        const workout = workoutPlan.weeks?.[week - 1]?.workouts?.[day - 1];
        if (!workout) continue;

        // Skip if this workout doesn't involve the lift we're checking
        if (workout.mainLift.name !== liftName) continue;

        // Get AMRAP reps for this workout
        const reps = getAmrapReps(week, day, liftName);

        // If no reps recorded or less than minimum, return false
        if (reps === null || reps < minimumReps[week]) {
          return false;
        }
      }
    }

    return true;
  }

  // Function to check if all AMRAP sets met minimum requirements
  function didMeetAllAmrapMinimums(): boolean {
    // Check all main lifts
    const mainLifts = ["squat", "bench", "deadlift", "press"];

    // Update the success status for each lift
    mainLifts.forEach((lift) => {
      liftSuccess[lift] = didLiftMeetAmrapMinimums(lift);
    });

    // Return true if at least one lift met its requirements
    return Object.values(liftSuccess).some((success) => success);
  }

  // Function to get failed AMRAP workouts
  function getFailedAmrapWorkouts(): Array<{
    week: number;
    day: number;
    lift: string;
    expected: number;
    actual: number;
  }> {
    const failures: Array<{
      week: number;
      day: number;
      lift: string;
      expected: number;
      actual: number;
    }> = [];
    const minimumReps: Record<number, number> = {
      1: 5, // Week 1: 5+ sets
      2: 3, // Week 2: 3+ sets
      3: 1, // Week 3: 1+ sets
    };

    // Check all main lifts for weeks 1-3
    for (let week = 1; week <= 3; week++) {
      for (let day = 1; day <= 4; day++) {
        // Get the workout for this week/day
        const workout = workoutPlan.weeks?.[week - 1]?.workouts?.[day - 1];
        if (!workout) continue;

        // Get the main lift name
        const mainLift = workout.mainLift.name;

        // Get AMRAP reps for this workout
        const reps = getAmrapReps(week, day, mainLift);

        // If no reps recorded or less than minimum, add to failures
        if (reps !== null && reps < minimumReps[week]) {
          failures.push({
            week,
            day,
            lift: formatLiftName(mainLift),
            expected: minimumReps[week],
            actual: reps,
          });
        }
      }
    }

    return failures;
  }

  // Function to get AMRAP reps for a workout
  function getAmrapReps(
    week: number,
    day: number,
    mainLift: string,
  ): number | null {
    const key = `${week}-${day}-${mainLift}`;
    return amrapReps[key] !== undefined ? amrapReps[key] : null;
  }

  // Function to format lift names for display
  function formatLiftName(name: string): string {
    const names: Record<string, string> = {
      squat: "Squat",
      bench: "Bench Press",
      deadlift: "Deadlift",
      press: "Overhead Press",
    };
    return names[name] || name;
  }

  // Current week and day being viewed
  let currentWeek = $state(initialWeek);
  let currentDay = $state(initialDay);

  // Get current workout based on selected week and day
  let currentWorkout = $derived(
    workoutPlan.weeks?.[currentWeek - 1]?.workouts?.[currentDay - 1] || null,
  );

  // Function to check if all main lift sets are completed
  function areAllMainLiftsCompleted(): boolean {
    if (!currentWorkout) return false;

    // If the workout is already marked as completed, return true
    if (isWorkoutCompleted(currentWeek, currentDay)) {
      return true;
    }

    // Check if all sets are completed
    for (let i = 0; i < currentWorkout.mainLift.sets.length; i++) {
      const key = `${currentWeek}-${currentDay}-${currentWorkout.mainLift.name}-${i}`;
      if (!completedSets[key]) {
        return false;
      }
    }

    return true;
  }

  // Function to get the AMRAP set index (usually the last set)
  function getAmrapSetIndex(): number {
    if (!currentWorkout) return -1;
    return currentWorkout.mainLift.sets.length - 1;
  }

  // Function to show AMRAP dialog
  function showAmrapRepDialog() {
    if (!currentWorkout) return;

    // Initialize with existing value if available
    const amrapKey = `${currentWeek}-${currentDay}-${currentWorkout.mainLift.name}`;
    amrapRepsInput = amrapReps[amrapKey] || 0;
    showAmrapDialog = true;
  }

  // Function to mark workout complete without AMRAP input (for deload week)
  async function markWorkoutComplete() {
    if (!currentWorkout) return;

    const workoutKey = `${currentWeek}-${currentDay}`;

    try {
      const response = await fetch("/api/workouts/track-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          week: currentWeek,
          day: currentDay,
          mainLift: currentWorkout.mainLift.name,
          setIndex: getAmrapSetIndex(),
          completed: true,
          workoutCompleted: true,
          planId: currentPlanId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        workoutCompleted = { ...workoutCompleted, [workoutKey]: true };

        // Trigger confetti celebration
        showConfetti = true;
        setTimeout(() => {
          showConfetti = false;
        }, 2000);

        // Check if all workouts are completed after marking this one
        if (areAllWorkoutsCompleted()) {
          // Determine if all AMRAP sets met minimum requirements
          cycleSuccessful = didMeetAllAmrapMinimums();

          if (!cycleSuccessful) {
            // Get the list of failed workouts
            failedWorkouts = getFailedAmrapWorkouts();
          }

          // Show the cycle completion dialog
          showCycleCompletionDialog = true;
        }
      } else {
        console.error("Failed to mark workout complete");
      }
    } catch (error) {
      console.error("Error marking workout complete:", error);
    }
  }

  // Function to save AMRAP reps
  async function saveAmrapReps() {
    if (!currentWorkout || amrapRepsInput < 0) return;

    const amrapKey = `${currentWeek}-${currentDay}-${currentWorkout.mainLift.name}`;
    const workoutKey = `${currentWeek}-${currentDay}`;

    try {
      // First, save the progress tracking information
      const progressResponse = await fetch("/api/workouts/track-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          week: currentWeek,
          day: currentDay,
          mainLift: currentWorkout.mainLift.name,
          setIndex: getAmrapSetIndex(),
          completed: true,
          amrapReps: amrapRepsInput,
          workoutCompleted: true,
          planId: currentPlanId,
        }),
      });

      const progressResult = await progressResponse.json();

      if (progressResult.success) {
        // Now save the completed workout with all set information for PR calculations
        // Create a copy of the sets with the AMRAP reps updated
        const updatedSets = currentWorkout.mainLift.sets.map(
          (set: { weight: number; reps: number }, index: number) => {
            if (index === getAmrapSetIndex()) {
              return { ...set, reps: amrapRepsInput };
            }
            return set;
          },
        );

        // Save the completed workout with all set information
        const completedResponse = await fetch("/api/workouts/save-completed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workout: {
              mainLift: {
                name: currentWorkout.mainLift.name,
                trainingMax: currentWorkout.mainLift.trainingMax,
              },
              sets: updatedSets,
            },
            planId: currentPlanId,
            completedAt: new Date().toISOString(),
          }),
        });

        const completedResult = await completedResponse.json();

        if (!completedResult.success) {
          console.error("Failed to save completed workout for PR tracking");
        }

        // Update local state
        amrapReps = { ...amrapReps, [amrapKey]: amrapRepsInput };
        workoutCompleted = { ...workoutCompleted, [workoutKey]: true };
        showAmrapDialog = false;

        // Trigger confetti celebration
        showConfetti = true;
        setTimeout(() => {
          showConfetti = false;
        }, 2000);

        // Check if all workouts are completed after marking this one
        if (areAllWorkoutsCompleted()) {
          // Determine if all AMRAP sets met minimum requirements
          cycleSuccessful = didMeetAllAmrapMinimums();

          if (!cycleSuccessful) {
            // Get the list of failed workouts
            failedWorkouts = getFailedAmrapWorkouts();
          }

          // Show the cycle completion dialog
          showCycleCompletionDialog = true;
        }
      } else {
        console.error("Failed to save AMRAP reps");
      }
    } catch (error) {
      console.error("Error saving AMRAP reps:", error);
    }
  }

  // Function to generate a new workout plan with selectively increased 1RM values
  function generateNewWorkoutPlan() {
    // Calculate new 1RM values based on which lifts met their requirements
    const newOneRepMaxes = {
      squat: oneRepMaxes.squat + (liftSuccess.squat ? 10 : 0),
      bench: oneRepMaxes.bench + (liftSuccess.bench ? 5 : 0),
      deadlift: oneRepMaxes.deadlift + (liftSuccess.deadlift ? 10 : 0),
      press: oneRepMaxes.press + (liftSuccess.press ? 5 : 0),
    };

    // Redirect to 1RM page with new values
    const params = new URLSearchParams();
    params.set("squat", newOneRepMaxes.squat.toString());
    params.set("bench", newOneRepMaxes.bench.toString());
    params.set("deadlift", newOneRepMaxes.deadlift.toString());
    params.set("press", newOneRepMaxes.press.toString());

    window.location.href = `/dashboard/1rm?${params.toString()}`;
  }

  // Function to close the cycle completion dialog
  function closeCycleCompletionDialog() {
    showCycleCompletionDialog = false;
  }

  // Function to handle AMRAP input focus
  function handleAmrapInputFocus(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    target.select();
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
      const response = await fetch("/api/workouts/track-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          week: currentWeek,
          day: currentDay,
          mainLift: currentWorkout.mainLift.name,
          setIndex,
          completed: !isCompleted,
          planId: currentPlanId,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        // Revert UI change if API call failed
        const revertedSets = { ...completedSets };
        revertedSets[key] = isCompleted;
        completedSets = revertedSets;
        console.error("Failed to update set completion status");
      }
    } catch (error) {
      // Revert UI change on error
      const revertedSets = { ...completedSets };
      revertedSets[key] = isCompleted;
      completedSets = revertedSets;
      console.error("Error updating set completion:", error);
    }
  }
</script>

<div class="max-w-4xl mx-auto">
  {#if showConfetti}
    <Confetti
      x={[-5, 5]}
      y={[0, 0.1]}
      delay={[0, 500]}
      duration={2000}
      amount={100}
      fallDistance="100vh"
    />
  {/if}
  <div class="mb-8">
    <h1 class="text-3xl font-bold mb-2">Your 5/3/1 Workout Plan</h1>
    <p class="text-muted-foreground">
      Based on your 1RM values, here's your personalized 4-week 5/3/1 workout
      plan. Follow the prescribed sets, reps, and weights for optimal progress.
    </p>
  </div>

  <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div class="bg-card rounded-lg p-4 border border-border">
      <h3 class="font-medium mb-1">Squat</h3>
      <div class="flex flex-col gap-1">
        <div>
          <p class="text-2xl font-bold">{oneRepMaxes.squat} lbs</p>
          <p class="text-xs text-muted-foreground">1 Rep Max</p>
        </div>
        <div class="mt-2 pt-2 border-t border-border">
          <p class="text-lg font-medium">
            {workoutPlan.trainingMaxes.squat} lbs
          </p>
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
          <p class="text-lg font-medium">
            {workoutPlan.trainingMaxes.bench} lbs
          </p>
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
          <p class="text-lg font-medium">
            {workoutPlan.trainingMaxes.deadlift} lbs
          </p>
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
          <p class="text-lg font-medium">
            {workoutPlan.trainingMaxes.press} lbs
          </p>
          <p class="text-xs text-muted-foreground">Training Max (90%)</p>
        </div>
      </div>
    </div>
  </div> -->

  <div class="bg-card rounded-lg border border-border overflow-hidden">
    <div class="p-4 border-b border-border bg-muted/50">
      <div class="flex flex-wrap gap-2">
        <div class="flex-1">
          <label
            for="week-select"
            class="block text-sm font-medium text-muted-foreground mb-1"
            >Week</label
          >
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
          <label
            for="day-select"
            class="block text-sm font-medium text-muted-foreground mb-1"
            >Workout</label
          >
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
          <h2 class="text-xl font-bold mb-4">
            Main Lift: {formatLiftName(currentWorkout.mainLift.name)}
          </h2>
          <div class="">
            <!-- Container for the table -->
            <table class="w-full md:border-collapse">
              <!-- Ensure collapse for desktop borders -->
              <thead class="hidden md:table-header-group">
                <tr class="bg-muted/50 border-b border-border">
                  <th class="px-4 py-2 text-left font-medium">Set</th>
                  <th class="px-4 py-2 text-left font-medium">Weight (lbs)</th>
                  <th class="px-4 py-2 text-left font-medium">Reps</th>
                  <th class="px-4 py-2 text-left font-medium">Percentage</th>
                  <th class="px-4 py-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {#each currentWorkout.mainLift.sets as set, i}
                  <tr
                    class="block md:table-row bg-card rounded-lg shadow-md mb-6 md:bg-transparent md:rounded-none md:shadow-none md:mb-0 md:border-b {isSetCompleted(
                      currentWeek,
                      currentDay,
                      currentWorkout.mainLift.name,
                      i,
                    )
                      ? 'border-green-500 border-2 md:border-green-500'
                      : 'border-border border md:border-border'}"
                  >
                    <td
                      class="block md:table-cell px-4 pt-3 pb-2 md:py-3 border-b border-border md:border-0"
                    >
                      <span class="text-sm font-medium text-muted-foreground"
                        >Set:
                      </span>
                      <span class="text-sm font-semibold">{i + 1}</span>
                    </td>
                    <td
                      class="block md:table-cell px-4 pt-2 pb-2 md:py-3 border-b border-border md:border-0"
                    >
                      <span class="text-sm font-medium text-muted-foreground"
                        >Weight (lbs):
                      </span>
                      <span class="text-sm font-semibold">{set.weight}</span>
                    </td>
                    <td
                      class="block md:table-cell px-4 pt-2 pb-2 md:py-3 border-b border-border md:border-0"
                    >
                      <span class="text-sm font-medium text-muted-foreground"
                        >Reps:
                      </span>
                      <span class="text-sm font-semibold"
                        >{set.reps}{i ===
                          currentWorkout.mainLift.sets.length - 1 &&
                        currentWeek !== 4
                          ? "+"
                          : ""}</span
                      >
                    </td>
                    <td
                      class="block md:table-cell px-4 pt-2 pb-2 md:py-3 border-b border-border md:border-0"
                    >
                      <span class="text-sm font-medium text-muted-foreground"
                        >Percentage:
                      </span>
                      <span class="text-sm font-semibold"
                        >{(set.percentage * 100).toFixed(0)}%</span
                      >
                    </td>
                    <td
                      class="block md:table-cell px-4 pt-2 pb-3 md:py-3 text-left md:text-right"
                    >
                      <button
                        class="w-full md:w-auto px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors {isSetCompleted(
                          currentWeek,
                          currentDay,
                          currentWorkout.mainLift.name,
                          i,
                        )
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'}"
                        onclick={() => toggleSetCompletion(i)}
                      >
                        {isSetCompleted(
                          currentWeek,
                          currentDay,
                          currentWorkout.mainLift.name,
                          i,
                        )
                          ? "Completed"
                          : "Mark Complete"}
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-sm text-muted-foreground">
            {#if currentWeek !== 4}
              The "+" indicates that the last set is an AMRAP (As Many Reps As
              Possible) set. Use the buttons to toggle completion status for
              each set.
            {:else}
              Deload week (Week 4) does not include AMRAP sets. Simply complete
              all prescribed sets and reps.
            {/if}
          </p>

          {#if areAllMainLiftsCompleted() && !isWorkoutCompleted(currentWeek, currentDay)}
            <div class="mt-6 flex justify-center">
              <button
                type="button"
                class="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors shadow-md flex items-center justify-center gap-2"
                onclick={currentWeek === 4
                  ? markWorkoutComplete
                  : showAmrapRepDialog}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                Workout Complete
              </button>
            </div>
          {/if}

          {#if isWorkoutCompleted(currentWeek, currentDay)}
            <div
              class="mt-6 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4 text-center"
            >
              {#if currentWeek === 4}
                <p
                  class="flex items-center justify-center gap-2 text-black dark:text-green-300 font-bold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>Workout Complete</span>
                </p>
              {:else if getAmrapReps(currentWeek, currentDay, currentWorkout.mainLift.name) !== null}
                <p
                  class="flex items-center justify-center gap-2 text-black dark:text-green-300 font-bold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span
                    >You completed <span class="font-bold"
                      >{getAmrapReps(
                        currentWeek,
                        currentDay,
                        currentWorkout.mainLift.name,
                      )}</span
                    > reps on your AMRAP set</span
                  >
                </p>
              {/if}
            </div>
          {/if}
        </div>

        <div class="mb-8">
          <h2 class="text-xl font-bold mb-4">
            Secondary Lift: {formatLiftName(currentWorkout.secondaryLift.name)}
          </h2>
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
                    <td class="px-4 py-3 text-muted-foreground"
                      >{(set.percentage * 100).toFixed(0)}%</td
                    >
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
                  <span class="text-muted-foreground">5 sets of 15-20 reps</span
                  >
                </li>
              </ul>
            </div>

            <div class="bg-muted/30 rounded-lg p-4 border border-border">
              <h3 class="font-medium mb-2">Core/Abs</h3>
              <ul class="space-y-2">
                <li class="flex justify-between">
                  <span>Ab Wheel</span>
                  <span class="text-muted-foreground">5 sets of 10-15 reps</span
                  >
                </li>
                <li class="flex justify-between">
                  <span>Hanging Leg Raises</span>
                  <span class="text-muted-foreground">5 sets of 10-15 reps</span
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="p-6 text-center">
        <p>
          Workout data not available. Please select a different week or day.
        </p>
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
        <span
          >The last set of each main lift is an AMRAP (As Many Reps As Possible)
          set.</span
        >
      </li>
      <li class="flex gap-2">
        <span class="text-primary font-bold">•</span>
        <span
          >Rest 2-3 minutes between main lift sets, and 60-90 seconds for
          assistance work.</span
        >
      </li>
      <li class="flex gap-2">
        <span class="text-primary font-bold">•</span>
        <span
          >After completing the 4-week cycle, increase your Training Max by 5-10
          lbs for upper body lifts and 10-15 lbs for lower body lifts.</span
        >
      </li>
      <li class="flex gap-2">
        <span class="text-primary font-bold">•</span>
        <span
          >Week 4 is a deload week. Don't skip it - recovery is essential for
          long-term progress.</span
        >
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

{#if showAmrapDialog}
  <div
    class="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 py-2 px-1 sm:p-4"
  >
    <div
      class="bg-white dark:bg-card text-black dark:text-card-foreground p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm border border-border dark:border-border"
    >
      <h2 class="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
        Record AMRAP Set
      </h2>
      {#if currentWorkout}
        <p class="mb-4 text-sm sm:text-base">
          How many reps did you complete on your AMRAP set for {formatLiftName(
            currentWorkout.mainLift.name,
          )}?
        </p>
      {/if}
      <div>
        <label for="amrap-reps" class="block text-sm font-medium mb-1"
          >Number of Reps</label
        >
        <input
          type="number"
          id="amrap-reps"
          bind:value={amrapRepsInput}
          min="0"
          pattern="\\d*"
          onfocus={handleAmrapInputFocus}
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
          placeholder="Enter reps"
        />
      </div>
      <div class="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors text-sm sm:text-base"
          onclick={() => (showAmrapDialog = false)}
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base"
          onclick={saveAmrapReps}
          disabled={amrapRepsInput === null || amrapRepsInput < 0}
        >
          Save Reps
        </button>
      </div>
    </div>
  </div>
{/if}

{#if showCycleCompletionDialog}
  <div
    class="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div
      class="bg-white dark:bg-card text-black dark:text-card-foreground p-6 rounded-lg shadow-xl max-w-lg w-full border-2 border-primary/20"
    >
      <h3 class="text-xl font-bold mb-4 text-primary">
        Workout Cycle Completed!
      </h3>

      <div class="mb-6">
        <p class="mb-4">
          Congratulations on completing your 5/3/1 workout cycle!
        </p>
        <p class="mb-4">
          Based on your AMRAP performance, here are the recommended changes to
          your training maxes:
        </p>
        <ul class="list-none pl-2 mb-4 space-y-3">
          <li
            class={liftSuccess.squat
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"}
          >
            <div class="flex items-center">
              <span
                class={`inline-block w-5 h-5 rounded-full mr-2 ${liftSuccess.squat ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400"} flex items-center justify-center text-white`}
                >✓</span
              >
              <span class="font-medium">Squat:</span>
              {#if liftSuccess.squat}
                <span class="ml-2"
                  >+10 lbs (new 1RM: {oneRepMaxes.squat + 10} lbs)</span
                >
              {:else}
                <span class="ml-2"
                  >No increase (not all AMRAP sets met minimum requirements)</span
                >
              {/if}
            </div>
          </li>
          <li
            class={liftSuccess.bench
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"}
          >
            <div class="flex items-center">
              <span
                class={`inline-block w-5 h-5 rounded-full mr-2 ${liftSuccess.bench ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400"} flex items-center justify-center text-white`}
                >✓</span
              >
              <span class="font-medium">Bench Press:</span>
              {#if liftSuccess.bench}
                <span class="ml-2"
                  >+5 lbs (new 1RM: {oneRepMaxes.bench + 5} lbs)</span
                >
              {:else}
                <span class="ml-2"
                  >No increase (not all AMRAP sets met minimum requirements)</span
                >
              {/if}
            </div>
          </li>
          <li
            class={liftSuccess.deadlift
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"}
          >
            <div class="flex items-center">
              <span
                class={`inline-block w-5 h-5 rounded-full mr-2 ${liftSuccess.deadlift ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400"} flex items-center justify-center text-white`}
                >✓</span
              >
              <span class="font-medium">Deadlift:</span>
              {#if liftSuccess.deadlift}
                <span class="ml-2"
                  >+10 lbs (new 1RM: {oneRepMaxes.deadlift + 10} lbs)</span
                >
              {:else}
                <span class="ml-2"
                  >No increase (not all AMRAP sets met minimum requirements)</span
                >
              {/if}
            </div>
          </li>
          <li
            class={liftSuccess.press
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"}
          >
            <div class="flex items-center">
              <span
                class={`inline-block w-5 h-5 rounded-full mr-2 ${liftSuccess.press ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400"} flex items-center justify-center text-white`}
                >✓</span
              >
              <span class="font-medium">Overhead Press:</span>
              {#if liftSuccess.press}
                <span class="ml-2"
                  >+5 lbs (new 1RM: {oneRepMaxes.press + 5} lbs)</span
                >
              {:else}
                <span class="ml-2"
                  >No increase (not all AMRAP sets met minimum requirements)</span
                >
              {/if}
            </div>
          </li>
        </ul>

        {#if Object.values(liftSuccess).some((success) => success)}
          <p>
            Would you like to generate a new workout plan with these updated
            values?
          </p>
        {:else}
          <p>
            Since none of your lifts met the minimum requirements, we recommend
            repeating this cycle with the same weights.
          </p>
        {/if}
      </div>

      <div class="flex justify-end gap-4">
        <button
          type="button"
          class="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80"
          onclick={closeCycleCompletionDialog}
        >
          Not Now
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          onclick={generateNewWorkoutPlan}
        >
          Generate New Plan
        </button>
      </div>
    </div>
  </div>
{/if}
