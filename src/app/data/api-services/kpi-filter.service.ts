import { Injectable, signal } from '@angular/core';
import { FiltersData } from '../interfaces/filter.interface';
import { formatDate, getStartAndEndDateCurrentMonth } from '../../shared/utils/date.utils';

@Injectable({
    providedIn: 'root',
})
export class KpiFilterService {
    filterData = signal<FiltersData>({
        startDate: '',
        endDate: '',
        previousStartDate: '',
        previousEndDate: '',

        selectServices: [],
        selectAccounts: [],
        selectAccount: '',

        pageSize: 10,
        page: 0,
        search: '',
    });

    constructor() {
        const { start, end } = getStartAndEndDateCurrentMonth();
        this.filterData.set({
            ...this.filterData(),
            startDate: formatDate(start, 'yyyy-MM-dd'),
            endDate: formatDate(end, 'yyyy-MM-dd'),
        });
    }
}
