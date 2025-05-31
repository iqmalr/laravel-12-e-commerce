import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface TransactionFilterSectionProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    dateFrom: string;
    setDateFrom: (value: string) => void;
    dateTo: string;
    setDateTo: (value: string) => void;
    onSearch: () => void;
    onClearFilters: () => void;
}

export default function TransactionFilterSection({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    onSearch,
    onClearFilters,
}: TransactionFilterSectionProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const hasActiveFilters = searchQuery || statusFilter || dateFrom || dateTo;

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
                        <CardDescription>Cari dan filter transaksi berdasarkan kriteria tertentu</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)} className="gap-2">
                        <Filter className="h-4 w-4" />
                        {isFilterOpen ? 'Tutup Filter' : 'Buka Filter'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                            placeholder="Cari berdasarkan nama customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                        />
                    </div>
                    <Button onClick={onSearch} className="gap-2">
                        <Search className="h-4 w-4" />
                        Cari
                    </Button>
                </div>

                {isFilterOpen && (
                    <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Status</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Semua Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Dari Tanggal</label>
                            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Sampai Tanggal</label>
                            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                        </div>
                    </div>
                )}

                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">Filter aktif:</span>
                        {searchQuery && <Badge variant="secondary">Pencarian: {searchQuery}</Badge>}
                        {statusFilter && <Badge variant="secondary">Status: {statusFilter}</Badge>}
                        {dateFrom && <Badge variant="secondary">Dari: {dateFrom}</Badge>}
                        {dateTo && <Badge variant="secondary">Sampai: {dateTo}</Badge>}
                        <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-6 px-2">
                            Hapus Semua
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
