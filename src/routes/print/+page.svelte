

<script lang="ts">
    import { company_logo_img, form_data, signature_img } from '$lib/Form.js';
    import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';

</script>


<svelte:head>
    <title>Pay Slip</title>
</svelte:head>


<div class="flex flex-col  justify-center items-center w-full h-full py-32 ">
    <form class="flex flex-col rounded-lg 2xl:w-[70rem] 2xl:px-10  2xl:py-8 bg-white  text-black shadow-2xl space-y-9">

        <!--Date -->
        <div class="flex flex-row justify-end items-center">
     
            <div class="flex flex-col justify-end">
                <label class="div_title" for="todayDate">Pay Slip For The Month</label>
                <span id="todayDate">{$form_data.employee_pay_summary.pay_period}</span>
            </div>
        </div>

        <!-- Logo -->
        <div class="flex flex-row justify-center items-center">
            <img src="{$company_logo_img}" alt="Signature Preview" class="rounded-lg" />
        </div>

        <!-- Company Details -->
        <div class="flex flex-row justify-between">
            <div class="flex flex-col space-y-5">
                <div class="flex flex-col">
                    <label placeholder="Enter Company Name" for="company_name">{$form_data.company_details.company_name}</label>
                </div>
                <div class="flex flex-col">
                    <label placeholder="Enter Company Address" for="company_address">{$form_data.company_details.company_address}</label>
                </div>

            </div>
    
        </div>

        <!-- Employee Pay Summary -->
        <div class="flex flex-col space-y-3">
            <div class="div_title">
                Employee Pay Summary
            </div>
            <div class="grid grid-cols-2 grid-rows-3 gap-5">
                <!-- Employee Name -->
                 <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="employee_name">Employee Name *</label>
                            <EllipsisVertical />
                        </div>
                        <div class="flex flex-col">
                            <span>{$form_data.employee_pay_summary.employee_name}</span>
                        </div>
                    </div>
                 </div>

                <!-- Employee ID -->
                <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="employee_id">Employee Id *</label>
                            <EllipsisVertical />
                        </div>
                        <div class="flex flex-col">
                            <span>{$form_data.employee_pay_summary.employee_id}</span>
                        </div>
                    </div>
                </div>
            
                <!-- Pay Period -->
                <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="pay_period">Pay Period</label>
                            <EllipsisVertical />
                        </div>
                        <div class="flex flex-col">
                            <span>{$form_data.employee_pay_summary.pay_period}</span>
                        </div>
                    </div>
                </div>


                <!-- Paid Days -->
                <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="paid_days">Paid Days</label>
                            <EllipsisVertical />
                        </div>
                        <div class="flex flex-col">
                            <span>{$form_data.employee_pay_summary.paid_days}</span>
                        </div>
                    </div>
                </div>

                <!-- Loss of Pay Days -->
                <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="loss_of_pay_days">Loss of pay days</label>
                            <EllipsisVertical />
                        </div>
                        <div class="flex flex-col">
                            <span>{$form_data.employee_pay_summary.loss_of_pay_days}</span>
                        </div>
                    </div>
                </div>
         
                <!-- Pay Date -->
                <div class="flex flex-col relative">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row">
                            <label class="employee_label" for="pay_date">Pay Date</label>
                            <EllipsisVertical />
                        </div>
                        <div class="flex flex-col">
                            <span>{$form_data.employee_pay_summary.pay_date}</span>
                        </div>
                    </div>
                </div>

                <!-- Add More -->
                {#each $form_data.employee_pay_summary.additional_data || [] as addMore, addIndex (addIndex)}
                <div class="flex flex-col">
                  <div class="flex flex-row justify-between space-x-1">
                    <div class="flex flex-col relative">
                      <input bind:value={$form_data.employee_pay_summary.additional_data[addIndex].name} placeholder="Name" class="input_half" />
                      <span id="error_message_employee" class=""></span>
                    </div>
                    <div class="flex flex-col relative">
                      <input bind:value={$form_data.employee_pay_summary.additional_data[addIndex].value} placeholder="Value" class="input_half" />
                      <span id="error_message_employee" class=""></span>
                    </div>
                  </div>
        
                </div>
              {/each}
              
        

            </div>
        </div>
        
        
        <!-- Earnings And Deductions -->
        <div class="flex flex-row justify-between items-start w-full space-x-4">

            <!-- Earnings -->
            <div class="flex flex-col w-1/2">
                <div class="border border-neutral-300 flex flex-row justify-between p-3">
                    <span>Earnings</span>
                    <span>Amount</span>
                </div>
                <div class="flex flex-col space-y-2 border-x border-b border-neutral-300 p-3">
                    <table class="w-full border-collapse border border-gray-300">
                        <tbody>
                            {#each $form_data.earnings as earnings, index}
                                <tr class="">
                                    <td class="">
                                        <span>{earnings.type}</span>
                                    </td>
                                    <td class="">
                                        <span class="text-right">{earnings.amount}</span>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                    
                    <div class="highlight py-2.5 px-3 flex flex-row justify-between items-center">
                        <div class="font-bold">Gross Earnings</div>
                        <div>{$form_data.total_earnings}</div>
                    </div>
                 
                </div>
            </div>

            <!-- Deductions -->
            <div class="flex flex-col w-1/2"> 
                <div class="border border-neutral-300 flex flex-row justify-between p-3">
                    <span>Deductions</span>
                    <span>Amount</span>
                </div>
                <div class="flex flex-col space-y-2 border-x border-b border-neutral-300 p-3">
                    <table class="w-full border-collapse border border-gray-300">
                        <tbody>
                            {#each $form_data.deductions as deductions, index}
                                <tr class="">
                                    <td class="">
                                        <span>{deductions.type}</span>
                                    </td>
                                    <td class="">
                                        <span class="text-right">{deductions.amount}</span>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                    <div class="highlight py-2.5 px-3 flex flex-row justify-between items-center">
                        <div class="font-bold">Total Deductions</div>
                        <div>{$form_data.total_deductions}</div>
                    </div>
                
                </div>
            </div>

        </div>

        <!-- Net Payable And Currency -->
        <div class="flex flex-col space-y-3">

            <!-- Net Payable -->
            <div class="flex flex-col justify-start items-start">
                <div class="flex flex-row justify-center items-center space-x-2">
                    <span class="div_title_2s">Net Payable :</span>
                    <span>{$form_data.total_earnings - $form_data.total_deductions}</span>
                </div>
                <div class="flex flex-row justify-center items-center space-x-2">
                    <span class="div_title_2">Amount In Words :</span>
                    <span>EK Lakh</span>
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
        <div class="flex flex-col space-y-3 w-1/7">
            <label class="div_title" placeholder="Enter Company Name" for="signature">Signature:</label>
            <div class="flex flex-row justify-center items-center">
                <img src="{$signature_img}" alt="Signature Preview" class="rounded-lg" />
            </div>
            <div class="border-dashed border-t">
                <span>{$form_data.signature}</span>
            </div>
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

    .div_title_2{
        font-size: 18px;
        font-weight: 600;
    }

    #error_message_employee{
        position: absolute;
        right: calc(var(--spacing) * 2);
        bottom: calc(var(--spacing) * -5) /* -1.25rem = -20px */;
        --color-delete: #e53e3e;
    }

    table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #d1d5db; /* Gray border */
    font-size: 16px;
}

td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb; /* Light gray border between rows */
}


tr:nth-child(even) {
    background-color: #f9fafb; /* Alternating row color */
}



td span {
    display: block;
    padding: 5px;
    border-radius: 4px;
}


</style>