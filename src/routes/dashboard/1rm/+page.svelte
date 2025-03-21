<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";

  export let data: PageData;

  // Initialize with default values
  let maxes = {
    squat: 0,
    bench: 0,
    deadlift: 0,
    press: 0,
  };

  let submitting = false;
  let error = "";
  let success = "";
  let hasExistingMaxes = false;
  let showConfirmDialog = false;

  // Use onMount to ensure client-side initialization happens after the component is mounted
  onMount(() => {
    console.log("1RM Client - User Maxes:", data.userMaxes);

    // Update values from data
    if (data.userMaxes) {
      maxes = {
        squat: data.userMaxes.squat || 0,
        bench: data.userMaxes.bench || 0,
        deadlift: data.userMaxes.deadlift || 0,
        press: data.userMaxes.press || 0,
      };
      hasExistingMaxes = true;
    }
  });

  function validateForm() {
    if (
      maxes.squat <= 0 ||
      maxes.bench <= 0 ||
      maxes.deadlift <= 0 ||
      maxes.press <= 0
    ) {
      error = "All lifts must have values greater than 0";
      return false;
    }
    error = "";
    return true;
  }
</script>

<div class="max-w-3xl mx-auto">
  <div class="mb-8">
    <h1 class="text-3xl font-bold mb-2">
      {hasExistingMaxes ? "Update" : "Enter"} Your 1 Rep Maxes
    </h1>
    <p class="text-muted-foreground">
      {#if hasExistingMaxes}
        You can update your one-rep max values below. Your current values are
        shown. Changing these values will recalculate your entire 5/3/1 workout
        plan.
      {:else}
        Enter your one-rep max for each lift. These values will be used to
        calculate your training weights for the 5/3/1 program. If you don't know
        your 1RM, you can estimate it by taking a weight you can do for 5 reps
        and multiplying by 1.1, or a weight you can do for 3 reps and
        multiplying by 1.05.
      {/if}
    </p>
  </div>

  {#if hasExistingMaxes}
    <div class="bg-muted/30 border border-border rounded-lg p-4 mb-6">
      <h2 class="text-lg font-medium mb-2">Current 1RM Values</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p class="text-sm text-muted-foreground">Squat</p>
          <p class="text-xl font-bold">{data.userMaxes?.squat || 0} lbs</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Bench Press</p>
          <p class="text-xl font-bold">{data.userMaxes?.bench || 0} lbs</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Deadlift</p>
          <p class="text-xl font-bold">{data.userMaxes?.deadlift || 0} lbs</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Overhead Press</p>
          <p class="text-xl font-bold">{data.userMaxes?.press || 0} lbs</p>
        </div>
      </div>
    </div>
  {/if}

  {#if error}
    <div
      class="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md mb-6"
    >
      {error}
    </div>
  {/if}

  {#if success}
    <div
      class="bg-primary/15 border border-primary text-primary px-4 py-3 rounded-md mb-6"
    >
      {success}
    </div>
  {/if}

  {#if showConfirmDialog}
    <div class="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-card text-black dark:text-card-foreground p-6 rounded-lg shadow-xl max-w-md w-full border-2 border-primary/20">
        <h3 class="text-xl font-bold mb-4 text-primary">Update Workout Plan?</h3>
        <p class="mb-6 font-medium">Updating your 1RM values will reset your current workout plan and progress. Are you sure you want to continue?</p>
        <div class="flex justify-end gap-4">
          <button 
            type="button" 
            class="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80"
            on:click={() => showConfirmDialog = false}
          >
            Cancel
          </button>
          <button 
            type="button" 
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            on:click={() => {
              showConfirmDialog = false;
              const form = document.getElementById('oneRMForm') as HTMLFormElement;
              if (form) form.submit();
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  {/if}

  <form
    id="oneRMForm"
    method="POST"
    action="/api/workouts/create-plan"
    use:enhance={({ formData, cancel }) => {
      // Validate the form before submission
      if (!validateForm()) {
        cancel();
        return;
      }

      // If user has an existing workout plan, show confirmation dialog
      if (data.hasWorkoutPlan && hasExistingMaxes) {
        showConfirmDialog = true;
        cancel();
        return;
      }

      submitting = true;

      return async ({ result, update }) => {
        submitting = false;

        if (result.type === "success") {
          success = "Workout plan generated successfully!";
          setTimeout(() => {
            window.location.href = "/dashboard/workouts";
          }, 1500);
        } else if (result.type === "error") {
          error = result.error?.message || "Failed to generate workout plan";
        }

        await update();
      };
    }}
    class="space-y-6"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label for="squat" class="block font-medium">
          Squat (lbs)
          {#if hasExistingMaxes}
            <span class="text-xs text-muted-foreground ml-2"
              >(Current: {data.userMaxes?.squat || 0} lbs)</span
            >
          {/if}
        </label>
        <input
          type="number"
          id="squat"
          name="squat"
          bind:value={maxes.squat}
          min="0"
          step="5"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={hasExistingMaxes
            ? `Current: ${data.userMaxes?.squat || 0} lbs`
            : "Enter weight in lbs"}
          required
        />
      </div>

      <div class="space-y-2">
        <label for="bench" class="block font-medium">
          Bench Press (lbs)
          {#if hasExistingMaxes}
            <span class="text-xs text-muted-foreground ml-2"
              >(Current: {data.userMaxes?.bench || 0} lbs)</span
            >
          {/if}
        </label>
        <input
          type="number"
          id="bench"
          name="bench"
          bind:value={maxes.bench}
          min="0"
          step="5"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={hasExistingMaxes
            ? `Current: ${data.userMaxes?.bench || 0} lbs`
            : "Enter weight in lbs"}
          required
        />
      </div>

      <div class="space-y-2">
        <label for="deadlift" class="block font-medium">
          Deadlift (lbs)
          {#if hasExistingMaxes}
            <span class="text-xs text-muted-foreground ml-2"
              >(Current: {data.userMaxes?.deadlift || 0} lbs)</span
            >
          {/if}
        </label>
        <input
          type="number"
          id="deadlift"
          name="deadlift"
          bind:value={maxes.deadlift}
          min="0"
          step="5"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={hasExistingMaxes
            ? `Current: ${data.userMaxes?.deadlift || 0} lbs`
            : "Enter weight in lbs"}
          required
        />
      </div>

      <div class="space-y-2">
        <label for="press" class="block font-medium">
          Overhead Press (lbs)
          {#if hasExistingMaxes}
            <span class="text-xs text-muted-foreground ml-2"
              >(Current: {data.userMaxes?.press || 0} lbs)</span
            >
          {/if}
        </label>
        <input
          type="number"
          id="press"
          name="press"
          bind:value={maxes.press}
          min="0"
          step="5"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={hasExistingMaxes
            ? `Current: ${data.userMaxes?.press || 0} lbs`
            : "Enter weight in lbs"}
          required
        />
      </div>
    </div>

    <div class="pt-6">
      <button
        type="submit"
        disabled={submitting}
        class="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(255,255,255,0.3),0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(255,255,255,0.4),0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clip-rule="evenodd"
          />
        </svg>
        {submitting
          ? "Processing..."
          : hasExistingMaxes
            ? "Update Workout Plan"
            : "Generate Workout Plan"}
      </button>
    </div>
  </form>

  <div class="mt-12 border-t border-border pt-6">
    <h2 class="text-xl font-bold mb-4">About Training Maxes</h2>
    <p class="mb-4">
      The 5/3/1 program uses training maxes (TM) which are 90% of your true 1RM.
      This provides a buffer for sustainable progress and reduces injury risk.
      The app will automatically calculate your training maxes based on the
      values you enter.
    </p>
    <p>
      Jim Wendler recommends starting with conservative numbers if you're
      unsure. It's better to start too light than too heavy - you'll still make
      progress and can adjust in future cycles.
    </p>
  </div>
</div>
