import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Search, User, X } from 'lucide-react';
import React from 'react';

interface Customer {
    id: string;
    name: string;
}

interface CustomerSelectorProps {
    customers: Customer[];
    selectedCustomer: Customer | null;
    searchCustomer: string;
    isCustomerDropdownOpen: boolean;
    errors: Record<string, string>;
    onSelectCustomer: (customer: Customer) => void;
    onResetCustomer: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onInputFocus: () => void;
}

export default function CustomerSelector({
    customers,
    selectedCustomer,
    searchCustomer,
    isCustomerDropdownOpen,
    errors,
    onSelectCustomer,
    onResetCustomer,
    onInputChange,
    onInputFocus,
}: CustomerSelectorProps) {
    const filteredCustomers = customers.filter(
        (customer) => customer && customer.name && customer.name.toLowerCase().includes(searchCustomer.toLowerCase()),
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Pilih Customer
                </CardTitle>
                <CardDescription>Pilih customer untuk transaksi ini</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="customer" className="text-sm font-medium">
                        Customer <span className="text-red-500">*</span>
                    </Label>
                    <div className="customer-dropdown-container relative">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />

                            <Input
                                placeholder="Cari customer..."
                                value={selectedCustomer ? selectedCustomer.name : searchCustomer}
                                disabled={!!selectedCustomer}
                                onChange={onInputChange}
                                onFocus={onInputFocus}
                                className={`pl-10 ${selectedCustomer ? 'cursor-default !text-gray-400 !opacity-100' : 'cursor-text'}`}
                            />

                            {selectedCustomer && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-700"
                                    onClick={onResetCustomer}
                                    title="Hapus pilihan customer"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Dropdown list customer */}
                        {isCustomerDropdownOpen && !selectedCustomer && (
                            <div className="bg-card absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-lg">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <div
                                            key={customer.id}
                                            className="hover:bg-card-foreground cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors last:border-b-0"
                                            onClick={() => onSelectCustomer(customer)}
                                        >
                                            <div className="font-medium text-gray-900">{customer.name}</div>
                                            <div className="text-sm text-gray-500">ID: {customer.id.slice(0, 8)}...</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-center text-gray-500">
                                        {searchCustomer ? 'Tidak ada customer ditemukan' : 'Mulai ketik untuk mencari customer'}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {errors.customer_id && (
                        <p className="flex items-center gap-1 text-xs text-red-500">
                            <AlertCircle className="h-3 w-3" />
                            {errors.customer_id}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
