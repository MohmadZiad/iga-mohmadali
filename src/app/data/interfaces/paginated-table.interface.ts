import { PaginatedEndpoint, Sort } from './page.interface';

export interface PaginatedTableColumn {
    property: string;
    label: string;
    clickable?: boolean;
    nowrap?: boolean;
    format?: PaginatedTableColumnFormat<any>;
}

export interface PaginatedTableOptions<T, Q> {
    endpoint: PaginatedEndpoint<T, Q>;
    initialSort: Sort<T>;
    initialFilter: Q;
    pageSize: number;
    columns: PaginatedTableColumn[];
    actions?: any;
    paginator: boolean;
    search: boolean;
    reload: boolean;
}

export type PaginatedTableColumnFormat<T> = (value: T) => string;
