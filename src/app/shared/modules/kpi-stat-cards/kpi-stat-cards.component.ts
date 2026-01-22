import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatistics } from '../../../data/api-services/order/models';
import { TranslateService } from '../../../data/translate/translate.service';

export type KpiStatVariant = 'green' | 'orange' | 'red' | 'blue';

export interface KpiStatItem {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: string;
    variant?: KpiStatVariant;
}

@Component({
    selector: 'app-kpi-stat-cards',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './kpi-stat-cards.component.html',
    styleUrl: './kpi-stat-cards.component.scss',
})
export class KpiStatCardsComponent {
    readonly translateService = inject(TranslateService);

    statistics = input.required<OrderStatistics>();
    totalEntities = input<number>(0);
    totalServices = input<number>(0);
    averageSlaDays = input<number>(0);
    executionStartDate = input<string>('');
    executionEndDate = input<string>('');

    statsRows = computed<KpiStatItem[][]>(() => {
        const stats = this.statistics();
        const entities = this.totalEntities();
        const services = this.totalServices();
        const slaDays = this.averageSlaDays();
        const startDate = this.executionStartDate();
        const endDate = this.executionEndDate();

        return [
            [
                {
                    title: this.translateService.getValue('kpiCards.rejectedRate'),
                    value: `${stats.rejectedRate}%`,
                    icon: '/assets/icons/x-square.svg',
                    variant: 'red' as KpiStatVariant,
                },
                {
                    title: this.translateService.getValue('kpiCards.returnedRate'),
                    value: `${stats.returnedRate}%`,
                    icon: '/assets/icons/calendar.svg',
                    variant: 'orange' as KpiStatVariant,
                },
                {
                    title: this.translateService.getValue('kpiCards.complianceRate'),
                    value: `${slaDays} days`,
                    icon: '/assets/icons/check-square.svg',
                    variant: 'green' as KpiStatVariant,
                },
            ],
            [
                {
                    title: this.translateService.getValue('kpiCards.governmentEntities'),
                    value: entities,
                    icon: '/assets/icons/check-square.svg',
                    variant: 'green' as KpiStatVariant,
                },
                {
                    title: this.translateService.getValue('kpiCards.totalServices'),
                    value: services,
                    icon: '/assets/icons/calendar.svg',
                    variant: 'green' as KpiStatVariant,
                },
                {
                    title: this.translateService.getValue('kpiCards.total'),
                    value: stats.total,
                    icon: '/assets/icons/check-square.svg',
                    variant: 'green' as KpiStatVariant,
                },
            ],
            [
                {
                    title: this.translateService.getValue('kpiCards.executionPeriod'),
                    value: `${stats.complianceRate}%`,
                    subtitle: startDate && endDate ? `${startDate} - ${endDate}` : '',
                    icon: '/assets/icons/calendar.svg',
                    variant: 'orange' as KpiStatVariant,
                },
            ],
        ];
    });
}
