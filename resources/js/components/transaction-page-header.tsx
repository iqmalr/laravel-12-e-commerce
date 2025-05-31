import { Link } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from './ui/button';

function TransactionPageHeader() {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Plus className="text-primary h-6 w-6" />
                    <h1 className="text-3xl font-bold tracking-tight">Transaksi Baru</h1>
                </div>
                <p className="text-muted-foreground">Buat transaksi penjualan baru</p>
            </div>
            <Link href="/transaction">
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
            </Link>
        </div>
    );
}

export default TransactionPageHeader;
