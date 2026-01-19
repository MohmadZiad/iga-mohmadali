import { Component, inject, OnDestroy } from '@angular/core';
import { DndDirective } from '../../../shared/directives/dnd.directive';
import { KpiExcelParser, ParseError } from '../../../data/parsers-services/excel/kpi-parser.service';
import DownloadService from '../../../shared/services/download.service';
import { OrderDB, OrderService } from '../../../data/api-services/order/order.service';
import { ReportItem, ReportsService } from '../../../data/api-services/reports/reports.service';
import { concatMap, delay, finalize, from, last } from 'rxjs';
import { chunkArray } from '../../../shared/utils/general.utils';
import { LoadingService } from '../../../loading/loading.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ServiceApiService } from '../../../data/api-services/service/service-api.service';
import { KpiNotificationService } from '../../../data/api-services/kpi-notification.service';
import { MatDialog } from '@angular/material/dialog';
import {
    MissedServicesDialogComponent,
    MissedServicesItem,
} from '../dialogs/missed-services-dialog/missed-services-dialog.component';

@Component({
    selector: 'app-kpi-upload-orders',
    imports: [DndDirective],
    templateUrl: './upload-orders.component.html',
    styleUrl: './upload-orders.component.scss',
})
export class UploadOrdersComponent implements OnDestroy {
    private orderService = inject(OrderService);
    private serviceApiService = inject(ServiceApiService);
    private reportService = inject(ReportsService);
    private loadingService = inject(LoadingService);
    private kpiExcelParser = inject(KpiExcelParser);
    private kpiNotificationService = inject(KpiNotificationService);

    dialog = new MatDialog();

    constructor(private notifications: NotificationsService) {
        this.serviceApiService.getSelfServices().subscribe({
            next: (services) => {
                this.kpiExcelParser.setServiceCodes(services);
            },
            error: (error) => {
                console.log('error :>> ', error);
                this.showMessage('Error: Something went wrong');
            },
        });
    }

    report = new ReportItem();
    fileContent: OrderDB[] = [];

    private showMessage(message: string) {
        this.notifications.show(message);
        this.onClickCancel();
    }

    private loadFile(file?: File) {
        if (!file || this.kpiExcelParser.fileType !== file.type) {
            this.showMessage('Incorrect format file');
            return;
        }

        this.loadingService.loadingOn();

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const fileContent = reader.result as ArrayBuffer;
                if (fileContent) {
                    this.fileContent = await this.kpiExcelParser.parse(fileContent);
                    this.report.filename = file.name;

                    const listMissedServices: MissedServicesItem[] = this.kpiExcelParser.getMissedServices(this.fileContent);
                    if (listMissedServices.length > 0) {
                        this.openNoticeDialog(listMissedServices);
                    }
                }
            } catch (error) {
                console.log('error :>> ', error);
                if (error instanceof ParseError) {
                    this.showMessage(error.message);
                    DownloadService.downloadFile(error.fileURL, file.name);
                } else if (error instanceof Error) {
                    this.showMessage(error.message);
                } else {
                    this.showMessage('Something went wrong');
                }
            } finally {
                this.loadingService.loadingOff();
            }
        };

        reader.readAsArrayBuffer(file);
    }
    fileBrowserHandler(event: Event) {
        this.loadFile((event.target as HTMLInputElement).files?.[0]);
        (event.target as HTMLInputElement).value = '';
    }

    onFileDropped(file?: File) {
        this.loadFile(file);
    }

    async downloadExampleFile() {
        const fileURL = await this.kpiExcelParser.getExampleFileURL();
        DownloadService.downloadFile(fileURL, 'Monthly Report Template.xlsx');
    }

    onClickCancel() {
        this.report = new ReportItem();
        this.fileContent = [];
    }

    // ! TODO: Need move this logic on lambda side.
    onClickUpload() {
        this.loadingService.loadingOn();

        const chunks = chunkArray(this.fileContent, 10000);

        const reportId = crypto.randomUUID();
        this.report.reportId = reportId;

        from(chunks)
            .pipe(
                concatMap((chunk) => this.orderService.insertOrders(chunk).pipe(delay(500))),
                last(),
                concatMap(() => this.reportService.insertReport(this.report)),
                concatMap(() =>
                    this.report.systemNote ? this.kpiNotificationService.sendReminderAboutMissingServices(reportId) : from([])
                ),
                finalize(() => this.loadingService.loadingOff())
            )
            .subscribe({
                next: () => console.log(`Loaded chunk item`),
                complete: () => this.showMessage('Success Upload'),
                error: (error: HttpErrorResponse | Error) => {
                    console.log('error :>> ', error);
                    this.showMessage(error.message || 'Something went wrong. Please try again later.');
                },
            });
    }

    openNoticeDialog(listMissedServices: MissedServicesItem[]) {
        const dialogRef = this.dialog.open(MissedServicesDialogComponent, {
            width: '520px',
            maxHeight: '700px',
            disableClose: false,
            data: {
                listMissedServices: listMissedServices,
                comment: '',
            },
        });

        dialogRef.afterClosed().subscribe((comment) => {
            this.report.comment = comment;
            this.report.setSystemNoteAboutMissedServices(listMissedServices);
            console.log('comment :>> ', {
                filename: this.report.filename,
                comment: this.report.comment,
                system_note: this.report.systemNote,
            });
        });
    }

    ngOnDestroy(): void {
        this.notifications.close();
    }
}
