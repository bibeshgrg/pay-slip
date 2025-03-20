// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface Company_Detail{
			company_logo:File;
			company_name:string;
			company_address: string | null;
		}

		interface Add_More{
			name:string;
			value:string;
		}

		interface Employee_Pay_Summary{
			employee_name:string;
			employee_id:string;
			pay_period:Date | null;
			paid_days:number;
			loss_of_pay_days:number | null;
			pay_date:Date | null; 
			add_more:Add_More[];
		}

		interface Form{
			company_details: Company_Detail;
			employee_pay_summary:Employee_Pay_Summary;
			earnings: Add_More[];
			total_earnings: number | null;
			deductions: Add_More[];
			total_deductions: number | null;
			net_payable: number | null;
			currency: string | null
			note: string | null;
			signature:string;
			upload_signature: File;
		}
	}
	declare module 'number-to-words' {
		export function toWords(num: number): string;
	}
	
}

export {};

