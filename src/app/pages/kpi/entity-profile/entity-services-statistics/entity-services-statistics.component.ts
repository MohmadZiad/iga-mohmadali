import { Component, inject, input, OnInit, signal, viewChild } from '@angular/core';
import {
    F2TableColumnOption,
    F2TableComponent,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../shared/components/f2-table/f2-table.component';
import { BehaviorSubject, first } from 'rxjs';
import { DownloadMenuComponent } from '../../../../shared/components/download-menu/download-menu.component';
import { TranslateService } from '../../../../data/translate/translate.service';
import DownloadService from '../../../../shared/services/download.service';
import { EntityServicesExceedSlaComponent } from './entity-services-exceed-sla/entity-services-exceed-sla.component';
import { EntityServicesMeetSlaComponent } from './entity-services-meet-sla/entity-services-meet-sla.component';
import { EntityMostRequestedServicesComponent } from './entity-most-requested-services/entity-most-requested-services.component';
import { ServiceApiService, ServiceStatistics } from '../../../../data/api-services/service/service-api.service';
import { FiltersData } from '../../../../data/interfaces/filter.interface';

@Component({
    selector: 'app-entity-services-statistics',
    imports: [
        F2TableComponent,
        DownloadMenuComponent,
        EntityServicesExceedSlaComponent,
        EntityServicesMeetSlaComponent,
        EntityMostRequestedServicesComponent,
    ],
    templateUrl: './entity-services-statistics.component.html',
    styleUrl: './entity-services-statistics.component.scss',
})
export class EntityServicesStatisticsComponent implements OnInit {
    readonly translateService = inject(TranslateService);
    private serviceApiService = inject(ServiceApiService);

    servicesMeetSla = viewChild.required(EntityServicesMeetSlaComponent);
    servicesExceedSla = viewChild.required(EntityServicesExceedSlaComponent);
    mostRequestedServices = viewChild.required(EntityMostRequestedServicesComponent);

    readonly applyFilterData$ = input.required<BehaviorSubject<FiltersData | null>>();

    title = signal(this.translateService.getValue('titleStatisticsCompletionServices'));
    reportFormats = ['csv', 'excel'];

    dataServiceStatistics: ServiceStatistics[] = [];
    tableData = signal<ServiceStatistics[]>([]);
    readonly columnOptions: F2TableColumnOption[] = [
        {
            key: 'mostDays',
            label: this.translateService.getValue('mostDays'),
        },
        {
            key: 'fewestDays',
            label: this.translateService.getValue('fewestDays'),
        },
        {
            key: 'averageDays',
            label: this.translateService.getValue('averageDays'),
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
                    prepareTableDataToCSV<ServiceStatistics>(this.dataServiceStatistics, this.columnOptions),
                    `report_popular_service${Date.now()}.csv`
                );
                break;
            case 'excel':
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<ServiceStatistics>(this.dataServiceStatistics, this.columnOptions),
                    `report_popular_service${Date.now()}.xlsx`
                );
                break;
            default:
                console.log('Unsupported format');
                return;
        }
    }

    requestData(filterData: FiltersData) {
        this.serviceApiService
            .getServiceStatistics(filterData)
            .pipe(first())
            .subscribe((res: ServiceStatistics[]) => {
                this.dataServiceStatistics = res;
                this.tableData.set(this.dataServiceStatistics.slice(0, 10));
            });
    }

    ngOnInit(): void {
        this.applyFilterData$().subscribe((filterData) => {
            if (filterData) {
                this.requestData(filterData);
            }
        });
    }
}
