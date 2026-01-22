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

interface ChartItem {
    service: ServiceStatistics;
    fewestPct: number;
    averagePct: number;
    mostPct: number;
    rangeBottomPct: number;
    rangeHeightPct: number;
}

@Component({
    selector: 'app-services-statistics',
    imports: [F2TableComponent, DownloadMenuComponent, FormsModule, CommonModule],
    templateUrl: './services-completion-statistics.component.html',
    styleUrl: './services-completion-statistics.component.scss',
})
export class ServicesCompletionStatisticsComponent {
    readonly translateService = inject(TranslateService);
    private readonly dialogsService = inject(DialogsService);

    title = signal(this.translateService.getValue('titleLongestCompletionServices'));
    reportFormats = ['csv', 'excel'];
    dataServiceStatistics = input.required<ServiceStatistics[]>();

    selectedDayType = signal<'average' | 'most' | 'fewest'>('most');
    selectedService = signal<ServiceStatistics | null>(null);
    activeDayType = signal<'all' | 'average' | 'most' | 'fewest'>('all');

    tableDate = computed(() => {
        const all = this.dataServiceStatistics();
        const sorted = [...all].sort((a, b) => (b.mostDays ?? 0) - (a.mostDays ?? 0));
        return sorted.slice(0, 10);
    });

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
            key: 'entityName',
            label: this.translateService.getValue('entity'),
        },
        {
            key: 'serviceName',
            label: this.translateService.getValue('service'),
            isBig: true,
        },
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

    chartMaxDays = computed(() => {
        const items = this.tableDate();
        if (!items.length) return 0;

        return Math.max(...items.map((s) => Math.max(s.mostDays ?? 0, s.averageDays ?? 0, s.fewestDays ?? 0)));
    });

    chartItems = computed<ChartItem[]>(() => {
        const items = this.tableDate();
        const max = this.chartMaxDays();

        if (!max || max === 0) {
            return items.map((service) => ({
                service,
                fewestPct: 10,
                averagePct: 40,
                mostPct: 85,
                rangeBottomPct: 10,
                rangeHeightPct: 75,
            }));
        }

        const result = items.map((service) => {
            const fewestVal = service.fewestDays ?? 0;
            const mostVal = service.mostDays ?? 0;
            const avgVal = service.averageDays ?? 0;

            const fewestPct = (fewestVal / max) * 70 + 10;
            const mostPct = (mostVal / max) * 70 + 10;
            const avgPct = (avgVal / max) * 70 + 10;

            const minPct = Math.min(fewestPct, mostPct);
            const maxPct = Math.max(fewestPct, mostPct);
            const rangeHeight = Math.max(maxPct - minPct, 5);

            return {
                service,
                fewestPct,
                averagePct: avgPct,
                mostPct,
                rangeBottomPct: minPct,
                rangeHeightPct: rangeHeight,
            };
        });

        return result;
    });

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
            (s) => s.serviceCode === item['serviceCode'] && s.accountId === item['accountId']
        );
        if (service) {
            this.selectedService.set(service);
        }
    }

    onChartItemClick(service: ServiceStatistics) {
        this.selectedService.set(service);
        this.goToDrillDown({
            serviceCode: service.serviceCode,
            accountId: service.accountId,
            serviceName: service.serviceName,
            entityName: service.entityName,
        } as F2TableData);
    }

    setActiveDayType(type: 'all' | 'average' | 'most' | 'fewest') {
        const current = this.activeDayType();
        this.activeDayType.set(current === type ? 'all' : type);
    }

    getStrokeDashArray(): string {
        const service = this.selectedService();
        if (!service) return '0 314.16';

        const maxDays = Math.max(service.averageDays, service.mostDays, service.fewestDays);
        const currentValue = this.selectedValue();
        const circumference = 2 * Math.PI * 50; // r = 50
        const percentage = maxDays > 0 ? currentValue / maxDays : 0;
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
