<script lang="ts">
    export let passFunction: () => void;
  </script>
  
  <button class="cursor-pointer primary_btn" type="button" on:click={passFunction}>
    Add More
  </button>
  