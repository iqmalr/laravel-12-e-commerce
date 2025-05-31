import { Product } from '@/types/transaction-page-types';

interface ProductSummaryProps {
    selectedProducts: Product[];
    formatCurrency: (amount: number) => string;
}

export function ProductSummary({ selectedProducts, formatCurrency }: ProductSummaryProps) {
    return (
        <div className="rounded-lg bg-green-50 p-3">
            <div className="text-sm font-medium text-green-900">Produk ({selectedProducts.length} item)</div>
            <div className="mt-1 space-y-1">
                {selectedProducts.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-xs text-green-700">
                        <span>
                            {item.product_name} x{item.quantity}
                        </span>
                        <span>{formatCurrency(item.subtotal + item.tax_amount)}</span>
                    </div>
                ))}
                {selectedProducts.length > 3 && <div className="text-xs text-green-600">+{selectedProducts.length - 3} produk lainnya</div>}
            </div>
        </div>
    );
}
