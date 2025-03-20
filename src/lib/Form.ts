import { get, writable, derived } from 'svelte/store';
import { z } from 'zod';

// Function to format the date (adjust the format as needed)
function formatDate(date: number): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
  const day = d.getDate().toString().padStart(2, '0'); // Add leading zero
  return `${year}-${month}-${day}`;
}

export const signature_img = writable('');
export const company_logo_img = writable('');

// Define the store and its default structure
export const form_data = writable<Form>({
  company_details: {
    company_logo: null,
    company_name: '',
    company_address: null,
  },
  employee_pay_summary: {
    employee_name: '',
    employee_id: ' ',
    pay_period: formatDate(Date.now()),
    paid_days: 0,
    loss_of_pay_days: 0,
    pay_date: "",
    add_more: []
  },
  earnings: [
    { name: 'Basic', value: 0 },
    { name: 'HRA', value: 0 },
    { name: 'Incentive', value: 0 }
  ],
  total_earnings: 0,
  deductions: [
    { name: 'Income Tax', value: 0 },
    { name: 'Provident Fund', value: 0 },
    { name: 'Unpaid Leaves', value: 0 }
  ],
  total_deductions: 0,
  net_payable: null,
  note: null,
  currency: '',
  signature: '',
  upload_signature: null
});

const earningOrDeductionSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  value: z.number().min(0, { message: 'Value must be at least 0' }),
});

// Zod schema for the form data
export const formDataSchema = z.object({
  company_details: z.object({
    company_logo: z.instanceof(File).nullable().optional(),
    company_name: z.string().min(1, { message: 'Company name is required' }),
    company_address: z.string().nullable(),
  }),
  employee_pay_summary: z.object({
    employee_name: z.string().min(1, { message: 'Employee name is required' }),
    employee_id: z.string().min(1, { message: 'Employee ID is required' }),
    pay_period: z.string().default(formatDate(Date.now())),
    paid_days: z.number().min(1, { message: 'Paid Days is required and must be greater than 0' }),
    loss_of_pay_days: z.number().min(0, { message: 'Loss of pay days cannot be negative' }),
    pay_date: z.string().optional(),
    add_more: z.array(z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      value: z.string().min(1, { message: 'Value is required' }),
    })).default([]),
  }),
  earnings: z.array(earningOrDeductionSchema).min(1, { message: 'At least one earning must be defined' }),
  total_earnings: z.number().min(0, { message: 'Total earnings cannot be negative' }),
  deductions: z.array(earningOrDeductionSchema).min(1, { message: 'At least one deduction must be defined' }),
  total_deductions: z.number().min(0, { message: 'Total deductions cannot be negative' }),
  net_payable: z.number().nullable().optional(),
  note: z.string().nullable().optional(),
  currency: z.string().min(1, { message: 'Currency is required' }),
  signature: z.string().min(1, { message: 'Signature is required' }),
  upload_signature: z.instanceof(File).nullable().optional(),
});

// Type derived from the form data schema
export type Form = z.infer<typeof formDataSchema>;

export const formErrors = writable({
  company_name: '',
  company_address: '',
  employee_name: '',
  employee_id: '',
  pay_period: '',
  paid_days: '',
  loss_of_pay_days: '',
  earnings: [] as { name: string; value: string }[],  // Add errors for earnings items
  deductions: [] as { name: string; value: string }[],  // Add errors for deductions items
  total_earnings: '',
  total_deductions: '',
  net_payable: '',
  note: '',
  currency: '',
  signature: '',
  upload_signature: '',
  add_more: [] as { name: string; value: string }[] // Store error messages for Add More items
});



// Function to validate form data
export async function validateForm() {
  // Perform validation using Zod
  const data = get(form_data);
  const validation = formDataSchema.safeParse(data);

  if (!validation.success) {
    console.log('Validation errors:', validation.error.format()); // Debugging step

    // Extract errors from Zod result
    const errors = validation.error.format();

    // Update the error store with error messages
    formErrors.set({
      company_name: errors.company_details?.company_name?._errors?.[0] || '',
      company_address: errors.company_details?.company_address?._errors?.[0] || '',
      employee_name: errors.employee_pay_summary?.employee_name?._errors?.[0] || '',
      employee_id: errors.employee_pay_summary?.employee_id?._errors?.[0] || '',
      pay_period: errors.employee_pay_summary?.pay_period?._errors?.[0] || '',
      paid_days: errors.employee_pay_summary?.paid_days?._errors?.[0] || '',
      loss_of_pay_days: errors.employee_pay_summary?.loss_of_pay_days?._errors?.[0] || '',
      earnings: data.earnings.map((_, index) => ({
        name: errors.earnings?.[index]?.name?._errors?.[0] || '',
        value: errors.earnings?.[index]?.value?._errors?.[0] || '',
      })),
      deductions: data.deductions.map((_, index) => ({
        name: errors.deductions?.[index]?.name?._errors?.[0] || '',
        value: errors.deductions?.[index]?.value?._errors?.[0] || '',
      })),
      total_earnings: errors.total_earnings?._errors?.[0] || '',
      total_deductions: errors.total_deductions?._errors?.[0] || '',
      net_payable: errors.net_payable?._errors?.[0] || '',
      note: errors.note?._errors?.[0] || '',
      currency: errors.currency?._errors?.[0] || '',
      signature: errors.signature?._errors?.[0] || '',
      upload_signature: errors.upload_signature?._errors?.[0] || '',
      // Adding errors for add_more
      add_more: data.employee_pay_summary.add_more.map((_, index) => ({
        name: errors.employee_pay_summary?.add_more?.[index]?.name?._errors?.[0] || '',
        value: errors.employee_pay_summary?.add_more?.[index]?.value?._errors?.[0] || '',
      })),
    });

    return false;
  }

  formErrors.set({});
  return true;
}



// Derived store to calculate total earnings
export const totalEarnings = derived(form_data, ($form_data) =>
  $form_data.earnings.reduce((sum, item) => sum + item.value, 0)
);

// Derived store to calculate total deductions
export const totalDeductions = derived(form_data, ($form_data) =>
  $form_data.deductions.reduce((sum, item) => sum + item.value, 0)
);

// Derived store to calculate net payable amount

export const netPayable = derived(
  [totalEarnings, totalDeductions],
  ([$totalEarnings, $totalDeductions]) => $totalEarnings - $totalDeductions
);
