import { Component, computed, inject, input, signal } from '@angular/core';
import {
    F2TableColumnOption,
    F2TableComponent,
    F2TableData,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../../shared/components/f2-table/f2-table.component';
import { TranslateService } from '../../../../../data/translate/translate.service';
import { AccountItemStatistics } from '../../../../../data/api-services/account/models';
import DownloadService from '../../../../../shared/services/download.service';
import { DownloadMenuComponent } from '../../../../../shared/components/download-menu/download-menu.component';
import { getColorByStatus } from '../../../../../shared/utils/general.utils';
import { DialogsService } from '../../../dialogs/dialogs.service';

@Component({
    selector: 'app-entity-report',
    imports: [F2TableComponent, DownloadMenuComponent],
    templateUrl: './entity-report.component.html',
    styleUrl: './entity-report.component.scss',
})
export class EntityReportComponent {
    private readonly translateService = inject(TranslateService);
    private readonly dialogsService = inject(DialogsService);

    entityStatistics = input.required<AccountItemStatistics[]>();

    tableData = computed(() => this.entityStatistics());

    reportFormats = ['csv', 'excel'];
    title = signal(this.translateService.getValue('titleEntityReport'));

    columnOptions: F2TableColumnOption[] = [
        {
            key: 'rateExceedSLA',
            label: this.translateService.getValue('rateExceedSLA'),
            unit: '%',
            color: '#ED973B',
        },
        {
            key: 'countExceedSLA',
            label: this.translateService.getValue('countExceedSLA'),
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
        },
        {
            key: 'rateCompletedOrders',
            label: this.translateService.getValue('rateCompletedOrders'),
            unit: '%',
            color: getColorByStatus('executed/complete'),
        },
        {
            key: 'countCompletedOrders',
            label: this.translateService.getValue('countCompletedOrders'),
        },
        // TODO: Need approve and new design for new status order
        // {
        //     key: 'rateCancelledOrders',
        //     label: this.translateService.getValue('rateCancelledOrders'),
        //     unit: '%',
        //     color: getColorByStatus('cancelled'),
        // },
        // {
        //     key: 'countCancelledOrders',
        //     label: this.translateService.getValue('countCancelledOrders'),
        // },
        {
            key: 'rateRejectedOrders',
            label: this.translateService.getValue('rateRejectedOrders'),
            unit: '%',
            color: getColorByStatus('rejected'),
        },
        {
            key: 'countRejectedOrders',
            label: this.translateService.getValue('countRejectedOrders'),
        },
        {
            key: 'rateReturnedOrders',
            label: this.translateService.getValue('rateReturnedOrders'),
            unit: '%',
            color: getColorByStatus('returned'),
        },
        {
            key: 'countReturnedOrders',
            label: this.translateService.getValue('countReturnedOrders'),
        },
        {
            key: 'rateInProgressOrders',
            label: this.translateService.getValue('rateInProgressOrders'),
            unit: '%',
            color: getColorByStatus('in_progress'),
        },
        {
            key: 'countInProgressOrders',
            label: this.translateService.getValue('countInProgressOrders'),
        },
        {
            key: 'countOrders',
            label: this.translateService.getValue('numberOfRequests'),
        },
        {
            key: 'countServices',
            label: this.translateService.getValue('countServices'),
        },
        {
            key: 'accountName',
            label: this.translateService.getValue('entity'),
        },
    ];

    downloadReport(format: string) {
        switch (format) {
            case 'csv':
                DownloadService.downloadCsv(
                    prepareTableDataToCSV<AccountItemStatistics>(this.entityStatistics(), this.columnOptions),
                    `report_entity_${Date.now()}.csv`
                );
                break;
            case 'excel':
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<AccountItemStatistics>(this.entityStatistics(), this.columnOptions),
                    `report_entity_${Date.now()}.xlsx`
                );
                break;
            default:
                console.log('Unsupported format');
                return;
        }
    }

    goToDrillDown(item: F2TableData) {
        this.dialogsService.openDrillDownDialog({ accountId: item['accountId'] });
    }
}
