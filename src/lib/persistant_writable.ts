import { writable } from "@macfja/svelte-persistent-store";
import { form_data } from "./Form.js";

// Check if we're in the browser (where localStorage is available)
const isBrowser = typeof window !== "undefined";

// Initialize store by retrieving only the value from localStorage if we're in the browser
const savedFormData = isBrowser ? localStorage.getItem("form-data") : null;
const savedAllForms = isBrowser ? localStorage.getItem("all_forms") : null;

// Create persistent stores
export const persistent_form_data = writable(
    "form-data", // Key for localStorage
    savedFormData ? JSON.parse(savedFormData) : form_data // Initial value
);

export const all_forms_data = writable(
    "all_forms", // Key for localStorage
    savedAllForms ? JSON.parse(savedAllForms) : [] // Initial value
);

// Debugging: Log the initialized values for persistence
persistent_form_data.subscribe(value => {
    console.log('Persistent Form Data:', value);
});

all_forms_data.subscribe(value => {
    console.log('All Forms Data:', value);
});