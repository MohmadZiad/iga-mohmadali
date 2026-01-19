import { Component, effect, inject } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import {
    F2TableColumnOption,
    F2TableComponent,
    F2TableData,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../shared/components/f2-table/f2-table.component';
import { ReportItem, ReportsService } from '../../../../data/api-services/reports/reports.service';
import { Page } from '../../../../data/interfaces/page.interface';
import { TranslateService } from '../../../../data/translate/translate.service';
import DownloadService from '../../../../shared/services/download.service';
import { DownloadMenuComponent } from '../../../../shared/components/download-menu/download-menu.component';
import { MatDialog } from '@angular/material/dialog';
import { MissedServicesDialogComponent } from '../../dialogs/missed-services-dialog/missed-services-dialog.component';
import { KpiFilterService } from '../../../../data/api-services/kpi-filter.service';

@Component({
    selector: 'app-pmo-entity-reporting',
    imports: [F2TableComponent, MatPaginatorModule, DownloadMenuComponent],
    templateUrl: './entity-reporting.component.html',
    styleUrl: './entity-reporting.component.scss',
})
export class EntityReportingComponent {
    private dialog = new MatDialog();
    readonly translateService = inject(TranslateService);
    private serviceReports = inject(ReportsService);
    private readonly kpiFilterService = inject(KpiFilterService);

    constructor() {
        effect(() => {
            console.log(this.kpiFilterService.filterData());
            this.requestData();
            this.getAccountsListWithoutReports();
        });
    }

    totalItems = 0;
    accountsWithoutReports: ReportItem[] = [];
    page = 0;
    pageSize = 5;

    reportFormats = ['csv', 'excel'];

    displayedReports: ReportItem[] = [];
    dataReports: ReportItem[] = [];
    readonly columnOptionsReports: F2TableColumnOption[] = [
        {
            key: 'existsSystemNote',
            label: this.translateService.getValue('systemNote'),
        },
        {
            key: 'filename',
            label: this.translateService.getValue('filename'),
        },
        {
            key: 'dateString',
            label: this.translateService.getValue('downloadDate'),
        },
        {
            key: 'state',
            label: this.translateService.getValue('reportState'),
        },
        {
            key: 'entityName',
            label: this.translateService.getValue('entity'),
        },
        {
            key: 'monthString',
            label: this.translateService.getValue('reportMonth'),
        },
    ];
    searchLabel = this.translateService.getValue('search');

    openSystemNoteModal(report: F2TableData) {
        if (!(report as ReportItem).listMissedServices.length) {
            return;
        }

        this.dialog.open(MissedServicesDialogComponent, {
            width: '520px',
            maxHeight: '700px',
            disableClose: false,
            data: {
                viewMode: true,
                listMissedServices: (report as ReportItem).listMissedServices,
                comment: (report as ReportItem).comment,
            },
        });
    }
    downloadReport(format: string) {
        switch (format) {
            case 'csv':
                DownloadService.downloadCsv(
                    prepareTableDataToCSV<ReportItem>(this.dataReports, this.columnOptionsReports),
                    `report_monthly_${Date.now()}.csv`
                );
                break;
            case 'excel':
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<ReportItem>(this.dataReports, this.columnOptionsReports),
                    `report_monthly_${Date.now()}.xlsx`
                );
                break;
            default:
                console.log('Unsupported format');
                return;
        }
    }

    onPageEvent(event: PageEvent) {
        this.page = event.pageIndex;
        this.displayedReports = this.dataReports.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
    }

    onInputSearch(value: string) {
        this.kpiFilterService.filterData.set({
            ...this.kpiFilterService.filterData(),

            search: value,
        });

        this.page = 0;
        this.requestData();
    }

    requestData() {
        this.serviceReports
            .getList(this.kpiFilterService.filterData())
            .pipe()
            .subscribe((res: Page<ReportItem>) => {
                this.dataReports = res.content;
                this.displayedReports = this.dataReports.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
                this.totalItems = res.totalItems;
            });
    }

    getAccountsListWithoutReports() {
        this.serviceReports.getListWithoutReports(this.kpiFilterService.filterData()).subscribe((res: ReportItem[]) => {
            this.accountsWithoutReports = res;
        });
    }
}
