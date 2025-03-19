

<script lang="ts">
    import { form_data } from '$lib/Form.js';
  import AddMore from '../components/AddMore.svelte';
    import EllipsisVertical from './../../node_modules/lucide-svelte/dist/icons/ellipsis-vertical.svelte';
    import Trash2 from './../../node_modules/lucide-svelte/dist/icons/trash-2.svelte';
 

    // Function to add more fields to employee pay summary
    function addMoreForEmployeePaySummary() {
    form_data.update(($form_data) => {
        $form_data.employee_pay_summary.add_more.push({
            name: '',
            value: ''
        });
        return $form_data;
    });
}


    // Function to add more fields to employee pay summary
    function addMoreForEarnings() {
    form_data.update(($form_data) => {
        $form_data.earnings.push({
            name: '',
            value: ''
        });
        return $form_data;
    });
    }

    function addMoreForDeducations() {
        form_data.update(($form_data) => {
            $form_data.deductions.push({
                name: '',
                value: ''
            });
            return $form_data;
        });
    }

  // Function to remove an item from the `add_more` array
  function removeAddMore(index: number) {
    form_data.update(($form_data) => {
      $form_data.employee_pay_summary.add_more.splice(index, 1); // Removes the item at the given index
      return $form_data;
    });
  }

  function removeEarnings(index: number) {
    form_data.update(($form_data) => {
      $form_data.earnings.splice(index, 1); // Removes the item at the given index
      return $form_data;
    });
  }

  function removeDeductions(index: number) {
    form_data.update(($form_data) => {
      $form_data.deductions.splice(index, 1); // Removes the item at the given index
      return $form_data;
    });
  }
    
</script>


<div class="flex flex-col  justify-center items-center w-full h-full py-32 bg-neutral-50">
    <form class="flex flex-col rounded-lg 2xl:w-[70rem] 2xl:px-10  2xl:py-8 bg-white  text-black shadow-2xl space-y-9">

        <!-- Logo and Date -->
        <div class="flex flex-row justify-between items-center">
            <div class="rounded-lg flex flex-col justify-center items-center space-y-2">
                <label for="uplpoadCompanyImage">Upload Image</label>
                <input class="input_primary" bind:value={$form_data.company_details.company_logo} id="uplpoadCompanyImage" type="file"/>
                <span id="error_message"></span>
            </div>
            <div class="flex flex-col">
                <label for="todayDate">Date</label>
                <span id="todayDate"> {Date.now()}</span>
               
            </div>
        </div>

        <!-- Company Details -->
        <div class="flex flex-row justify-between">
            <div class="flex flex-col space-y-5">
                <div class="flex flex-col">
                    <label placeholder="Enter Company Name" for="company_name">Company Name:</label>
                    <input class="input_primary" bind:value={$form_data.company_details.company_name} type="text" id="company_name"/>
                    <span id="error_message"></span>
                </div>
                <div class="flex flex-col">
                    <label placeholder="Enter Company Address" for="company_address">Company Address:</label>
                    <input class="input_primary" bind:value={$form_data.company_details.company_address} type="text" id="company_address"/>
                    <span id="error_message"></span>
                </div>
                <div class="flex flex-col">
                    <label placeholder="Enter Pin Code" for="pin_code">Pin Code:</label>
                    <input class="input_primary" bind:value={$form_data.company_details.company_pincode} type="text" id="pin_code"/>
                    <span id="error_message"></span>
                </div>
            </div>
    
        </div>

        <!-- Employee Pay Summary -->
        <div class="flex flex-col">
            <div>
                Employee Pay Summary
            </div>
            <div class="grid grid-cols-2 grid-rows-3 gap-5">
                <!-- Employee Name -->
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-row">
                        <label class="employee_label" for="employee_name">Employee Name *</label>
                        <EllipsisVertical />
                    </div>
                    <div>
                        <input bind:value={$form_data.employee_pay_summary.employee_name} class="input_half" id="employee_name"/>
                    </div>
                </div>
                <!-- Employee ID -->
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-row">
                        <label class="employee_label" for="employee_id">Employee Id *</label>
                        <EllipsisVertical />
                    </div>
                    <div>
                        <input bind:value={$form_data.employee_pay_summary.employee_id} class="input_half" id="employee_id"/>
                    </div>
                </div>
                <!-- Pay Period -->
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-row">
                        <label class="employee_label" for="pay_period">Pay Period</label>
                        <EllipsisVertical />
                    </div>
                    <div>
                        <input bind:value={$form_data.employee_pay_summary.pay_period} type="date" class="input_half" id="pay_period"/>
                    </div>
                </div>
                <!-- Paid Days -->
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-row">
                        <label class="employee_label" for="paid_days">Paid Days</label>
                        <EllipsisVertical />
                    </div>
                    <div>
                        <input bind:value={$form_data.employee_pay_summary.paid_days} class="input_half" id="paid_days"/>
                    </div>
                </div>
                <!-- Loss of Pay Days -->
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-row">
                        <label class="employee_label" for="loss_of_pay_days">Loss of pay days</label>
                        <EllipsisVertical />
                    </div>
                    <div>
                        <input bind:value={$form_data.employee_pay_summary.loss_of_pay_days} class="input_half" id="loss_of_pay_days"/>
                    </div>
                </div>
                <!-- Pay Date -->
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-row">
                        <label class="employee_label" for="pay_date">Pay Date</label>
                        <EllipsisVertical />
                    </div>
                    <div>
                        <input type="date" bind:value={$form_data.employee_pay_summary.pay_date} class="input_half" id="pay_date"/>
                    </div>
                </div>
                <!-- Add More -->
                {#each $form_data.employee_pay_summary.add_more as addMore, addIndex (addIndex)}
                <div class="flex flex-col">
                    <div class="flex flex-row justify-between space-x-1">
                        <input bind:value={$form_data.employee_pay_summary.add_more[addIndex].name} placeholder="Name" class="input_half" />
                        <input bind:value={$form_data.employee_pay_summary.add_more[addIndex].value} placeholder="Value" class="input_half" />
                    </div>
                    <div class="flex justify-end items-center">
                        <button type="button" class="cursor-pointer primary_btn_delete mt-2 flex justify-center items-center" on:click={() => removeAddMore(addIndex)}>
                            <Trash2 />
                        </button>
                    </div>
                </div>
            {/each}
            
            <div class="col-span-2">
                <AddMore passFunction={addMoreForEmployeePaySummary}/>
            </div>

            </div>
        </div>
        
        
        <!-- Earnings And Deducations -->
        <div class="flex flex-row justify-between items-center w-full space-x-4">

            <!-- Earnings -->
            <div class="flex flex-col w-1/2">
                <div class="border border-neutral-300 flex flex-row justify-between p-3">
                  <span>Earnings</span>
                  <span>Amount</span>
                </div>
                <div class=" flex flex-col space-y-2 border-x border-b border-neutral-300 p-3">
                  {#each $form_data.earnings as earnings, index}
                    <div class="flex flex-row space-x-2  items-center">
                      <div class="flex-1"> <!-- Added flex-1 for better width control -->
                        <input bind:value={earnings.name} class="input_for_earnings_and_deductions min-w-2"/>
                      </div>
                      <div class="flex flex-row justify-center items-center space-x-2">
                        <input bind:value={earnings.value} class="input_for_earnings_and_deductions"/>
                        <button on:click={()=>removeEarnings(index)} type="button" class="cursor-pointer primary_btn_delete flex justify-center items-center">
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  {/each}
                    <div class="col-span-2">
                        <AddMore passFunction={addMoreForEarnings}/>
                    </div>
                </div>
            </div>

            <!-- Deductions -->
            <div class="flex flex-col w-1/2">
                <div class="border border-neutral-300 flex flex-row justify-between p-3">
                  <span>Deductions</span>
                  <span>Amount</span>
                </div>
                <div class=" flex flex-col space-y-2 border-x border-b border-neutral-300 p-3">
                  {#each $form_data.deductions as deductions, index}
                    <div class="flex flex-row space-x-2  items-center">
                      <div class="flex-1"> <!-- Added flex-1 for better width control -->
                        <input bind:value={deductions.name} class="input_for_earnings_and_deductions min-w-2"/>
                      </div>
                      <div class="flex flex-row justify-center items-center space-x-2">
                        <input bind:value={deductions.value} class="input_for_earnings_and_deductions"/>
                        <button on:click={()=>removeDeductions(index)} type="button" class="cursor-pointer primary_btn_delete flex justify-center items-center">
                            <Trash2 />
                          </button>
                      </div>
                    </div>
                  {/each}
                  <div class="col-span-2">
                    <AddMore passFunction={addMoreForDeducations}/>
                </div>
                </div>
            </div>
 
        </div>

        <div>
            
        </div>
        <div>
            
        </div>
        <div>
            
        </div>
    </form>
</div>

<style>
    .employee_label{
        min-width: 11rem;
    }
</style>