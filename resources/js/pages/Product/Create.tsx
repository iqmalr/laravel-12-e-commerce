import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Tax } from '@/types/tax';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, ImagePlus, Receipt, Save, Tag } from 'lucide-react';
import { useState } from 'react';

interface Props {
    allTaxes: Tax[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Produk', href: '/product' },
    { title: 'Tambah Produk', href: '/product/create' },
];

export default function CreateProduct({ allTaxes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        description: '',
        taxes: [] as string[],
        image: null as File | null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        console.log(data);
        e.preventDefault();
        post(route('product.store'), {
            forceFormData: true,
        });
    };

    const handleTaxChange = (taxId: string, checked: boolean) => {
        if (checked) {
            setData('taxes', [...data.taxes, taxId]);
        } else {
            setData(
                'taxes',
                data.taxes.filter((id) => id !== taxId),
            );
        }
    };

    const hasErrors = Object.keys(errors).length > 0;

    const selectedTaxes = allTaxes.filter((tax) => data.taxes.includes(tax.id));
    const totalTaxRate = selectedTaxes.reduce((sum, tax) => sum + tax.percentage, 0);
    const basePrice = parseInt(data.price) || 0;
    const taxAmount = (basePrice * totalTaxRate) / 100;
    const totalPrice = basePrice + taxAmount;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Produk" />
            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Tag className="text-primary h-6 w-6" />
                            <h1 className="text-3xl font-bold tracking-tight">Tambah Produk Baru</h1>
                        </div>
                        <p className="text-muted-foreground">Masukkan informasi produk baru untuk katalog</p>
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
                                <CardDescription>Lengkapi informasi produk untuk ditampilkan di katalog</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nama Produk <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Contoh: Mac Book Pro"
                                                className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                            />
                                            {errors.name && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="price">
                                                Harga (Rp) <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="Contoh: 25000"
                                                className={`[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            />
                                            {errors.price && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.price}
                                                </p>
                                            )}
                                        </div>

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

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Receipt className="h-5 w-5" />
                                            <Label className="text-base font-medium">Pajak yang Dikenakan</Label>
                                        </div>

                                        {allTaxes && allTaxes.length > 0 ? (
                                            <div className="space-y-3">
                                                {allTaxes.map((tax) => (
                                                    <div key={tax.id} className="flex items-center space-x-3 rounded-lg border p-3">
                                                        <Checkbox
                                                            id={`tax-${tax.id}`}
                                                            checked={data.taxes.includes(tax.id)}
                                                            onCheckedChange={(checked) => handleTaxChange(tax.id, checked as boolean)}
                                                        />
                                                        <div className="flex-1">
                                                            <Label htmlFor={`tax-${tax.id}`} className="cursor-pointer text-sm font-medium">
                                                                {tax.name}
                                                            </Label>
                                                            <p className="text-muted-foreground text-xs">
                                                                {tax.percentage}% - {tax.type}
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
                                    <div className="space-y-2">
                                        <Label htmlFor="image">Product Image</Label>
                                        <div className="grid w-auto gap-1.5 pt-4">
                                            <div className="flex w-auto items-center justify-center">
                                                <label
                                                    htmlFor="image"
                                                    className="flex w-auto cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800"
                                                >
                                                    {imagePreview ? (
                                                        <div className="flex items-center justify-center px-6 py-5">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Image preview"
                                                                className="h-full rounded-lg object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <ImagePlus className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF (MAX. 2MB)</p>
                                                        </div>
                                                    )}
                                                </label>
                                                <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <Separator />

                                    <div className="flex items-center gap-3 pt-4">
                                        <Button type="submit" disabled={processing} size="lg" className="min-w-[120px]">
                                            {processing ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Simpan Produk
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
                                                        <span>Rp {((basePrice * tax.percentage) / 100).toLocaleString('id-ID')}</span>
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
