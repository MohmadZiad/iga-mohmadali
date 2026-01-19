import { Component, inject, ViewChild } from '@angular/core';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PageRequest, Sort } from '../../../data/interfaces/page.interface';
import { DateTime } from 'luxon';
import { PaginatedTableOptions } from '../../../data/interfaces/paginated-table.interface';
import {
    LlmStructureSharedTokenFilter,
    LlmStructureSharedTokenService,
} from '../../../data/api-services/llm-structure-shared-token.service';
import { LlmStructureSharedToken } from '../../../data/interfaces/llm-structure-shared-token.interface';
import { MatDialog } from '@angular/material/dialog';
import { LlmStructureSharedTokenDialogComponent } from '../llm-structure-shared-token-dialog/llm-structure-shared-token-dialog.component';

@Component({
    selector: 'app-llm-structure-shared-tokens',
    imports: [PaginatedTableComponent],
    templateUrl: './llm-structure-shared-tokens.component.html',
    styleUrl: './llm-structure-shared-tokens.component.scss',
})
export class LlmStructureSharedTokensComponent {
    llmStructureSharedTokenService = inject(LlmStructureSharedTokenService);
    private readonly route = inject(ActivatedRoute);
    router = inject(Router);
    @ViewChild(PaginatedTableComponent) table!: PaginatedTableComponent;
    dialog = new MatDialog();

    llmStructureId = this.route.parent?.snapshot.paramMap.get('structureId');

    tableOptions = {
        endpoint: (request: PageRequest<LlmStructureSharedToken>, filter: LlmStructureSharedTokenFilter) =>
            this.llmStructureSharedTokenService.getList(request, filter),
        columns: [
            {
                property: 'sharedToken',
                label: 'Shared Token',
            },
            {
                property: 'description',
                label: 'Description',
            },
            {
                property: 'createdAt',
                label: 'Date & Time',
                nowrap: true,
                format: (value: DateTime) => {
                    return value.toFormat('M/d/yy, h:mm a');
                },
            },
        ],
        actions: [
            {
                name: 'Edit',
                icon: '/assets/icons/edit.svg',
                onClick: (data: { element: LlmStructureSharedToken }) => {
                    console.log('Edit -> onClick -> element:', data.element);
                    this.updateLlmStructureSharedToken(data.element);
                },
            },
            {
                name: 'Delete',
                icon: '/assets/icons/trush.svg',
                onClick: (data: { element: LlmStructureSharedToken }) => {
                    console.log('Delete -> onClick -> element:', data.element);
                    this.deleteLlmStructureSharedToken(data.element.llmStructureSharedTokenId!);
                },
            },
        ],
        initialSort: {
            property: 'createdAt',
            order: 'desc',
        } as Sort<LlmStructureSharedToken>,
        initialFilter: {
            search: '',
            llmStructureId: this.llmStructureId,
        },
        pageSize: 10,
        paginator: true,
        search: true,
        reload: true,
    } as PaginatedTableOptions<LlmStructureSharedToken, LlmStructureSharedTokenFilter>;

    addLlmStructureSharedToken() {
        const dialogRef = this.dialog.open(LlmStructureSharedTokenDialogComponent, {
            width: '520px',
            disableClose: false,
            data: {
                llmStructureId: this.llmStructureId,
            },
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res?.submitted) {
                this.table.data.refresh();
            }
        });
    }

    updateLlmStructureSharedToken(llmStructureSharedToken: LlmStructureSharedToken) {
        this.llmStructureSharedTokenService
            .get(llmStructureSharedToken.llmStructureSharedTokenId!)
            .subscribe((llmStructureSharedToken) => {
                const dialogRef = this.dialog.open(LlmStructureSharedTokenDialogComponent, {
                    width: '520px',
                    disableClose: false,
                    data: {
                        llmStructureSharedToken,
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

    deleteLlmStructureSharedToken(llmStructureSharedTokenId: string) {
        this.llmStructureSharedTokenService.delete(llmStructureSharedTokenId).subscribe(() => {
            this.table.data.refresh();
        });
    }

    goBack() {
        this.router.navigate(['/llm/structures']);
    }
}
