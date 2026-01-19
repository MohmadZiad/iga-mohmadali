//Angular
import { Component, computed, inject, viewChild } from '@angular/core';

//Local components
import { IndicatorsOFWorkingComponent } from '../../pmo-dashboard/indicators-of-working/indicators-of-working.component';
import { StatisticsOfServicesComponent } from '../../pmo-dashboard/statistics-of-services/statistics-of-services.component';
import { TranslateService } from '../../../../data/translate/translate.service';
import { EntityStatisticsComponent } from '../../pmo-dashboard/entity-statistics/entity-statistics.component';
import { EntityReportingComponent } from '../../pmo-dashboard/entity-reporting/entity-reporting.component';
import { KpiFilterService } from '../../../../data/api-services/kpi-filter.service';

@Component({
    selector: 'app-iga-reports',
    imports: [
        IndicatorsOFWorkingComponent,
        StatisticsOfServicesComponent,
        EntityStatisticsComponent,
        EntityReportingComponent,
    ],
    templateUrl: './iga-reports.component.html',
    styleUrl: './iga-reports.component.scss',
})
export class IgaReportsComponent {
    readonly translateService = inject(TranslateService);
    private readonly kpiFilterService = inject(KpiFilterService);

    private entityStatistics = viewChild.required(EntityStatisticsComponent);
    private statisticsOfServices = viewChild.required(StatisticsOfServicesComponent);

    menuItems = computed(() => {
        return [
            this.entityStatistics(),
            this.entityStatistics().entityReport(),
            this.statisticsOfServices().fastedCompletionServices(),
            this.statisticsOfServices().longestCompletionServices(),
            this.statisticsOfServices(),
            this.statisticsOfServices().servicesCompletionStatistics(),
            this.statisticsOfServices().servicesMeetSla(),
            this.statisticsOfServices().servicesExceedSla(),
            this.statisticsOfServices().mostRequestedServices(),
            ...this.statisticsOfServices().topServicesByStatus(),
        ].filter(Boolean);
    });

    selectedPeriod = computed(() => {
        const { startDate, endDate } = this.kpiFilterService.filterData();
        return `${startDate} - ${endDate}`;
    });
}
