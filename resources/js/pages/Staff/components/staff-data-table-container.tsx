"use client"

import React from "react"
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
} from "@tanstack/react-table"
import { User } from "@/types/user"
import { StaffDataTable } from "./staff-data-table"

interface StaffDataTableProps {
    columns: ColumnDef<User, unknown>[]
    data: User[]
}

export function StaffDataTableContainer({ columns, data }: StaffDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<string>("all")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, value) => {
            const searchValue = value.toLowerCase()
            return (
                row.original.name?.toLowerCase().includes(searchValue) ||
                row.original.username?.toLowerCase().includes(searchValue) ||
                row.original.email?.toLowerCase().includes(searchValue)
            )
        },
        state: { sorting, columnFilters, globalFilter },
        initialState: {
            pagination: { pageSize: 10 },
        },
    })

    React.useEffect(() => {
        if (statusFilter === "all") {
            table.getColumn("status")?.setFilterValue(undefined)
        } else {
            table.getColumn("status")?.setFilterValue(statusFilter)
        }
    }, [statusFilter, table])

    const activeCount = data.filter((u) => !u.deleted_at).length
    const inactiveCount = data.filter((u) => u.deleted_at).length

    return (
        <StaffDataTable
            table={table}
            columns={columns}
            data={data}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            activeCount={activeCount}
            inactiveCount={inactiveCount}
            setColumnFilters={setColumnFilters}
            setSorting={setSorting}
        />
    )
}
