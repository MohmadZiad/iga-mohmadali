import { Component, inject, ViewChild } from '@angular/core';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { LlmStructureFilter, LlmStructureService } from '../../../data/api-services/llm-structure.service';
import { PageRequest, Sort } from '../../../data/interfaces/page.interface';
import { PaginatedTableColumn, PaginatedTableOptions } from '../../../data/interfaces/paginated-table.interface';
import { Router } from '@angular/router';
import { LlmStructure } from '../../../data/interfaces/llm-structure.interface';
import { MatDialog } from '@angular/material/dialog';
import { LlmStructureDialogComponent } from '../llm-structure-dialog/llm-structure-dialog.component';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-llm-structures',
    imports: [PaginatedTableComponent],
    templateUrl: './llm-structures.component.html',
    styleUrl: './llm-structures.component.scss',
})
export class LlmStructuresComponent {
    router = inject(Router);
    llmStructureService = inject(LlmStructureService);
    dialog = new MatDialog();
    @ViewChild(PaginatedTableComponent) table!: PaginatedTableComponent;

    tableOptions = {
        endpoint: (request: PageRequest<LlmStructure>, filter: LlmStructureFilter) =>
            this.llmStructureService.getList(request, filter),
        columns: [
            {
                property: 'name',
                label: 'Structure Name',
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
                onClick: (data: { element: LlmStructure }) => {
                    console.log('Edit -> onClick -> element:', data.element);
                    this.updateLlmStructure(data.element);
                },
            },
            {
                name: 'Delete',
                icon: '/assets/icons/trush.svg',
                onClick: (data: { element: LlmStructure }) => {
                    console.log('Delete -> onClick -> element:', data.element);
                    this.deleteLlmStructure(data.element.llmStructureId!);
                },
            },
        ],
        initialSort: {
            property: 'name',
            order: 'asc',
        } as Sort<LlmStructure>,
        initialFilter: {
            search: '',
        },
        pageSize: 10,
        paginator: true,
        search: true,
        reload: true,
    } as PaginatedTableOptions<LlmStructure, LlmStructureFilter>;

    columnClicked(data: { element: LlmStructure; column: PaginatedTableColumn }) {
        console.log('columnClicked -> element:', data.element);
        this.router.navigate([`/llm/structures/${data.element.llmStructureId}/details`]);
    }

    addLlmStructure() {
        const dialogRef = this.dialog.open(LlmStructureDialogComponent, {
            width: '520px',
            disableClose: false,
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res?.submitted) {
                this.table.data.refresh();
            }
        });
    }

    updateLlmStructure(llmStructure: LlmStructure) {
        this.llmStructureService.get(llmStructure.llmStructureId!).subscribe((llmStructure) => {
            const dialogRef = this.dialog.open(LlmStructureDialogComponent, {
                width: '520px',
                disableClose: false,
                data: {
                    llmStructure,
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

    deleteLlmStructure(llmStructureId: string) {
        this.llmStructureService.delete(llmStructureId).subscribe(() => {
            this.table.data.refresh();
        });
    }
}
