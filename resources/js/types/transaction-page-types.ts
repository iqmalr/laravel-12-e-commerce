export interface Customer {
    id: string;
    name: string;
}

export interface Product {
    product_name?: string;
    quantity: number;
    subtotal: number;
    tax_amount: number;
}

export interface TransactionSummaryProps {
    selectedCustomer: Customer | null;
    selectedProducts: Product[];
    subtotal: number;
    totalTax: number;
    total: number;
    formatCurrency: (amount: number) => string;
    processing: boolean;
    paymentMethodId?: string;
    transactionStatusId?: string;
    onSubmit: () => void;
}
