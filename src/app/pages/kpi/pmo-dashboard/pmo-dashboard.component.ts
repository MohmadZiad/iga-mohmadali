//Angular
import { Component, computed, inject, viewChild } from '@angular/core';

//Angular Material
import { MatMenuModule } from '@angular/material/menu';

//Common components
import { F2PopupComponent } from '../../../shared/components/f2-popup/f2-popup.component';

//Local components
import { IndicatorsOFWorkingComponent } from './indicators-of-working/indicators-of-working.component';
import { FilterModalDialogComponent } from './filter-modal/filter-modal.component';
import { StatisticsOfServicesComponent } from './statistics-of-services/statistics-of-services.component';
import { TranslateService } from '../../../data/translate/translate.service';
import { EntityStatisticsComponent } from './entity-statistics/entity-statistics.component';
import { EntityReportingComponent } from './entity-reporting/entity-reporting.component';
import { KpiFilterService } from '../../../data/api-services/kpi-filter.service';

@Component({
    selector: 'app-pmo-dashboard',
    imports: [
        MatMenuModule,
        IndicatorsOFWorkingComponent,
        F2PopupComponent,
        FilterModalDialogComponent,
        StatisticsOfServicesComponent,
        EntityStatisticsComponent,
        EntityReportingComponent,
    ],
    templateUrl: './pmo-dashboard.component.html',
    styleUrl: './pmo-dashboard.component.scss',
})
export class PMODashboardComponent {
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

    filterPopupOpen = false;
    selectedPeriod = computed(() => {
        const { startDate, endDate } = this.kpiFilterService.filterData();
        return `${startDate} - ${endDate}`;
    });

    openPopup() {
        this.filterPopupOpen = true;
    }
}
