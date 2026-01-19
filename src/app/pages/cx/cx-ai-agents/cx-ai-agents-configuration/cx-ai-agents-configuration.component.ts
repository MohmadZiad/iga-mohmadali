import { Component, inject, OnInit, signal } from '@angular/core';
import { CxAiAgentService } from '../../../../data/api-services/cx-ai-agent.service';
import {
    CxActionGroupListRequest,
    CxActionGroupRequest,
    CxActionGroupSummary,
    CxActionGroupFilter,
    CxAiAgentItem,
    CxActionGroupResponse,
} from '../../../../data/interfaces/cx-ai-agent.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { PaginatedTableComponent } from '../../../../shared/components/paginated-table/paginated-table.component';
import { PageRequest, Sort } from '../../../../data/interfaces/page.interface';
import { DateTime } from 'luxon';
import { PaginatedTableColumn, PaginatedTableOptions } from '../../../../data/interfaces/paginated-table.interface';
import { MatDialog } from '@angular/material/dialog';
import { CxAiAgentsActionGroupDialogComponent } from '../cx-ai-agents-action-group-dialog/cx-ai-agents-action-group-dialog.component';

@Component({
    selector: 'app-cx-ai-agents-configuration',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButton, PaginatedTableComponent],
    templateUrl: './cx-ai-agents-configuration.component.html',
    styleUrl: './cx-ai-agents-configuration.component.scss',
})
export class CxAiAgentsConfigurationComponent implements OnInit {
    aiAgentService = inject(CxAiAgentService);
    aiAgentDetails = signal<CxAiAgentItem | null>(null);
    tableOptions!: PaginatedTableOptions<CxActionGroupSummary, CxActionGroupFilter>;
    dialog: MatDialog = new MatDialog();

    private getAgentParams(): CxActionGroupListRequest {
        const details = this.aiAgentDetails();
        if (!details) {
            throw new Error('AI Agent details are not available');
        }

        return {
            agentId: details.agentId,
            agentVersion: details.agentVersion,
        };
    }

    ngOnInit() {
        const details = this.aiAgentService.getAiAgentDetails();
        if (details) {
            this.aiAgentDetails.set(details);
        } else {
            // TODO: do request and get details from api
        }

        this.tableOptions = {
            endpoint: (request: PageRequest<CxActionGroupSummary>, filter: CxActionGroupFilter) =>
                this.aiAgentService.getActionGroupList(request, filter, this.getAgentParams()),
            columns: [
                {
                    property: 'actionGroupName',
                    label: 'Action Group Name',
                    clickable: true,
                },
                {
                    property: 'actionGroupId',
                    label: 'Action Group Id',
                    clickable: true,
                },
                {
                    property: 'actionGroupState',
                    label: 'Action Group State',
                    clickable: true,
                },
                {
                    property: 'updatedAt',
                    label: 'Updated At',
                    format: (value: string) => {
                        const newValue = DateTime.fromISO(value);
                        return newValue.toFormat('M/d/yy, h:mm a');
                    },
                },
            ],
            actions: [
                {
                    name: 'Edit',
                    icon: '/assets/icons/edit.svg',
                    onClick: (data: { element: CxActionGroupSummary }) => {
                        console.log('Edit -> onClick -> element:', data.element);
                    },
                },
                {
                    name: 'Delete',
                    icon: '/assets/icons/trush.svg',
                    onClick: (data: { element: CxActionGroupSummary }) => {
                        console.log('Delete -> onClick -> element:', data.element);
                    },
                },
            ],
            initialSort: {
                property: 'actionGroupName',
                order: 'asc',
            } as Sort<CxActionGroupSummary>,
            initialFilter: {
                search: '',
            },
            pageSize: 10,
            paginator: true,
            search: true,
            reload: true,
        } as PaginatedTableOptions<CxActionGroupSummary, CxActionGroupFilter>;
    }

    columnActionGroupClicked(data: { element: CxActionGroupSummary; column: PaginatedTableColumn }) {
        const request: CxActionGroupRequest = {
            actionGroupId: data.element.actionGroupId,
            agentId: this.aiAgentDetails()!.agentId,
            agentVersion: this.aiAgentDetails()!.agentVersion,
        };

        this.aiAgentService.getActionGroup(request).subscribe((res: CxActionGroupResponse) => {
            this.dialog.open(CxAiAgentsActionGroupDialogComponent, {
                width: '520px',
                disableClose: false,
                data: {
                    editMode: false,
                    actionGroup: res.agentActionGroup || [],
                },
            });
        });
    }
}
