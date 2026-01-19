import { Component, inject, signal } from '@angular/core';

import { TranslateService } from '../../../data/translate/translate.service';
import {
    // prepareTableDataToCSV,
    // prepareTableDataToExcel,
    F2TableColumnOption,
} from '../../../shared/components/f2-table/f2-table.component';
// import DownloadService from '../../../shared/services/download.service';
import { F2TableComponent } from '../../../shared/components/f2-table/f2-table.component';
import { DownloadMenuComponent } from '../../../shared/components/download-menu/download-menu.component';
import { OrderService, FiltersOrdersData, Order } from '../../../data/api-services/order/order.service';
import { DatepickerData, F2DatepickerComponent } from '../../../shared/components/f2-datepicker/f2-datepicker.component';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { KpiFilterService } from '../../../data/api-services/kpi-filter.service';

@Component({
    selector: 'app-drill-down',
    imports: [F2TableComponent, DownloadMenuComponent, F2DatepickerComponent, MatPaginatorModule],
    templateUrl: './drill-down.component.html',
    styleUrl: './drill-down.component.scss',
})
export class DrillDownComponent {
    private orderService = inject(OrderService);
    private readonly kpiFilterService = inject(KpiFilterService);

    searchParameters: FiltersOrdersData = this.kpiFilterService.filterData();

    pageSize = 10;
    totalItems = 0;
    page = 0;

    constructor(private router: Router) {
        const nav = this.router.getCurrentNavigation();
        if (nav) {
            const receivedData = nav.extras.state;
            this.searchParameters.selectAccount = receivedData?.['accountId'] || '';
            this.searchParameters.selectOrderStatuses = receivedData?.['selectOrderStatuses'] || [];

            if (receivedData?.['serviceCode']) {
                this.searchParameters.selectServices = [receivedData?.['serviceCode']];
            }
        }
    }

    readonly translateService = inject(TranslateService);

    orders: Order[] = [];
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
            label: this.translateService.getValue('approvalEntity'),
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
            label: this.translateService.getValue('statusOrder'),
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
        console.log('format :>> ', format);
        // switch (format) {
        //     case 'csv':
        //         DownloadService.downloadCsv(
        //             prepareTableDataToCSV<AccountItemStatistics>(this.entityStatistics(), this.columnOptions),
        //             `report_entity_${Date.now()}.csv`
        //         );
        //         break;
        //     case 'excel':
        //         DownloadService.downloadExcel(
        //             prepareTableDataToExcel<AccountItemStatistics>(this.entityStatistics(), this.columnOptions),
        //             `report_entity_${Date.now()}.xlsx`
        //         );
        //         break;
        //     default:
        //         console.log('Unsupported format');
        //         return;
        // }
    }

    onChangeDateRange(dateRange: DatepickerData) {
        console.log('dateRange :>> ', dateRange);
        // this.searchParameters.startDate = dateRange.startDate;
        // this.searchParameters.endDate = dateRange.endDate;
        // this.orderService.searchOrders(this.searchParameters).subscribe((res: Order[]) => {
        //     this.orders = res;
        //     this.totalItems = this.orders.length;
        //     this.tableData.set(this.orders.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize));
        // });
    }

    onPageEvent(event: PageEvent) {
        this.page = event.pageIndex;
        this.tableData.set(this.orders.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize));
    }
}
