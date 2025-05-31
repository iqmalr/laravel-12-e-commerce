import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface PaymentMethod {
    id: string;
    name: string;
}

interface TransactionStatus {
    id: string;
    name: string;
}

interface PaymentStatusSelectorProps {
    paymentMethods: PaymentMethod[];
    transactionStatuses: TransactionStatus[];
    selectedPaymentMethodId: string;
    selectedTransactionStatusId: string;
    errors: any;
    onPaymentMethodChange: (value: string) => void;
    onTransactionStatusChange: (value: string) => void;
}

export default function PaymentStatusSelector({
    paymentMethods,
    transactionStatuses,
    selectedPaymentMethodId,
    selectedTransactionStatusId,
    errors,
    onPaymentMethodChange,
    onTransactionStatusChange,
}: PaymentStatusSelectorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Metode Pembayaran & Status</CardTitle>
                <CardDescription>Pilih metode pembayaran dan status transaksi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="payment_method" className="text-sm font-medium">
                            Metode Pembayaran <span className="text-red-500">*</span>
                        </Label>
                        <Select value={selectedPaymentMethodId} onValueChange={onPaymentMethodChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih metode pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentMethods.map((method) => (
                                    <SelectItem key={method.id} value={method.id}>
                                        {method.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.payment_method_id && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {errors.payment_method_id}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="transaction_status" className="text-sm font-medium">
                            Status Transaksi <span className="text-red-500">*</span>
                        </Label>
                        <Select value={selectedTransactionStatusId} onValueChange={onTransactionStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih status transaksi" />
                            </SelectTrigger>
                            <SelectContent>
                                {transactionStatuses.map((status) => (
                                    <SelectItem key={status.id} value={status.id}>
                                        {status.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.transaction_status_id && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {errors.transaction_status_id}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
