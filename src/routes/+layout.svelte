<script lang="ts">
  import { page } from '$app/stores';
  import '../app.css';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<svelte:head>
  <title>53one - Workout Planner</title>
  <meta name="description" content="Track your lifts and get personalized workout plans" />
</svelte:head>

<div class="flex flex-col min-h-screen">
  {#if !$page.url.pathname.startsWith('/dashboard')}
  <header class="bg-primary text-primary-foreground">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="text-xl font-bold">53one</a>
        
        <div class="hidden md:flex items-center space-x-4">
          <ThemeToggle />
        </div>
        
        <div class="hidden md:block">
          <div class="flex items-center space-x-4">
            {#if $page.data.session?.user}
              <a href="/dashboard" class="px-3 py-2 hover:bg-primary-foreground/10 rounded-md">Dashboard</a>
              <a href="/dashboard/1rm" class="px-3 py-2 hover:bg-primary-foreground/10 rounded-md">My 1RM</a>
              <a href="/dashboard/workouts" class="px-3 py-2 hover:bg-primary-foreground/10 rounded-md">My Workouts</a>
              <a href="/api/auth/signout" class="px-3 py-2 hover:bg-primary-foreground/10 rounded-md">Sign Out</a>
            {:else}
              <a href="/api/auth/signin" class="px-3 py-2 hover:bg-primary-foreground/10 rounded-md">Sign In</a>
            {/if}
          </div>
        </div>
        
        <div class="md:hidden">
          <button type="button" class="text-primary-foreground" aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
  {/if}

  <main class="flex-1">
    <slot />
  </main>

  <footer class="bg-muted py-6">
    <div class="container mx-auto px-4 text-center">
      <p class="text-muted-foreground">© {new Date().getFullYear()} 53one. All rights reserved.</p>
    </div>
  </footer>
</div>
