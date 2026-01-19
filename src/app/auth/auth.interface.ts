import { AuthUser } from '../data/api-services/user/user.interface';

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    user: AuthUser;
}
