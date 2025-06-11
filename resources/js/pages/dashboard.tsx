import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types/page-props';
import { Head } from '@inertiajs/react';
import { Activity, BarChart, Calendar, CreditCard, DollarSign, Package, ShoppingCart, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { Bar, CartesianGrid, BarChart as RechartBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DashboardProps extends PageProps {
    summary: {
        stats: {
            total_users: number;
            total_customers: number;
            total_products: number;
            total_transactions: number;
            today_transactions: number;
            month_transactions: number;
        };
        revenue: {
            total: number;
        };
        charts: {
            weekly_orders: Array<{
                date: string;
                count: number;
                full_date: string;
            }>;
            monthly_transactions: Array<{
                month: string;
                count: number;
                revenue: number;
            }>;
        };
        recent_transactions: Array<{
            id: string;
            customer_name: string;
            status: string;
            date: string;
        }>;
        top_products: Array<{
            name: string;
            sold: number;
            revenue: number;
        }>;
        payment_methods: Array<{
            name: string;
            count: number;
            revenue: number;
        }>;
    };
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
};

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed':
        case 'selesai':
        case 'berhasil':
            return 'default';
        case 'pending':
        case 'menunggu':
            return 'secondary';
        case 'cancelled':
        case 'dibatalkan':
            return 'destructive';
        default:
            return 'outline';
    }
};

export default function Dashboard({ summary }: DashboardProps) {
    const { stats, revenue, charts, recent_transactions, top_products, payment_methods } = summary;

    // Calculate percentage growth (simplified version)
    const todayGrowth = stats.today_transactions > 0 ? ((stats.today_transactions / stats.month_transactions) * 100).toFixed(1) : '0';
    const growthIsPositive = parseFloat(todayGrowth) > 0;

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-8 p-6">
                {/* Header Section */}
                <div className="space-y-2">
                    <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-gray-100 dark:to-gray-400">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg">Selamat datang kembali! Berikut ringkasan bisnis Anda hari ini.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-green-950 dark:to-emerald-900">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10" />
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-green-800 dark:text-green-200">Total Pendapatan</CardTitle>
                            <div className="rounded-full bg-green-500/20 p-2">
                                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-green-700 dark:text-green-300">{formatCurrency(revenue.total)}</div>
                            <p className="text-sm font-medium text-green-600/80 dark:text-green-400/80">Total pendapatan keseluruhan</p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-cyan-100 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-blue-950 dark:to-cyan-900">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10" />
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-blue-800 dark:text-blue-200">Transaksi Hari Ini</CardTitle>
                            <div className="rounded-full bg-blue-500/20 p-2">
                                <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{formatNumber(stats.today_transactions)}</div>
                            <div className="flex items-center gap-1 text-sm font-medium">
                                {growthIsPositive ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                                <span className={growthIsPositive ? 'text-green-600' : 'text-red-600'}>{todayGrowth}% dari bulan ini</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-violet-100 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-purple-950 dark:to-violet-900">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-600/10" />
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-purple-800 dark:text-purple-200">Growth Bulan Ini</CardTitle>
                            <div className="rounded-full bg-purple-500/20 p-2">
                                {growthIsPositive ? (
                                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div
                                className={`text-3xl font-bold ${growthIsPositive ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}
                            >
                                {todayGrowth}%
                            </div>
                            <p
                                className={`text-sm font-medium ${growthIsPositive ? 'text-green-600/80 dark:text-green-400/80' : 'text-red-600/80 dark:text-red-400/80'}`}
                            >
                                dibanding total bulan ini
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-amber-100 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-orange-950 dark:to-amber-900">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-600/10" />
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-orange-800 dark:text-orange-200">Total Produk</CardTitle>
                            <div className="rounded-full bg-orange-500/20 p-2">
                                <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">{formatNumber(stats.total_products)}</div>
                            <p className="text-sm font-medium text-orange-600/80 dark:text-orange-400/80">Produk tersedia</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
                    <Card className="col-span-1 border-0 bg-gradient-to-br from-slate-50 to-gray-100 shadow-lg lg:col-span-7 dark:from-slate-900 dark:to-gray-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                <div className="bg-primary/10 rounded-lg p-2">
                                    <BarChart className="text-primary h-6 w-6" />
                                </div>
                                Transaksi 7 Hari Terakhir
                            </CardTitle>
                            <CardDescription className="text-base">Jumlah transaksi harian dalam seminggu terakhir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={320}>
                                <RechartBarChart data={charts.weekly_orders} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        className="text-sm font-medium"
                                        tick={{ fill: 'currentColor' }}
                                    />
                                    <YAxis axisLine={false} tickLine={false} className="text-sm font-medium" tick={{ fill: 'currentColor' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} className="fill-primary drop-shadow-sm" />
                                </RechartBarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 border-0 bg-gradient-to-br from-slate-50 to-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl lg:col-span-7 dark:from-slate-900 dark:to-gray-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold">Transaksi Bulanan</CardTitle>
                            <CardDescription className="text-base">Ringkasan transaksi dan pendapatan per bulan</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartBarChart data={charts.monthly_transactions}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="month" tick={{ fill: 'currentColor' }} className="text-sm font-medium" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fill: 'currentColor' }} className="text-sm" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fill: 'currentColor' }} className="text-sm" />
                                    <Tooltip
                                        formatter={(value: never) => (typeof value === 'number' ? value : value)}
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        }}
                                    />
                                    <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Transaksi" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Pendapatan" radius={[4, 4, 0, 0]} />
                                </RechartBarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Recent Transactions */}
                    <Card className="col-span-1 border-0 bg-gradient-to-br from-slate-50 to-gray-100 shadow-lg lg:col-span-2 dark:from-slate-900 dark:to-gray-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                <div className="rounded-lg bg-blue-500/10 p-2">
                                    <Activity className="h-6 w-6 text-blue-600" />
                                </div>
                                Transaksi Terbaru
                            </CardTitle>
                            <CardDescription className="text-base">5 transaksi terakhir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent_transactions.length > 0 ? (
                                    recent_transactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between rounded-xl border bg-white/50 p-4 shadow-sm transition-all duration-200 hover:bg-white/80 hover:shadow-md dark:bg-gray-800/50 dark:hover:bg-gray-800/80"
                                        >
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">{transaction.customer_name}</div>
                                                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                                    <Calendar className="h-4 w-4" />
                                                    {transaction.date}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getStatusBadgeVariant(transaction.status)} className="font-medium">
                                                    {transaction.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted-foreground py-8 text-center">
                                        <Activity className="mx-auto mb-3 h-12 w-12 opacity-50" />
                                        <p className="text-lg font-medium">Belum ada transaksi terbaru</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Products & Payment Methods */}
                    <div className="space-y-6">
                        {/* Top Products */}
                        <Card className="border-0 bg-gradient-to-br from-slate-50 to-gray-100 shadow-lg dark:from-slate-900 dark:to-gray-800">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                                    <div className="rounded-lg bg-yellow-500/10 p-2">
                                        <Star className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    Produk Terlaris
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {top_products.length > 0 ? (
                                        top_products.map((product, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg bg-white/50 p-3 shadow-sm dark:bg-gray-800/50"
                                            >
                                                <div className="flex-1">
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{product.name}</div>
                                                    <div className="text-muted-foreground text-xs font-medium">
                                                        {formatNumber(product.sold)} terjual
                                                    </div>
                                                </div>
                                                <div className="text-sm font-bold text-green-600 dark:text-green-400">
                                                    {formatCurrency(product.revenue)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted-foreground py-6 text-center">
                                            <Star className="mx-auto mb-2 h-10 w-10 opacity-50" />
                                            <p className="text-sm font-medium">Belum ada data produk terlaris</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card className="border-0 bg-gradient-to-br from-slate-50 to-gray-100 shadow-lg dark:from-slate-900 dark:to-gray-800">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                                    <div className="rounded-lg bg-indigo-500/10 p-2">
                                        <CreditCard className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    Metode Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {payment_methods.length > 0 ? (
                                        payment_methods.map((method, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg bg-white/50 p-3 shadow-sm dark:bg-gray-800/50"
                                            >
                                                <div className="flex-1">
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{method.name}</div>
                                                    <div className="text-muted-foreground text-xs font-medium">
                                                        {formatNumber(method.count)} transaksi
                                                    </div>
                                                </div>
                                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {formatCurrency(method.revenue)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted-foreground py-6 text-center">
                                            <CreditCard className="mx-auto mb-2 h-10 w-10 opacity-50" />
                                            <p className="text-sm font-medium">Belum ada data metode pembayaran</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
