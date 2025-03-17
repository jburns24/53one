<script lang="ts">
  import { page } from '$app/stores';
  import { cn } from '$lib/utils';
</script>

<!-- Hero Section -->
<section class="relative bg-gradient-to-b from-primary/90 to-primary py-24 md:py-32">
  <div class="absolute inset-0 bg-[url('/images/barbell-pattern.svg')] opacity-10"></div>
  <div class="container mx-auto px-4 relative z-10">
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground">53one Workout Planner</h1>
      <p class="text-xl md:text-2xl mb-8 text-primary-foreground/90">Master the 5/3/1 program. Track your lifts. Build real strength.</p>
      
      {#if !$page.data.session?.user}
        <a href="/auth/signin" class="inline-flex items-center justify-center rounded-md bg-primary-foreground text-primary px-8 py-3 text-base font-medium shadow-sm hover:bg-primary-foreground/90 transition-colors">
          Get Started with Google
          <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      {:else}
        <a href="/dashboard" class="inline-flex items-center justify-center rounded-md bg-primary-foreground text-primary px-8 py-3 text-base font-medium shadow-sm hover:bg-primary-foreground/90 transition-colors">
          Go to Dashboard
          <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      {/if}
    </div>
  </div>
</section>

<!-- Program Overview -->
<section class="py-16 md:py-24 bg-background">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Jim Wendler's 5/3/1 Program</h2>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">A proven strength training methodology focused on steady progression and long-term results.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div class="bg-card rounded-lg shadow-sm p-6 border border-border hover:border-primary/20 transition-colors">
        <div class="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-xl font-medium mb-2">Four Core Lifts</h3>
        <p class="text-muted-foreground">Focus on Squat, Bench Press, Deadlift, and Overhead Press to build total body strength.</p>
      </div>
      
      <div class="bg-card rounded-lg shadow-sm p-6 border border-border hover:border-primary/20 transition-colors">
        <div class="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium mb-2">Progressive Overload</h3>
        <p class="text-muted-foreground">Structured progression based on percentages of your training max for consistent gains.</p>
      </div>
      
      <div class="bg-card rounded-lg shadow-sm p-6 border border-border hover:border-primary/20 transition-colors">
        <div class="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium mb-2">Four-Week Cycles</h3>
        <p class="text-muted-foreground">Structured 3-week progression followed by a deload week for optimal recovery.</p>
      </div>
      
      <div class="bg-card rounded-lg shadow-sm p-6 border border-border hover:border-primary/20 transition-colors">
        <div class="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium mb-2">Simplicity</h3>
        <p class="text-muted-foreground">A straightforward program that's easy to understand, implement, and stick with long-term.</p>
      </div>
    </div>
  </div>
</section>

<!-- Weekly Schedule -->
<section class="py-16 md:py-24 bg-muted/30">
  <div class="container mx-auto px-4">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Weekly Training Structure</h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">A balanced approach to strength training with adequate recovery.</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div class="bg-card rounded-lg shadow-sm p-4 border border-border hover:border-primary/20 transition-colors">
          <h3 class="text-lg font-medium mb-2 text-center">Day 1</h3>
          <div class="text-center p-3 bg-primary/10 rounded-md text-primary font-medium">Squat</div>
          <p class="mt-3 text-sm text-muted-foreground text-center">+ Assistance Work</p>
        </div>
        
        <div class="bg-card rounded-lg shadow-sm p-4 border border-border hover:border-primary/20 transition-colors">
          <h3 class="text-lg font-medium mb-2 text-center">Day 2</h3>
          <div class="text-center p-3 bg-primary/10 rounded-md text-primary font-medium">Bench Press</div>
          <p class="mt-3 text-sm text-muted-foreground text-center">+ Assistance Work</p>
        </div>
        
        <div class="bg-card rounded-lg shadow-sm p-4 border border-border hover:border-primary/20 transition-colors">
          <h3 class="text-lg font-medium mb-2 text-center">Day 3</h3>
          <div class="text-center p-3 bg-muted rounded-md text-muted-foreground font-medium">Rest</div>
          <p class="mt-3 text-sm text-muted-foreground text-center">Recovery</p>
        </div>
        
        <div class="bg-card rounded-lg shadow-sm p-4 border border-border hover:border-primary/20 transition-colors">
          <h3 class="text-lg font-medium mb-2 text-center">Day 4</h3>
          <div class="text-center p-3 bg-primary/10 rounded-md text-primary font-medium">Deadlift</div>
          <p class="mt-3 text-sm text-muted-foreground text-center">+ Assistance Work</p>
        </div>
        
        <div class="bg-card rounded-lg shadow-sm p-4 border border-border hover:border-primary/20 transition-colors">
          <h3 class="text-lg font-medium mb-2 text-center">Day 5</h3>
          <div class="text-center p-3 bg-primary/10 rounded-md text-primary font-medium">Overhead Press</div>
          <p class="mt-3 text-sm text-muted-foreground text-center">+ Assistance Work</p>
        </div>
        
        <div class="bg-card rounded-lg shadow-sm p-4 border border-border hover:border-primary/20 transition-colors">
          <h3 class="text-lg font-medium mb-2 text-center">Day 6</h3>
          <div class="text-center p-3 bg-muted rounded-md text-muted-foreground font-medium">Rest</div>
          <p class="mt-3 text-sm text-muted-foreground text-center">Recovery</p>
        </div>
        
        <div class="bg-card rounded-lg shadow-sm p-4 border border-border hover:border-primary/20 transition-colors">
          <h3 class="text-lg font-medium mb-2 text-center">Day 7</h3>
          <div class="text-center p-3 bg-muted rounded-md text-muted-foreground font-medium">Rest</div>
          <p class="mt-3 text-sm text-muted-foreground text-center">Recovery</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Features -->
<section class="py-16 md:py-24 bg-background">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Why 53one?</h2>
        <p class="text-lg mb-6 text-muted-foreground">53one is designed for strength enthusiasts who want a simple, effective way to track their progress and follow Jim Wendler's 5/3/1 program.</p>
        
        <ul class="space-y-4">
          <li class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Calculate your training max and generate personalized workouts</span>
          </li>
          <li class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Track your progress with detailed workout history</span>
          </li>
          <li class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Automatically calculate weight progressions after each cycle</span>
          </li>
          <li class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Choose from popular assistance templates like Boring But Big</span>
          </li>
        </ul>
      </div>
      
      <div class="bg-card rounded-lg shadow-md p-8 border border-border">
        <h3 class="text-2xl font-bold mb-6">Program Cycle Structure</h3>
        
        <div class="space-y-6">
          <div class="p-4 rounded-md bg-muted/50">
            <h4 class="font-medium mb-2">Week 1 (5/5/5+)</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex justify-between">
                <span>Set 1:</span>
                <span class="font-medium">5 reps @ 65% TM</span>
              </li>
              <li class="flex justify-between">
                <span>Set 2:</span>
                <span class="font-medium">5 reps @ 75% TM</span>
              </li>
              <li class="flex justify-between">
                <span>Set 3:</span>
                <span class="font-medium">5+ reps @ 85% TM</span>
              </li>
            </ul>
          </div>
          
          <div class="p-4 rounded-md bg-muted/50">
            <h4 class="font-medium mb-2">Week 2 (3/3/3+)</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex justify-between">
                <span>Set 1:</span>
                <span class="font-medium">3 reps @ 70% TM</span>
              </li>
              <li class="flex justify-between">
                <span>Set 2:</span>
                <span class="font-medium">3 reps @ 80% TM</span>
              </li>
              <li class="flex justify-between">
                <span>Set 3:</span>
                <span class="font-medium">3+ reps @ 90% TM</span>
              </li>
            </ul>
          </div>
          
          <div class="p-4 rounded-md bg-muted/50">
            <h4 class="font-medium mb-2">Week 3 (5/3/1+)</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex justify-between">
                <span>Set 1:</span>
                <span class="font-medium">5 reps @ 75% TM</span>
              </li>
              <li class="flex justify-between">
                <span>Set 2:</span>
                <span class="font-medium">3 reps @ 85% TM</span>
              </li>
              <li class="flex justify-between">
                <span>Set 3:</span>
                <span class="font-medium">1+ reps @ 95% TM</span>
              </li>
            </ul>
          </div>
          
          <div class="p-4 rounded-md bg-muted/50">
            <h4 class="font-medium mb-2">Week 4 (Deload)</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex justify-between">
                <span>Set 1:</span>
                <span class="font-medium">5 reps @ 40% TM</span>
              </li>
              <li class="flex justify-between">
                <span>Set 2:</span>
                <span class="font-medium">5 reps @ 50% TM</span>
              </li>
              <li class="flex justify-between">
                <span>Set 3:</span>
                <span class="font-medium">5 reps @ 60% TM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-16 md:py-24 bg-primary text-primary-foreground">
  <div class="container mx-auto px-4 text-center">
    <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Get Stronger?</h2>
    <p class="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">Join 53one today and start your journey with the 5/3/1 program.</p>
    
    {#if !$page.data.session?.user}
      <a href="/auth/signin" class="inline-flex items-center justify-center rounded-md bg-primary-foreground text-primary px-8 py-3 text-base font-medium shadow-sm hover:bg-primary-foreground/90 transition-colors">
        Sign Up with Google
      </a>
    {:else}
      <a href="/dashboard" class="inline-flex items-center justify-center rounded-md bg-primary-foreground text-primary px-8 py-3 text-base font-medium shadow-sm hover:bg-primary-foreground/90 transition-colors">
        Go to Dashboard
      </a>
    {/if}
  </div>
</section>
