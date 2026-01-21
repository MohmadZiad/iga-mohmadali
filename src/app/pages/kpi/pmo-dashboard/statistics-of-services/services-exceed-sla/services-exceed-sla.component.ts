import { Component, computed, inject, input, signal } from '@angular/core';
import { ServiceStatistics } from '../../../../../data/api-services/service/models';
import { TranslateService } from '../../../../../data/translate/translate.service';
import {
    F2TableColumnOption,
    F2TableComponent,
    F2TableData,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../../shared/components/f2-table/f2-table.component';
import DownloadService from '../../../../../shared/services/download.service';
import { DownloadMenuComponent } from '../../../../../shared/components/download-menu/download-menu.component';
import { DialogsService } from '../../../dialogs/dialogs.service';

@Component({
    selector: 'app-services-exceed-sla',
    imports: [F2TableComponent, DownloadMenuComponent],
    templateUrl: './services-exceed-sla.component.html',
    styleUrl: './services-exceed-sla.component.scss',
})
export class ServicesExceedSlaComponent {
    readonly translateService = inject(TranslateService);
    private readonly dialogsService = inject(DialogsService);

    title = signal(this.translateService.getValue('titleServiceExceedSLA'));
    reportFormats = ['csv', 'excel'];
    dataServicesExceedSLA = input.required({
        transform: (res: ServiceStatistics[]) => {
            return res
                .concat()
                .filter((item) => !!item.countExceedSLA)
                .sort((a, b) => b.rateExceedSLA - a.rateExceedSLA);
        },
    });
    tableData = computed(() => this.dataServicesExceedSLA().slice(0, 10));
    readonly columnOptions: F2TableColumnOption[] = [
        {
            key: 'rangeDays',
            label: this.translateService.getValue('durationPeriod'),
        },
        {
            key: 'isExistsApprovalDependencies',
            label: this.translateService.getValue('isExistsApprovalDependencies'),
        },
        {
            key: 'averageDays',
            label: this.translateService.getValue('averageDays'),
        },
        {
            key: 'rateExceedSLA',
            label: this.translateService.getValue('rateExceedSLA'),
            unit: '%',
            color: '#ED973B',
        },
        {
            key: 'countExceedSLA',
            label: this.translateService.getValue('countExceedSLA'),
            color: '#0D2646',
        },
        {
            key: 'sla',
            label: this.translateService.getValue('SLA'),
        },
        {
            key: 'countCompletedOrders',
            label: this.translateService.getValue('countCompletedOrders'),
        },
        {
            key: 'serviceName',
            label: this.translateService.getValue('service'),
        },
        {
            key: 'entityName',
            label: this.translateService.getValue('entity'),
        },
    ];

    downloadReport(format: string) {
        switch (format) {
            case 'csv':
                DownloadService.downloadCsv(
                    prepareTableDataToCSV<ServiceStatistics>(this.dataServicesExceedSLA(), this.columnOptions),
                    `report_exceed_sla_service${Date.now()}.csv`
                );
                break;
            case 'excel':
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<ServiceStatistics>(this.dataServicesExceedSLA(), this.columnOptions),
                    `report_exceed_sla_service${Date.now()}.xlsx`
                );
                break;
            default:
                console.log('Unsupported format');
                return;
        }
    }

    goToDrillDown(item: F2TableData) {
        this.dialogsService.openDrillDownDialog({
            accountId: item['accountId'],
            serviceCode: item['serviceCode'],
            selectOrderStatuses: ['executed/complete'],
        });
    }
}
