<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  
  let maxes = {
    squat: 0,
    bench: 0,
    deadlift: 0,
    press: 0
  };
  
  let submitting = false;
  let error = '';
  let success = '';
  
  function validateForm() {
    if (maxes.squat <= 0 || maxes.bench <= 0 || maxes.deadlift <= 0 || maxes.press <= 0) {
      error = 'All lifts must have values greater than 0';
      return false;
    }
    error = '';
    return true;
  }
</script>

<div class="max-w-3xl mx-auto">
  <div class="mb-8">
    <h1 class="text-3xl font-bold mb-2">Enter Your 1 Rep Maxes</h1>
    <p class="text-muted-foreground">
      Enter your one-rep max for each lift. These values will be used to calculate your training weights
      for the 5/3/1 program. If you don't know your 1RM, you can estimate it by taking a weight you can
      do for 5 reps and multiplying by 1.1, or a weight you can do for 3 reps and multiplying by 1.05.
    </p>
  </div>
  
  {#if error}
    <div class="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md mb-6">
      {error}
    </div>
  {/if}
  
  {#if success}
    <div class="bg-primary/15 border border-primary text-primary px-4 py-3 rounded-md mb-6">
      {success}
    </div>
  {/if}
  
  <form 
    method="POST" 
    action="/api/workouts/create-plan"
    use:enhance={({ formData, cancel }) => {
      // Validate the form before submission
      if (!validateForm()) {
        cancel();
        return;
      }
      
      submitting = true;
      
      return async ({ result, update }) => {
        submitting = false;
        
        if (result.type === 'success') {
          success = 'Workout plan generated successfully!';
          setTimeout(() => {
            window.location.href = '/dashboard/workouts';
          }, 1500);
        } else if (result.type === 'error') {
          error = result.error?.message || 'Failed to generate workout plan';
        }
        
        await update();
      };
    }}
    class="space-y-6"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label for="squat" class="block font-medium">Squat (lbs)</label>
        <input
          type="number"
          id="squat"
          name="squat"
          bind:value={maxes.squat}
          min="0"
          step="5"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      
      <div class="space-y-2">
        <label for="bench" class="block font-medium">Bench Press (lbs)</label>
        <input
          type="number"
          id="bench"
          name="bench"
          bind:value={maxes.bench}
          min="0"
          step="5"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      
      <div class="space-y-2">
        <label for="deadlift" class="block font-medium">Deadlift (lbs)</label>
        <input
          type="number"
          id="deadlift"
          name="deadlift"
          bind:value={maxes.deadlift}
          min="0"
          step="5"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      
      <div class="space-y-2">
        <label for="press" class="block font-medium">Overhead Press (lbs)</label>
        <input
          type="number"
          id="press"
          name="press"
          bind:value={maxes.press}
          min="0"
          step="5"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
    </div>
    
    <div class="pt-4">
      <button
        type="submit"
        disabled={submitting}
        class="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Generating...' : 'Generate Workout'}
      </button>
    </div>
  </form>
  
  <div class="mt-12 border-t border-border pt-6">
    <h2 class="text-xl font-bold mb-4">About Training Maxes</h2>
    <p class="mb-4">
      The 5/3/1 program uses training maxes (TM) which are 90% of your true 1RM. This provides a buffer
      for sustainable progress and reduces injury risk. The app will automatically calculate your
      training maxes based on the values you enter.
    </p>
    <p>
      Jim Wendler recommends starting with conservative numbers if you're unsure. It's better to start
      too light than too heavy - you'll still make progress and can adjust in future cycles.
    </p>
  </div>
</div>
