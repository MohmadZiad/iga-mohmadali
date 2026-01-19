import { Component, computed, inject, input, signal } from '@angular/core';
// import { ProgressBarComponent } from '../../../../shared/components/progress-bar/progress-bar.component';
import {
    F2TableColumnOption,
    F2TableComponent,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../../shared/components/f2-table/f2-table.component';
import { DownloadMenuComponent } from '../../../../../shared/components/download-menu/download-menu.component';
import { TranslateService } from '../../../../../data/translate/translate.service';
import DownloadService from '../../../../../shared/services/download.service';
import { ServiceStatistics } from '../../../../../data/api-services/service/models';

@Component({
    selector: 'app-entity-most-requested-services',
    imports: [F2TableComponent, DownloadMenuComponent],
    templateUrl: './entity-most-requested-services.component.html',
    styleUrl: './entity-most-requested-services.component.scss',
})
export class EntityMostRequestedServicesComponent {
    readonly translateService = inject(TranslateService);

    title = signal(this.translateService.getValue('titleMostRequestedServices'));
    reportFormats = ['csv', 'excel'];

    tableData = computed(() => this.dataMostRequestedServices().slice(0, 10));
    readonly columnOptions: F2TableColumnOption[] = [
        {
            key: 'countInProgressOrders',
            label: this.translateService.getValue('countInProgressOrders'),
        },
        {
            key: 'countRejectedOrders',
            label: this.translateService.getValue('countRejectedOrders'),
        },
        // TODO: Need approve and new design for new status order
        // {
        //     key: 'countCancelledOrders',
        //     label: this.translateService.getValue('countCancelledOrders'),
        // },
        {
            key: 'countReturnedOrders',
            label: this.translateService.getValue('countReturnedOrders'),
        },
        {
            key: 'countCompletedOrders',
            label: this.translateService.getValue('countCompletedOrders'),
        },
        {
            key: 'totalOrders',
            label: this.translateService.getValue('numberOfRequests'),
        },
        {
            key: 'serviceName',
            label: this.translateService.getValue('service'),
            isBig: true,
        },
    ];
    dataMostRequestedServices = input.required({
        transform: (res: ServiceStatistics[]) => {
            return res.concat().sort((a, b) => b.totalOrders - a.totalOrders);
        },
    });

    downloadReport(format: string) {
        switch (format) {
            case 'csv':
                DownloadService.downloadCsv(
                    prepareTableDataToCSV<ServiceStatistics>(this.dataMostRequestedServices(), this.columnOptions),
                    `entity_most_requested_services_report_${Date.now()}.csv`
                );
                break;
            case 'excel':
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<ServiceStatistics>(this.dataMostRequestedServices(), this.columnOptions),
                    `entity_most_requested_services_report_${Date.now()}.xlsx`
                );
                break;
            default:
                console.log('Unsupported format');
                return;
        }
    }
}
