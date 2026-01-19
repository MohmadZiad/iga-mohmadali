import { Component, inject, model, OnInit } from '@angular/core';
import { DatePipe, AsyncPipe } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

import { AccountItem, AccountService } from '../../../../data/api-services/account/account.service';
import { ServiceApiService, ServiceItem } from '../../../../data/api-services/service/service-api.service';
import { TranslateService } from '../../../../data/translate/translate.service';
import { getPreviousDatesRange } from '../../../../shared/utils/date.utils';
import { KpiFilterService } from '../../../../data/api-services/kpi-filter.service';

@Component({
    selector: 'app-filter-modal',
    imports: [
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatDateRangeInput,
        MatDateRangePicker,
        MatIconModule,
        AsyncPipe,
    ],
    templateUrl: './filter-modal.component.html',
    styleUrl: './filter-modal.component.scss',
    providers: [provideNativeDateAdapter(), DatePipe],
})
export class FilterModalDialogComponent implements OnInit {
    readonly translateService = inject(TranslateService);
    private readonly kpiFilterService = inject(KpiFilterService);

    accountList$: Observable<AccountItem[]>;
    serviceList$: Observable<ServiceItem[]>;
    range: FormGroup<{
        start: FormControl<Date | null>;
        end: FormControl<Date | null>;
    }>;

    constructor(
        private readonly serviceApiService: ServiceApiService,
        private readonly accountService: AccountService,
        private datePipe: DatePipe
    ) {
        this.accountList$ = this.accountService.getList();
        this.serviceList$ = this.serviceApiService.getListServices();

        const { startDate, endDate } = this.kpiFilterService.filterData();
        this.range = new FormGroup({
            start: new FormControl(new Date(startDate), Validators.required),
            end: new FormControl(new Date(endDate), Validators.required),
        });
    }

    private formatDate(date: Date) {
        return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
    }

    readonly popupOpen = model(true);

    selectedServices: string[] = [];
    selectedAccounts: string[] = [];

    clearSelectedServices() {
        if (this.selectedAccounts.length) {
            this.selectedServices = [];
        }
    }

    onApplyFilters(): void {
        if (!this.range.value.end || !this.range.value.start) {
            return;
        }

        const previousRange = getPreviousDatesRange(this.range.value.start, this.range.value.end);
        this.kpiFilterService.filterData.set({
            ...this.kpiFilterService.filterData(),
            startDate: this.formatDate(this.range.value.start),
            endDate: this.formatDate(this.range.value.end),
            previousStartDate: this.formatDate(previousRange.start),
            previousEndDate: this.formatDate(previousRange.end),
            selectServices: this.selectedServices,
            selectAccounts: this.selectedAccounts,
        });
        this.popupOpen.set(false);
    }

    ngOnInit() {
        this.onApplyFilters();
    }
}
