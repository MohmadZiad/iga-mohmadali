import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { PaginatedDataSource } from '../../../data/data-sources/paginated.data-source';
import { AsyncPipe, NgClass } from '@angular/common';
import { PaginatedTableColumn, PaginatedTableOptions } from '../../../data/interfaces/paginated-table.interface';

@Component({
    selector: 'app-paginated-table',
    imports: [MatTableModule, MatPaginatorModule, MatButtonModule, AsyncPipe, NgClass],
    templateUrl: './paginated-table.component.html',
    styleUrl: './paginated-table.component.scss',
})
export class PaginatedTableComponent implements OnInit {
    @Input() options!: PaginatedTableOptions<any, any>;
    @Output() columnClicked = new EventEmitter<{ element: any; column: PaginatedTableColumn }>();
    @Output() editClicked = new EventEmitter<{ element: any }>();
    @Output() removeClicked = new EventEmitter<{ element: any }>();

    columns: string[] = [];
    data!: PaginatedDataSource<any, any>;

    ngOnInit() {
        this.columns = this.options.columns.map((column) => column.property);
        if (this.options.actions?.length) {
            this.columns.push('actions');
        }
        this.data = new PaginatedDataSource(
            this.options.endpoint,
            this.options.initialSort,
            this.options.initialFilter,
            this.options.pageSize
        );
    }

    formatValue(column: PaginatedTableColumn, value: any): string {
        if (column.format) {
            return column.format(value);
        }
        return value?.toString();
    }

    pageChanged(event: PageEvent) {
        this.data.fetch(event.pageIndex);
    }
}
