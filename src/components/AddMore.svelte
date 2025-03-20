<script lang="ts">
    export let passFunction: () => void;
    import Plus from './../../node_modules/lucide-svelte/dist/icons/plus.svelte';
  </script>
  
  <button class="cursor-pointer primary_btn" type="button" on:click={passFunction}>
     <span><Plus /></span><span>Add More</span>
  </button>
  