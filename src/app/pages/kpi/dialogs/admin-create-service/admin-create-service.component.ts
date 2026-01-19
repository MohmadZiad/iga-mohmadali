import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    MatDialogContent,
    MatDialogActions,
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogClose,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatOption, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

import { AccountItem } from '../../../../data/api-services/account/models';
import { ServiceItem } from '../../../../data/api-services/service/models';

export interface AdminCreateServiceDialogData {
    accountList: AccountItem[];
    serviceItem?: ServiceItem;
}

@Component({
    selector: 'app-admin-create-service',
    imports: [
        MatDialogContent,
        MatDialogActions,
        MatDialogTitle,
        MatDialogClose,
        MatSelect,
        MatOption,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatDividerModule,
    ],
    templateUrl: './admin-create-service.component.html',
    styleUrl: './admin-create-service.component.scss',
})
export class AdminCreateServiceComponent {
    private dialogRef = inject(MatDialogRef<AdminCreateServiceComponent>);
    data: AdminCreateServiceDialogData = inject(MAT_DIALOG_DATA);

    accountList: AccountItem[] = [];
    processedServiceItem!: ServiceItem;
    form!: FormGroup;

    constructor() {
        this.accountList = this.data.accountList;
        this.processedServiceItem = this.data.serviceItem || new ServiceItem();
        const initServiceCode = this.processedServiceItem.serviceId
            ? this.processedServiceItem.serviceId.split('.').slice(1).join('.')
            : '';
        this.form = new FormGroup({
            selectedAccount: new FormControl(this.accountList[0], { nonNullable: true }),
            serviceCode: new FormControl(initServiceCode, [
                Validators.required,
                Validators.pattern(ServiceItem.SERVICE_CODE_PATTERN),
            ]),
            serviceName: new FormControl(this.processedServiceItem.serviceName, [Validators.required]),
            sla: new FormControl(this.processedServiceItem.sla, [Validators.required]),
        });
    }

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.processedServiceItem.accountId = this.form.value.selectedAccount.accountId;
        this.processedServiceItem.serviceId = this.getPrefixServiceCode() + this.form.value.serviceCode;
        this.processedServiceItem.serviceName = this.form.value.serviceName;
        this.processedServiceItem.sla = this.form.value.sla;

        this.dialogRef.close({
            serviceItem: this.processedServiceItem,
        });
    }

    getPrefixServiceCode() {
        return this.form.value.selectedAccount.accountCode + '.';
    }
}
