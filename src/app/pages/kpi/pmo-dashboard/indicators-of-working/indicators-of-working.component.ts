import { Component, effect, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { OrderService, OrderStatistics, FiltersOrdersData } from '../../../../data/api-services/order/order.service';
import { first } from 'rxjs';
import { IndicatorsServicesComponent } from '../../../../shared/modules/indicators-services/indicators-services.component';
import { TranslateService } from '../../../../data/translate/translate.service';
import { calculatePercentage, getDaysDifference } from '../../../../shared/utils/general.utils';
import { KpiFilterService } from '../../../../data/api-services/kpi-filter.service';

@Component({
    selector: 'app-indicators-of-working',
    imports: [IndicatorsServicesComponent, DecimalPipe],
    templateUrl: './indicators-of-working.component.html',
    styleUrl: './indicators-of-working.component.scss',
})
export class IndicatorsOFWorkingComponent {
    private readonly orderService = inject(OrderService);
    private readonly kpiFilterService = inject(KpiFilterService);
    readonly translateService = inject(TranslateService);

    constructor() {
        effect(() => {
            this.requestData(this.kpiFilterService.filterData());
        });
    }

    statisticsForCurrentPeriod: OrderStatistics = new OrderStatistics({});

    statisticsForPreviousPeriod: OrderStatistics = new OrderStatistics({});

    differenceDays = 0;

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
                //TODO: Need refactor interface
                startDate: filterData.previousStartDate as string,
                endDate: filterData.previousEndDate as string,
                selectAccounts: filterData.selectAccounts,
                selectServices: filterData.selectServices,
            })
            .pipe(first())
            .subscribe((res: OrderStatistics) => {
                this.statisticsForPreviousPeriod = res;
            });
    }
}
