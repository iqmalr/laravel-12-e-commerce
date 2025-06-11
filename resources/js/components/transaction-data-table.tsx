import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowUpDown, ChevronDown, Eye, MoreHorizontal, Printer } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';

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

type BadgeVariant = 'secondary' | 'default' | 'destructive' | 'outline';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
        case 'success':
        case 'paid':
            return 'default';
        case 'pending':
            return 'secondary';
        case 'failed':
        case 'cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
};

const calculateTransactionTotal = (items: Array<{ subtotal: number; tax_amount: number }> = []) => {
    return items.reduce((total, item) => {
        return total + (item.subtotal || 0) + (item.tax_amount || 0);
    }, 0);
};

export const columns: ColumnDef<Transaction>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                >
                    ID Transaksi
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="flex items-center gap-2 font-mono text-sm font-medium">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>{row.getValue('id').substring(0, 8)}...</span>
            </div>
        ),
    },
    {
        id: 'customer',
        accessorFn: (row) => row.customer?.user?.name || 'N/A',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                >
                    Customer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const transaction = row.original;
            return (
                <div>
                    <div className="font-medium">{transaction.customer?.user?.name || 'N/A'}</div>
                    <div className="text-muted-foreground text-sm">{transaction.customer?.user?.email || ''}</div>
                </div>
            );
        },
        filterFn: 'includesString',
    },
    {
        id: 'staff',
        accessorFn: (row) => row.staff?.name || 'N/A',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                >
                    Staff
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.original.staff?.name || 'N/A',
    },
    {
        accessorKey: 'transaction_time',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                >
                    Waktu
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('transaction_time'));
            return (
                <div className="text-sm">
                    <div className="font-medium">{format(date, 'dd MMM yyyy', { locale: id })}</div>
                    <div className="text-muted-foreground">{format(date, 'HH:mm', { locale: id })}</div>
                </div>
            );
        },
    },
    {
        id: 'payment_method',
        accessorFn: (row) => row.payment_method?.name || 'N/A',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                >
                    Pembayaran
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const transaction = row.original;
            return (
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-gray-200"></div>
                    {transaction.payment_method?.name || 'N/A'}
                </div>
            );
        },
    },
    {
        id: 'status',
        accessorFn: (row) => row.transaction_status?.name || 'Unknown',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.original.transaction_status?.name || 'Unknown';
            return (
                <Badge variant={getStatusBadgeVariant(status)} className="font-medium">
                    {status}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            const status = row.original.transaction_status?.name?.toLowerCase() || '';
            return value.includes(status);
        },
    },
    {
        id: 'items_count',
        accessorFn: (row) => row.items?.length || 0,
        header: 'Items',
        cell: ({ row }) => (
            <Badge variant="outline" className="font-medium">
                {row.original.items?.length || 0} item(s)
            </Badge>
        ),
    },
    {
        id: 'total',
        accessorFn: (row) => calculateTransactionTotal(row.items || []),
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                >
                    <div className="text-right">Total</div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const total = calculateTransactionTotal(row.original.items || []);
            return <div className="text-right font-bold">{formatCurrency(total)}</div>;
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const transaction = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction.id)}>Copy transaction ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/transaction/${transaction.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/transaction/${transaction.id}/receipt`} className="flex items-center">
                                <Printer className="mr-2 h-4 w-4" />
                                Print receipt
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

interface TransactionDataTableProps {
    transactions: Transaction[];
}

export default function TransactionDataTable({ transactions }: TransactionDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: transactions,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        // Remove client-side pagination - we'll use server-side
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        // Disable pagination count since we're using server-side
        manualPagination: true,
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter customers..."
                    value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('customer')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="hover:bg-muted/50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Belum ada data transaksi.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                {/* Pagination will be handled by PaginationControls component */}
            </div>
        </div>
    );
}
