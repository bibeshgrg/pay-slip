

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
    import Cloud from 'lucide-svelte/icons/cloud';
    import { all_forms_data } from '$lib/persistant_writable.js';
    import { supabase } from '$lib/supabase/supabase.client.js';
    import { toast, Toasts } from 'svoast';

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
        $form_data.employee_pay_summary.additional_data = $form_data.employee_pay_summary.additional_data || [];
        $form_data.employee_pay_summary.additional_data.push({
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
            type: '',
            amount: 0 // Make sure the value is a number
        });
        return $form_data;
    });
}


    function addMoreForDeducations() {
        form_data.update(($form_data) => {
            $form_data.deductions.push({
                type: '',
                amount: 0
            });
            return $form_data;
        });
    }

  // Function to remove an item from the `add_more` array
  function removeAddMore(index: number) {
    form_data.update(($form_data) => {
        // Ensure add_more is initialized as an empty array if it's undefined
        if (!$form_data.employee_pay_summary.additional_data) {
            $form_data.employee_pay_summary.additional_data = [];
        }

        // Now we can safely call splice
        $form_data.employee_pay_summary.additional_data.splice(index, 1);

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
    

    async function uploadToSupabaseStorage(file:File, path:any) {
        if (!file) return null;

        const blob = file instanceof File ? file : await fetch(file).then(res => res.blob());

        const { data, error } = await supabase.storage
            .from('payslipfiles')
            .upload(path, blob, { upsert: true });

        if (error) {
            console.error(`Error uploading file to Supabase Storage: ${error.message}`);
            return null;
        }

        return data.path; // Returns file path
    }


    function handleFileUpload(event: Event): void {
  const target = event.target as HTMLInputElement;
  const file: File | undefined = target.files?.[0];

  if (file) {
    form_data.update((data) => ({
      ...data,
      upload_signature: file, // Store the actual file object for upload
    }));

    // Optional: If you need to preview the file (base64), you can read it:
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      signature_img.set(e.target?.result as string); // Store the preview in a separate store
    };
    reader.readAsDataURL(file);
  }
}

function handleCompanyLogo(event: Event): void {
  const target = event.target as HTMLInputElement;
  const file: File | undefined = target.files?.[0];

  if (file) {
    form_data.update((data) => ({
      ...data,
      company_details: {
        ...data.company_details, // Keep existing company details
        company_logo: file, // Store the actual file object for upload
      },
    }));

    // Optional: If you need to preview the file (base64), you can read it:
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      company_logo_img.set(e.target?.result as string); // Store the preview in a separate store
    };
    reader.readAsDataURL(file);
  }
}




    function safeSerialize(data:any) {
        return JSON.parse(JSON.stringify(data));
    }

    async function submitForm() {
        if (await validateForm()) {

            // Generate a new ID and update persistent_form_data
            const newId = Date.now().toString(); // Example unique ID
            const newFormEntry = safeSerialize({ ...$form_data, id: newId });


            // Optionally push the data to all_form
            all_forms_data.update(forms => {
                // Ensure forms is an array (default to empty array if null/undefined)
                const updatedForms = Array.isArray(forms) ? [...forms, newFormEntry] : [newFormEntry];

                // Save updated forms list to localStorage manually
                localStorage.setItem('all_forms', JSON.stringify(updatedForms));

                return updatedForms;
            });
            toast.success('Forms Saved Sucessfully!');


            
        } else {
            console.log('Form has errors, check UI');
        }
    }


    async function submitFormOnDatabase() {
    if (await validateForm()) {
        console.log('Form is valid, proceed with submission');

        const formData = new FormData();
        const data = $form_data;

        // Append the entire JSON data as a single field
        formData.append("json", JSON.stringify(data));

            // Append files
        if (data.company_details.company_logo) {
            formData.append("company_logo", data.company_details.company_logo);
        }
        if (data.upload_signature) {
            formData.append("upload_signature", data.upload_signature);
        }

        // Send form data to backend API
        try {
            const response = await fetch('/api/submit-form', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log('Form successfully submitted:', result);
                toast.success("Form Saved Successfully!");
            } else {
                console.error('Error submitting form:', result.error || 'Unknown error');
                toast.error("Error saving form!");
            }
        } catch (error) {
            console.error('Network error:', error);
            toast.error("Network error. Please try again.");
        }
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



    $:$all_forms_data;
    </script>


    <svelte:head>
        <title>Pay Slip</title>
    </svelte:head>


    <div class="flex flex-col justify-center items-center w-full min-h-screen py-8 px-4 sm:px-6 lg:px-40">
        <form class="flex flex-col rounded-lg w-full  px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-12 bg-white text-black shadow-2xl space-y-6 sm:space-y-8">

            <!-- Logo and Date -->
            <div class="flex flex-col sm:flex-row md:justify-between md:items-center space-y-4 sm:space-y-0">
                <!-- Logo Upload -->
                <div class="flex flex-row md:justify-center items-center space-x-2">
                    <label for="signature-upload-company-logo" class="upload-button">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 19V5m-7 7 7-7 7 7"></path>
                        </svg>
                        <span>Upload Company Logo</span>
                    </label>
                    <input type="file" id="signature-upload-company-logo" accept="image/*" class="hidden" on:change="{handleCompanyLogo}" />
                    <span id="error_message"></span>
                    {#if $company_logo_img}
                        <Dialog image={$company_logo_img} />
                    {/if}
                </div>
            
                <!-- Date -->
                <div class="flex flex-col">
                    <label class="div_title" for="todayDate">Pay Slip For The Month</label>
                    <span id="todayDate">{$formattedDate}</span>
                </div>
            </div>

            <!-- Company Details -->
            <div class="flex flex-col sm:flex-row justify-between space-y-5 sm:space-y-0">
                <!-- Company Name and Address -->
                <div class="flex flex-col space-y-5">
                    <div class="flex flex-col relative">
                        <label class="flex space-x-2" placeholder="Enter Company Name" for="company_name">
                            <span>Company Name</span>
                            <span>:</span>
                            <span class="text-[var(--color-delete)]">*</span>
                        </label>
                        <input class="input_primary" bind:value={$form_data.company_details.company_name} type="text" id="company_name" />
                        {#if $formErrors.company_name}
                            <span id="error_message_employee" class="error-message">{$formErrors.company_name}</span>
                        {/if}
                    </div>
                    <div class="flex flex-col relative">
                        <label placeholder="Enter Company Address" for="company_address">Company Address:</label>
                        <input class="input_primary" bind:value={$form_data.company_details.company_address} type="text" id="company_address" />
                        {#if $formErrors.company_address}
                            <span id="error_message_employee" class="error-message">{$formErrors.company_address}</span>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Employee Pay Summary -->
            <div class="flex flex-col space-y-3">
                <div class="div_title">Employee Pay Summary</div>
                <div class="flex flex-col 2xl:grid 3xl:grid-cols-2 3xl:grid-rows-3 gap-5">
                    
                    <!-- Employee Name -->
                    <div class="flex flex-col relative">
                        <label class="employee_label flex space-x-2" for="employee_name">
                            <span>Employee Name</span>
                            <span>:</span>
                            <span class="text-[var(--color-delete)]">*</span>
                        </label>
                        <input bind:value={$form_data.employee_pay_summary.employee_name} class="input_primary" id="employee_name"/>
                        {#if $formErrors.employee_name}
                            <span id="error_message_employee">{$formErrors.employee_name}</span>
                        {/if}
                    </div>
            
                    <!-- Employee ID -->
                    <div class="flex flex-col relative">
                        <label class="employee_label flex space-x-2" for="employee_id">
                            <span>Employee ID</span>
                            <span>:</span>
                            <span class="text-[var(--color-delete)]">*</span>
                        </label>
                        <input bind:value={$form_data.employee_pay_summary.employee_id} class="input_primary" id="employee_id"/>
                        {#if $formErrors.employee_id}
                            <span id="error_message_employee">{$formErrors.employee_id}</span>
                        {/if}
                    </div>
            
                    <!-- Pay Period -->
                    <div class="flex flex-col relative">
                        <label class="employee_label flex space-x-2" for="pay_period">
                            <span>Pay Period</span>
                            <span>:</span>
                        </label>
                        <input bind:value={$form_data.employee_pay_summary.pay_period} type="date" class="input_half" id="pay_period"/>
                        {#if $formErrors.pay_period}
                            <span id="error_message_employee">{$formErrors.pay_period}</span>
                        {/if}
                    </div>
            
                    <!-- Paid Days -->
                    <div class="flex flex-col relative">
                        <label class="employee_label flex space-x-2" for="paid_days">
                            <span>Paid Days</span>
                            <span>:</span>
                            <span class="text-[var(--color-delete)]">*</span>
                        </label>
                        <input type="number" bind:value={$form_data.employee_pay_summary.paid_days} class="input_half" id="paid_days"/>
                        {#if $formErrors.paid_days}
                            <span id="error_message_employee">{$formErrors.paid_days}</span>
                        {/if}
                    </div>
            
                    <!-- Loss of Pay Days -->
                    <div class="flex flex-col relative">
                        <label class="employee_label flex space-x-2" for="loss_of_pay_days">
                            <span>Loss of Pay Days</span>
                            <span>:</span>
                        </label>
                        <input type="number" bind:value={$form_data.employee_pay_summary.loss_of_pay_days} class="input_half" id="loss_of_pay_days"/>
                        {#if $formErrors.loss_of_pay_days}
                            <span id="error_message_employee">{$formErrors.loss_of_pay_days}</span>
                        {/if}
                    </div>
            
                    <!-- Pay Date -->
                    <div class="flex flex-col relative">
                        <label class="employee_label flex space-x-2" for="pay_date">
                            <span>Pay Date</span>
                            <span>:</span>
                        </label>
                        <input type="date" bind:value={$form_data.employee_pay_summary.pay_date} class="input_half" id="pay_date"/>
                        {#if $formErrors.pay_date}
                            <span id="error_message_employee">{$formErrors.pay_date}</span>
                        {/if}
                    </div>
            
                    <!-- Add More Fields -->
                    {#each $form_data.employee_pay_summary.additional_data || [] as addMore, addIndex}
                    <div class="flex flex-col relative">
                        <div class="flex flex-row space-x-2">
                            <input
                                bind:value={$form_data.employee_pay_summary.additional_data[addIndex].name}
                                placeholder="Name"
                                class="input_half"
                            />
                            <input
                                bind:value={$form_data.employee_pay_summary.additional_data[addIndex].value}
                                placeholder="Value"
                                class="input_half"
                            />
                            <button
                                type="button"
                                class="cursor-pointer primary_btn_delete flex justify-center items-center"
                                on:click={() => removeAddMore(addIndex)}
                            >
                                <Trash_2 />
                            </button>
                        </div>
                        {#if $formErrors.additional_data?.[addIndex]?.name}
                            <span id="error_message_employee">{$formErrors.additional_data[addIndex].name}</span>
                        {/if}
                        {#if $formErrors.additional_data?.[addIndex]?.value}
                            <span id="error_message_employee">{$formErrors.additional_data[addIndex].value}</span>
                        {/if}
                    </div>
                    {/each}
            
                    <div class="col-span-2">
                        <AddMore passFunction={addMoreForEmployeePaySummary}/>
                    </div>
                </div>
            </div>
            
            
            
            <!-- Earnings And Deductions -->
            <div class="flex xl:flex-row flex-col justify-between items-start w-full space-y-2  xl:space-x-4">

                <!-- Earnings -->
                <div class="flex flex-col w-full xl:w-1/2 min-h-[300px]">
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
                                        bind:value={earnings.type} 
                                        class="input_for_earnings_and_deductions min-w-2"
                                    />
                                    {#if $formErrors.earnings?.[index]?.type}
                                    <span id="error_message_employee">{$formErrors.earnings?.[index]?.type}</span>
                                {/if}
                                </div>
                                <div class="flex flex-row justify-center items-center space-x-2 relative">
                                    <input 
                                        placeholder="value" 
                                        type="number" 
                                        bind:value={earnings.amount} 
                                        class="input_for_earnings_and_deductions"
                                    />
                                    {#if $formErrors.earnings?.[index]?.amount}
                                    <span id="error_message_employee">{$formErrors.earnings?.[index]?.amount}</span>
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
                <div class="flex flex-col w-full xl:w-1/2 min-h-[300px]"> 
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
                                        bind:value={deductions.type} 
                                        class="input_for_earnings_and_deductions min-w-2"
                                    />
                                    {#if $formErrors.deductions?.[index]?.type}
                                        <span class="error_message_employee">{$formErrors.deductions?.[index]?.type}</span>
                                    {/if}
                                </div>
                                <div class="flex flex-row justify-center items-center space-x-2">
                                    <input 
                                        placeholder="value" 
                                        type="number" 
                                        bind:value={deductions.amount} 
                                        class="input_for_earnings_and_deductions"
                                    />
                                    {#if $formErrors.deductions?.[index]?.amount}
                                        <span class="error_message_employee">{$formErrors.deductions?.[index]?.amount}</span>
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
                    Notes
                </div>
                <textarea bind:value={$form_data.note} class="textarea_primary resize-none" placeholder="Enter your notes ...">
                    
                </textarea>
            </div>

            <!-- Signature -->
            <div class="flex flex-col space-y-3">
                <label class="div_title" placeholder="Enter Company Name" for="signature">Signature</label>
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
                <button on:click={()=>{window.location.reload()}} class="primary_btn justify-center items-center space-x-2" type="button">
                    <RotateCcw/> <span>Reset</span>
                </button>
                <button class="primary_btn justify-center items-center space-x-2" type="button">
                <Share_2/> <span>Share</span>
                </button>
                <button on:click={submitForm} class="primary_btn justify-center items-center space-x-2" type="button">
                    <Save/> <span>Local</span>
                </button>
                <button on:click={submitFormOnDatabase} class="primary_btn justify-center items-center space-x-2" type="button">
                    <Cloud/> <span>Cloud</span>
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
    background-color: var(--hover--color-primary);
  }
  .icon {
    width: 20px;
    height: 20px;
  }

</style>