import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';

export interface MissedServicesItem {
    code: string;
    name: string;
}

@Component({
    selector: 'app-missed-services-dialog',
    imports: [ReactiveFormsModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatListModule],
    templateUrl: './missed-services-dialog.component.html',
    styleUrl: './missed-services-dialog.component.scss',
})
export class MissedServicesDialogComponent {
    private dialogRef = inject(MatDialogRef<MissedServicesDialogComponent>);
    data: { listMissedServices: MissedServicesItem[]; comment: string; viewMode?: boolean } = inject(MAT_DIALOG_DATA);

    form = new FormGroup({
        comment: new FormControl(this.data.comment || '', { nonNullable: true }),
    });

    submit() {
        this.dialogRef.close(this.form.value.comment);
    }
}
