import { Component, effect, inject } from '@angular/core';

import { OrderService, OrderStatistics, FiltersOrdersData } from '../../../../data/api-services/order/order.service';
import { first } from 'rxjs';
import { AccountService } from '../../../../data/api-services/account/account.service';
import { ServiceApiService } from '../../../../data/api-services/service/service-api.service';
import { KpiStatCardsComponent } from '../../../../shared/modules/kpi-stat-cards/kpi-stat-cards.component';
import { TranslateService } from '../../../../data/translate/translate.service';
import { calculatePercentage, getDaysDifference } from '../../../../shared/utils/general.utils';
import { KpiFilterService } from '../../../../data/api-services/kpi-filter.service';

@Component({
    selector: 'app-indicators-of-working',
    imports: [KpiStatCardsComponent],
    templateUrl: './indicators-of-working.component.html',
    styleUrl: './indicators-of-working.component.scss',
})
export class IndicatorsOFWorkingComponent {
    private readonly orderService = inject(OrderService);
    private readonly kpiFilterService = inject(KpiFilterService);
    private readonly accountService = inject(AccountService);
    private readonly serviceApiService = inject(ServiceApiService);
    readonly translateService = inject(TranslateService);

    constructor() {
        effect(() => {
            this.requestData(this.kpiFilterService.filterData());
        });
    }

    statisticsForCurrentPeriod: OrderStatistics = new OrderStatistics({});

    statisticsForPreviousPeriod: OrderStatistics = new OrderStatistics({});

    differenceDays = 0;

    // Additional stats for KPI cards
    totalEntities = 0;
    totalServices = 0;
    averageSlaDays = 0;
    executionStartDate = '';
    executionEndDate = '';

    getDifferenceWithPreviousPeriod(): number {
        if (!this.statisticsForCurrentPeriod || !this.statisticsForPreviousPeriod) return 0;
        return Math.abs(
            calculatePercentage(
                this.statisticsForCurrentPeriod.total - this.statisticsForPreviousPeriod.total,
                this.statisticsForPreviousPeriod.total
            )
        );
    }
    requestData(filterData: FiltersOrdersData) {
        this.differenceDays = getDaysDifference(filterData.previousStartDate as string, filterData.previousEndDate as string) + 1;

        // Set execution period dates from filter
        this.executionStartDate = this.formatDisplayDate(filterData.startDate);
        this.executionEndDate = this.formatDisplayDate(filterData.endDate);
        this.orderService
            .getStatistics({
                startDate: filterData.startDate,
                endDate: filterData.endDate,
                selectAccounts: filterData.selectAccounts,
                selectServices: filterData.selectServices,
            })
            .pipe(first())
            .subscribe((res: OrderStatistics) => {
                this.statisticsForCurrentPeriod = res;
            });

        this.orderService
            .getStatistics({
                startDate: filterData.previousStartDate as string,
                endDate: filterData.previousEndDate as string,
                selectAccounts: filterData.selectAccounts,
                selectServices: filterData.selectServices,
            })
            .pipe(first())
            .subscribe((res: OrderStatistics) => {
                this.statisticsForPreviousPeriod = res;
            });

        // Fetch entities count
        this.accountService
            .getListWithStatistics({
                startDate: filterData.startDate,
                endDate: filterData.endDate,
                selectAccounts: filterData.selectAccounts || [],
                page: 0,
                pageSize: 1000,
            })
            .pipe(first())
            .subscribe((res) => {
                this.totalEntities = res.totalItems || res.items.length;
                this.totalServices = res.items.reduce((sum, item) => sum + (item.countServices || 0), 0);
            });

        // Fetch service statistics for average SLA days
        this.serviceApiService
            .getServiceStatistics({
                startDate: filterData.startDate,
                endDate: filterData.endDate,
                selectAccounts: filterData.selectAccounts || [],
                selectServices: filterData.selectServices || [],
            })
            .pipe(first())
            .subscribe((services) => {
                if (services.length > 0) {
                    const totalDays = services.reduce((sum, s) => sum + (s.averageDays || 0), 0);
                    this.averageSlaDays = Math.round(totalDays / services.length) || 0;
                }
            });
    }

    private formatDisplayDate(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    }
}
