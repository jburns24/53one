<script lang="ts">
  import { page } from '$app/stores';
  import { signOut } from '@auth/sveltekit/client';
  import type { LayoutData } from './$types';
  
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
        <a href="/dashboard" class="text-foreground hover:text-primary transition-colors">Dashboard</a>
        <a href="/dashboard/1rm" class="text-foreground hover:text-primary transition-colors">1RM</a>
        
        {#if user}
          <div class="flex items-center gap-3">
            <div class="flex flex-col text-sm">
              <span class="font-medium">{user.name}</span>
              <span class="text-muted-foreground">{user.email}</span>
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
