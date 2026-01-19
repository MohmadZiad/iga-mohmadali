import { Component, computed, inject, input, signal } from '@angular/core';
import { ServiceStatistics } from '../../../../../data/api-services/service/models';
import {
    F2TableColumnOption,
    F2TableComponent,
    F2TableData,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../../shared/components/f2-table/f2-table.component';
import { TranslateService } from '../../../../../data/translate/translate.service';
import { DownloadMenuComponent } from '../../../../../shared/components/download-menu/download-menu.component';
import DownloadService from '../../../../../shared/services/download.service';
import { DialogsService } from '../../../dialogs/dialogs.service';

@Component({
    selector: 'app-services-statistics',
    imports: [F2TableComponent, DownloadMenuComponent],
    templateUrl: './services-completion-statistics.component.html',
    styleUrl: './services-completion-statistics.component.scss',
})
export class ServicesCompletionStatisticsComponent {
    readonly translateService = inject(TranslateService);
    private readonly dialogsService = inject(DialogsService);

    title = signal(this.translateService.getValue('titleStatisticsCompletionServices'));
    reportFormats = ['csv', 'excel'];
    dataServiceStatistics = input.required<ServiceStatistics[]>();
    tableDate = computed(() =>
        this.dataServiceStatistics()
            .filter((item) => !!item.totalOrders && !!item.countCompletedOrders)
            .slice(0, 10)
    );
    readonly columnOptions: F2TableColumnOption[] = [
        {
            key: 'mostDays',
            label: this.translateService.getValue('mostDays'),
        },
        {
            key: 'fewestDays',
            label: this.translateService.getValue('fewestDays'),
        },
        {
            key: 'averageDays',
            label: this.translateService.getValue('averageDays'),
        },
        // {
        //     key: 'isExistsApprovalDependencies',
        //     label: this.translateService.getValue('isExistsApprovalDependencies'),
        // },
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
                    prepareTableDataToCSV<ServiceStatistics>(this.dataServiceStatistics(), this.columnOptions),
                    `report_popular_service${Date.now()}.csv`
                );
                break;
            case 'excel':
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<ServiceStatistics>(this.dataServiceStatistics(), this.columnOptions),
                    `report_popular_service${Date.now()}.xlsx`
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
