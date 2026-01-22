import { Component, computed, effect, inject, signal, viewChild, viewChildren } from '@angular/core';
import { first } from 'rxjs';

import { TranslateService } from '../../../../data/translate/translate.service';

import { ServicesCompletionStatisticsComponent } from './services-completion-statistics/services-completion-statistics.component';
import { FastedCompletionServicesChartComponent } from './fasted-completion-services-chart/fasted-completion-services-chart.component';
import { LongestCompletionServicesChartComponent } from './longest-completion-services-chart/longest-completion-services-chart.component';
import { MostRequestedServicesComponent } from './most-requested-services/most-requested-services.component';
import { TopServicesByStatusComponent } from './top-services-by-status/top-services-by-status.component';
import { KpiFilterService } from '../../../../data/api-services/kpi-filter.service';
import { ServiceApiService, ServiceStatistics } from '../../../../data/api-services/service/service-api.service';
import { FiltersData } from '../../../../data/interfaces/filter.interface';

@Component({
    selector: 'app-statistics-of-completion-services',
    imports: [
        ServicesCompletionStatisticsComponent,
        FastedCompletionServicesChartComponent,
        LongestCompletionServicesChartComponent,
        MostRequestedServicesComponent,
        TopServicesByStatusComponent,
    ],
    templateUrl: './statistics-of-services.component.html',
    styleUrl: './statistics-of-services.component.scss',
})
export class StatisticsOfServicesComponent {
    private readonly serviceApiService = inject(ServiceApiService);
    private readonly kpiFilterService = inject(KpiFilterService);
    readonly translateService = inject(TranslateService);

    constructor() {
        effect(() => {
            this.requestData(this.kpiFilterService.filterData());
        });
    }

    servicesCompletionStatistics = viewChild.required(ServicesCompletionStatisticsComponent);
    fastedCompletionServices = viewChild.required(FastedCompletionServicesChartComponent);
    longestCompletionServices = viewChild.required(LongestCompletionServicesChartComponent);
    mostRequestedServices = viewChild.required(MostRequestedServicesComponent);
    topServicesByStatus = viewChildren(TopServicesByStatusComponent);

    title = signal(this.translateService.getValue('titleStatisticsCompletionServices'));
    reportFormats = ['png', 'jpeg'];
    selectedDataRange = computed(() => {
        const { startDate, endDate } = this.kpiFilterService.filterData();
        return `${startDate} - ${endDate}`;
    });

    dataServiceStatistics: ServiceStatistics[] = [];
    chartData = signal<[string, number, number, number][]>([]);

    dimension: string[] = [
        this.translateService.getValue('service'),
        this.translateService.getValue('averageDays'),
        this.translateService.getValue('mostDays'),
        this.translateService.getValue('fewestDays'),
    ];

    listTopServicesByStatus = [
        {
            title: this.translateService.getValue('titleMostReturnedServices'),
            requestsLabel: this.translateService.getValue('requestsReturned'),
            status: 'returned',
        },
        {
            title: this.translateService.getValue('titleMostRejectedServices'),
            requestsLabel: this.translateService.getValue('requestsRejected'),
            status: 'rejected',
        },
    ];

    downloadReport(format: string) {
        console.log('Download report:', format);
    }

    requestData(filterData: FiltersData) {
        this.serviceApiService
            .getServiceStatistics(filterData)
            .pipe(first())
            .subscribe((res: ServiceStatistics[]) => {
                this.dataServiceStatistics = res;
                this.chartData.set(
                    this.dataServiceStatistics
                        .filter((item) => !!item.totalOrders && !!item.countCompletedOrders)
                        .slice(0, 10)
                        .map((item, index) => [
                            `${item.serviceName}${new Array(index).fill(' ').join('')}`, // ! Needed fix this to identical name services.
                            item.averageDays,
                            item.mostDays,
                            item.fewestDays,
                        ])
                );
            });
    }
}
