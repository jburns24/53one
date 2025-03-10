<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="hero py-5 bg-dark text-white text-center">
  <div class="container">
    <h1 class="display-4 fw-bold mb-4">53one Workout Planner</h1>
    <p class="lead mb-4">Track your lifts, generate personalized workout schedules, and reach your strength goals.</p>
    {#if !$page.data.session?.user}
      <a href="/auth/signin" class="btn btn-primary btn-lg">Get Started with Google</a>
    {:else}
      <a href="/dashboard" class="btn btn-primary btn-lg">Go to Dashboard</a>
    {/if}
  </div>
</div>

<div class="container py-5">
  <div class="row g-4">
    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body text-center">
          <h3 class="card-title">Track Your Lifts</h3>
          <p class="card-text">Record your 1RM for squat, deadlift, bench press, and overhead press to establish your baseline strength.</p>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body text-center">
          <h3 class="card-title">Generate Workouts</h3>
          <p class="card-text">Get personalized workout schedules based on your current strength levels and fitness goals.</p>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body text-center">
          <h3 class="card-title">Track Progress</h3>
          <p class="card-text">Monitor your strength gains over time and adjust your training program as you get stronger.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="bg-light py-5">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-6">
        <h2 class="mb-4">Why 53one?</h2>
        <p>53one is designed for strength enthusiasts who want a simple, effective way to track their progress and follow a structured workout plan based on scientific principles.</p>
        <p>Our workout generator uses your 1-rep max data to create personalized training programs that progressively overload your muscles, helping you get stronger over time.</p>
      </div>
      <div class="col-md-6 text-center">
        <div class="p-4 bg-white rounded shadow-sm">
          <h3 class="mb-3">Key Features</h3>
          <ul class="list-group list-group-flush text-start">
            <li class="list-group-item">Google authentication for secure login</li>
            <li class="list-group-item">Track your 1RM for major compound lifts</li>
            <li class="list-group-item">Generate personalized weekly workout schedules</li>
            <li class="list-group-item">Simple, clean interface focused on your training</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .hero {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80');
    background-size: cover;
    background-position: center;
    padding: 5rem 0;
  }
</style>
