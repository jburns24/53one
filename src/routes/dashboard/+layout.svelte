<script lang="ts">
  import { page } from "$app/stores";
  import { signOut } from "@auth/sveltekit/client";
  import type { LayoutData } from "./$types";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  // Use export let for now since we're having issues with $props and slots
  export let data: LayoutData;

  // User data from the session
  const user = data.user;

  // Mobile menu state
  let isMenuOpen = false;

  // Toggle mobile menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;

    // Toggle body scroll lock
    if (browser) {
      if (isMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }

  // Close mobile menu
  function closeMenu() {
    isMenuOpen = false;
    if (browser) {
      document.body.style.overflow = "";
    }
  }

  // Cleanup function to ensure body scroll is enabled when component unmounts
  onMount(() => {
    return () => {
      if (browser) {
        document.body.style.overflow = "";
      }
    };
  });
</script>

<div class="min-h-screen bg-background">
  <header class="border-b border-border">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <!-- Logo/favicon for small screens, text for larger screens -->
        <a href="/" class="flex items-center">
          <img src="/favicon.png" alt="53one logo" class="h-8 w-8 sm:mr-2" />
          <span class="hidden sm:inline text-2xl font-bold text-primary"
            >53one</span
          >
        </a>
      </div>

      <!-- Desktop navigation -->
      <nav class="hidden sm:flex items-center gap-6">
        <a
          href="/dashboard"
          class="{$page.url.pathname === '/dashboard'
            ? 'text-primary font-medium'
            : 'text-foreground'} hover:text-primary transition-colors"
        >
          History
        </a>
        <a
          href="/dashboard/1rm"
          class="{$page.url.pathname === '/dashboard/1rm'
            ? 'text-primary font-medium'
            : 'text-foreground'} hover:text-primary transition-colors"
        >
          1RM
        </a>
        <a
          href="/dashboard/workouts"
          class="{$page.url.pathname === '/dashboard/workouts'
            ? 'text-primary font-medium'
            : 'text-foreground'} hover:text-primary transition-colors"
        >
          Workouts
        </a>
        <ThemeToggle />

        {#if user}
          <div class="flex items-center">
            <form action="/api/auth/signout" method="GET" class="m-0 p-0">
              <button
                type="submit"
                class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        {/if}
      </nav>

      <!-- Mobile user controls (always visible) -->
      <div class="flex sm:hidden items-center gap-3">
        <ThemeToggle />

        <!-- Mobile hamburger menu (moved here) -->
        <button
          class="flex sm:hidden text-foreground p-1"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          on:click={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {#if isMenuOpen}
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            {:else}
              <path d="M4 12h16"></path>
              <path d="M4 6h16"></path>
              <path d="M4 18h16"></path>
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile navigation overlay -->
  {#if isMenuOpen}
    <div
      class="fixed inset-0 bg-black dark:bg-gray-900 text-white dark:text-white z-40 sm:hidden flex flex-col"
      on:click|self={closeMenu}
      on:keydown={(e) => e.key === "Escape" && closeMenu()}
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div class="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <!-- Close button at the top -->
        <div class="flex justify-end mb-6">
          <button
            class="p-2 rounded-full hover:bg-gray-800 text-white transition-colors"
            aria-label="Close menu"
            on:click={closeMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Mobile navigation links -->
        <nav class="flex flex-col gap-6 items-center text-lg">
          <a
            href="/dashboard"
            class="{$page.url.pathname === '/dashboard'
              ? 'text-primary font-medium'
              : 'text-white dark:text-white'} hover:text-primary transition-colors py-2"
            on:click={closeMenu}
          >
            History
          </a>
          <a
            href="/dashboard/1rm"
            class="{$page.url.pathname === '/dashboard/1rm'
              ? 'text-primary font-medium'
              : 'text-white dark:text-white'} hover:text-primary transition-colors py-2"
            on:click={closeMenu}
          >
            1RM
          </a>
          <a
            href="/dashboard/workouts"
            class="{$page.url.pathname === '/dashboard/workouts'
              ? 'text-primary font-medium'
              : 'text-white dark:text-white'} hover:text-primary transition-colors py-2"
            on:click={closeMenu}
          >
            Workouts
          </a>

          <!-- User logout in mobile menu (removed name display) -->
          {#if user}
            <div class="mt-4 flex flex-col items-center gap-4">
              <form action="/api/auth/signout" method="GET" class="m-0 p-0">
                <button
                  type="submit"
                  class="px-6 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          {/if}
        </nav>
      </div>
    </div>
  {/if}

  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
</div>
