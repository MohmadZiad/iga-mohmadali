import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { first } from 'rxjs';

import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { DatepickerData, F2DatepickerComponent } from '../../../shared/components/f2-datepicker/f2-datepicker.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { F2TableColumnOption, F2TableComponent, F2TableData } from '../../../shared/components/f2-table/f2-table.component';
import { AccountItemStatistics, AccountService, FilterAccountData } from '../../../data/api-services/account/account.service';
import { UserService } from '../../../data/api-services/user/user.service';
import { TranslateService } from '../../../data/translate/translate.service';

@Component({
    selector: 'app-entity-list',
    imports: [F2DatepickerComponent, MatFormFieldModule, MatSelectModule, F2TableComponent, MatPaginatorModule, AsyncPipe],
    templateUrl: './entity-list.component.html',
    styleUrl: './entity-list.component.scss',
})
export class EntityListComponent {
    readonly translateService = inject(TranslateService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    readonly accountService = inject(AccountService);

    constructor(private readonly userService: UserService) {
        if (!this.userService.isRootAccountUser) {
            this.router.navigate([this.userService.authUser?.userAccountId], { relativeTo: this.route });
        }
    }

    columnOptionsReports: F2TableColumnOption[] = [
        // {
        //     key: 'profileName',
        //     label: this.translateService.getValue('profile'),
        // },
        {
            key: 'rateCompletedOrders',
            label: this.translateService.getValue('performance'),
            unit: '%',
        },
        {
            key: 'countServices',
            label: this.translateService.getValue('countServices'),
        },
        {
            key: 'countOrders',
            label: this.translateService.getValue('numberOfRequests'),
        },
        {
            key: 'accountName',
            label: this.translateService.getValue('governmentAgency'),
        },
    ];
    dataReports: AccountItemStatistics[] = [];
    searchLabel: string = this.translateService.getValue('search');

    accountList$ = this.accountService.getList();
    totalItems = 0;
    filterData: FilterAccountData = {
        startDate: '',
        endDate: '',
        selectAccounts: [],
        page: 0,
        pageSize: 10,
        search: '',
    };

    goToDetailsEntity(item: F2TableData) {
        this.router.navigate([(item as AccountItemStatistics).accountId], { relativeTo: this.route });
    }

    confirmFiltersData() {
        this.accountService
            .getListWithStatistics(this.filterData)
            .pipe(first())
            .subscribe((res) => {
                this.dataReports = res.items;
                this.totalItems = res.totalItems;
            });
    }
    onChangeDateRange(event: DatepickerData) {
        this.filterData.startDate = event.startDate;
        this.filterData.endDate = event.endDate;
        this.confirmFiltersData();
    }

    onPageEvent(event: PageEvent) {
        this.filterData.page = event.pageIndex;
        this.confirmFiltersData();
    }
    onInputSearch(value: string) {
        this.filterData.search = value;
        this.filterData.page = 0;
        this.confirmFiltersData();
    }
}
