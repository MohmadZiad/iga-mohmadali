export interface UserDB {
    user_id: string;
    user_account_id: string;
    user_name: string;
    email?: string;
    meta_data: {
        full_name: string;
        phone?: string;
    };
    account_code?: string;
}

export interface AuthUser {
    id: string;
    email: string;
    phone: string;
    user_metadata: UserMetadata;
}

export interface UserMetadata {
    display_name: string;
}
