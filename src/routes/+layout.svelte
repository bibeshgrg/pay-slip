<script lang="ts">
    import { onMount } from 'svelte';
    import SiderBar from '../components/SiderBar.svelte';
    import { authStore } from '../stores/authStore.js';
    import { browser } from '$app/environment';
    import { Toasts } from 'svoast';

    let { children } = $props();

    onMount(() => {
    const unsubscribe = authStore.subscribe(({ currentUser, isLoading }) => {
        if (!browser || isLoading) return;

        if (!currentUser && window.location.pathname !== '/login') {
            window.location.href = '/login';
            console.log('Redirecting to /login');
        }

        if (currentUser && window.location.pathname === '/login') {
            window.location.href = '/';
            console.log('Redirecting to /');
        }
    });

    return () => {
        unsubscribe();
    };
});
</script>
  

<Toasts position="top-center" />
<div class="flex flex-row w-full h-full">

    <!-- Sticky Sidebar -->
    <nav class="sticky top-0 h-full">
        <SiderBar />
    </nav>

    <!-- Main content area -->
    <div class="flex h-full w-full">
        {@render children()}
    </div>
</div>
