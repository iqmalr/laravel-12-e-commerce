import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CreditCard, Eye, Printer } from 'lucide-react';

interface Transaction {
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

interface TransactionTableProps {
    transactions: Transaction[];
}
type BadgeVariant = 'secondary' | 'default' | 'destructive' | 'outline';
export default function TransactionTable({ transactions }: TransactionTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    function getStatusBadgeVariant(status: string): BadgeVariant {
        switch (status.toLowerCase()) {
            case 'success':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'failed':
                return 'destructive';
            default:
                return 'outline';
        }
    }

    const calculateTransactionTotal = (items: Array<{ subtotal: number; tax_amount: number }> = []) => {
        return items.reduce((total, item) => {
            return total + (item.subtotal || 0) + (item.tax_amount || 0);
        }, 0);
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold">ID Transaksi</TableHead>
                        <TableHead className="font-semibold">Customer</TableHead>
                        <TableHead className="font-semibold">Staff</TableHead>
                        <TableHead className="font-semibold">Waktu</TableHead>
                        <TableHead className="font-semibold">Pembayaran</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Items</TableHead>
                        <TableHead className="text-right font-semibold">Total</TableHead>
                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-muted-foreground py-8 text-center">
                                Belum ada data transaksi
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((transaction) => (
                            <TableRow key={transaction.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="font-mono text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        <span>{transaction.id.substring(0, 8)}...</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div>
                                        <div className="font-medium">{transaction.customer?.user?.name || 'N/A'}</div>
                                        <div className="text-muted-foreground text-sm">{transaction.customer?.user?.email || ''}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{transaction.staff?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <div className="font-medium">
                                            {format(new Date(transaction.transaction_time), 'dd MMM yyyy', { locale: id })}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {format(new Date(transaction.transaction_time), 'HH:mm', { locale: id })}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="text-muted-foreground h-4 w-4" />
                                        {transaction.payment_method?.name || 'N/A'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(transaction.transaction_status?.name || '')} className="font-medium">
                                        {transaction.transaction_status?.name || 'Unknown'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-medium">
                                        {transaction.items?.length || 0} item(s)
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-bold">
                                    {formatCurrency(calculateTransactionTotal(transaction.items || []))}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/transaction/${transaction.id}`}>
                                            <Button variant="outline" size="sm" className="h-8">
                                                <Eye className="mr-1 h-3 w-3" />
                                                View
                                            </Button>
                                        </Link>
                                        <Link href={`/transaction/${transaction.id}/receipt`}>
                                            <Button variant="outline" size="sm" className="h-8">
                                                <Printer className="mr-1 h-3 w-3" />
                                                Print
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
