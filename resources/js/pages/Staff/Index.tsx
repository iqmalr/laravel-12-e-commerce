'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { StaffDataTableContainer } from '@/pages/Staff/components/staff-data-table-container';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/page-props';
import { User } from '@/types/user';
import { Head, Link } from '@inertiajs/react';
import { Activity, Clock, Database, TrendingUp, UserCheck, UserPlus, Users, UserX } from 'lucide-react';
import { useMemo } from 'react';
import { useStaffColumns } from './components/staff-columns-container';

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
    const columns = useStaffColumns();

    const statistics = useMemo(() => {
        const total = staff.length;
        const active = staff.filter((user) => !user.deleted_at).length;
        const inactive = staff.filter((user) => user.deleted_at).length;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentlyAdded = staff.filter((user) => new Date(user.created_at) > thirtyDaysAgo).length;

        return { total, active, inactive, recentlyAdded };
    }, [staff]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff Management" />

            <div className="container mx-auto space-y-8 p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                                <Users className="text-primary h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                                <p className="text-muted-foreground">Manage your system admins and staff effortlessly</p>
                            </div>
                        </div>
                    </div>
                    <Link href="/staff/create">
                        <Button size="lg" className="shadow-md transition-all hover:shadow-lg">
                            <UserPlus className="mr-2 h-5 w-5" />
                            Add New Staff
                        </Button>
                    </Link>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Total Staff</CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                <Database className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total}</div>
                            <p className="text-muted-foreground text-xs">Overall number of staff</p>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Active Staff</CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                                <UserCheck className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statistics.active}</div>
                            <p className="text-muted-foreground text-xs">Currently active staff</p>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Inactive Staff</CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                                <UserX className="h-4 w-4 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{statistics.inactive}</div>
                            <p className="text-muted-foreground text-xs">Deactivated staff</p>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Recently Added</CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                                <TrendingUp className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{statistics.recentlyAdded}</div>
                            <p className="text-muted-foreground text-xs">In the last 30 days</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-muted/50 flex flex-wrap items-center gap-4 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <Activity className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm font-medium">System Status:</span>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                        {statistics.active > 0 ? 'Active' : 'No Active Staff'}
                    </Badge>
                    <div className="text-muted-foreground text-sm">•</div>
                    <div className="text-muted-foreground text-sm">
                        Active ratio: {statistics.total > 0 ? Math.round((statistics.active / statistics.total) * 100) : 0}%
                    </div>
                    {statistics.recentlyAdded > 0 && (
                        <>
                            <div className="text-muted-foreground text-sm">•</div>
                            <div className="flex items-center gap-1 text-sm">
                                <Clock className="text-muted-foreground h-3 w-3" />
                                <span className="text-muted-foreground">{statistics.recentlyAdded} new staff this month</span>
                            </div>
                        </>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Staff List
                                </CardTitle>
                                <CardDescription>Manage registered admins and staff with search, filter, and sorting features</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-xs">
                                {staff.length} Total
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="px-6 pb-6">
                            <StaffDataTableContainer columns={columns} data={staff} />
                        </div>
                    </CardContent>
                </Card>

                <div className="text-muted-foreground flex items-center justify-center text-xs">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Data is updated in real-time</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
