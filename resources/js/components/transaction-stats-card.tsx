import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, TrendingUp } from 'lucide-react';

interface Transaction {
    transaction_status?: {
        name: string;
    };
}

interface TransactionStatsCardsProps {
    totalTransactions: number;
    completedTransactions: Transaction[];
    pendingTransactions: Transaction[];
    perPage: number;
}

export default function TransactionStatsCards({
    totalTransactions,
    completedTransactions,
    pendingTransactions,
    perPage,
}: TransactionStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                    <Receipt className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalTransactions}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{completedTransactions.length}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{pendingTransactions.length}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Per Halaman</CardTitle>
                    <TrendingUp className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{perPage}</div>
                </CardContent>
            </Card>
        </div>
    );
}
