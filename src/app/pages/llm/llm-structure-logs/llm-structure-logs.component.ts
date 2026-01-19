import { Component, inject, ViewChild } from '@angular/core';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { PageRequest, Sort } from '../../../data/interfaces/page.interface';
import { DateTime } from 'luxon';
import { PaginatedTableOptions } from '../../../data/interfaces/paginated-table.interface';
import { LlmLogFilter, LlmLogService } from '../../../data/api-services/llm-log.service';
import { LlmLog } from '../../../data/interfaces/llm-log.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DatepickerData, F2DatepickerComponent } from '../../../shared/components/f2-datepicker/f2-datepicker.component';

@Component({
    selector: 'app-llm-structure-logs',
    imports: [PaginatedTableComponent, F2DatepickerComponent],
    templateUrl: './llm-structure-logs.component.html',
    styleUrl: './llm-structure-logs.component.scss',
})
export class LlmStructureLogsComponent {
    llmLogService = inject(LlmLogService);
    private readonly route = inject(ActivatedRoute);
    router = inject(Router);
    @ViewChild(PaginatedTableComponent) table!: PaginatedTableComponent;

    llmStructureId = this.route.parent?.snapshot.paramMap.get('structureId');

    tableOptions = {
        endpoint: (request: PageRequest<LlmLog>, filter: LlmLogFilter) => this.llmLogService.getList(request, filter),
        columns: [
            {
                property: 'createdAt',
                label: 'Date & Time',
                nowrap: true,
                format: (value: DateTime) => {
                    return value.toFormat('M/d/yy, h:mm a');
                },
            },
            {
                property: 'question',
                label: 'Question',
            },
            {
                property: 'answer',
                label: 'Answer',
            },
            {
                property: 'sources',
                label: 'Sources',
                format: (value: string[]) => {
                    return value.join('\n');
                },
            },
        ],
        initialSort: {
            property: 'createdAt',
            order: 'desc',
        } as Sort<LlmLog>,
        initialFilter: {
            search: '',
            llmStructureId: this.llmStructureId,
        },
        pageSize: 10,
        paginator: true,
        search: true,
        reload: true,
    } as PaginatedTableOptions<LlmLog, LlmLogFilter>;

    onChangeDateRange(event: DatepickerData) {
        const startDate = DateTime.fromFormat(event.startDate, 'yyyy-MM-dd');
        const endDate = DateTime.fromFormat(event.endDate, 'yyyy-MM-dd').endOf('day');
        this.tableOptions.initialFilter.startDate = startDate;
        this.tableOptions.initialFilter.endDate = endDate;
        this.table?.data?.filterBy({
            startDate,
            endDate,
        });
    }

    goBack() {
        this.router.navigate(['/llm/structures']);
    }
}
