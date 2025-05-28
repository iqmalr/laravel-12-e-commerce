// resources/js/Pages/Tax/Create.tsx

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Percent, Save, Tag } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tax',
        href: '/tax',
    },
    {
        title: 'Tambah Tax',
        href: '/tax/create',
    },
];

export default function CreateTax() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        percentage: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tax');
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Tax" />
            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Tag className="text-primary h-6 w-6" />
                            <h1 className="text-3xl font-bold tracking-tight">Tambah Pajak Baru</h1>
                        </div>
                        <p className="text-muted-foreground">Masukkan data pajak yang akan digunakan</p>
                    </div>
                    <Link href="/tax">
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

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Percent className="h-5 w-5" />
                                    Informasi Pajak
                                </CardTitle>
                                <CardDescription>Masukkan nama dan persentase pajak</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-medium">
                                                Nama Pajak <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Misal: Pajak PPN"
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

                                        <div className="space-y-2">
                                            <Label htmlFor="percentage" className="text-sm font-medium">
                                                Persentase (%) <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="percentage"
                                                type="number"
                                                placeholder="Contoh: 10"
                                                value={data.percentage}
                                                onChange={(e) => setData('percentage', e.target.value)}
                                                className={`[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${errors.percentage ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            />
                                            {errors.percentage && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.percentage}
                                                </p>
                                            )}
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
                                                    Simpan Pajak
                                                </>
                                            )}
                                        </Button>
                                        <Link href="/tax">
                                            <Button type="button" variant="outline" size="lg">
                                                Batal
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Panduan Pengisian</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Nama Pajak</h4>
                                    <p className="text-muted-foreground text-xs">Contoh: Pajak PPN, Pajak Layanan, dll.</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h4 className="font-medium">Persentase</h4>
                                    <p className="text-muted-foreground text-xs">Masukkan angka saja, misal: 10 untuk 10%</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
