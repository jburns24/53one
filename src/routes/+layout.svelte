<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>53one - Workout Planner</title>
  <meta name="description" content="Track your lifts and get personalized workout plans" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</svelte:head>

<div class="app">
  <header class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="/">53one</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          {#if $page.data.session?.user}
            <li class="nav-item">
              <a class="nav-link" href="/dashboard">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/workout-data">My Lifts</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/schedule">My Schedule</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/auth/signout">Sign Out</a>
            </li>
          {:else}
            <li class="nav-item">
              <a class="nav-link" href="/auth/signin">Sign In</a>
            </li>
          {/if}
        </ul>
      </div>
    </div>
  </header>

  <main class="container py-4">
    <slot />
  </main>

  <footer class="bg-light py-3 mt-5">
    <div class="container text-center">
      <p class="mb-0">© {new Date().getFullYear()} 53one. All rights reserved.</p>
    </div>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }
</style>
