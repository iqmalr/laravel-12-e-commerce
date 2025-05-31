export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    email_verified_at?: string | null;
    password?: string;
    remember_token?: string | null;
    role_id: number;
    created_at: string;
    updated_at?: string;
    deleted_at?: string | null;
    restored_at?: string | null;
}
