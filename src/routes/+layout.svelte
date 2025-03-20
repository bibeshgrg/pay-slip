<script lang="ts">
    import SiderBar from '../components/SiderBar.svelte';
  
    let { children } = $props();
  </script>
  
  <div class="flex flex-row w-full h-full relative">
      <!-- Sticky Sidebar -->
      <nav class="sticky top-0 w-64 h-full">
          <SiderBar />
      </nav>
  
      <!-- Main content area -->
      <div class="flex-1 h-full">
          {@render children()}
      </div>
  </div>
  