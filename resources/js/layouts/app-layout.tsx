import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout'
import { type BreadcrumbItem } from '@/types'
import { type ReactNode, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { Toaster, toast } from 'sonner'

interface AppLayoutProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success)
        }
        if (flash?.error) {
            toast.error(flash.error)
        }
    }, [flash])

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster
                position="top-right"
                richColors
                toastOptions={{
                    style: {
                        borderRadius: "12px",
                        background: "#1a202c",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: 500,
                    },
                    classNames: {
                        toast: "shadow-lg",
                        title: "font-bold",
                        description: "opacity-90",
                    },
                }}
            />
        </AppLayoutTemplate>
    )
}
