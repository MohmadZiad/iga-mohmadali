import { Component, inject } from '@angular/core';
import { TranslateService } from '../../../../data/translate/translate.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { AccountItem, AccountService } from '../../../../data/api-services/account/account.service';
import { ServiceApiService, ServiceItem } from '../../../../data/api-services/service/service-api.service';
import { F2TableColumnOption, F2TableComponent } from '../../../../shared/components/f2-table/f2-table.component';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { FiltersData } from '../../../../data/interfaces/filter.interface';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';

@Component({
    selector: 'app-service-codes',
    imports: [F2TableComponent, MatPaginator, MatFormField, MatLabel, MatSelect, MatOption],
    templateUrl: './service-codes.component.html',
    styleUrl: './service-codes.component.scss',
})
export class ServiceCodesComponent {
    readonly translateService = inject(TranslateService);
    private readonly accountService = inject(AccountService);
    private readonly serviceApiService = inject(ServiceApiService);
    private readonly dialogService = inject(DialogsService);
    private notifications = inject(NotificationsService);

    accountList!: AccountItem[];

    constructor() {
        this.fetchData();

        this.accountService.getList().subscribe((response: AccountItem[]) => {
            if (!response) return;
            this.accountList = response;
        });
    }

    columnOptionsReports: F2TableColumnOption[] = [
        {
            key: 'serviceId',
            label: this.translateService.getValue('serviceCode'),
        },
        {
            key: 'serviceName',
            label: this.translateService.getValue('serviceName'),
        },
        {
            key: 'sla',
            label: this.translateService.getValue('sla'),
        },
    ];

    rowActions = [
        {
            name: 'Edit',
            icon: '/assets/icons/edit.svg',
            onClick: (item: ServiceItem) => {
                console.log('Edit -> onClick -> element:', item);
                this.openDialogToAddNewService(item);
            },
        },
        {
            name: 'Delete',
            icon: '/assets/icons/trush.svg',
            onClick: (item: ServiceItem) => {
                console.log('Delete -> onClick -> element:', item.serviceId);
                this.serviceApiService.deleteService(item.serviceId).subscribe({
                    complete: () => {
                        this.notifications.show('Success');
                        this.fetchData();
                    },
                    error: (res) => {
                        console.log('error :>> ', res);
                        this.notifications.show(res.error?.error?.message || 'Something went wrong. Please try again later.');
                    },
                });
            },
        },
    ];
    tableData: ServiceItem[] = [];
    serviceList: ServiceItem[] = [];
    searchLabel: string = this.translateService.getValue('search');

    totalItems = 0;
    filterData: FiltersData = {
        startDate: '',
        endDate: '',
        selectAccounts: [],
        page: 0,
        pageSize: 10,
        search: '',
    };

    fetchData() {
        this.serviceApiService.getServicesByPage(this.filterData).subscribe((res) => {
            this.tableData = res.content;
            this.totalItems = res.totalItems;
        });
    }

    onPageEvent(event: PageEvent) {
        this.filterData.page = event.pageIndex;
        this.fetchData();
    }

    onInputSearch(value: string) {
        this.filterData.page = 0;
        this.filterData.search = value;
        this.fetchData();
    }

    openDialogToAddNewService(serviceItem?: ServiceItem) {
        const dialogRef = this.dialogService.openAdminCreateServiceDialog({ accountList: this.accountList, serviceItem });

        dialogRef.afterClosed().subscribe((response: { serviceItem: ServiceItem }) => {
            if (!response) return;
            this.serviceApiService.insertService(response.serviceItem).subscribe({
                complete: () => {
                    this.notifications.show('Success');
                    this.fetchData();
                },
                error: (res) => {
                    this.notifications.show(res.error?.error?.message || 'Something went wrong. Please try again later.');
                },
            });
        });
    }
}
