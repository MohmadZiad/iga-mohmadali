//Angular
import { Component, computed, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

//Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';

//Common components
import { F2PopupComponent } from '../../../../shared/components/f2-popup/f2-popup.component';

//Local components (from pmo-dashboard)
import { IndicatorsOFWorkingComponent } from '../../pmo-dashboard/indicators-of-working/indicators-of-working.component';
import { FilterModalDialogComponent } from '../../pmo-dashboard/filter-modal/filter-modal.component';
import { StatisticsOfServicesComponent } from '../../pmo-dashboard/statistics-of-services/statistics-of-services.component';
import { TranslateService } from '../../../../data/translate/translate.service';
import { EntityStatisticsComponent } from '../../pmo-dashboard/entity-statistics/entity-statistics.component';
import { EntityReportingComponent } from '../../pmo-dashboard/entity-reporting/entity-reporting.component';
import { KpiFilterService } from '../../../../data/api-services/kpi-filter.service';
import { ProjectService } from '../../../../data/api-services/project/project.service';
import { ProjectItem } from '../../../../data/api-services/project/project.interface';

@Component({
    selector: 'app-view-project',
    imports: [
        MatMenuModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatIconModule,
        MatInputModule,
        IndicatorsOFWorkingComponent,
        F2PopupComponent,
        FilterModalDialogComponent,
        StatisticsOfServicesComponent,
        EntityStatisticsComponent,
        EntityReportingComponent,
    ],
    providers: [provideNativeDateAdapter(), DatePipe],
    templateUrl: './view-project.component.html',
    styleUrl: './view-project.component.scss',
})
export class ViewProjectComponent implements OnInit {
    readonly translateService = inject(TranslateService);
    private readonly kpiFilterService = inject(KpiFilterService);
    private readonly projectService = inject(ProjectService);

    private entityStatistics = viewChild.required(EntityStatisticsComponent);
    private statisticsOfServices = viewChild.required(StatisticsOfServicesComponent);

    projectOptions = signal<ProjectItem[]>([]);
    selectedProjectId = '';
    selectedMonthOption = 'previous';

    range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    menuItems = computed(() => {
        return [
            this.entityStatistics(),
            this.entityStatistics().entityReport(),
            this.entityStatistics().servicesMeetSla(),
            this.entityStatistics().servicesExceedSla(),
            this.statisticsOfServices().fastedCompletionServices(),
            this.statisticsOfServices().longestCompletionServices(),
            this.statisticsOfServices(),
            this.statisticsOfServices().servicesCompletionStatistics(),
            this.statisticsOfServices().mostRequestedServices(),
            ...this.statisticsOfServices().topServicesByStatus(),
        ].filter(Boolean);
    });

    filterPopupOpen = false;
    selectedPeriod = computed(() => {
        const { startDate, endDate } = this.kpiFilterService.filterData();
        return `${startDate} - ${endDate}`;
    });

    ngOnInit() {
        this.loadProjects();
    }

    loadProjects() {
        this.projectService.getProjects().subscribe({
            next: (projects) => {
                this.projectOptions.set(projects);
            },
            error: (err) => {
                console.error('Error loading projects:', err);
            },
        });
    }

    onProjectChange(projectId: string) {
        this.selectedProjectId = projectId;
        console.log('Selected project:', projectId);
    }

    onMonthOptionChange(option: string) {
        this.selectedMonthOption = option;

        const now = new Date();
        let start: Date;
        let end: Date;

        if (option === 'previous') {
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0);
        } else if (option === 'next') {
            start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        } else {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        this.range.patchValue({ start, end });
        this.updateFilter(start, end);
    }

    onDateRangeChange() {
        const start = this.range.value.start;
        const end = this.range.value.end;

        if (start && end) {
            this.updateFilter(start, end);
        }
    }

    exportReport() {
        console.log('Export report clicked');
    }

    openPopup() {
        this.filterPopupOpen = true;
    }

    private updateFilter(start: Date, end: Date) {
        const formatDate = (d: Date) => {
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${year}-${month}-${day}`;
        };

        this.kpiFilterService.filterData.set({
            ...this.kpiFilterService.filterData(),
            startDate: formatDate(start),
            endDate: formatDate(end),
        });
    }
}
