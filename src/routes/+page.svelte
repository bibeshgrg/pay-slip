

<script lang="ts">
    import { company_logo_img, form_data, formErrors, netPayable, signature_img, totalDeductions, totalEarnings, validateForm } from '$lib/Form.js';
    import { writable } from 'svelte/store';
    import AddMore from '../components/AddMore.svelte';
    import Printer from 'lucide-svelte/icons/printer';
    import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
    import Share_2 from 'lucide-svelte/icons/share-2';
    import Save from 'lucide-svelte/icons/save';
    import Trash_2 from 'lucide-svelte/icons/trash-2';
    import Dialog from '../components/Dialog.svelte';
    import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
    import numWords from "num-words"

    let formattedDate = writable('');

    $: {
    const PaySlipForTheMonth = new Date($form_data.employee_pay_summary.pay_period);

    function getDayWithSuffix(day: number) {
      if (day > 3 && day < 21) {
        return day + 'th';
      }
      switch (day % 10) {
        case 1: return day + 'st';
        case 2: return day + 'nd';
        case 3: return day + 'rd';
        default: return day + 'th';
      }
    }

    const day = PaySlipForTheMonth.getDate();
    const month = PaySlipForTheMonth.toLocaleString('en-US', { month: 'long' });
    const year = PaySlipForTheMonth.getFullYear();

    // Set the formatted date to the writable store
    formattedDate.set(`${month} ${getDayWithSuffix(day)}, ${year}`);
  }

    // Function to add more fields to employee pay summary
    function addMoreForEmployeePaySummary() {
    form_data.update(($form_data) => {
        // Ensure the `add_more` field exists and push an object with `name` and `value` properties
        $form_data.employee_pay_summary.add_more = $form_data.employee_pay_summary.add_more || [];
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
        // Push a new object with `name` and `value` where `value` is a number
        $form_data.earnings.push({
            name: '',
            value: 0 // Make sure the value is a number
        });
        return $form_data;
    });
}


    function addMoreForDeducations() {
        form_data.update(($form_data) => {
            $form_data.deductions.push({
                name: '',
                value: 0
            });
            return $form_data;
        });
    }

  // Function to remove an item from the `add_more` array
  function removeAddMore(index: number) {
    form_data.update(($form_data) => {
        // Ensure add_more is initialized as an empty array if it's undefined
        if (!$form_data.employee_pay_summary.add_more) {
            $form_data.employee_pay_summary.add_more = [];
        }

        // Now we can safely call splice
        $form_data.employee_pay_summary.add_more.splice(index, 1);

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
    
  function handleFileUpload(event: Event): void {
  const target = event.target as HTMLInputElement;
  const file: File | undefined = target.files?.[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      form_data.update((data) => ({
        ...data,
        upload_signature: file, // Store the actual file
      }));
      signature_img.set( e.target?.result as string)
    };

    reader.readAsDataURL(file);
  }
}

function handleCompanyLogo(event: Event): void {
  const target = event.target as HTMLInputElement;
  const file: File | undefined = target.files?.[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      form_data.update((data) => ({
        ...data,
        company_details: {
          ...data.company_details, // Spread existing company_details
          company_logo: file, // Store actual file
        }
      }));
      
      // Store Base64 preview
      company_logo_img.set(e.target?.result as string);
    };

    reader.readAsDataURL(file);
  }
}

    async function submitForm() {
    if (await validateForm()) {
        console.log('Form is valid, proceed with submission');
        // Submit form logic
    } else {
        console.log('Form has errors, check UI');
    }
    }

    $:{
        totalDeductions;
        totalEarnings;
        netPayable;
    }


    function capitalizeWords(str: string): string {
        return str
            .split(' ') // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(' '); // Join the words back into a string
    }
</script>


<svelte:head>
    <title>Pay Slip</title>
</svelte:head>


<div class="flex flex-col  justify-center items-center w-full h-full py-32 ">
    <form class="flex flex-col rounded-lg 2xl:w-[70rem] 2xl:px-10  2xl:py-8 bg-white  text-black shadow-2xl space-y-9">

        <!-- Logo and Date -->
        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-row justify-center items-center space-x-2">
                <label for="signature-upload-company-logo" class="upload-button">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 19V5m-7 7 7-7 7 7"></path>
                    </svg>
                    <span>Upload Company Logo</span>
                  </label>
                  <input type="file" id="signature-upload-company-logo" accept="image/*" class="hidden" on:change="{handleCompanyLogo}" />
                <span id="error_message"></span>
                {#if $company_logo_img}
                <Dialog image={$company_logo_img}/>    
                {/if}
            </div>
            <div class="flex flex-col">
                <label class="div_title" for="todayDate">Pay Slip For The Month</label>
                <span id="todayDate">{$formattedDate}</span>
               
            </div>
        </div>

        <!-- Company Details -->
        <div class="flex flex-row justify-between">
            <div class="flex flex-col space-y-5">
                <div class="flex flex-col relative">
                    <label class="flex space-x-2" placeholder="Enter Company Name" for="company_name">
                        <span>Company Name</span> 
                        <span>:</span>
                        <span class="text-[var(--color-delete)]">*</span>

                    </label>
                    <input class="input_primary" bind:value={$form_data.company_details.company_name} type="text" id="company_name"/>
                    {#if $formErrors.company_name}
                        <span id="error_message_employee" class="error-message">{$formErrors.company_name}</span>
                    {/if}
                </div>
                <div class="flex flex-col relative">
                    <label placeholder="Enter Company Address" for="company_address">Company Address:</label>
                    <input class="input_primary" bind:value={$form_data.company_details.company_address} type="text" id="company_address"/>
                    {#if $formErrors.company_address}
                        <span id="error_message_employee"  class="error-message">{$formErrors.company_address}</span>
                    {/if}
                </div>

            </div>
    
        </div>

        <!-- Employee Pay Summary -->
        <div class="flex flex-col space-y-3">
            <div class="div_title">
                Employee Pay Summary
            </div>
            <div class="grid grid-cols-2 grid-rows-3 gap-7">
                <!-- Employee Name -->
                 <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="employee_name">Employee Name 
                                <span class="text-[var(--color-delete)]">*</span>

                            </label>
                            <EllipsisVertical />
                        </div>
                        <div class="flex flex-col">
                            <input bind:value={$form_data.employee_pay_summary.employee_name} class="input_half" id="employee_name"/>
                        </div>
                    </div>
                    {#if $formErrors.employee_name}
                        <span id="error_message_employee"  class="error-message">{$formErrors.employee_name}</span>
                    {/if}
                 </div>

                <!-- Employee ID -->
                <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="employee_id">Employee Id 
                                <span class="text-[var(--color-delete)]">*</span>
                            </label>
                            <EllipsisVertical />
                        </div>
                        <div>
                            <input bind:value={$form_data.employee_pay_summary.employee_id} class="input_half" id="employee_id"/>
                        </div>
                    </div>
                    {#if $formErrors.employee_id}
                    <span id="error_message_employee"  class="error-message">{$formErrors.employee_id}</span>
                    {/if}
                </div>
            
                <!-- Pay Period -->
                <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="pay_period">Pay Period</label>
                            <EllipsisVertical />
                        </div>
                        <div>
                            <input bind:value={$form_data.employee_pay_summary.pay_period} type="date" class="input_half" id="pay_period"/>
                        </div>
                    </div>
                    {#if $formErrors.pay_period}
                        <span id="error_message_employee"  class="error-message">{$formErrors.pay_period}</span>
                    {/if}
                </div>


                <!-- Paid Days -->
                <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="paid_days">Paid Days
                                <span class="text-[var(--color-delete)]">*</span>
                            </label>
                            <EllipsisVertical />
                        </div>
                        <div>
                            <input type="number" bind:value={$form_data.employee_pay_summary.paid_days} class="input_half" id="paid_days"/>
                        </div>
                    </div>
                    {#if $formErrors.paid_days}
                        <span id="error_message_employee"  class="error-message">{$formErrors.paid_days}</span>
                    {/if}
                </div>

                <!-- Loss of Pay Days -->
                <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="loss_of_pay_days">Loss of pay days</label>
                            <EllipsisVertical />
                        </div>
                        <div>
                            <input type="number" bind:value={$form_data.employee_pay_summary.loss_of_pay_days} class="input_half" id="loss_of_pay_days"/>
                        </div>
                    </div>
                    {#if $formErrors.loss_of_pay_days}
                        <span id="error_message_employee"  class="error-message">{$formErrors.loss_of_pay_days}</span>
                    {/if}
                </div>
         
                <!-- Pay Date -->
                <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="pay_date">Pay Date</label>
                            <EllipsisVertical />
                        </div>
                        <div>
                            <input type="date" bind:value={$form_data.employee_pay_summary.pay_date} class="input_half" id="pay_date"/>
                        </div>
                    </div>
                    <span id="error_message_employee" class=""></span>
                </div>

         <!-- Add More -->
            {#each $form_data.employee_pay_summary.add_more || [] as addMore, addIndex (addIndex)}
            <div class="flex flex-col">
            <div class="flex flex-row justify-between space-x-1">
                <div class="flex flex-col relative">
                <input
                    bind:value={$form_data.employee_pay_summary.add_more[addIndex].name}
                    placeholder="Name"
                    class="input_half"
                />
                {#if $formErrors.add_more?.[addIndex]?.name}
                    <span id="error_message_employee" class="error-message">{$formErrors.add_more[addIndex].name}</span>
                {/if}
                </div>
                <div class="flex flex-col relative">
                <input
                    bind:value={$form_data.employee_pay_summary.add_more[addIndex].value}
                    placeholder="Value"
                    class="input_half"
                />
                {#if $formErrors.add_more?.[addIndex]?.value}
                    <span id="error_message_employee" class="error-message">{$formErrors.add_more[addIndex].value}</span>
                {/if}
                </div>
            </div>
            <div class="flex justify-end items-center mt-3">
                <button
                type="button"
                class="cursor-pointer primary_btn_delete mt-2 flex justify-center items-center"
                on:click={() => removeAddMore(addIndex)}
                >
                <Trash_2 />
                </button>
            </div>
            </div>
            {/each}

              
            
            <div class="col-span-2">
                <AddMore passFunction={addMoreForEmployeePaySummary}/>
            </div>

            </div>
        </div>
        
        
   <!-- Earnings And Deductions -->
<div class="flex flex-row justify-between items-start w-full space-x-4">

    <!-- Earnings -->
    <div class="flex flex-col w-1/2 min-h-[300px]">
        <div class="border border-neutral-300 flex flex-row justify-between p-3">
            <span>Earnings</span>
            <span>Amount</span>
        </div>
        <div class="flex flex-col space-y-4 border-x border-b border-neutral-300 p-3">
            {#each $form_data.earnings as earnings, index}
                <div class="flex flex-row space-x-2 items-center">
                    <div class="flex-1 relative">
                        <input 
                            placeholder="name" 
                            bind:value={earnings.name} 
                            class="input_for_earnings_and_deductions min-w-2"
                        />
                        {#if $formErrors.earnings[index]?.name}
                            <span id="error_message_employee">{$formErrors.earnings[index].name}</span>
                        {/if}
                    </div>
                    <div class="flex flex-row justify-center items-center space-x-2 relative">
                        <input 
                            placeholder="value" 
                            type="number" 
                            bind:value={earnings.value} 
                            class="input_for_earnings_and_deductions"
                        />
                        {#if $formErrors.earnings[index]?.value}
                            <span id="error_message_employee">{$formErrors.earnings[index].value}</span>
                        {/if}
                        <button on:click={() => removeEarnings(index)} type="button" class="cursor-pointer primary_btn_delete flex justify-center items-center">
                            <Trash_2 />
                        </button>
                    </div>
                </div>
            {/each}
            <div class="highlight py-2.5 px-3 flex flex-row justify-between items-center mt-3">
                <div class="font-bold">Gross Earnings</div>
                <div>{$totalEarnings}</div>
            </div>
            <div class="col-span-2">
                <AddMore passFunction={addMoreForEarnings}/>
            </div>
        </div>
    </div>

    <!-- Deductions -->
    <div class="flex flex-col w-1/2 min-h-[300px]"> 
        <div class="border border-neutral-300 flex flex-row justify-between p-3">
            <span>Deductions</span>
            <span>Amount</span>
        </div>
        <div class="flex flex-col space-y-4 border-x border-b border-neutral-300 p-3">
            {#each $form_data.deductions as deductions, index}
                <div class="flex flex-row space-x-2 items-center">
                    <div class="flex-1">
                        <input 
                            placeholder="name" 
                            bind:value={deductions.name} 
                            class="input_for_earnings_and_deductions min-w-2"
                        />
                        {#if $formErrors.deductions[index]?.name}
                            <span class="error_message_employee">{$formErrors.deductions[index].name}</span>
                        {/if}
                    </div>
                    <div class="flex flex-row justify-center items-center space-x-2">
                        <input 
                            placeholder="value" 
                            type="number" 
                            bind:value={deductions.value} 
                            class="input_for_earnings_and_deductions"
                        />
                        {#if $formErrors.deductions[index]?.value}
                            <span class="error_message_employee">{$formErrors.deductions[index].value}</span>
                        {/if}
                        <button on:click={() => removeDeductions(index)} type="button" class="cursor-pointer primary_btn_delete flex justify-center items-center">
                            <Trash_2 />
                        </button>
                    </div>
                </div>
            {/each}
            <div class="highlight py-2.5 px-3 flex flex-row justify-between items-center mt-3">
                <div class="font-bold">Total Deductions</div>
                <div>{$totalDeductions}</div>
            </div>
            <div class="col-span-2">
                <AddMore passFunction={addMoreForDeducations}/>
            </div>
        </div>
    </div>

</div>


        <!-- Net Payable And Currency -->
        <div class="flex flex-col space-y-3">

            <!-- Net Payable -->
            <div class="flex flex-row justify-between">
                <div class="div_title">
                    Net Payable :
                </div>
                <div class="font-extrabold">
                    {$netPayable}
                </div>
            </div>


            <div class="flex flex-row justify-between w-full">
                <div class="w-1/2">
                    Gross Earnings - Total Deductions
                </div>
                <div class="flex flex-col flex-wrap">
                    <div class="flex flex-col">
                        <span class="font-semibold">Amount in Words : </span>
                    </div>
                </div>
            </div>
            


            <div class="flex flex-row justify-between space-x-2 items-center w-1/2">
                <div class="flex flex-row ">
                    <label class="employee_label" for="currency">Currency</label>
                    <EllipsisVertical />
                </div>
                <div>
                    <input placeholder="Enter Salary/hour" bind:value={$form_data.currency} type="text" class="input_half" id="currency"/>
                </div>
            </div>
        </div>

        <!-- Note -->
        <div class="flex flex-col space-y-3">
            <div class="div_title">
                Notes :
            </div>
            <textarea bind:value={$form_data.note} class="textarea_primary resize-none" placeholder="Enter your notes ...">
                
            </textarea>
        </div>

        <!-- Signature -->
        <div class="flex flex-col space-y-3">
            <label class="div_title" placeholder="Enter Company Name" for="signature">Signature:</label>
            <input class="input_primary w-1/2 placeholder:py-2" placeholder="e.g Bibesh Gurung" bind:value={$form_data.signature} type="text" id="signature"/>
            <span id="error_message"></span>
                   <div class="flex flex-row justify-between">
            <!-- Upload Button -->
            <label for="signature-upload" class="upload-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19V5m-7 7 7-7 7 7"></path>
              </svg>
              <span>Upload Signature</span>
            </label>
            
            <input type="file" id="signature-upload" accept="image/*" class="hidden" on:change="{handleFileUpload}" />
          
            <!-- Signature Preview -->
            {#if $signature_img}
            <Dialog image={$signature_img}/>    
            {/if}
        </div>
        </div>


        <!-- Buttons For Print Reset Share Save -->
        <div class="flex flex-row justify-center items-center space-x-3">
            <button class="primary_btn justify-center items-center space-x-2" type="button">
                <Printer /> <span>Print</span>
            </button>
            <button class="primary_btn justify-center items-center space-x-2" type="button">
                <RotateCcw/> <span>Reset</span>
            </button>
            <button class="primary_btn justify-center items-center space-x-2" type="button">
               <Share_2/> <span>Share</span>
            </button>
            <button on:click={submitForm} class="primary_btn justify-center items-center space-x-2" type="button">
                <Save/> <span>Save</span>
            </button>
        </div>



 
        
    </form>
</div>

<style>
    .employee_label{
        min-width: 11rem;
    }

    .div_title{
        font-size: 23px;
        font-weight: 700;
    }

    #error_message_employee{
        position: absolute;
        right: calc(var(--spacing) * 2);
        bottom: calc(var(--spacing) * -5) /* -1.25rem = -20px */;
        color: var(--color-delete);
        font-size: 0.7rem;
    }

    .upload-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: var(--color-primary);
    color: white;
    padding: 8px 15px;
    font-weight: bold;
    height: 3.5rem;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  .upload-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  .icon {
    width: 20px;
    height: 20px;
  }

</style>