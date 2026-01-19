import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatepickerData, F2DatepickerComponent } from '../../../../shared/components/f2-datepicker/f2-datepicker.component';
import { DownloadMenuComponent } from '../../../../shared/components/download-menu/download-menu.component';
import {
    F2TableColumnOption,
    F2TableComponent,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../shared/components/f2-table/f2-table.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { KpiFilterService } from '../../../../data/api-services/kpi-filter.service';
import { FiltersOrdersData, Order, OrderService } from '../../../../data/api-services/order/order.service';
import { TranslateService } from '../../../../data/translate/translate.service';
import { Page } from '../../../../data/interfaces/page.interface';
import { concatMap, from, map, reduce } from 'rxjs';
import DownloadService from '../../../../shared/services/download.service';

export interface DrillDownDialogData {
    accountId: string;
    serviceCode?: string;
    selectOrderStatuses?: string[];
}

@Component({
    selector: 'app-drill-down-dialog',
    imports: [F2DatepickerComponent, DownloadMenuComponent, F2TableComponent, MatPaginator],
    templateUrl: './drill-down-dialog.component.html',
    styleUrl: './drill-down-dialog.component.scss',
})
export class DrillDownDialogComponent {
    private dialogRef = inject(MatDialogRef<DrillDownDialogComponent>);
    private orderService = inject(OrderService);
    private readonly kpiFilterService = inject(KpiFilterService);
    private data: DrillDownDialogData = inject(MAT_DIALOG_DATA);

    searchParameters!: FiltersOrdersData;

    constructor() {
        this.searchParameters = { ...structuredClone(this.kpiFilterService.filterData()), pageSize: 10, page: 0 };
    }

    totalItems = 0;

    readonly translateService = inject(TranslateService);

    tableData = signal<Order[]>([]);

    reportFormats = ['csv', 'excel'];
    title = signal(this.translateService.getValue('drillDown'));

    columnOptions: F2TableColumnOption[] = [
        {
            key: 'comments',
            label: this.translateService.getValue('comments'),
            color: '#ED973B',
        },
        {
            key: 'approvalEntityCode',
            label: this.translateService.getValue('approvalEntityCode'),
        },
        {
            key: 'approvalDependencies',
            label: this.translateService.getValue('approvalDependencies'),
        },
        {
            key: 'applicantType',
            label: this.translateService.getValue('applicantType'),
            color: '#6CCA2D',
        },
        {
            key: 'submissionChannel',
            label: this.translateService.getValue('submissionChannel'),
        },
        {
            key: 'numberOfDays',
            label: this.translateService.getValue('numberOfDays'),
            color: '#999999',
        },
        {
            key: 'orderStatus',
            label: this.translateService.getValue('orderStatus'),
        },
        {
            key: 'completionDate',
            label: this.translateService.getValue('completionDate'),
            color: '#E1251B',
        },
        {
            key: 'submissionDate',
            label: this.translateService.getValue('submissionDate'),
            color: '#308099',
        },
        {
            key: 'registrationNumber',
            label: this.translateService.getValue('registrationNumber'),
        },
        {
            key: 'orderNumber',
            label: this.translateService.getValue('orderNumber'),
        },
        {
            key: 'accountCode',
            label: this.translateService.getValue('entityCode'),
        },
        // {
        //     key: 'entityName',
        //     label: this.translateService.getValue('entityName'),
        // },
        {
            key: 'serviceName',
            label: this.translateService.getValue('serviceName'),
        },
        {
            key: 'serviceCode',
            label: this.translateService.getValue('serviceCode'),
        },
    ];

    downloadReport(format: string) {
        const pageSize = 7000;
        const totalPages = Math.ceil(this.totalItems / pageSize);
        from(Array(totalPages).keys())
            .pipe(
                concatMap((page) => this.orderService.searchOrders({ ...this.searchParameters, page, pageSize: pageSize })),
                map((res) => res.content),
                reduce((acc: Order[], pageData: Order[]) => acc.concat(pageData), [])
            )
            .subscribe((res: Order[]) => {
                switch (format) {
                    case 'csv':
                        DownloadService.downloadCsv(
                            prepareTableDataToCSV<Order>(res, this.columnOptions),
                            `report_drill_down_${Date.now()}.csv`
                        );
                        break;
                    case 'excel':
                        DownloadService.downloadExcel(
                            prepareTableDataToExcel<Order>(res, this.columnOptions),
                            `report_drill_down_${Date.now()}.xlsx`
                        );
                        break;
                    default:
                        console.log('Unsupported format');
                        return;
                }
            });
    }

    fetchData() {
        this.orderService.searchOrders(this.searchParameters).subscribe((res: Page<Order>) => {
            this.totalItems = res.totalItems;
            this.tableData.set(res.content);
        });
    }

    onChangeDateRange(dateRange: DatepickerData) {
        this.searchParameters.page = 0;
        this.searchParameters.startDate = dateRange.startDate;
        this.searchParameters.endDate = dateRange.endDate;
        this.searchParameters.selectAccount = this.data.accountId;
        this.searchParameters.selectAccount = this.data.accountId || '';
        this.searchParameters.selectOrderStatuses = this.data?.selectOrderStatuses || [];

        if (this.data?.serviceCode) {
            this.searchParameters.selectServices = [this.data?.serviceCode];
        }
        this.fetchData();
    }

    onPageEvent(event: PageEvent) {
        this.searchParameters.page = event.pageIndex;
        this.fetchData();
    }
}
