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
import { User } from '@/types/user';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, RotateCcw, Trash2, UserPlus, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staff',
        href: '/staff',
    },
];
interface StaffPageProps extends PageProps {
    staff: User[];
}
export default function Index({ staff }: StaffPageProps) {
    const { delete: destroy, post } = useForm();
    function deleteStaff(id: string) {
        destroy(`/staff/${id}`, {
            preserveScroll: true,
        });
    }

    function restoreStaff(id: string) {
        post(`/staff/${id}/restore`);
    }

    const activeStaff = staff.filter((user) => !user.deleted_at);
    const inactiveStaff = staff.filter((user) => user.deleted_at);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff Management" />

            <div className="container mx-auto space-y-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Users className="text-primary h-6 w-6" />
                            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                        </div>
                        <p className="text-muted-foreground">Kelola admin dan staff sistem Anda</p>
                    </div>
                    <Link href="/staff/create">
                        <Button size="lg" className="shadow-sm">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Tambah Admin Baru
                        </Button>
                    </Link>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{staff.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Staff Aktif</CardTitle>
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{activeStaff.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Staff Nonaktif</CardTitle>
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{inactiveStaff.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Staff</CardTitle>
                        <CardDescription>Daftar lengkap admin dan staff yang terdaftar dalam sistem</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-semibold">Nama</TableHead>
                                        <TableHead className="font-semibold">Username</TableHead>
                                        <TableHead className="font-semibold">Email</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {staff.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                                                Belum ada data staff
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        staff.map((user) => (
                                            <TableRow
                                                key={user.id}
                                                className={user.deleted_at ? 'bg-muted/50' : 'hover:bg-muted/50 transition-colors'}
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`h-2 w-2 rounded-full ${user.deleted_at ? 'bg-red-500' : 'bg-green-500'}`}
                                                        ></div>
                                                        <span className={user.deleted_at ? 'text-muted-foreground line-through' : ''}>
                                                            {user.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className={user.deleted_at ? 'text-muted-foreground' : ''}>{user.username}</TableCell>
                                                <TableCell className={user.deleted_at ? 'text-muted-foreground' : ''}>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.deleted_at ? 'destructive' : 'default'} className="font-medium">
                                                        {user.deleted_at ? 'Nonaktif' : 'Aktif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {!user.deleted_at ? (
                                                            <>
                                                                <Link href={`/staff/${user.id}/edit`}>
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
                                                                                Apakah Anda yakin ingin menghapus staff <strong>{user.name}</strong>?
                                                                                Tindakan ini dapat dibatalkan dengan memulihkan data.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                className="bg-destructive hover:bg-destructive/90 text-white"
                                                                                onClick={() => deleteStaff(user.id)}
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
                                                                onClick={() => restoreStaff(user.id)}
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
