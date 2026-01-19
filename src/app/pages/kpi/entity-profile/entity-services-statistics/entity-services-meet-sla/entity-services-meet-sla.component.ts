import { Component, computed, inject, input, signal } from '@angular/core';

import {
    F2TableColumnOption,
    F2TableComponent,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../../shared/components/f2-table/f2-table.component';
import { DownloadMenuComponent } from '../../../../../shared/components/download-menu/download-menu.component';
import { TranslateService } from '../../../../../data/translate/translate.service';
import { ServiceStatistics } from '../../../../../data/api-services/service/models';
import DownloadService from '../../../../../shared/services/download.service';

@Component({
    selector: 'app-entity-services-meet-sla',
    imports: [F2TableComponent, DownloadMenuComponent],
    templateUrl: './entity-services-meet-sla.component.html',
    styleUrl: './entity-services-meet-sla.component.scss',
})
export class EntityServicesMeetSlaComponent {
    private translateService = inject(TranslateService);

    title = signal(this.translateService.getValue('titleServiceMeetSLA'));
    reportFormats = ['csv', 'excel'];
    dataServicesMeetSLA = input.required({
        transform: (res: ServiceStatistics[]) => {
            return res
                .concat()
                .filter((item) => !!item.countMeetSLA)
                .sort((a: ServiceStatistics, b: ServiceStatistics) => b.rateMeetSLA - a.rateMeetSLA);
        },
    });
    tableDate = computed(() => this.dataServicesMeetSLA().slice(0, 10));
    readonly columnOptions: F2TableColumnOption[] = [
        {
            key: 'rangeDays',
            label: this.translateService.getValue('durationPeriod'),
        },
        {
            key: 'averageDays',
            label: this.translateService.getValue('averageDays'),
        },
        {
            key: 'rateMeetSLA',
            label: this.translateService.getValue('rateMeetSLA'),
            unit: '%',
            color: '#72A64A',
        },
        {
            key: 'countMeetSLA',
            label: this.translateService.getValue('countMeetSLA'),
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
            key: 'isExistsApprovalDependencies',
            label: this.translateService.getValue('isExistsApprovalDependencies'),
        },
        {
            key: 'serviceName',
            label: this.translateService.getValue('service'),
            isBig: true,
        },
    ];

    downloadReport(format: string) {
        switch (format) {
            case 'csv':
                DownloadService.downloadCsv(
                    prepareTableDataToCSV<ServiceStatistics>(this.dataServicesMeetSLA(), this.columnOptions),
                    `report_meet_sla_service${Date.now()}.csv`
                );
                break;
            case 'excel':
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<ServiceStatistics>(this.dataServicesMeetSLA(), this.columnOptions),
                    `report_meet_sla_service${Date.now()}.xlsx`
                );
                break;
            default:
                console.log('Unsupported format');
                return;
        }
    }
}
