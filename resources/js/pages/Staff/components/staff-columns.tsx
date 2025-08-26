"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types/user"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Edit,
    RotateCcw,
    Trash2,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Mail,
    User as UserIcon,
} from "lucide-react"
import { Link } from "@inertiajs/react"

interface StaffColumnsProps {
    deleteStaff: (id: string) => void
    restoreStaff: (id: string) => void
}

export function StaffColumns({ deleteStaff, restoreStaff }: StaffColumnsProps): ColumnDef<User>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => {
                const isSorted = column.getIsSorted()
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2 hover:bg-muted/50"
                    >
                        <UserIcon className="mr-2 h-4 w-4" />
                        Name
                        {isSorted === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                        ) : isSorted === "desc" ? (
                            <ArrowDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div
                        className={`h-2 w-2 rounded-full flex-shrink-0 ${
                            row.original.deleted_at ? "bg-red-500" : "bg-green-500"
                        }`}
                    />
                    <div className="min-w-0">
                        <div
                            className={`font-medium truncate ${
                                row.original.deleted_at
                                    ? "text-muted-foreground line-through"
                                    : ""
                            }`}
                        >
                            {row.original.name}
                        </div>
                        {row.original.deleted_at && (
                            <div className="text-xs text-red-500 mt-1">Deleted</div>
                        )}
                    </div>
                </div>
            ),
            enableSorting: true,
            sortingFn: (rowA, rowB) => {
                return rowA.original.name.localeCompare(rowB.original.name)
            },
        },
        {
            accessorKey: "username",
            header: ({ column }) => {
                const isSorted = column.getIsSorted()
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2 hover:bg-muted/50"
                    >
                        Username
                        {isSorted === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                        ) : isSorted === "desc" ? (
                            <ArrowDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div
                    className={`font-mono text-sm ${
                        row.original.deleted_at ? "text-muted-foreground" : ""
                    }`}
                >
                    @{row.original.username}
                </div>
            ),
            enableSorting: true,
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                const isSorted = column.getIsSorted()
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2 hover:bg-muted/50"
                    >
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                        {isSorted === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                        ) : isSorted === "desc" ? (
                            <ArrowDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div
                    className={`truncate max-w-[200px] ${
                        row.original.deleted_at ? "text-muted-foreground" : ""
                    }`}
                    title={row.original.email}
                >
                    {row.original.email}
                </div>
            ),
            enableSorting: true,
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                const isSorted = column.getIsSorted()
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2 hover:bg-muted/50"
                    >
                        Status
                        {isSorted === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                        ) : isSorted === "desc" ? (
                            <ArrowDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
            cell: ({ row }) => (
                <Badge
                    variant={row.original.deleted_at ? "destructive" : "default"}
                    className="font-medium"
                >
                    {row.original.deleted_at ? "Inactive" : "Active"}
                </Badge>
            ),
            enableSorting: true,
            sortingFn: (rowA, rowB) => {
                const aStatus = rowA.original.deleted_at ? "inactive" : "active"
                const bStatus = rowB.original.deleted_at ? "inactive" : "active"
                return aStatus.localeCompare(bStatus)
            },
            filterFn: (row, id, value) => {
                if (value === "active") return !row.original.deleted_at
                if (value === "inactive") return !!row.original.deleted_at
                return true
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                const isSorted = column.getIsSorted()
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2 hover:bg-muted/50"
                    >
                        Created At
                        {isSorted === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                        ) : isSorted === "desc" ? (
                            <ArrowDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
            cell: ({ row }) => {
                const date = new Date(row.original.created_at)
                return (
                    <div
                        className={`text-sm ${
                            row.original.deleted_at ? "text-muted-foreground" : ""
                        }`}
                    >
                        <div>{date.toLocaleDateString("en-US")}</div>
                        <div className="text-xs text-muted-foreground">
                            {date.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                    </div>
                )
            },
            enableSorting: true,
            sortingFn: (rowA, rowB) => {
                const dateA = new Date(rowA.original.created_at)
                const dateB = new Date(rowB.original.created_at)
                return dateA.getTime() - dateB.getTime()
            },
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-end">
                    {!row.original.deleted_at ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/staff/${row.original.id}/edit`}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Staff
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                            className="text-red-600 focus:text-red-600 cursor-pointer"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Staff
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Deletion Confirmation</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete staff{" "}
                                                <strong className="font-semibold">
                                                    {row.original.name}
                                                </strong>
                                                ?
                                                <br />
                                                <br />
                                                The staff will be deactivated and can be restored later.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                                onClick={() => deleteStaff(row.original.id)}
                                            >
                                                Yes, Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                            onClick={() => restoreStaff(row.original.id)}
                        >
                            <RotateCcw className="mr-1 h-3 w-3" />
                            Restore
                        </Button>
                    )}
                </div>
            ),
            enableSorting: false,
        },
    ]
}
