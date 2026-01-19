import { Component, computed, effect, input, output, signal } from '@angular/core';

import { F2TableColumnOption, F2TableData, F2TableRowActions } from './f2-table.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { hexToRgb } from '../../utils/general.utils';
import { CircleProgressBarComponent } from '../circle-progress-bar/circle-progress-bar.component';
import { AccountNameComponent } from '../account-name/account-name.component';
import { MatButtonModule } from '@angular/material/button';
export * from './f2-table.interface';

@Component({
    selector: 'app-f2-table',
    imports: [ReactiveFormsModule, CircleProgressBarComponent, AccountNameComponent, MatButtonModule],
    templateUrl: './f2-table.component.html',
    styleUrl: './f2-table.component.scss',
})
export class F2TableComponent {
    data = input<F2TableData[]>([]);
    columnOptions = input<F2TableColumnOption[]>([]);
    rowActions = input<F2TableRowActions[]>([]);
    includeIndex = input<boolean>(false);
    maxDisplayingData = input<number>(5);

    tableData = computed<F2TableData[]>(() => {
        return this.data().slice(
            this.selectedPage() * this.maxDisplayingData(),
            (this.selectedPage() + 1) * this.maxDisplayingData()
        );
    });

    countPages = computed(() => {
        return new Array(Math.ceil(this.data().length / this.maxDisplayingData()));
    });

    selectedPage = signal(0);

    searchLabel = input<string | undefined>(undefined);
    searchControl = new FormControl();
    inputSearch = output<string>();

    clickToRow = output<F2TableData>();

    hexToRgb = hexToRgb;

    constructor() {
        this.searchControl.valueChanges.pipe(distinctUntilChanged(), debounceTime(500)).subscribe((value) => {
            this.inputSearch.emit(value);
        });

        effect(() => {
            this.selectedPage.set(!this.data().length ? this.data().length : 0);
        });
    }

    getIndexNumber(index: number) {
        return this.selectedPage() * this.maxDisplayingData() + ++index;
    }

    onClickToRow(row: F2TableData) {
        this.clickToRow.emit(row);
    }
}

// export const prepareTableDataToCSV = <T>(items: T[], columnOptions: F2TableColumnOption[]) => {
//     return items.map((item, index) => {
//         return {
//             ...columnOptions.reduce((acc, option) => {
//                 return { ...acc, [option.label]: item[option.key as keyof T] ?? '' };
//             }, {}),
//             '#': index + 1,
//         };
//     });
// };

export const prepareTableDataToExcel = <T>(items: T[], columnOptions: F2TableColumnOption[]) => {
    const data: (string | number)[][] = [];
    data.push(columnOptions.map((i) => i.label).concat(['#']));
    items.forEach((item, index) => {
        data.push(
            columnOptions
                .map((option) => {
                    return item[option.key as keyof T] as string | number;
                })
                .concat([index + 1])
        );
    });

    return data;
};

export const prepareTableDataToCSV = prepareTableDataToExcel;
