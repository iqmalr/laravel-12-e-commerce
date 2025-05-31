import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/page-props';
import { Head, Link, router } from '@inertiajs/react';
import { FileDown, Plus, Receipt } from 'lucide-react';
import { useState } from 'react';

import PaginationControls from '@/components/pagination-control';
import TransactionFilterSection from '@/components/transaction-filter-section';
import TransactionStatsCards from '@/components/transaction-stats-card';
import TransactionTable from '@/components/transaction-table';
import { TransactionFilters, TransactionPagination } from '@/types/transaction';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi',
        href: '/transactions',
    },
];

interface TransactionPageProps extends PageProps {
    transactions: TransactionPagination;
    filters?: TransactionFilters;
}

export default function Index({ transactions, filters = {} }: TransactionPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleSearch = () => {
        router.get(
            '/transaction',
            {
                q: searchQuery,
                status: statusFilter,
                date_from: dateFrom,
                date_to: dateTo,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setDateFrom('');
        setDateTo('');
        router.get('/transaction');
    };

    const completedTransactions = transactions.data.filter((t) => t.transaction_status?.name?.toLowerCase() === 'completed');
    const pendingTransactions = transactions.data.filter((t) => t.transaction_status?.name?.toLowerCase() === 'pending');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaction Management" />

            <div className="container mx-auto space-y-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Receipt className="text-primary h-6 w-6" />
                            <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
                        </div>
                        <p className="text-muted-foreground">Kelola semua transaksi dalam sistem Anda</p>
                    </div>
                    <Link href="/transaction/create">
                        <Button size="lg" className="shadow-sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Transaksi Baru
                        </Button>
                    </Link>
                </div>

                <Separator />

                <TransactionStatsCards
                    totalTransactions={transactions.total}
                    completedTransactions={completedTransactions}
                    pendingTransactions={pendingTransactions}
                    perPage={transactions.per_page}
                />

                <TransactionFilterSection
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    dateTo={dateTo}
                    setDateTo={setDateTo}
                    onSearch={handleSearch}
                    onClearFilters={clearFilters}
                />

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Daftar Transaksi</CardTitle>
                                <CardDescription>Daftar lengkap transaksi yang terdaftar dalam sistem</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <FileDown className="h-4 w-4" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TransactionTable transactions={transactions.data} />

                        <PaginationControls
                            currentPage={transactions.current_page}
                            lastPage={transactions.last_page}
                            from={transactions.from}
                            to={transactions.to}
                            total={transactions.total}
                            links={transactions.links}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
