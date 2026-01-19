import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { APP_URL, API_URL } from '../../environments/environments';
import { AuthUser } from '../data/api-services/user/user.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    http = inject(HttpClient);
    cookieService = inject(CookieService);
    router = inject(Router);

    token: string | null = null;
    refreshToken: string | null = null;
    authUser: AuthUser | null = null;

    publicRoutes = ['/login', '/reset-password', '/forgot-password'];

    constructor() {
        const pathOnly = this.router.url.split('#')[0];
        if (!this.token && !this.publicRoutes.includes(pathOnly)) {
            this.token = this.cookieService.get('token');
            this.refreshToken = this.cookieService.get('refreshToken');
            const authUser = this.cookieService.get('authUser');
            if (!authUser || !this.token) {
                this.logout();
            } else {
                this.authUser = authUser ? JSON.parse(authUser) : null;
            }
        }
    }

    get isAuth() {
        return !!this.token;
    }

    login(username: string, password: string) {
        console.log('AuthService -> login');
        const url = `${API_URL}/token`;
        const body = {
            email: username,
            password,
        };
        const options = {
            params: {
                grant_type: 'password',
            },
        };
        return this.http.post<TokenResponse>(url, body, options).pipe(tap((val) => this.saveTokens(val)));
    }

    refreshAuthToken() {
        console.log('AuthService -> refreshAuthToken', this.refreshToken);
        const url = `${API_URL}/token`;
        const body = {
            refresh_token: this.refreshToken,
        };
        const options = {
            params: {
                grant_type: 'refresh_token',
            },
        };
        return this.http.post<TokenResponse>(url, body, options).pipe(
            tap((val) => this.saveTokens(val)),
            catchError((err) => {
                this.logout();
                return throwError(() => new Error(err.message));
            })
        );
    }

    logout() {
        this.removeTokens();
        // TODO: Need to clear all states in services
        this.router.navigate(['/login']).then(() => {
            window.location.reload();
        });
    }

    private saveTokens(res: TokenResponse) {
        this.token = res.access_token;
        this.refreshToken = res.refresh_token;
        this.authUser = res.user;
        this.cookieService.set('token', this.token, { path: '/', sameSite: 'Strict', secure: true });
        this.cookieService.set('refreshToken', this.refreshToken, { path: '/', sameSite: 'Strict', secure: true });
        this.cookieService.set('authUser', JSON.stringify(this.authUser), { path: '/', sameSite: 'Strict', secure: true });
    }

    private removeTokens() {
        this.token = null;
        this.refreshToken = null;
        this.authUser = null;
        this.cookieService.deleteAll('/');
    }

    updateUser(fullName: string, phone: string) {
        console.log('AuthService -> updateUser');
        const url = `${API_URL}/user`;
        const body = {
            data: { display_name: fullName },
            phone,
        };
        return this.http.put(url, body);
    }

    updatePassword(password: string) {
        console.log('AuthService -> updatePassword');
        const url = `${API_URL}/user`;
        const body = {
            password,
        };
        return this.http.put(url, body);
    }

    resetPassword(email: string) {
        console.log('AuthService -> resetPassword');
        const url = `${API_URL}/reset-password`;
        const body = {
            email,
        };
        const params = {
            redirect_to: `${APP_URL}/reset-password`,
        };
        return this.http.post(url, body, { params });
    }
}
