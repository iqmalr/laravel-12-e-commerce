"use client"

import { useForm } from "@inertiajs/react"
import { useMemo } from "react"
import { User } from "@/types/user"
import { ColumnDef } from "@tanstack/react-table"
import { StaffColumns } from "./staff-columns"

export function useStaffColumns(): ColumnDef<User>[] {
    const { delete: destroy, post } = useForm()

    function deleteStaff(id: string) {
        destroy(`/staff/${id}`, {
            preserveScroll: true,
        })
    }

    function restoreStaff(id: string) {
        post(`/staff/${id}/restore`, {})
    }

    return useMemo(() => StaffColumns({ deleteStaff, restoreStaff }), [])
}
