import { Component, inject, ViewChild } from '@angular/core';
import { LlmDataSourceFilter, LlmDataSourceService } from '../../../data/api-services/llm-data-source.service';
import { PageRequest, Sort } from '../../../data/interfaces/page.interface';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { PaginatedTableColumn, PaginatedTableOptions } from '../../../data/interfaces/paginated-table.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LlmDataSourceDialogComponent } from '../llm-data-source-dialog/llm-data-source-dialog.component';
import { LlmDataSource } from '../../../data/interfaces/llm-data-source.interface';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-llm-data-sources',
    imports: [PaginatedTableComponent, MatDialogModule],
    templateUrl: './llm-data-sources.component.html',
    styleUrl: './llm-data-sources.component.scss',
})
export class LlmDataSourcesComponent {
    llmDataSourceService = inject(LlmDataSourceService);
    dialog = new MatDialog();
    router = inject(Router);
    @ViewChild(PaginatedTableComponent) table!: PaginatedTableComponent;

    tableOptions = {
        endpoint: (request: PageRequest<LlmDataSource>, filter: LlmDataSourceFilter) =>
            this.llmDataSourceService.getList(request, filter),
        columns: [
            {
                property: 'name',
                label: 'Data Source Name',
                clickable: true,
            },
            {
                property: 'createdAt',
                label: 'Created',
                format: (value: DateTime) => {
                    return value.toFormat('M/d/yy, h:mm a');
                },
            },
        ],
        actions: [
            {
                name: 'Edit',
                icon: '/assets/icons/edit.svg',
                onClick: (data: { element: LlmDataSource }) => {
                    console.log('Edit -> onClick -> element:', data.element);
                    this.updateLlmDataSource(data.element);
                },
            },
            {
                name: 'Delete',
                icon: '/assets/icons/trush.svg',
                onClick: (data: { element: LlmDataSource }) => {
                    console.log('Delete -> onClick -> element:', data.element);
                    this.deleteLlmDataSource(data.element.llmDataSourceId!);
                },
            },
        ],
        initialSort: {
            property: 'name',
            order: 'asc',
        } as Sort<LlmDataSource>,
        initialFilter: {
            search: '',
        },
        pageSize: 10,
        paginator: true,
        search: true,
        reload: true,
    } as PaginatedTableOptions<LlmDataSource, LlmDataSourceFilter>;

    addLlmDataSource() {
        const dialogRef = this.dialog.open(LlmDataSourceDialogComponent, {
            width: '520px',
            disableClose: false,
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res?.submitted) {
                this.table.data.refresh();
            }
        });
    }

    columnClicked(data: { element: LlmDataSource; column: PaginatedTableColumn }) {
        console.log('columnClicked -> element:', data.element);
        this.router.navigate([`/llm/data-sources/${data.element.llmDataSourceId}/details`]);
    }

    updateLlmDataSource(llmDataSource: LlmDataSource) {
        this.llmDataSourceService.get(llmDataSource.llmDataSourceId!).subscribe((llmDataSource) => {
            const dialogRef = this.dialog.open(LlmDataSourceDialogComponent, {
                width: '520px',
                disableClose: false,
                data: {
                    llmDataSource,
                    editMode: true,
                },
            });
            dialogRef.afterClosed().subscribe((res) => {
                if (res?.submitted) {
                    this.table.data.refresh();
                }
            });
        });
    }

    deleteLlmDataSource(llmDataSourceId: string) {
        this.llmDataSourceService.delete(llmDataSourceId).subscribe(() => {
            this.table.data.refresh();
        });
    }
}
