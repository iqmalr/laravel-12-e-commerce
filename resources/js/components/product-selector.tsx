import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Package, Search, X } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
}

interface TransactionItem {
    product_id: string;
    product_name?: string;
    quantity: number;
    unit_price: number;
    applied_tax_percentage: number;
    subtotal: number;
    tax_amount: number;
}

interface ProductSelectorProps {
    products: Product[];
    selectedProducts: TransactionItem[];
    searchProduct: string;
    isProductDropdownOpen: boolean;
    errors: { items: string };
    onProductInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onProductInputFocus: () => void;
    onAddProduct: (product: Product) => void;
    onUpdateItemQuantity: (index: number, quantity: number) => void;
    onUpdateItemTaxPercentage: (index: number, taxPercentage: number) => void;
    onRemoveItem: (index: number) => void;
    formatCurrency: (amount: number) => string;
}

export default function ProductSelector({
    products,
    selectedProducts,
    searchProduct,
    isProductDropdownOpen,
    errors,
    onProductInputChange,
    onProductInputFocus,
    onAddProduct,
    onUpdateItemQuantity,
    onRemoveItem,
    formatCurrency,
}: ProductSelectorProps) {
    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchProduct.toLowerCase()) && !selectedProducts.some((item) => item.product_id === product.id),
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Pilih Produk
                </CardTitle>
                <CardDescription>Tambahkan produk ke dalam transaksi</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="product" className="text-sm font-medium">
                            Cari Produk
                        </Label>
                        <div className="product-dropdown-container relative">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Cari produk..."
                                    value={searchProduct}
                                    onChange={onProductInputChange}
                                    onFocus={onProductInputFocus}
                                    className="pl-10"
                                />
                            </div>
                            {isProductDropdownOpen && (
                                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-100"
                                                onClick={() => onAddProduct(product)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{product.name}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium text-blue-600">{formatCurrency(product.price)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-center text-gray-500">
                                            {searchProduct ? 'Tidak ada produk ditemukan' : 'Mulai ketik untuk mencari produk'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedProducts.length > 0 && (
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Produk Terpilih</Label>
                            <div className="max-h-96 space-y-3 overflow-y-auto">
                                {selectedProducts.map((item, index) => (
                                    <div key={index} className="bg-foreground-50 flex items-center gap-3 rounded-lg border p-3">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{item.product_name}</div>
                                        </div>

                                        <div className="flex items-center">
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const newQty = parseInt(e.target.value) || 1;
                                                    onUpdateItemQuantity(index, newQty);
                                                }}
                                                className={`"[appearance:textfield] text-center" h-8 w-16 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                                            />
                                        </div>

                                        <div className="w-20 text-center">
                                            <div className="text-sm font-medium">{item.applied_tax_percentage}%</div>
                                            <div className="text-xs text-gray-500">Pajak</div>
                                        </div>

                                        <div className="min-w-[100px] text-right">
                                            <div className="text-sm font-medium">{formatCurrency(item.subtotal + item.tax_amount)}</div>
                                            <div className="text-xs text-gray-500">Subtotal: {formatCurrency(item.subtotal)}</div>
                                            <div className="text-xs text-green-600">+ Pajak: {formatCurrency(item.tax_amount)}</div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onRemoveItem(index)}
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                            title="Hapus item"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {errors.items && (
                        <p className="flex items-center gap-1 text-xs text-red-500">
                            <AlertCircle className="h-3 w-3" />
                            {errors.items}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
