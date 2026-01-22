import { Component, computed, inject, input, signal, viewChild } from '@angular/core';

import { F2ChartsComponent, ChartDataItemType, ItemChart } from '../../../../../shared/components/f2-charts/f2-charts.component';
import { DownloadMenuComponent } from '../../../../../shared/components/download-menu/download-menu.component';
import { TranslateService } from '../../../../../data/translate/translate.service';
import { ServiceStatistics } from '../../../../../data/api-services/service/models';
import DownloadService from '../../../../../shared/services/download.service';
import { DialogsService } from '../../../dialogs/dialogs.service';

@Component({
    selector: 'app-fasted-completion-services-chart',
    imports: [DownloadMenuComponent, F2ChartsComponent],
    templateUrl: './fasted-completion-services-chart.component.html',
    styleUrl: './fasted-completion-services-chart.component.scss',
})
export class FastedCompletionServicesChartComponent {
    private translateService = inject(TranslateService);
    private readonly dialogsService = inject(DialogsService);

    title = signal<string>(this.translateService.getValue('titleFastedCompletionServices'));

    childChart = viewChild.required(F2ChartsComponent);

    reportFormats = ['png', 'jpeg', 'csv', 'excel'];

    fastedServices = input.required({
        transform: (res: ServiceStatistics[]) => {
            return res.concat().sort((a, b) => a.averageDays - b.averageDays);
        },
    });
    fastedChartData = computed<ChartDataItemType[]>(() => {
        return this.fastedServices().map((item, index) => [
            `${item.serviceName} (${item.entityName || index + 1})`,
            item.averageDays,
            item.serviceCode,
            item.accountId,
        ]);
    });

    dimensions: string[] = [this.translateService.getValue('service'), this.translateService.getValue('numberOfDays')];

    goToDrillDown(item: ItemChart) {
        this.dialogsService.openDrillDownDialog({ accountId: item.accountId, serviceCode: item.serviceCode });
    }

    downloadReport(format: string) {
        switch (format) {
            case 'csv': {
                const data: (string | number)[][] = [
                    [
                        this.translateService.getValue('numberOfDays'),
                        this.translateService.getValue('service'),
                        this.translateService.getValue('entity'),
                        this.translateService.getValue('ranking'),
                    ],
                ];
                this.fastedServices().forEach((item, index) => {
                    data.push([item.averageDays, item.serviceName, item.entityName, index + 1]);
                });
                DownloadService.downloadCsv(data, `report_fasted_completion_service${Date.now()}.csv`);
                break;
            }
            case 'excel': {
                const data: (string | number)[][] = [
                    [
                        this.translateService.getValue('numberOfDays'),
                        this.translateService.getValue('service'),
                        this.translateService.getValue('entity'),
                        this.translateService.getValue('ranking'),
                    ],
                ];
                this.fastedServices().forEach((item, index) => {
                    data.push([item.averageDays, item.serviceName, item.entityName, index + 1]);
                });
                DownloadService.downloadExcel(data, `report_fasted_completion_service${Date.now()}.xlsx`);
                break;
            }
            case 'png':
            case 'jpeg': {
                const dataUrl = this.childChart().getChartDataURL(format);
                if (!dataUrl) break;
                DownloadService.downloadFile(dataUrl, `report_fasted_completion_service${Date.now()}.${format}`);
                break;
            }
            default:
                console.log('Unsupported format');
                return;
        }
    }
}
