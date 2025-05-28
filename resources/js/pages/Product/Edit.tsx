import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Package, Receipt, Save, Tag } from 'lucide-react';

interface Tax {
    id: string;
    name: string;
    percentage: number;
    deleted_at: string | null;
    restored_at: string | null;
}

interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    deleted_at: string | null;
    taxes: Tax[];
}

interface Props {
    product: Product;
    allTaxes: Tax[];
}

export default function EditProduct({ product, allTaxes }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Produk',
            href: '/product',
        },
        {
            title: `Edit - ${product.name}`,
            href: `/product/${product.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        price: product.price?.toString() || '',
        description: product.description || '',
        taxes: (product.taxes || []).map((tax) => tax.id) as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/product/${product.id}`);
    };

    const handleTaxChange = (taxId: string, checked: boolean) => {
        if (checked) {
            setData('taxes', [...(data.taxes || []), taxId]);
        } else {
            setData(
                'taxes',
                (data.taxes || []).filter((id) => id !== taxId),
            );
        }
    };

    const hasErrors = Object.keys(errors).length > 0;

    // Calculate total tax rate for preview
    const selectedTaxes = (allTaxes || []).filter((tax) => (data.taxes || []).includes(tax.id));
    const totalTaxRate = selectedTaxes.reduce((sum, tax) => sum + (tax.percentage || 0), 0);
    const basePrice = parseFloat(data.price) || 0;
    const taxAmount = (basePrice * totalTaxRate) / 100;
    const totalPrice = basePrice + taxAmount;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${product.name}`} />

            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Package className="text-primary h-6 w-6" />
                            <h1 className="text-3xl font-bold tracking-tight">Edit Produk</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Perbarui informasi produk <span className="font-medium">{product.name}</span>
                        </p>
                    </div>
                    <Link href="/product">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <Separator className="mb-6" />

                {hasErrors && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Terdapat kesalahan pada form. Silakan periksa kembali data yang dimasukkan.</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5" />
                                    Informasi Produk
                                </CardTitle>
                                <CardDescription>Edit detail produk</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        {/* Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nama Produk <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Masukkan nama produk"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                            />
                                            {errors.name && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <div className="space-y-2">
                                            <Label htmlFor="price">
                                                Harga (Rp) <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                placeholder="Masukkan harga"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                className={errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                            />
                                            {errors.price && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.price}
                                                </p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Deskripsi Produk</Label>
                                            <textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Masukkan deskripsi produk"
                                                className={`bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            />
                                            {errors.description && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Tax Selection Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Receipt className="h-5 w-5" />
                                            <Label className="text-base font-medium">Pajak yang Dikenakan</Label>
                                            {(product.taxes || []).length > 0 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {(product.taxes || []).length} pajak saat ini
                                                </Badge>
                                            )}
                                        </div>

                                        {(allTaxes || []).length > 0 ? (
                                            <div className="space-y-3">
                                                {(allTaxes || []).map((tax) => (
                                                    <div key={tax.id} className="flex items-center space-x-3 rounded-lg border p-3">
                                                        <Checkbox
                                                            id={`tax-${tax.id}`}
                                                            checked={(data.taxes || []).includes(tax.id)}
                                                            onCheckedChange={(checked) => handleTaxChange(tax.id, checked as boolean)}
                                                        />
                                                        <div className="flex-1">
                                                            <Label htmlFor={`tax-${tax.id}`} className="cursor-pointer text-sm font-medium">
                                                                {tax.name}
                                                            </Label>
                                                            <p className="text-muted-foreground text-xs">
                                                                {tax.percentage}% {tax.deleted_at ? '(Deleted)' : ''}
                                                            </p>
                                                        </div>
                                                        <div className="text-sm font-medium">{tax.percentage}%</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-dashed p-6 text-center">
                                                <Receipt className="text-muted-foreground mx-auto h-8 w-8" />
                                                <p className="text-muted-foreground mt-2 text-sm">Tidak ada pajak yang tersedia</p>
                                            </div>
                                        )}

                                        {errors.taxes && (
                                            <p className="flex items-center gap-1 text-xs text-red-500">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.taxes}
                                            </p>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="flex items-center gap-3 pt-4">
                                        <Button type="submit" disabled={processing} size="lg" className="min-w-[120px]">
                                            {processing ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Simpan Perubahan
                                                </>
                                            )}
                                        </Button>
                                        <Link href="/product">
                                            <Button type="button" variant="outline" size="lg">
                                                Batal
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Price Preview Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Receipt className="h-5 w-5" />
                                    Ringkasan Harga
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Harga Dasar:</span>
                                        <span>Rp {basePrice.toLocaleString('id-ID')}</span>
                                    </div>

                                    {selectedTaxes.length > 0 && (
                                        <>
                                            <Separator />
                                            <div className="space-y-1">
                                                <p className="text-muted-foreground text-xs font-medium">Pajak:</p>
                                                {selectedTaxes.map((tax) => (
                                                    <div key={tax.id} className="flex justify-between text-xs">
                                                        <span>
                                                            {tax.name} ({tax.percentage}%)
                                                        </span>
                                                        <span>Rp {((basePrice * (tax.percentage || 0)) / 100).toLocaleString('id-ID')}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Total Pajak:</span>
                                                <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
                                            </div>
                                        </>
                                    )}

                                    <Separator />
                                    <div className="flex justify-between font-medium">
                                        <span>Total Harga:</span>
                                        <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                {selectedTaxes.length > 0 && (
                                    <div className="bg-muted rounded-lg p-3">
                                        <p className="text-muted-foreground text-xs">
                                            {selectedTaxes.length} pajak dipilih dengan total rate {totalTaxRate}%
                                        </p>
                                    </div>
                                )}

                                {/* Current Taxes Display */}
                                {(product.taxes || []).length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <p className="text-muted-foreground text-xs font-medium">Pajak Saat Ini:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {(product.taxes || []).map((tax) => (
                                                    <Badge key={tax.id} variant="outline" className="text-xs">
                                                        {tax.name} ({tax.percentage}%)
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
