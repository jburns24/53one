<script lang="ts">
  import { page } from '$app/stores';
  import { signOut } from '@auth/sveltekit/client';
  import type { LayoutData } from './$types';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  
  // Use export let for now since we're having issues with $props and slots
  export let data: LayoutData;
  
  // User data from the session
  const user = data.user;
</script>

<div class="min-h-screen bg-background">
  <header class="border-b border-border">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <a href="/" class="text-2xl font-bold text-primary">53one</a>
      </div>
      
      <nav class="flex items-center gap-6">
        <a 
          href="/dashboard" 
          class="{$page.url.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-foreground'} hover:text-primary transition-colors"
        >
          History
        </a>
        <a 
          href="/dashboard/1rm" 
          class="{$page.url.pathname === '/dashboard/1rm' ? 'text-primary font-medium' : 'text-foreground'} hover:text-primary transition-colors"
        >
          1RM
        </a>
        <a 
          href="/dashboard/workouts" 
          class="{$page.url.pathname === '/dashboard/workouts' ? 'text-primary font-medium' : 'text-foreground'} hover:text-primary transition-colors"
        >
          Workouts
        </a>
        <ThemeToggle />
        
        {#if user}
          <div class="flex items-center gap-3">
            <div class="text-sm font-medium">
              {user.name}
            </div>
            <button 
              on:click={() => signOut()} 
              class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
            >
              Sign Out
            </button>
          </div>
        {/if}
      </nav>
    </div>
  </header>
  
  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
</div>
