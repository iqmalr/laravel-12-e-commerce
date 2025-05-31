import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { User } from '@/types/user';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Calendar, Eye, EyeOff, Lock, Mail, Save, Shield, User as UserIcon, UserPen } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ staff }: { staff: User }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Staff',
            href: '/staff',
        },
        {
            title: `Edit - ${staff.name}`,
            href: `/staff/${staff.id}/edit`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: staff.name || '',
        username: staff.username || '',
        email: staff.email || '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/staff/${staff.id}`);
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${staff.name}`} />

            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <UserPen className="text-primary h-6 w-6" />
                            <h1 className="text-3xl font-bold tracking-tight">Edit Admin</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Perbarui informasi admin <span className="font-medium">{staff.name}</span>
                        </p>
                    </div>
                    <Link href="/staff">
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
                                    <UserIcon className="h-5 w-5" />
                                    Informasi Admin
                                </CardTitle>
                                <CardDescription>Edit informasi akun admin yang sudah ada</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-medium">
                                                Nama Lengkap <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Masukkan nama lengkap"
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
                                            <Label htmlFor="username" className="text-sm font-medium">
                                                Username <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="username"
                                                placeholder="Masukkan username unik"
                                                value={data.username}
                                                onChange={(e) => setData('username', e.target.value)}
                                                className={errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                            />
                                            {errors.username && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.username}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium">
                                                Email <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="admin@example.com"
                                                    className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div className="mb-4 flex items-center gap-2">
                                            <Lock className="text-muted-foreground h-4 w-4" />
                                            <h3 className="text-sm font-medium">Ubah Password</h3>
                                            <Badge variant="secondary" className="text-xs">
                                                Opsional
                                            </Badge>
                                        </div>

                                        <Alert className="border-amber-200 bg-amber-50">
                                            <AlertCircle className="h-4 w-4 text-amber-600" />
                                            <AlertDescription className="text-sm text-amber-800">
                                                Kosongkan field password jika tidak ingin mengubah password
                                            </AlertDescription>
                                        </Alert>

                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-sm font-medium">
                                                Password Baru
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Masukkan password baru (opsional)"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className={`pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="text-muted-foreground h-4 w-4" />
                                                    ) : (
                                                        <Eye className="text-muted-foreground h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            {errors.password && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                                Konfirmasi Password Baru
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password_confirmation"
                                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                                    placeholder="Konfirmasi password baru"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    className="pr-10"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                >
                                                    {showPasswordConfirmation ? (
                                                        <EyeOff className="text-muted-foreground h-4 w-4" />
                                                    ) : (
                                                        <Eye className="text-muted-foreground h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center gap-3 pt-4">
                                        <Button type="submit" disabled={processing} size="lg" className="min-w-[120px]">
                                            {processing ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                                    Memperbarui...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Perbarui Admin
                                                </>
                                            )}
                                        </Button>
                                        <Link href="/staff">
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
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Shield className="h-4 w-4" />
                                    Admin Saat Ini
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="text-muted-foreground h-4 w-4" />
                                        <span className="text-sm font-medium">{staff.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="text-muted-foreground h-4 w-4" />
                                        <span className="text-muted-foreground text-sm">{staff.email}</span>
                                    </div>
                                    {staff.created_at && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="text-muted-foreground h-4 w-4" />
                                            <span className="text-muted-foreground text-xs">
                                                Dibuat: {new Date(staff.created_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Panduan Edit</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Data Pribadi</h4>
                                    <p className="text-muted-foreground text-xs">Perbarui nama, username, atau email admin</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h4 className="font-medium">Password</h4>
                                    <p className="text-muted-foreground text-xs">
                                        Kosongkan jika tidak ingin mengubah password. Jika diisi, konfirmasi password harus sama.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm text-amber-700">Catatan Penting</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground space-y-2 text-xs">
                                <p>• Username dan email harus tetap unik</p>
                                <p>• Password baru minimal 8 karakter</p>
                                <p>• Perubahan akan tersimpan langsung</p>
                                <p>• Admin dapat login dengan data terbaru</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
