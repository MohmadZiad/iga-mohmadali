import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';

import { IgaReportsComponent } from '../iga-reports/iga-reports.component';
import { KpiFilterService } from '../../../../data/api-services/kpi-filter.service';
import { ProjectService } from '../../../../data/api-services/project/project.service';
import { ProjectItem } from '../../../../data/api-services/project/project.interface';

@Component({
    selector: 'app-view-project',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatIconModule,
        MatInputModule,
        IgaReportsComponent,
    ],
    providers: [provideNativeDateAdapter(), DatePipe],
    templateUrl: './view-project.component.html',
    styleUrl: './view-project.component.scss',
})
export class ViewProjectComponent implements OnInit {
    private readonly kpiFilterService = inject(KpiFilterService);
    private readonly projectService = inject(ProjectService);

    projectOptions = signal<ProjectItem[]>([]);
    selectedProjectId = '';
    selectedMonthOption = 'current';

    range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    constructor() {
        this.setCurrentMonth();
    }

    ngOnInit() {
        this.loadProjects();
    }

    loadProjects() {
        this.projectService.getProjects().subscribe({
            next: (projects) => {
                this.projectOptions.set(projects);
                if (projects.length > 0) {
                    this.selectedProjectId = projects[0].projectId;
                }
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

    private setCurrentMonth() {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        this.range.patchValue({ start, end });
        this.updateFilter(start, end);
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
