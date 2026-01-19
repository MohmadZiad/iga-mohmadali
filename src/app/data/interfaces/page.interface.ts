import { Observable } from 'rxjs';

export interface Sort<T> {
    property: keyof T;
    order: 'asc' | 'desc';
}

export interface PageRequest<T> {
    page: number;
    size: number;
    sort?: Sort<T>;
}

export interface Page<T> {
    number?: number;
    size?: number;
    content: T[];

    totalItems: number;
}

export type PaginatedEndpoint<T, Q> = (request: PageRequest<T>, filter: Q) => Observable<Page<T>>;
