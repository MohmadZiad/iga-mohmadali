import { Component, computed, inject, viewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

import { BehaviorSubject } from 'rxjs';

import { EntityIndicatorsComponent } from './entity-indicators/entity-indicators.component';
import { EntityServicesStatisticsComponent } from './entity-services-statistics/entity-services-statistics.component';
import { EntityReportingComponent } from './entity-reporting/entity-reporting.component';

import { AccountService } from '../../../data/api-services/account/account.service';
import { FiltersOrdersData } from '../../../data/api-services/order/order.service';
import { DatepickerData, F2DatepickerComponent } from '../../../shared/components/f2-datepicker/f2-datepicker.component';
import { TranslateService } from '../../../data/translate/translate.service';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
    selector: 'app-entity-profile',
    imports: [
        MatSelectModule,
        MatFormFieldModule,
        MatMenuModule,
        EntityIndicatorsComponent,
        EntityServicesStatisticsComponent,
        EntityReportingComponent,
        F2DatepickerComponent,
        AsyncPipe,
    ],
    templateUrl: './entity-profile.component.html',
    styleUrl: './entity-profile.component.scss',
})
export class EntityProfileComponent {
    readonly translateService = inject(TranslateService);
    private readonly route = inject(ActivatedRoute);
    private accountService = inject(AccountService);

    private entityIndicators = viewChild.required(EntityIndicatorsComponent);
    private entityServicesStatistics = viewChild.required(EntityServicesStatisticsComponent);

    menuItems = computed(() => {
        return [
            this.entityIndicators(),
            this.entityServicesStatistics().mostRequestedServices(),
            this.entityServicesStatistics(),
            this.entityServicesStatistics().servicesExceedSla(),
            this.entityServicesStatistics().servicesMeetSla(),
        ].filter(Boolean);
    });

    filterData: FiltersOrdersData = {
        startDate: '',
        endDate: '',
        selectAccount: this.route.snapshot.paramMap.get('entityId') || '',
    };

    selectedEntityName = '';

    selectedAccount(event: MatOptionSelectionChange<string>, name: string) {
        if (!event.isUserInput && this.selectedEntityName) return;
        this.selectedEntityName = name;
    }

    accountList$ = this.accountService.getList();

    applyFilterData$ = new BehaviorSubject<FiltersOrdersData | null>(null);

    confirmFiltersData() {
        if (
            !this.filterData.startDate ||
            !this.filterData.endDate ||
            !this.filterData.selectAccount ||
            !this.filterData.previousStartDate ||
            !this.filterData.previousEndDate
        ) {
            console.warn("Filter data isn't confirmed");
            return;
        }

        this.applyFilterData$.next(this.filterData);
    }

    onChangeDateRange(eventData: DatepickerData) {
        if (this.filterData.startDate === eventData.startDate && this.filterData.endDate === eventData.endDate) {
            return;
        }
        this.filterData.startDate = eventData.startDate;
        this.filterData.endDate = eventData.endDate;
        this.filterData.previousStartDate = eventData.previousStartDate;
        this.filterData.previousEndDate = eventData.previousEndDate;

        this.confirmFiltersData();
    }
}
