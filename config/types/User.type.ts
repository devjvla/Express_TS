export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email_address: string;
    profile_picture_url?: string;
    is_active?: string;
    created_at?: string;
    updated_at?: string;
};

export type SignupUserParams = {
    first_name: string;
    last_name: string;
    email_address: string;
    password: string;
    confirm_password: string;
}

export type SigninUserParams = {
    email_address: string;
    password: string;
}

export type UserHashPasswordsParams = {
    user_id: number;
    salt: string;
    password: string;
}

export type UserCredentials = {
    id: number;
    profile_id: number;
    first_name: string;
    last_name: string;
    email_address: string;
}