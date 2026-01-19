import { Component, computed, inject, input } from '@angular/core';

import { DownloadMenuComponent } from '../../../../../shared/components/download-menu/download-menu.component';
import DownloadService from '../../../../../shared/services/download.service';
import { TranslateService } from '../../../../../data/translate/translate.service';
import { ServiceStatistics } from '../../../../../data/api-services/service/models';
import {
    F2TableColumnOption,
    F2TableComponent,
    F2TableData,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../../shared/components/f2-table/f2-table.component';
import { getColorByStatus } from '../../../../../shared/utils/general.utils';
import { DialogsService } from '../../../dialogs/dialogs.service';

@Component({
    selector: 'app-top-services-by-status',
    imports: [F2TableComponent, DownloadMenuComponent],
    templateUrl: './top-services-by-status.component.html',
    styleUrl: './top-services-by-status.component.scss',
})
export class TopServicesByStatusComponent {
    readonly translateService = inject(TranslateService);
    private readonly dialogsService = inject(DialogsService);

    status = input.required<string>();
    title = input.required<string>();
    requestsLabel = input.required<string>();
    reportFormats = ['csv', 'excel'];

    topServicesByStatus = input.required({
        transform: (res: ServiceStatistics[]) => {
            return res
                .concat()
                .sort(
                    (a: ServiceStatistics, b: ServiceStatistics) =>
                        b.getStatisticsByStatus(this.status()).rate - a.getStatisticsByStatus(this.status()).rate
                );
        },
    });

    tableData = computed(() =>
        this.topServicesByStatus()
            .slice(0, 10)
            .map((item) => {
                const { rate, count } = item.getStatisticsByStatus(this.status());
                return {
                    rate: rate,
                    count: count,
                    totalOrders: item.totalOrders,
                    serviceName: item.serviceName,
                    account: item.account,
                    accountId: item.accountId,
                    serviceCode: item.serviceCode,
                };
            })
    );
    readonly columnOptions = computed<F2TableColumnOption[]>(() => {
        return [
            {
                key: 'rate',
                label: this.translateService.getValue('percentage'),
                displayMode: 'circleProgress',
                color: getColorByStatus(this.status()),
                unit: '%',
            },
            {
                key: 'count',
                label: this.requestsLabel(),
            },
            {
                key: 'totalOrders',
                label: this.translateService.getValue('totalRequests'),
            },
            {
                key: 'serviceName',
                label: this.translateService.getValue('service'),
                isBig: true,
            },
            {
                key: 'account',
                label: this.translateService.getValue('entity'),
                displayMode: 'accountName',
            },
        ];
    });

    downloadReport(format: string) {
        const exportData = this.topServicesByStatus().map((item) => {
            const { rate, count } = item.getStatisticsByStatus(this.status());
            return {
                rate: rate,
                count: count,
                totalOrders: item.totalOrders,
                serviceName: item.serviceName,
                account: item.entityName,
            };
        });
        switch (format) {
            case 'csv': {
                DownloadService.downloadCsv(
                    prepareTableDataToCSV<Record<string, number | string>>(exportData, this.columnOptions()),
                    `report_top_${this.status()}_service${Date.now()}.csv`
                );
                break;
            }
            case 'excel': {
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<Record<string, number | string>>(exportData, this.columnOptions()),
                    `report_top_${this.status()}_service${Date.now()}.xlsx`
                );
                break;
            }
            default:
                console.log('Unsupported format');
                return;
        }
    }

    goToDrillDown(item: F2TableData) {
        this.dialogsService.openDrillDownDialog({
            accountId: item['accountId'],
            serviceCode: item['serviceCode'],
            selectOrderStatuses: [this.status()],
        });
    }
}
