interface TransactionTotalProps {
    subtotal: number;
    totalTax: number;
    total: number;
    formatCurrency: (amount: number) => string;
}

export function TransactionTotal({ subtotal, totalTax, total, formatCurrency }: TransactionTotalProps) {
    return (
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
                <span>Pajak:</span>
                <span>{formatCurrency(totalTax)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                <span>Total:</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
            </div>
        </div>
    );
}
