import { writable } from "svelte/store";
import type { User } from '@supabase/supabase-js';
import { supabase } from "$lib/supabase/supabase.client.js";

export const authStore = writable<{
    isLoading: boolean;
    currentUser: User | null;
}>({
    isLoading: true,
    currentUser: null
});

export const authHandlers = {
    signup: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.error(error.message);
        }
        return data?.user;
    },

    loginWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            console.error('Error logging in with Google:', error.message);
            return null;  // Return null in case of an error
        }

        const user = data?.user;
        if (user) {
            // Update the authStore with the current user
            authStore.update((curr) => ({ ...curr, currentUser: user }));
        }
        return user;
    },

    logout: async () => {
        await supabase.auth.signOut();
        authStore.update((curr) => ({ ...curr, currentUser: null }));  // Optionally reset the store
    },
};
