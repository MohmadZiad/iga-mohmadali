import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, catchError, filter, switchMap, tap, throwError } from 'rxjs';

const isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.token;
    if (!token || req.url.includes('/token') || req.url.includes('/reset-password')) {
        return next(req);
    }

    if (isRefreshing$.value) {
        return refreshAndProceed(authService, req, next);
    }
    return next(addToken(req, token)).pipe(
        catchError((error) => {
            console.log('catchError -> error:', error);
            console.log('catchError -> error.status:', error.status);
            // Status 0 is returned by API Gateway in case of 401/403 // TODO: setup API Gateway to return correct error code
            if (error.status === 403 || error.status === 401 || error.status === 0) {
                return refreshAndProceed(authService, req, next);
            }
            return throwError(error);
        })
    );
};

const refreshAndProceed = (authService: AuthService, req: HttpRequest<any>, next: HttpHandlerFn) => {
    if (!isRefreshing$.value) {
        isRefreshing$.next(true);
        return authService.refreshAuthToken().pipe(
            tap(() => isRefreshing$.next(false)),
            switchMap((res) => {
                return next(addToken(req, res.access_token));
            })
        );
    }

    return isRefreshing$.pipe(
        filter((isRefreshing) => !isRefreshing),
        switchMap(() => {
            return next(addToken(req, authService.token!));
        })
    );
};

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });
};
