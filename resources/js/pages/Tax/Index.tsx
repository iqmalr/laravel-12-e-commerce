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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/page-props';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, MoreHorizontal, Percent, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tax',
        href: '/tax',
    },
];

interface Tax {
    id: string;
    name: string;
    percentage: number;
    description?: string;
    deleted_at?: string | null;
}

interface TaxPageProps extends PageProps {
    tax: Tax[];
}

export default function Index({ tax }: TaxPageProps) {
    const { delete: destroy } = useForm();

    function deleteTax(id: string) {
        destroy(`/tax/${id}`, {
            preserveScroll: true,
        });
    }

    const activeTax = tax?.filter((tax) => !tax.deleted_at);
    const inactiveTax = tax?.filter((tax) => tax.deleted_at);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tax Management" />

            <div className="container mx-auto space-y-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Percent className="text-primary h-6 w-6" />
                            <h1 className="text-3xl font-bold tracking-tight">Tax Management</h1>
                        </div>
                        <p className="text-muted-foreground">Manage taxes in your system</p>
                    </div>
                    <Link href="/tax/create">
                        <Button size="lg" className="shadow-sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Tax
                        </Button>
                    </Link>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Taxes</CardTitle>
                            <Percent className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tax.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Taxes</CardTitle>
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{activeTax.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive Taxes</CardTitle>
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{inactiveTax.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Tax List</CardTitle>
                        <CardDescription>Complete list of taxes registered in the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tax Name</TableHead>
                                        <TableHead>Percentage</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tax.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                                                No tax data available
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        tax.map((item) => (
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
                                                <TableCell className={item.deleted_at ? 'text-muted-foreground' : ''}>{item.percentage}%</TableCell>
                                                <TableCell className={item.deleted_at ? 'text-muted-foreground' : ''}>
                                                    {item.description || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={item.deleted_at ? 'destructive' : 'default'}>
                                                        {item.deleted_at ? 'Inactive' : 'Active'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end">
                                                        {!item.deleted_at ? (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    {/* Delete */}
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <DropdownMenuItem
                                                                                onSelect={(e) => e.preventDefault()}
                                                                                className="bg-red-600 focus:bg-red-400 cursor-pointer"
                                                                            >
                                                                                <Trash2 className="mr-2 h-4 w-4 text-foreground" />
                                                                                Delete Tax
                                                                            </DropdownMenuItem>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Are you sure you want to delete tax{" "}
                                                                                    <strong className="font-semibold">{item.name}</strong>?
                                                                                    <br />
                                                                                    <br />
                                                                                    This action can be undone by restoring the data.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                                                                    onClick={() => deleteTax(item.id)}
                                                                                >
                                                                                    Yes, Delete
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm italic">Deleted</span>
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
