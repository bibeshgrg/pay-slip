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
			company_pincode: string | null;
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
			deductions: Add_More[];
			net_payable: number | null;
			note: string | null;
			signature:string;
			upload_signature: File;
		}
	}
}

export {};
