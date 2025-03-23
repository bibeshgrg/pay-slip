import { supabase } from '$lib/supabase/supabase.client.js';
import { toast } from 'svoast';

export async function POST({ request }: { request: Request }) {
    try {
        const formData = await request.formData();
        const newId = Date.now().toString();

        // Extract files
        const companyLogoFile = formData.get("company_logo") as File;
        const signatureFile = formData.get("upload_signature") as File;


        // Extract JSON fields
        const jsonString = formData.get("json") as string;
        if (!jsonString) {
            throw new Error("Missing JSON data in form submission");
        }

        const jsonData = JSON.parse(jsonString);

        // Ensure required fields are present
        if (!jsonData.company_details?.company_name) {
            throw new Error("Company name is required");
        }

        // Upload files to Supabase Storage
        const [logoUpload, signatureUpload] = await Promise.all([
            uploadToSupabaseStorage(companyLogoFile, `logos/${newId}.png`),
            uploadToSupabaseStorage(signatureFile, `signatures/${newId}.png`)
        ]);

 
        // Insert data into payroll_records table
        const { error } = await supabase.from("payroll_records").insert([
            {
                company_logo: logoUpload,
                company_name: jsonData.company_details.company_name,
                company_address: jsonData.company_details.company_address,
                employee_name: jsonData.employee_pay_summary.employee_name,
                employee_id: jsonData.employee_pay_summary.employee_id,
                pay_period: jsonData.employee_pay_summary.pay_period,
                paid_days: jsonData.employee_pay_summary.paid_days,
                loss_of_pay_days: jsonData.employee_pay_summary.loss_of_pay_days,
                pay_date: jsonData.employee_pay_summary.pay_date,

                additional_data: jsonData.employee_pay_summary.add_more || [],

                earnings: jsonData.earnings || [],
                total_earnings: jsonData.total_earnings,
                deductions: jsonData.deductions || [],
                total_deductions: jsonData.total_deductions,
                net_payable: jsonData.net_payable,
                currency: jsonData.currency,
                note: jsonData.note,

                signature: jsonData.signature,
                upload_signature: signatureUpload,
            }
        ]);

        if (error) throw new Error(`Error inserting payroll record: ${error.message}`);

        return new Response(JSON.stringify({ success: true, message: "Form successfully submitted" }), { status: 200 });

    } catch (error: any) {
        console.error(error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}

// Helper function to upload files to Supabase Storage
async function uploadToSupabaseStorage(file, path) {
    if (!file) return null;
    const { error } = await supabase.storage
        .from("bibesh")
        .upload(path, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (error) {
        console.error(`Error uploading file: ${error.message}`);
        toast.error("Upload Failed");
        return null;
    }

    const { data: publicUrlData } = supabase.storage.from("bibesh").getPublicUrl(path);
    return publicUrlData.publicUrl || null;
}
