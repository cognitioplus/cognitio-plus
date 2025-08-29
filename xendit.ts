// services/xendit.ts

interface InvoiceDetails {
    planName: string;
    price: number;
    currency: string;
    userType: string;
}

/**
 * Simulates creating a dynamic invoice with Xendit.
 * @param details The details for the invoice.
 * @returns A promise that resolves with a simulated invoice URL.
 */
export const createXenditInvoice = async (details: InvoiceDetails): Promise<{ success: boolean; invoiceUrl: string; }> => {
    console.log("🚀 Simulating Xendit invoice creation...");
    console.log("Invoice Details:", details);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const invoiceId = `inv_${Date.now()}`;
    const fakeInvoiceUrl = `https://invoice.xendit.co/od/${invoiceId}`;

    console.log(`✅ Invoice created successfully (simulated). URL: ${fakeInvoiceUrl}`);
    
    return {
        success: true,
        invoiceUrl: fakeInvoiceUrl,
    };
};
