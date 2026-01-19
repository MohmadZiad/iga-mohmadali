import { DatePipe } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

export interface DatepickerData {
    startDate: string;
    endDate: string;
    previousStartDate?: string;
    previousEndDate?: string;
}

@Component({
    selector: 'app-f2-datepicker',
    imports: [
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatDateRangeInput,
        MatDateRangePicker,
        MatIconModule,
    ],
    templateUrl: './f2-datepicker.component.html',
    styleUrl: './f2-datepicker.component.scss',
    providers: [provideNativeDateAdapter(), DatePipe],
})
export class F2DatepickerComponent implements OnInit {
    constructor(private datePipe: DatePipe) {}

    private today: Date = new Date();

    startDay = input<string>();
    endDay = input<string>();

    valueChange = output<DatepickerData>();

    range!: FormGroup;

    private formatDate(date: Date) {
        return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
    }

    onChangeDate() {
        if (!this.range.valid || !this.range.value.start || !this.range.value.end) {
            return;
        }

        const range = this.range.value.end.getTime() - this.range.value.start.getTime();

        this.valueChange.emit({
            startDate: this.formatDate(this.range.value.start),
            endDate: this.formatDate(this.range.value.end),
            previousStartDate: this.formatDate(new Date(this.range.value.start.getTime() - range)),
            previousEndDate: this.formatDate(new Date(this.range.value.end.getTime() - range)),
        });
    }

    ngOnInit(): void {
        const startDay = this.startDay() || null;
        const endDay = this.endDay() || null;
        this.range = new FormGroup({
            start: new FormControl<Date>(
                startDay ? new Date(startDay) : new Date(this.today.getFullYear(), this.today.getMonth(), 1),
                Validators.required
            ),
            end: new FormControl<Date>(
                endDay ? new Date(endDay) : new Date(this.today.getFullYear(), this.today.getMonth() + 1, 1),
                Validators.required
            ),
        });
        this.onChangeDate();
    }
}
