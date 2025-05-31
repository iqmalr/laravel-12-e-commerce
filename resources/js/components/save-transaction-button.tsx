import { Customer, Product } from '@/types/transaction-page-types';
import { Button } from './ui/button';

interface SaveTransactionButtonProps {
    processing: boolean;
    selectedCustomer: Customer | null;
    selectedProducts: Product[];
    paymentMethodId?: string;
    transactionStatusId?: string;
    onSubmit: () => void;
}

export function SaveTransactionButton({
    processing,
    selectedCustomer,
    selectedProducts,
    paymentMethodId,
    transactionStatusId,
    onSubmit,
}: SaveTransactionButtonProps) {
    const handleClick = () => {
        onSubmit();
    };
    return (
        <Button
            type="submit"
            className="w-full"
            disabled={processing || !selectedCustomer || selectedProducts.length === 0 || !paymentMethodId || !transactionStatusId}
            onClick={handleClick}
        >
            {processing ? 'Memproses...' : 'Simpan Transaksi'}
        </Button>
    );
}
