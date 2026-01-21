import { Component, computed, inject, input, signal } from '@angular/core';
import { TranslateService } from '../../../../../data/translate/translate.service';
import { ServiceStatistics } from '../../../../../data/api-services/service/models';
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
    selector: 'app-longest-sla-duration-entities',
    imports: [F2TableComponent, DownloadMenuComponent],
    templateUrl: './longest-sla-duration-entities.component.html',
    styleUrl: './longest-sla-duration-entities.component.scss',
})
export class LongestSlaDurationEntitiesComponent {
    private translateService = inject(TranslateService);
    private readonly dialogsService = inject(DialogsService);

    title = signal(this.translateService.getValue('titleLongestSLADurationEntities'));
    reportFormats = ['csv', 'excel'];

    dataServices = input.required({
        transform: (res: ServiceStatistics[]) => {
            return res
                .concat()
                .filter((item) => !!item.sla && !!item.totalOrders)
                .sort((a, b) => b.sla - a.sla);
        },
    });

    tableData = computed(() => this.dataServices().slice(0, 10));

    readonly columnOptions: F2TableColumnOption[] = [
        {
            key: 'totalOrders',
            label: this.translateService.getValue('numberOfRequests'),
        },
        {
            key: 'sla',
            label: this.translateService.getValue('slaDuration'),
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
                    prepareTableDataToCSV<ServiceStatistics>(this.dataServices(), this.columnOptions),
                    `report_longest_sla_duration_${Date.now()}.csv`
                );
                break;
            case 'excel':
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<ServiceStatistics>(this.dataServices(), this.columnOptions),
                    `report_longest_sla_duration_${Date.now()}.xlsx`
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
        });
    }
}

