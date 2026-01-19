import { Component, computed, inject, input, signal, viewChild } from '@angular/core';
import {
    F2TableColumnOption,
    F2TableComponent,
    F2TableData,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../../shared/components/f2-table/f2-table.component';
import { F2ChartsComponent } from '../../../../../shared/components/f2-charts/f2-charts.component';
import { DownloadMenuComponent } from '../../../../../shared/components/download-menu/download-menu.component';
import { TranslateService } from '../../../../../data/translate/translate.service';
import DownloadService from '../../../../../shared/services/download.service';
import { ServiceStatistics } from '../../../../../data/api-services/service/models';
import { DialogsService } from '../../../dialogs/dialogs.service';

@Component({
    selector: 'app-most-requested-services',
    imports: [F2ChartsComponent, F2TableComponent, DownloadMenuComponent],
    templateUrl: './most-requested-services.component.html',
    styleUrl: './most-requested-services.component.scss',
})
export class MostRequestedServicesComponent {
    private readonly translateService = inject(TranslateService);
    private readonly dialogsService = inject(DialogsService);

    chartComponent = viewChild.required(F2ChartsComponent);

    title = signal(this.translateService.getValue('titleMostRequestedServices'));
    reportFormats = ['png', 'jpeg', 'csv', 'excel'];

    dimensions: string[] = [this.translateService.getValue('service'), this.translateService.getValue('numberOfRequests')];
    chartDataPopularServices = computed(() =>
        this.dataMostRequestedServices()
            .slice(0, 10)
            .map((item: ServiceStatistics, index) => [
                `${item.serviceName}${new Array(index).fill('\u00A0').join('')}`,
                item.totalOrders,
                item.serviceCode,
                item.accountId,
            ])
    );
    dataMostRequestedServices = input.required({
        transform: (res: ServiceStatistics[]) => {
            return res.concat().sort((a, b) => b.totalOrders - a.totalOrders);
        },
    });
    tableDate = computed(() => this.dataMostRequestedServices().slice(0, 10));

    readonly columnOptions: F2TableColumnOption[] = [
        // {
        //     key: 'countInProgressOrders',
        //     label: this.translateService.getValue('countInProgressOrders'),
        // },
        // {
        //     key: 'countRejectedOrders',
        //     label: this.translateService.getValue('countRejectedOrders'),
        // },
        // {
        //     key: 'countReturnedOrders',
        //     label: this.translateService.getValue('countReturnedOrders'),
        // },
        // {
        //     key: 'countCompletedOrders',
        //     label: this.translateService.getValue('countCompletedOrders'),
        // },
        {
            key: 'totalOrders',
            label: this.translateService.getValue('numberOfRequests'),
        },
        {
            key: 'serviceName',
            label: this.translateService.getValue('service'),
            isBig: true,
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
                    prepareTableDataToCSV<ServiceStatistics>(this.dataMostRequestedServices(), this.columnOptions),
                    `report_popular_service${Date.now()}.csv`
                );
                break;
            case 'excel':
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<ServiceStatistics>(this.dataMostRequestedServices(), this.columnOptions),
                    `report_popular_service${Date.now()}.xlsx`
                );
                break;
            case 'png':
            case 'jpeg': {
                const dataUrl = this.chartComponent().getChartDataURL(format);
                if (!dataUrl) break;
                DownloadService.downloadFile(dataUrl, `report_popular_service${Date.now()}.${format}`);
                break;
            }
            default:
                console.log('Unsupported format');
                return;
        }
    }

    goToDrillDown(item: F2TableData) {
        this.dialogsService.openDrillDownDialog({ accountId: item['accountId'], serviceCode: item['serviceCode'] });
    }
}
