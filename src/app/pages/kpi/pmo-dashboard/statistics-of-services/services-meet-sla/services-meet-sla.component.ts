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
    selector: 'app-services-meet-sla',
    imports: [F2TableComponent, DownloadMenuComponent],
    templateUrl: './services-meet-sla.component.html',
    styleUrl: './services-meet-sla.component.scss',
})
export class ServicesMeetSlaComponent {
    private translateService = inject(TranslateService);
    private readonly dialogsService = inject(DialogsService);

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
    tableData = computed(() => this.dataServicesMeetSLA().slice(0, 10));
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

    goToDrillDown(item: F2TableData) {
        this.dialogsService.openDrillDownDialog({
            accountId: item['accountId'],
            serviceCode: item['serviceCode'],
            selectOrderStatuses: ['executed/complete'],
        });
    }
}
