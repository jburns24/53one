<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import { onMount, onDestroy } from 'svelte';
  import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
  
  // Register Chart.js components
  Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);
  
  export let data: PageData;
  
  // Format weight with proper units
  function formatWeight(weight: number): string {
    return `${weight} lbs`;
  }
  
  // Calculate estimated 1RM using Epley formula
  function calculateEstimated1RM(weight: number, reps: number): number {
    return Math.round(weight * (1 + reps/30));
  }
  
  // Initialize chart on mount
  let chartContainer: HTMLCanvasElement;
  let chart: Chart | null = null;
  
  onMount(() => {
    if (data.oneRMHistory && chartContainer) {
      renderChart();
    }
  });
  
  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
  
  // Render the progress chart
  function renderChart() {
    const chartData = data.oneRMHistory;
    console.log('Chart data:', chartData);
    
    // Debug data points for each lift
    for (const lift of Object.keys(chartData)) {
      console.log(`${lift} data points:`, chartData[lift as keyof typeof chartData]);
    }
    
    if (!chartData || Object.keys(chartData).every(key => 
      chartData[key as keyof typeof chartData].length === 0)) {
      console.log('No chart data available, displaying message');
      const ctx = chartContainer.getContext('2d');
      if (ctx) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No history data available yet', chartContainer.width / 2, chartContainer.height / 2);
      }
      return;
    }
    
    // Prepare data for Chart.js
    const lifts = ['squat', 'bench', 'deadlift', 'press'];
    const liftColors = {
      squat: 'rgb(255, 99, 132)',
      bench: 'rgb(54, 162, 235)',
      deadlift: 'rgb(255, 206, 86)',
      press: 'rgb(75, 192, 192)'
    };
    
    // Get all unique dates across all lifts
    const allDates = new Set<string>();
    for (const lift of lifts) {
      const liftData = chartData[lift as keyof typeof chartData] || [];
      for (const point of liftData) {
        allDates.add(point.date);
      }
    }
    
    // Sort dates chronologically
    const labels = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    // Create datasets for each lift
    const datasets = lifts.map(lift => {
      const liftData = chartData[lift as keyof typeof chartData] || [];
      
      // Create a map of date to value for easier lookup
      const dateValueMap = new Map<string, number>();
      for (const point of liftData) {
        dateValueMap.set(point.date, point.value);
      }
      
      // Create the dataset with values for each label date
      return {
        label: lift.charAt(0).toUpperCase() + lift.slice(1),
        data: labels.map(date => dateValueMap.get(date) || null),
        borderColor: liftColors[lift as keyof typeof liftColors],
        backgroundColor: liftColors[lift as keyof typeof liftColors] + '20', // 20 is hex for 12% opacity
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });
    
    // Create the chart
    const ctx = chartContainer.getContext('2d');
    if (!ctx) return;
    
    if (chart) {
      chart.destroy();
    }
    
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Weight (lbs)'
            },
            beginAtZero: false
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${formatWeight(value)}`;
              }
            }
          }
        }
      }
    });
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Workout History</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- 1RM Progress Chart -->
    <div class="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border">
      <h2 class="text-xl font-semibold mb-4">1RM Progress</h2>
      <div class="h-64 bg-card rounded-md overflow-hidden">
        <canvas bind:this={chartContainer} class="w-full h-full"></canvas>
      </div>
    </div>
    
    <!-- Personal Records -->
    <div class="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border">
      <h2 class="text-xl font-semibold mb-4">Personal Records</h2>
      <div class="space-y-4">
        <div class="p-4 bg-muted/20 rounded-md">
          <h3 class="font-medium mb-2">Squat</h3>
          {#if data.prData?.squat?.weight > 0}
            <p>
              <span class="font-semibold">{formatWeight(data.prData.squat.weight)}</span> × 
              <span class="font-semibold">{data.prData.squat.reps}</span> reps
              <span class="text-muted-foreground ml-2">
                (Est. 1RM: {formatWeight(calculateEstimated1RM(data.prData.squat.weight, data.prData.squat.reps))})
              </span>
            </p>
          {:else}
            <p class="text-muted-foreground">No PR recorded yet</p>
          {/if}
        </div>
        
        <div class="p-4 bg-muted/20 rounded-md">
          <h3 class="font-medium mb-2">Bench Press</h3>
          {#if data.prData?.bench?.weight > 0}
            <p>
              <span class="font-semibold">{formatWeight(data.prData.bench.weight)}</span> × 
              <span class="font-semibold">{data.prData.bench.reps}</span> reps
              <span class="text-muted-foreground ml-2">
                (Est. 1RM: {formatWeight(calculateEstimated1RM(data.prData.bench.weight, data.prData.bench.reps))})
              </span>
            </p>
          {:else}
            <p class="text-muted-foreground">No PR recorded yet</p>
          {/if}
        </div>
        
        <div class="p-4 bg-muted/20 rounded-md">
          <h3 class="font-medium mb-2">Deadlift</h3>
          {#if data.prData?.deadlift?.weight > 0}
            <p>
              <span class="font-semibold">{formatWeight(data.prData.deadlift.weight)}</span> × 
              <span class="font-semibold">{data.prData.deadlift.reps}</span> reps
              <span class="text-muted-foreground ml-2">
                (Est. 1RM: {formatWeight(calculateEstimated1RM(data.prData.deadlift.weight, data.prData.deadlift.reps))})
              </span>
            </p>
          {:else}
            <p class="text-muted-foreground">No PR recorded yet</p>
          {/if}
        </div>
        
        <div class="p-4 bg-muted/20 rounded-md">
          <h3 class="font-medium mb-2">Overhead Press</h3>
          {#if data.prData?.press?.weight > 0}
            <p>
              <span class="font-semibold">{formatWeight(data.prData.press.weight)}</span> × 
              <span class="font-semibold">{data.prData.press.reps}</span> reps
              <span class="text-muted-foreground ml-2">
                (Est. 1RM: {formatWeight(calculateEstimated1RM(data.prData.press.weight, data.prData.press.reps))})
              </span>
            </p>
          {:else}
            <p class="text-muted-foreground">No PR recorded yet</p>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Theoretical Total -->
    <div class="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border md:col-span-2">
      <h2 class="text-xl font-semibold mb-4">Theoretical Total</h2>
      <div class="flex items-center justify-center h-24 bg-muted/30 rounded-md">
        {#if data.theoreticalTotal > 0}
          <p class="text-3xl font-bold">{formatWeight(data.theoreticalTotal)}</p>
        {:else}
          <p class="text-muted-foreground">No data available yet</p>
        {/if}
      </div>
    </div>
  </div>
</div>
