import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { DownloadMenuComponent } from '../../../../shared/components/download-menu/download-menu.component';
import DownloadService from '../../../../shared/services/download.service';
import { TranslateService } from '../../../../data/translate/translate.service';
import {
    F2TableColumnOption,
    F2TableComponent,
    F2TableData,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../shared/components/f2-table/f2-table.component';
import { AccountItemStatistics, AccountService } from '../../../../data/api-services/account/account.service';
import { FiltersOrdersData } from '../../../../data/api-services/order/order.interface';
import { first } from 'rxjs';
import { EntityReportComponent } from './entity-report/entity-report.component';
import { KpiFilterService } from '../../../../data/api-services/kpi-filter.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { ServicesMeetSlaComponent } from '../statistics-of-services/services-meet-sla/services-meet-sla.component';
import { ServicesExceedSlaComponent } from '../statistics-of-services/services-exceed-sla/services-exceed-sla.component';
import { LongestSlaDurationEntitiesComponent } from '../statistics-of-services/longest-sla-duration-entities/longest-sla-duration-entities.component';
import { ServiceApiService, ServiceStatistics } from '../../../../data/api-services/service/service-api.service';

@Component({
    selector: 'app-entity-statistics',
    imports: [DownloadMenuComponent, F2TableComponent, EntityReportComponent, ServicesMeetSlaComponent, ServicesExceedSlaComponent, LongestSlaDurationEntitiesComponent],
    templateUrl: './entity-statistics.component.html',
    styleUrl: './entity-statistics.component.scss',
})
export class EntityStatisticsComponent {
    private readonly accountService = inject(AccountService);
    private readonly serviceApiService = inject(ServiceApiService);
    private readonly translateService = inject(TranslateService);
    private readonly kpiFilterService = inject(KpiFilterService);
    private readonly dialogsService = inject(DialogsService);

    constructor() {
        effect(() => {
            this.requestData(this.kpiFilterService.filterData());
            this.requestServiceStatistics(this.kpiFilterService.filterData());
        });
    }

    entityReport = viewChild.required(EntityReportComponent);
    servicesMeetSla = viewChild.required(ServicesMeetSlaComponent);
    servicesExceedSla = viewChild.required(ServicesExceedSlaComponent);
    longestSlaDurationEntities = viewChild.required(LongestSlaDurationEntitiesComponent);

    reportFormats = ['csv', 'excel'];
    title = signal(this.translateService.getValue('titleEntityStatistics'));

    entityStatistics: AccountItemStatistics[] = [];
    tableData = signal<AccountItemStatistics[]>([]);
    
    serviceStatistics: ServiceStatistics[] = [];

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
                    prepareTableDataToCSV<AccountItemStatistics>(this.entityStatistics, this.columnOptions),
                    `report_most_exceeded_sla_entity_${Date.now()}.csv`
                );
                break;
            case 'excel':
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<AccountItemStatistics>(this.entityStatistics, this.columnOptions),
                    `report_most_exceeded_sla_entity_${Date.now()}.xlsx`
                );
                break;
            default:
                console.log('Unsupported format');
                return;
        }
    }

    requestData(filterDate: FiltersOrdersData): void {
        this.accountService
            .getListWithStatistics({
                selectAccounts: filterDate.selectAccounts || [],
                startDate: filterDate.startDate,
                endDate: filterDate.endDate,
                pageSize: 10000,
                page: 0,
            })
            .pipe(first())
            .subscribe((res) => {
                this.entityStatistics = res.items.sort((a, b) => b.rateExceedSLA - a.rateExceedSLA);
                this.tableData.set(
                    this.entityStatistics
                    // .filter((item) => !!item.countExceedSLA)
                );
            });
    }

    goToDrillDown(item: F2TableData) {
        this.dialogsService.openDrillDownDialog({ accountId: item['accountId'] });
    }

    requestServiceStatistics(filterData: FiltersOrdersData): void {
        this.serviceApiService
            .getServiceStatistics(filterData)
            .pipe(first())
            .subscribe((res: ServiceStatistics[]) => {
                this.serviceStatistics = res;
            });
    }
}
