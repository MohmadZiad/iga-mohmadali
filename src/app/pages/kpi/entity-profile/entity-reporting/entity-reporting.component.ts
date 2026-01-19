import { Component, inject, input, OnInit } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import {
    F2TableColumnOption,
    F2TableComponent,
    F2TableData,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../shared/components/f2-table/f2-table.component';
import { BehaviorSubject, first } from 'rxjs';
import { FiltersOrdersData } from '../../../../data/api-services/order/order.service';
import { FilterReportData, ReportItem, ReportsService } from '../../../../data/api-services/reports/reports.service';
import { Page } from '../../../../data/interfaces/page.interface';
import { TranslateService } from '../../../../data/translate/translate.service';
import DownloadService from '../../../../shared/services/download.service';
import { DownloadMenuComponent } from '../../../../shared/components/download-menu/download-menu.component';
import { MissedServicesDialogComponent } from '../../dialogs/missed-services-dialog/missed-services-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-entity-reporting',
    imports: [F2TableComponent, MatPaginatorModule, DownloadMenuComponent],
    templateUrl: './entity-reporting.component.html',
    styleUrl: './entity-reporting.component.scss',
})
export class EntityReportingComponent implements OnInit {
    private dialog = new MatDialog();
    readonly translateService = inject(TranslateService);
    private serviceReports = inject(ReportsService);
    applyFilterData$ = input.required<BehaviorSubject<FiltersOrdersData | null>>();

    totalItems = 0;

    filterData: FilterReportData = {
        selectAccount: '',
        searchUserName: '',
        startDate: '',
        endDate: '',
    };

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
            key: 'userName',
            label: this.translateService.getValue('employeeName'),
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

    onInputSearch(value: string) {
        this.filterData.searchUserName = value;
        this.page = 0;
        this.requestData();
    }

    onPageEvent(event: PageEvent) {
        this.page = event.pageIndex;
        this.displayedReports = this.dataReports.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
    }

    requestData() {
        this.serviceReports
            .getList(this.filterData)
            .pipe(first())
            .subscribe((res: Page<ReportItem>) => {
                this.dataReports = res.content;
                this.displayedReports = this.dataReports.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
                this.totalItems = res.totalItems;
            });
    }

    ngOnInit(): void {
        this.applyFilterData$().subscribe((filterData: FiltersOrdersData | null) => {
            if (filterData) {
                this.filterData = filterData;
                this.page = 0;
                this.pageSize = 5;

                this.requestData();
            }
        });
    }
}
