import { writable } from "@macfja/svelte-persistent-store"
import { form_data } from "./Form.js";

export const persistent_form_data = writable('form-data', form_data);