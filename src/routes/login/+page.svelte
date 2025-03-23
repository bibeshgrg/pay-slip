<script lang="ts">
    import { supabase } from "$lib/supabase/supabase.client.js";




    let errorMessage = '';

    // The loginWithGoogle function
    const loginWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });

            if (error) {
                errorMessage = error.message;
                console.error('Error logging in with Google:', error.message);
                return;
            }

            // After login, fetch the session to get user info
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                errorMessage = sessionError.message;
                console.error('Error fetching session:', sessionError.message);
                return;
            }

        
        } catch (error) {
            console.error('Unexpected error during Google login:', error);
            errorMessage = 'An unexpected error occurred.';
        }
    }
</script>

<main class="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
    <div class="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <button 
            on:click={loginWithGoogle} 
            class="bg-[var(--color-primary)] cursor-pointer hover:bg-[var(--hover--color-primary)] text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 w-full">
            <img src="/google.png" alt="Google" class="w-6 h-6" />
            Continue with Google
        </button>
        {#if errorMessage}
            <p class="text-red-500 mt-2">{errorMessage}</p>
        {/if}
    </div>
</main>
