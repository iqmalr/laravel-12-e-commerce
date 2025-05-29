export interface Tax {
    id: string;
    name: string;
    percentage: number;
    description?: string;
    deleted_at?: string | null;
    type: string;
}
