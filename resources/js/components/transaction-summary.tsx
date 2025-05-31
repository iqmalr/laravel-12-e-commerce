import { TransactionSummaryProps } from '@/types/transaction-page-types';
import { CustomerSummary } from './customer-summary';
import { ProductSummary } from './product-summary';
import { SaveTransactionButton } from './save-transaction-button';
import TransactionGuidelines from './transaction-guidelines';
import { TransactionTotal } from './transaction-total';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function TransactionSummary({
    selectedCustomer,
    selectedProducts,
    subtotal,
    totalTax,
    total,
    formatCurrency,
    processing,
    paymentMethodId,
    transactionStatusId,
    onSubmit,
}: TransactionSummaryProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Ringkasan Transaksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <CustomerSummary selectedCustomer={selectedCustomer} />

                    {selectedProducts.length > 0 && <ProductSummary selectedProducts={selectedProducts} formatCurrency={formatCurrency} />}

                    <TransactionTotal subtotal={subtotal} totalTax={totalTax} total={total} formatCurrency={formatCurrency} />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <SaveTransactionButton
                        processing={processing}
                        selectedCustomer={selectedCustomer}
                        selectedProducts={selectedProducts}
                        paymentMethodId={paymentMethodId}
                        transactionStatusId={transactionStatusId}
                        onSubmit={onSubmit}
                    />
                </CardContent>
            </Card>

            <TransactionGuidelines />
        </div>
    );
}
