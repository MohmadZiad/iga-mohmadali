import { Component } from '@angular/core';
import { PageRequest, Sort } from '../../../data/interfaces/page.interface';
import { LlmStructureFilter } from '../../../data/api-services/llm-structure.service';
import { User } from '../../../data/api-services/user/user.service';
import { PaginatedTableColumn, PaginatedTableOptions } from '../../../data/interfaces/paginated-table.interface';
import { from } from 'rxjs';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';

@Component({
    selector: 'app-users-management',
    imports: [PaginatedTableComponent],
    templateUrl: './users-management.component.html',
    styleUrl: './users-management.component.scss',
})
export class UsersManagementComponent {
    tableOptions = {
        endpoint: (request: PageRequest<User>, filter: LlmStructureFilter) => {
            console.log('request :>> ', request);
            console.log('filter :>> ', filter);
            return from([]);
        },
        columns: [
            {
                property: 'userName',
                label: 'Full Name',
                clickable: true,
            },
            {
                property: 'email',
                label: 'Email',
                clickable: false,
            },
            {
                property: 'accountCode',
                label: 'Account Code',
                clickable: false,
            },
        ],
        actions: [
            {
                name: 'Edit',
                icon: '/assets/icons/edit.svg',
                onClick: (data: { element: User }) => {
                    console.log('Edit -> onClick -> element:', data.element);
                    this.editUser(data.element);
                },
            },
            {
                name: 'Delete',
                icon: '/assets/icons/trush.svg',
                onClick: (data: { element: User }) => {
                    console.log('Delete -> onClick -> element:', data.element);
                    this.removeUser(data.element);
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

    addNewUser() {
        console.log('addNewUser');
    }

    editUser(user: User) {
        console.log('editUser', user);
    }

    removeUser(user: User) {
        console.log('removeUser', user);
    }
}
