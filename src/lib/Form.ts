import { writable } from "svelte/store";

function formatDate(date: number): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
    const day = d.getDate().toString().padStart(2, '0'); // Add leading zero
    return `-${month}-${day}-${year}`;
  }
  
export const form_data = writable<Form>({
	company_details: {
		company_logo: new File([], ''), // Placeholder, modify as needed
		company_name: '',
		company_address: null,
		company_pincode: null
	},
	employee_pay_summary: {
        employee_name : '',
        employee_id: ' ',
        pay_period: ' ',
        paid_days: 0,
        loss_of_pay_days: 0,
        pay_date: formatDate(Date.now()),
        add_more: []
  },
  earnings: [
    {
      name: 'Basic',
      value: 0
    },
    {
      name: 'HRA',
      value: 0
    },
    {
      name: 'Incentive',
      value: 0
    }
  ],
  deductions:  [
    {
      name: 'Income Tax',
      value: 0
    },
    {
      name: 'Provident Fund',
      value: 0
    },
    {
      name: 'Unpaid Leaves',
      value: 0
    }
  ],
	net_payable: null,
	note: null,
	signature: '',
	upload_signature: new File([], '') // Placeholder, modify as needed
});
