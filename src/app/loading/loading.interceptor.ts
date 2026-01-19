import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from './loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    // Turn on the loading spinner
    loadingService.loadingOn();

    return next(req).pipe(
        finalize(() => {
            // Turn off the loading spinner
            loadingService.loadingOff();
        })
    );
};
