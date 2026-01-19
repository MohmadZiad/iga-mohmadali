import { Component, computed, inject, input, signal, viewChild } from '@angular/core';

import { F2ChartsComponent, ChartDataItemType, ItemChart } from '../../../../../shared/components/f2-charts/f2-charts.component';
import { DownloadMenuComponent } from '../../../../../shared/components/download-menu/download-menu.component';
import { TranslateService } from '../../../../../data/translate/translate.service';
import { ServiceStatistics } from '../../../../../data/api-services/service/models';
import DownloadService from '../../../../../shared/services/download.service';
import { DialogsService } from '../../../dialogs/dialogs.service';

@Component({
    selector: 'app-longest-completion-services-chart',
    imports: [DownloadMenuComponent, F2ChartsComponent],
    templateUrl: './longest-completion-services-chart.component.html',
    styleUrl: './longest-completion-services-chart.component.scss',
})
export class LongestCompletionServicesChartComponent {
    private translateService = inject(TranslateService);
    private readonly dialogsService = inject(DialogsService);

    title = signal<string>(this.translateService.getValue('titleLongestCompletionServices'));
    childChart = viewChild.required(F2ChartsComponent);

    reportFormats = ['png', 'jpeg', 'csv', 'excel'];
    longestServices = input.required({
        transform: (res: ServiceStatistics[]) => {
            return res
                .concat()
                .filter((item) => !!item.averageDays)
                .sort((a, b) => b.averageDays - a.averageDays);
        },
    });
    longestChartData = computed<ChartDataItemType[]>(() => {
        return this.longestServices()
            .slice(0, 10)
            .map((item, index) => [
                `${item.serviceName}${new Array(index).fill('\u00A0').join('')}`, // ! Needed fix this to identical name services.
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
                this.longestServices().forEach((item, index) => {
                    data.push([item.averageDays, item.serviceName, item.entityName, index + 1]);
                });
                DownloadService.downloadCsv(data, `report_longest_completion_service${Date.now()}.csv`);
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
                this.longestServices().forEach((item, index) => {
                    data.push([item.averageDays, item.serviceName, item.entityName, index + 1]);
                });
                DownloadService.downloadExcel(data, `report_longest_completion_service${Date.now()}.xlsx`);
                break;
            }
            case 'png':
            case 'jpeg': {
                const dataUrl = this.childChart().getChartDataURL(format);
                if (!dataUrl) break;
                DownloadService.downloadFile(dataUrl, `report_longest_completion_service${Date.now()}.${format}`);
                break;
            }
            default:
                console.log('Unsupported format');
                return;
        }
    }
}
