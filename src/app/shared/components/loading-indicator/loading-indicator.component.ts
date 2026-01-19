import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { LoadingService } from '../../../loading/loading.service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-loading-indicator',
    imports: [MatProgressSpinnerModule, AsyncPipe],
    templateUrl: './loading-indicator.component.html',
    styleUrl: './loading-indicator.component.scss',
})
export class LoadingIndicatorComponent {
    loadingService = inject(LoadingService);
    loading$: Observable<boolean> = this.loadingService.loading$;
}
