import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/page-props';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Package, PackagePlus, RotateCcw, Trash2 } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    status: string;
    deleted_at: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: '/product',
    },
];

interface ProductPageProps extends PageProps {
    product: Product[];
}

export default function Index({ product }: ProductPageProps) {
    const { delete: destroy, post } = useForm();

    function deleteProduct(id: string) {
        destroy(`/product/${id}`, {
            preserveScroll: true,
        });
    }

    function restoreProduct(id: string) {
        post(`/product/${id}/restore`);
    }

    const activeProduct = product.filter((p) => !p.deleted_at);
    const inactiveProduct = product.filter((p) => p.deleted_at);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Management" />

            <div className="container mx-auto space-y-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Package className="text-primary h-6 w-6" />
                            <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
                        </div>
                        <p className="text-muted-foreground">Kelola produk dalam sistem Anda</p>
                    </div>
                    <Link href="/product/create">
                        <Button size="lg" className="shadow-sm">
                            <PackagePlus className="mr-2 h-4 w-4" />
                            Tambah Produk Baru
                        </Button>
                    </Link>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                            <Package className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{product.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{activeProduct.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Produk Nonaktif</CardTitle>
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{inactiveProduct.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Produk</CardTitle>
                        <CardDescription>Daftar lengkap produk yang terdaftar dalam sistem</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-semibold">Nama Produk</TableHead>
                                        {/* <TableHead className="font-semibold">SKU</TableHead> */}
                                        <TableHead className="font-semibold">Harga</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Status Upload</TableHead>
                                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {product.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                                                Belum ada data produk
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        product.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className={item.deleted_at ? 'bg-muted/50' : 'hover:bg-muted/50 transition-colors'}
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`h-2 w-2 rounded-full ${item.deleted_at ? 'bg-red-500' : 'bg-green-500'}`}
                                                        ></div>
                                                        <span className={item.deleted_at ? 'text-muted-foreground line-through' : ''}>
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                {/* <TableCell className={item.deleted_at ? 'text-muted-foreground' : ''}>{item.sku}</TableCell> */}
                                                <TableCell className={item.deleted_at ? 'text-muted-foreground' : ''}>
                                                    Rp {item.price.toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={item.deleted_at ? 'destructive' : 'default'} className="font-medium">
                                                        {item.deleted_at ? 'Nonaktif' : 'Aktif'}
                                                    </Badge>
                                                </TableCell>
                                                {/* <TableCell>
<Badge variant={item.status?'destructive', pending}>

</Badge>
                                                </TableCell> */}
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {!item.deleted_at ? (
                                                            <>
                                                                <Link href={`/product/${item.id}/edit`}>
                                                                    <Button variant="outline" size="sm" className="h-8">
                                                                        <Edit className="mr-1 h-3 w-3" />
                                                                        Edit
                                                                    </Button>
                                                                </Link>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="destructive" size="sm" className="h-8">
                                                                            <Trash2 className="mr-1 h-3 w-3" />
                                                                            Hapus
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Apakah Anda yakin ingin menghapus produk <strong>{item.name}</strong>?
                                                                                Tindakan ini dapat dibatalkan dengan memulihkan data.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                className="bg-destructive hover:bg-destructive/90 text-white"
                                                                                onClick={() => deleteProduct(item.id)}
                                                                            >
                                                                                Ya, Hapus
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 border-green-200 text-green-700 hover:bg-green-50"
                                                                onClick={() => restoreProduct(item.id)}
                                                            >
                                                                <RotateCcw className="mr-1 h-3 w-3" />
                                                                Pulihkan
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
