import { Component, inject } from '@angular/core';
import { ChatAgentsHeaderComponent } from '../chat-agents-header/chat-agents-header.component';
import { ChatAgentService } from '../../../../data/api-services/chat-agent.service';
import { PageRequest, Sort } from '../../../../data/interfaces/page.interface';
import { DateTime } from 'luxon';
import { PaginatedTableColumn, PaginatedTableOptions } from '../../../../data/interfaces/paginated-table.interface';
import { ChatAgent, ChatAgentFilter } from '../../../../data/interfaces/chat-agent.interface';
import { PaginatedTableComponent } from '../../../../shared/components/paginated-table/paginated-table.component';

@Component({
    selector: 'app-chat-agents-container',
    imports: [ChatAgentsHeaderComponent, PaginatedTableComponent],
    templateUrl: './chat-agents-container.component.html',
    styleUrl: './chat-agents-container.component.scss',
})
export class ChatAgentsContainerComponent {
    private chatAgentService = inject(ChatAgentService);

    tableOptions = {
        endpoint: (request: PageRequest<ChatAgent>, filter: ChatAgentFilter) => this.chatAgentService.getList(request, filter),
        columns: [
            {
                property: 'username',
                label: 'Username',
                clickable: true,
            },
            {
                property: 'password',
                label: 'Password',
                clickable: true,
            },
            {
                property: 'instanceId',
                label: 'Instance Id',
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
                onClick: (data: { element: ChatAgent }) => {
                    console.log('Edit -> onClick -> element:', data.element);
                },
            },
            {
                name: 'Delete',
                icon: '/assets/icons/trush.svg',
                onClick: (data: { element: ChatAgent }) => {
                    console.log('Delete -> onClick -> element:', data.element);
                },
            },
        ],
        initialSort: {
            property: 'username',
            order: 'asc',
        } as Sort<ChatAgent>,
        initialFilter: {
            search: '',
        },
        pageSize: 10,
        paginator: true,
        search: true,
        reload: true,
    } as PaginatedTableOptions<ChatAgent, ChatAgentFilter>;

    columnClicked(data: { element: ChatAgent; column: PaginatedTableColumn }) {
        console.log('columnClicked -> element:', data.element);
    }
}
