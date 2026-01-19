import { Component, inject, OnDestroy } from '@angular/core';
import { CxAgentService } from '../../../../data/api-services/cx-agent.service';
import { PageRequest, Sort } from '../../../../data/interfaces/page.interface';
import { CxAgent, CxAgentFilter } from '../../../../data/interfaces/cx-agent.interface';
import { DateTime } from 'luxon';
import { PaginatedTableColumn, PaginatedTableOptions } from '../../../../data/interfaces/paginated-table.interface';
import { PaginatedTableComponent } from '../../../../shared/components/paginated-table/paginated-table.component';
import { CxAgentsConnectInstanceDetailsComponent } from '../cx-agents-connect-instance-details/cx-agents-connect-instance-details.component';
import { AWS_REGION, CCP_URL } from '../../../../../environments/environments';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cx-agents-list',
    imports: [PaginatedTableComponent, CxAgentsConnectInstanceDetailsComponent],
    templateUrl: './cx-agents-list.component.html',
    styleUrl: './cx-agents-list.component.scss',
})
export class CxAgentsListComponent implements OnDestroy {
    private agentService = inject(CxAgentService);
    router = inject(Router);

    tableOptions = {
        endpoint: (request: PageRequest<CxAgent>, filter: CxAgentFilter) => this.agentService.getList(request, filter),
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
                property: 'role',
                label: 'Role',
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
                onClick: (data: { element: CxAgent }) => {
                    console.log('Edit -> onClick -> element:', data.element);
                },
            },
            {
                name: 'Delete',
                icon: '/assets/icons/trush.svg',
                onClick: (data: { element: CxAgent }) => {
                    console.log('Delete -> onClick -> element:', data.element);
                },
            },
        ],
        initialSort: {
            property: 'username',
            order: 'asc',
        } as Sort<CxAgent>,
        initialFilter: {
            search: '',
        },
        pageSize: 10,
        paginator: true,
        search: true,
        reload: true,
    } as PaginatedTableOptions<CxAgent, CxAgentFilter>;

    columnClicked(data: { element: CxAgent; column: PaginatedTableColumn }) {
        console.log('columnClicked -> element:', data.element);
    }

    goBack() {
        this.router.navigate(['/cx/agents']);
    }

    openCcpFrame() {
        const connect = (window as any).connect;
        connect.core.initCCP(document.getElementById('ccpFrame'), {
            ccpUrl: CCP_URL,
            loginPopup: true,
            loginPopupAutoClose: true,
            loginOptions: {
                autoClose: true,
            },
            region: AWS_REGION, // replace with your Amazon Connect region
            softphone: {
                allowFramedSoftphone: true, // must be true for embedding in iframe
                disableRingtone: false,
            },
        });
        connect.core.onAuthorizeSuccess(() => {
            console.log('onAuthorizeSuccess');
        });
    }

    openCcpWindow() {
        const windowFeatures = 'width=350,height=450,resizable=yes,scrollbars=yes,status=yes';
        window.open(CCP_URL, '_blank', windowFeatures);
    }

    ngOnDestroy() {
        const connect = (window as any).connect;
        connect.core.terminate();
    }
}
