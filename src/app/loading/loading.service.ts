import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private loadingSubject$ = new BehaviorSubject<boolean>(false);

    // TODO: need to find better solution to track parallel requests
    private requestCount = 0;

    loading$ = this.loadingSubject$.asObservable();

    loadingOn() {
        this.requestCount++;
        this.loadingSubject$.next(true);
    }

    loadingOff() {
        this.requestCount--;
        if (this.requestCount === 0) {
            this.loadingSubject$.next(false);
        }
    }
}
