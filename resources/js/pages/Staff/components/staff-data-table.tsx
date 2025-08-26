'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/types/user';
import { flexRender, type Table as TableType } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Search, X } from 'lucide-react';

interface StaffDataTableProps {
    table: TableType<User>;
    columns: unknown[];
    data: User[];
    globalFilter: string;
    setGlobalFilter: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    activeCount: number;
    inactiveCount: number;
    setColumnFilters: (val: never[]) => void;
    setSorting: (val: never[]) => void;
}

export function StaffDataTable({
    table,
    columns,
    data,
    globalFilter,
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    activeCount,
    inactiveCount,
    setColumnFilters,
    setSorting,
}: StaffDataTableProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search by name, username, or email..."
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                        {globalFilter && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
                                onClick={() => setGlobalFilter('')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="text-muted-foreground h-4 w-4" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status ({data.length})</SelectItem>
                                <SelectItem value="active">Active ({activeCount})</SelectItem>
                                <SelectItem value="inactive">Inactive ({inactiveCount})</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="font-normal">
                        {table.getFilteredRowModel().rows.length} of {data.length} staff
                    </Badge>
                </div>
            </div>

            {(globalFilter || statusFilter !== 'all') && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">Active filters:</span>
                    {globalFilter && (
                        <Badge variant="secondary" className="gap-1">
                            Search: "{globalFilter}"
                            <Button variant="ghost" size="sm" className="h-3 w-3 p-0" onClick={() => setGlobalFilter('')}>
                                <X className="h-2 w-2" />
                            </Button>
                        </Badge>
                    )}
                    {statusFilter !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                            Status: {statusFilter === 'active' ? 'Active' : 'Inactive'}
                            <Button variant="ghost" size="sm" className="h-3 w-3 p-0" onClick={() => setStatusFilter('all')}>
                                <X className="h-2 w-2" />
                            </Button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                            setGlobalFilter('');
                            setStatusFilter('all');
                            setColumnFilters([]);
                            setSorting([]);
                        }}
                    >
                        Reset all
                    </Button>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="py-12 text-center">
                                    <div className="text-muted-foreground flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8" />
                                        <div>
                                            <p className="font-medium">No data found</p>
                                            <p className="text-sm">
                                                {globalFilter || statusFilter !== 'all'
                                                    ? 'Try changing or removing the filter'
                                                    : 'No staff data available yet'}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span>Showing</span>
                    <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
                        <SelectTrigger className="h-8 w-16">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 30, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>of {table.getFilteredRowModel().rows.length} data</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
