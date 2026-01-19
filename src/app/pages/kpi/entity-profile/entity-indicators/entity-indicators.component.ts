import { Component, inject, input, OnInit, signal } from '@angular/core';
import { BehaviorSubject, first } from 'rxjs';

import { CircleProgressBarComponent } from '../../../../shared/components/circle-progress-bar/circle-progress-bar.component';
import { ProgressBarComponent } from '../../../../shared/components/progress-bar/progress-bar.component';
import { IndicatorsServicesComponent } from '../../../../shared/modules/indicators-services/indicators-services.component';
import { FiltersOrdersData, OrderService, OrderStatistics } from '../../../../data/api-services/order/order.service';
import { DownloadMenuComponent } from '../../../../shared/components/download-menu/download-menu.component';
import { TranslateService } from '../../../../data/translate/translate.service';
import DownloadService from '../../../../shared/services/download.service';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-entity-indicators',
    imports: [CircleProgressBarComponent, ProgressBarComponent, IndicatorsServicesComponent, DownloadMenuComponent, DecimalPipe],
    templateUrl: './entity-indicators.component.html',
    styleUrl: './entity-indicators.component.scss',
})
export class EntityIndicatorsComponent implements OnInit {
    readonly translateService = inject(TranslateService);
    private orderService = inject(OrderService);

    title = signal(this.translateService.getValue('performanceLevel'));
    reportFormats = ['csv', 'excel'];

    entityName = input.required<string>();
    applyFilterData$ = input.required<BehaviorSubject<FiltersOrdersData | null>>();

    entityOrdersStatistics: OrderStatistics = new OrderStatistics({});

    downloadReport(format: string) {
        switch (format) {
            case 'csv': {
                DownloadService.downloadCsv(
                    [
                        {
                            [this.translateService.getValue('totalServiceRequests')]: this.entityOrdersStatistics.total,
                            [this.translateService.getValue('completedServiceRequests')]: this.entityOrdersStatistics.completed,
                            [this.translateService.getValue('performances.individual')]:
                                this.entityOrdersStatistics.individualRate + '%',
                            [this.translateService.getValue('performances.individualCount')]:
                                this.entityOrdersStatistics.individualCount,
                            [this.translateService.getValue('performances.businessOwner')]:
                                this.entityOrdersStatistics.businessOwnerRate + '%',
                            [this.translateService.getValue('performances.businessOwnerCount')]:
                                this.entityOrdersStatistics.businessOwnerCount,
                            [this.translateService.getValue('performances.electronic')]:
                                this.entityOrdersStatistics.electronicRate + '%',
                            [this.translateService.getValue('performances.electronicCount')]:
                                this.entityOrdersStatistics.electronicCount,
                            [this.translateService.getValue('performances.inPerson')]:
                                this.entityOrdersStatistics.inPersonRate + '%',
                            [this.translateService.getValue('performances.inPersonCount')]:
                                this.entityOrdersStatistics.inPersonCount,
                            [this.translateService.getValue('performances.approvalDependencies')]:
                                this.entityOrdersStatistics.approvalDependenciesRate + '%',
                            [this.translateService.getValue('performances.approvalDependenciesCount')]:
                                this.entityOrdersStatistics.approvalDependencies,
                            [this.translateService.getValue('performances.compliance')]:
                                this.entityOrdersStatistics.complianceRate + '%',
                            [this.translateService.getValue('performances.complianceCount')]:
                                this.entityOrdersStatistics.completedWithinSla,
                        },
                    ],
                    `performance_report_${Date.now()}.csv`
                );
                break;
            }
            case 'excel': {
                const data: (string | number)[][] = [
                    [
                        this.translateService.getValue('totalServiceRequests'),
                        this.translateService.getValue('completedServiceRequests'),
                        this.translateService.getValue('performances.individual'),
                        this.translateService.getValue('performances.individualCount'),
                        this.translateService.getValue('performances.businessOwner'),
                        this.translateService.getValue('performances.businessOwnerCount'),
                        this.translateService.getValue('performances.electronic'),
                        this.translateService.getValue('performances.electronicCount'),
                        this.translateService.getValue('performances.inPerson'),
                        this.translateService.getValue('performances.inPersonCount'),
                        this.translateService.getValue('performances.approvalDependencies'),
                        this.translateService.getValue('performances.approvalDependenciesCount'),
                        this.translateService.getValue('performances.compliance'),
                        this.translateService.getValue('performances.complianceCount'),
                    ],
                    [
                        this.entityOrdersStatistics.total,
                        this.entityOrdersStatistics.completed,
                        this.entityOrdersStatistics.individualRate + '%',
                        this.entityOrdersStatistics.individualCount,
                        this.entityOrdersStatistics.businessOwnerRate + '%',
                        this.entityOrdersStatistics.businessOwnerCount,
                        this.entityOrdersStatistics.electronicRate + '%',
                        this.entityOrdersStatistics.electronicCount,
                        this.entityOrdersStatistics.inPersonRate + '%',
                        this.entityOrdersStatistics.inPersonCount,
                        this.entityOrdersStatistics.approvalDependenciesRate + '%',
                        this.entityOrdersStatistics.approvalDependencies,
                        this.entityOrdersStatistics.complianceRate + '%',
                        this.entityOrdersStatistics.completedWithinSla,
                    ],
                ];
                DownloadService.downloadExcel(data, `performance_report_${Date.now()}.xlsx`);
                break;
            }
            default:
                console.log('Unsupported format');
                return;
        }
    }

    requestData(filterData: FiltersOrdersData) {
        this.orderService
            .getStatistics({
                startDate: filterData.startDate,
                endDate: filterData.endDate,
                selectAccount: filterData.selectAccount,
            })
            .pipe(first())
            .subscribe((res: OrderStatistics) => {
                this.entityOrdersStatistics = res;
            });
    }

    ngOnInit(): void {
        this.applyFilterData$().subscribe((filterDate: FiltersOrdersData | null) => {
            if (filterDate) {
                this.requestData(filterDate);
            }
        });
    }
}
