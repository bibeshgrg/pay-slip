<script lang="ts">
    import { form_data } from "$lib/Form.js";
    import { all_forms_data } from "$lib/persistant_writable.js";
    import Trash_2 from "lucide-svelte/icons/trash-2";
    import { fade } from "svelte/transition";
  
    function handleCompanyClick(form: any) {
      // Update form_data with the selected form's data
      form_data.set(form);
    }
  
    function handleDeleteForm(formId: string) {
      // Remove the form from all_forms_data by filtering out the form with the matching ID
      all_forms_data.update(forms => {
        return forms.filter(form => form.id !== formId);
      });
    }
  </script>
  


  <div class="sidebar overflow-y-auto">
    <div class="text-center border-[val(--border-color)] border-b-[0.5px] heading-one py-4">
        <h2 class="text-lg font-bold">Saved Forms</h2>
    </div>

    <div class="flex flex-col p-1 px-2 overflow-y-auto h-screen">
        {#each $all_forms_data as form}
            <!-- Check if form has company_details -->
            {#if form.company_details && form.company_details.company_name}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="hover:bg-neutral-700 p-1 py-1.5 rounded-lg"
                    transition:fade
                    on:click={() => handleCompanyClick(form)}
                >
                    <div class="flex flex-row justify-between items-center cursor-pointer">
                  
                        <div class="flex flex-col">
                            <span>{form.company_details.company_name}</span>
                            <span class="text-[var(--color-muted)] text-xs">{form.employee_pay_summary.pay_period}</span>
                        </div>
                        <button
                            type="button"
                            class="cursor-pointer primary_btn_delete flex justify-center items-center"
                            on:click={(e) => {
                              e.stopPropagation(); // Prevent triggering the form click
                              handleDeleteForm(form.id);
                            }}
                        >
                            <Trash_2 />
                        </button>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>
