import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ServiceStatistics } from '../../../../../data/api-services/service/models';
import {
    F2TableColumnOption,
    F2TableComponent,
    F2TableData,
    prepareTableDataToCSV,
    prepareTableDataToExcel,
} from '../../../../../shared/components/f2-table/f2-table.component';
import { TranslateService } from '../../../../../data/translate/translate.service';
import { DownloadMenuComponent } from '../../../../../shared/components/download-menu/download-menu.component';
import DownloadService from '../../../../../shared/services/download.service';
import { DialogsService } from '../../../dialogs/dialogs.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-services-statistics',
    imports: [F2TableComponent, DownloadMenuComponent, FormsModule, CommonModule],
    templateUrl: './services-completion-statistics.component.html',
    styleUrl: './services-completion-statistics.component.scss',
})
export class ServicesCompletionStatisticsComponent {
    readonly translateService = inject(TranslateService);
    private readonly dialogsService = inject(DialogsService);

    title = signal(this.translateService.getValue('titleStatisticsCompletionServices'));
    reportFormats = ['csv', 'excel'];
    dataServiceStatistics = input.required<ServiceStatistics[]>();
    
    selectedDayType = signal<'average' | 'most' | 'fewest'>('most');
    selectedService = signal<ServiceStatistics | null>(null);
    
    tableDate = computed(() =>
        this.dataServiceStatistics()
            .filter((item) => !!item.totalOrders && !!item.countCompletedOrders)
            .slice(0, 10)
    );
    
    constructor() {
        // تحديد الخدمة الأولى تلقائياً عند تحميل البيانات
        effect(() => {
            const filtered = this.tableDate();
            if (filtered.length > 0 && !this.selectedService()) {
                this.selectedService.set(filtered[0]);
            }
        });
    }
    readonly columnOptions: F2TableColumnOption[] = [
        {
            key: 'averageDays',
            label: this.translateService.getValue('averageDays'),
        },
        {
            key: 'fewestDays',
            label: this.translateService.getValue('fewestDays'),
        },
        {
            key: 'mostDays',
            label: this.translateService.getValue('mostDays'),
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
                    prepareTableDataToCSV<ServiceStatistics>(this.dataServiceStatistics(), this.columnOptions),
                    `report_popular_service${Date.now()}.csv`
                );
                break;
            case 'excel':
                DownloadService.downloadExcel(
                    prepareTableDataToExcel<ServiceStatistics>(this.dataServiceStatistics(), this.columnOptions),
                    `report_popular_service${Date.now()}.xlsx`
                );
                break;
            default:
                console.log('Unsupported format');
                return;
        }
    }

    selectedValue = computed(() => {
        const service = this.selectedService();
        if (!service) return 0;
        
        switch (this.selectedDayType()) {
            case 'average':
                return service.averageDays;
            case 'most':
                return service.mostDays;
            case 'fewest':
                return service.fewestDays;
            default:
                return 0;
        }
    });

    onServiceSelect(item: F2TableData) {
        const service = this.dataServiceStatistics().find(
            s => s.serviceCode === item['serviceCode'] && s.accountId === item['accountId']
        );
        if (service) {
            this.selectedService.set(service);
        }
    }

    getStrokeDashArray(): string {
        const service = this.selectedService();
        if (!service) return '0 314.16';
        
        const maxDays = Math.max(service.averageDays, service.mostDays, service.fewestDays);
        const currentValue = this.selectedValue();
        const circumference = 2 * Math.PI * 50; // r = 50
        const percentage = maxDays > 0 ? (currentValue / maxDays) : 0;
        const dashLength = circumference * percentage;
        
        return `${dashLength} ${circumference}`;
    }

    onDayTypeChange(type: 'average' | 'most' | 'fewest') {
        this.selectedDayType.set(type);
    }

    goToDrillDown(item: F2TableData) {
        this.dialogsService.openDrillDownDialog({
            accountId: item['accountId'],
            serviceCode: item['serviceCode'],
            selectOrderStatuses: ['executed/complete'],
        });
    }
}
