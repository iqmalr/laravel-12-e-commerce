import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationControlsProps {
    currentPage: number;
    lastPage: number;
    from: number;
    to: number;
    total: number;
    links: PaginationLink[];
}

export default function PaginationControls({ currentPage, lastPage, from, to, total, links }: PaginationControlsProps) {
    if (lastPage <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-muted-foreground text-sm">
                Menampilkan {from || 0} - {to || 0} dari {total} hasil
            </div>
            <div className="flex items-center space-x-2">
                {links.map((link, index) => (
                    <Button
                        key={index}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => link.url && router.get(link.url)}
                        disabled={!link.url}
                        className="min-w-[40px]"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
