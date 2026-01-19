import { Component } from '@angular/core';
import { PageRequest, Sort } from '../../../data/interfaces/page.interface';
import { LlmStructureFilter } from '../../../data/api-services/llm-structure.service';
import { User } from '../../../data/api-services/user/user.service';
import { from } from 'rxjs';
import { PaginatedTableColumn, PaginatedTableOptions } from '../../../data/interfaces/paginated-table.interface';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';

@Component({
    selector: 'app-roles-management',
    imports: [PaginatedTableComponent],
    templateUrl: './roles-management.component.html',
    styleUrl: './roles-management.component.scss',
})
export class RolesManagementComponent {
    tableOptions = {
        endpoint: (request: PageRequest<User>, filter: LlmStructureFilter) => {
            console.log('request :>> ', request);
            console.log('filter :>> ', filter);
            return from([]);
        },
        columns: [
            {
                property: 'roleName',
                label: 'Role Name',
                clickable: true,
            },
            {
                property: 'CountAssignUsers',
                label: 'Assign Users',
                clickable: false,
            },
        ],
        actions: [
            {
                name: 'Edit',
                icon: '/assets/icons/edit.svg',
                onClick: (data: { element: User }) => {
                    console.log('Edit -> onClick -> element:', data.element);
                    this.editRole(data.element);
                },
            },
            {
                name: 'Delete',
                icon: '/assets/icons/trush.svg',
                onClick: (data: { element: User }) => {
                    console.log('Delete -> onClick -> element:', data.element);
                    this.removeRole(data.element);
                },
            },
        ],
        initialSort: {
            property: 'name',
            order: 'asc',
        } as unknown as Sort<User>,
        initialFilter: {
            search: '',
        },
        pageSize: 10,
        paginator: true,
        search: true,
        reload: true,
    } as PaginatedTableOptions<User, LlmStructureFilter>;

    columnClicked(data: { element: User; column: PaginatedTableColumn }) {
        console.log('columnClicked', data);
    }

    addNewRole() {
        console.log('addNewRole');
    }

    editRole(user: User) {
        console.log('editRole', user);
    }

    removeRole(user: User) {
        console.log('removeRole', user);
    }
}
