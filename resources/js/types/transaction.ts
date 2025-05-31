export interface Transaction {
    id: string;
    customer_id: string;
    staff_id: string;
    transaction_time: string;
    payment_method_id: string;
    transaction_status_id: string;
    customer?: {
        user?: {
            name: string;
            email: string;
        };
    };
    staff?: {
        name: string;
    };
    payment_method?: {
        name: string;
    };
    transaction_status?: {
        name: string;
    };
    items?: Array<{
        subtotal: number;
        tax_amount: number;
    }>;
}

export interface TransactionPagination {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export interface TransactionFilters {
    q?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
}
