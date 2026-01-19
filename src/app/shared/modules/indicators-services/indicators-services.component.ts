import { Component, computed, inject, input } from '@angular/core';
import { KeyValuePipe, NgFor } from '@angular/common';

import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { TranslateService } from '../../../data/translate/translate.service';
import { OrderStatistics } from '../../../data/api-services/order/models';

@Component({
    selector: 'app-indicators-services',
    imports: [ProgressBarComponent, NgFor, KeyValuePipe],
    templateUrl: './indicators-services.component.html',
    styleUrl: './indicators-services.component.scss',
})
export class IndicatorsServicesComponent {
    readonly translateService = inject(TranslateService);

    statistics = input.required<OrderStatistics>();
    data = computed(() => {
        return this.statistics().getIndicators();
    });
}
