import { Component, inject, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LlmStructureService } from '../../../data/api-services/llm-structure.service';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { PageRequest, Sort } from '../../../data/interfaces/page.interface';
import { PaginatedTableOptions } from '../../../data/interfaces/paginated-table.interface';
import { LlmRuleFilter, LlmRuleService } from '../../../data/api-services/llm-rule.service';
import { LlmRule } from '../../../data/interfaces/llm-rule.interface';
import { MatDialog } from '@angular/material/dialog';
import { LlmStructureRuleDialogComponent } from '../llm-structure-rule-dialog/llm-structure-rule-dialog.component';
import { LlmStructure } from '../../../data/interfaces/llm-structure.interface';
import { tap } from 'rxjs';
import { DateTime } from 'luxon';
import { LlmStructureDialogComponent } from '../llm-structure-dialog/llm-structure-dialog.component';

@Component({
    selector: 'app-llm-structure-details',
    imports: [AsyncPipe, PaginatedTableComponent],
    templateUrl: './llm-structure-details.component.html',
    styleUrl: './llm-structure-details.component.scss',
})
export class LlmStructureDetailsComponent {
    llmStructureService = inject(LlmStructureService);
    llmRuleService = inject(LlmRuleService);
    private readonly route = inject(ActivatedRoute);
    dialog = new MatDialog();
    router = inject(Router);
    @ViewChild(PaginatedTableComponent) rulesTable!: PaginatedTableComponent;

    llmStructureId = this.route.parent?.snapshot.paramMap.get('structureId');

    llmStructure: LlmStructure | null = null;
    llmStructure$ = this.llmStructureService.get(this.llmStructureId!).pipe(
        tap((structure) => {
            this.llmStructure = structure;
            this.rulesTableOptions.initialFilter.llmRulesetId = structure.llmRulesetId || '';
        })
    );

    rulesTableOptions = {
        endpoint: (request: PageRequest<LlmRule>, filter: LlmRuleFilter) => this.llmRuleService.getList(request, filter),
        columns: [
            {
                property: 'name',
                label: 'Name',
            },
            {
                property: 'value',
                label: 'Value',
            },
            {
                property: 'createdAt',
                label: 'Date',
                format: (value: DateTime) => {
                    return value.toFormat('M/d/yy, h:mm a');
                },
            },
        ],
        actions: [
            {
                name: 'Edit',
                icon: '/assets/icons/edit.svg',
                onClick: (data: { element: LlmRule }) => {
                    console.log('Edit -> onClick -> element:', data.element);
                    this.updateLlmRule(data.element);
                },
            },
            {
                name: 'Delete',
                icon: '/assets/icons/trush.svg',
                onClick: (data: { element: LlmRule }) => {
                    console.log('Delete -> onClick -> element:', data.element);
                    this.deleteLlmRule(data.element.llmRuleId!);
                },
            },
        ],
        initialSort: {
            property: 'createdAt',
            order: 'desc',
        } as Sort<LlmRule>,
        initialFilter: {
            search: '',
            llmRulesetId: this.llmStructure?.llmRulesetId,
        },
        pageSize: 10,
        paginator: true,
        search: true,
        reload: true,
    } as PaginatedTableOptions<LlmRule, LlmRuleFilter>;

    addLlmRule() {
        const dialogRef = this.dialog.open(LlmStructureRuleDialogComponent, {
            width: '520px',
            disableClose: false,
            data: {
                llmStructure: this.llmStructure,
            },
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res?.submitted) {
                this.rulesTable.data.refresh();
            }
        });
    }

    updateLlmRule(llmRule: LlmRule) {
        this.llmRuleService.get(llmRule.llmRuleId!).subscribe((llmRule) => {
            const dialogRef = this.dialog.open(LlmStructureRuleDialogComponent, {
                width: '520px',
                disableClose: false,
                data: {
                    llmRule,
                    editMode: true,
                },
            });
            dialogRef.afterClosed().subscribe((res) => {
                if (res?.submitted) {
                    this.rulesTable.data.refresh();
                }
            });
        });
    }

    deleteLlmRule(llmRuleId: string) {
        this.llmRuleService.delete(llmRuleId).subscribe(() => {
            this.rulesTable.data.refresh();
        });
    }

    goBack() {
        this.router.navigate(['/llm/structures']);
    }

    edit() {
        const dialogRef = this.dialog.open(LlmStructureDialogComponent, {
            width: '520px',
            disableClose: false,
            data: {
                llmStructure: this.llmStructure,
                editMode: true,
            },
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res?.submitted) {
                this.llmStructure$.subscribe();
            }
        });
    }
}
