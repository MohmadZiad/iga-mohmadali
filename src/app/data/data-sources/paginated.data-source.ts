import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, share, startWith, switchMap, tap } from 'rxjs';
import { Page, PaginatedEndpoint, Sort } from '../interfaces/page.interface';

export class PaginatedDataSource<T, Q> implements DataSource<T> {
    private pageNumber: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private sort: BehaviorSubject<Sort<T>>;
    private filter: BehaviorSubject<Q>;
    page$: Observable<Page<T>>;

    constructor(
        private endpoint: PaginatedEndpoint<T, Q>,
        initialSort: Sort<T>,
        initialFilter: Q,
        public pageSize = 10
    ) {
        this.sort = new BehaviorSubject<Sort<T>>(initialSort);
        this.filter = new BehaviorSubject<Q>(initialFilter);
        this.page$ = combineLatest([this.filter, this.sort]).pipe(
            switchMap(([filter, sort]) =>
                this.pageNumber.pipe(
                    startWith(0),
                    switchMap((page) =>
                        this.endpoint({ page, sort, size: this.pageSize }, filter).pipe(
                            catchError(() => of({ number: page, size: pageSize, content: [], totalItems: 0 }))
                        )
                    )
                )
            ),
            share()
        );
    }

    connect(): Observable<T[]> {
        return this.page$.pipe(
            tap((page) => console.log(page)),
            map((page) => page.content)
        );
    }

    disconnect(): void {
        this.pageNumber.complete();
        this.sort.complete();
        this.filter.complete();
    }

    sortBy(sort: Partial<Sort<T>>): void {
        const lastSort = this.sort.getValue();
        const nextSort = { ...lastSort, ...sort }; // merge sorting by different columns
        this.sort.next(nextSort);
    }

    filterBy(filter: Partial<Q>): void {
        const lastFilter = this.filter.getValue();
        const nextFilter = { ...lastFilter, ...filter };
        this.filter.next(nextFilter);
        this.pageNumber.next(0); // reset to 1st page on filter(search)
    }

    fetch(page: number): void {
        this.pageNumber.next(page);
    }

    refresh(): void {
        this.pageNumber.next(0); // reset to 1st page on refresh
    }
}
