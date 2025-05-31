import { Customer } from '@/types/transaction-page-types';

interface CustomerSummaryProps {
    selectedCustomer: Customer | null;
}

export function CustomerSummary({ selectedCustomer }: CustomerSummaryProps) {
    return selectedCustomer ? (
        <div className="bg-muted rounded-lg p-3">
            <div className="text-card-foreground text-sm font-medium">Customer</div>
            <div className="text-muted-foreground text-sm">{selectedCustomer.name}</div>
            <div className="text-muted-foreground mt-1 text-xs">ID: {selectedCustomer.id.slice(0, 8)}...</div>
        </div>
    ) : (
        <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-muted-foreground text-sm">Pilih customer terlebih dahulu</div>
        </div>
    );
}
