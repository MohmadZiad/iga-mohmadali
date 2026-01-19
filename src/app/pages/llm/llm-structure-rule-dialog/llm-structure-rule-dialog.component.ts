import { Component, inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LlmRuleService } from '../../../data/api-services/llm-rule.service';
import { LlmStructure } from '../../../data/interfaces/llm-structure.interface';
import { LlmRuleModel } from '../../../data/models/llm-rule.model';
import { UserService } from '../../../data/api-services/user/user.service';
import { LlmRule } from '../../../data/interfaces/llm-rule.interface';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-llm-structure-rule-dialog',
    imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, ReactiveFormsModule, NgClass],
    templateUrl: './llm-structure-rule-dialog.component.html',
    styleUrl: './llm-structure-rule-dialog.component.scss',
})
export class LlmStructureRuleDialogComponent {
    llmRuleService = inject(LlmRuleService);
    userService = inject(UserService);
    dialogRef = inject(MatDialogRef<LlmStructureRuleDialogComponent>);
    formBuilder = inject(FormBuilder);
    data?: { llmStructure: LlmStructure; llmRule: LlmRule; editMode: boolean } = inject(MAT_DIALOG_DATA);

    form: FormGroup = this.formBuilder.group({
        name: [this.data?.llmRule?.name, [Validators.required, Validators.pattern(/^[A-Za-z0-9 .-]+$/)]],
        value: [this.data?.llmRule?.value, [Validators.required]],
    });

    submit() {
        // Mark all fields as touched to trigger validation messages
        this.form.markAllAsTouched();

        if (!this.form.valid) {
            return;
        }

        if (this.data?.editMode) {
            const rule = new LlmRuleModel({
                name: this.form.controls['name'].value,
                value: this.form.controls['value'].value,
            });
            this.llmRuleService.update(this.data.llmRule.llmRuleId!, rule).subscribe(() => {
                console.log('Updated llm rule');
                this.dialogRef.close({
                    submitted: true,
                });
            });
        } else if (this.data?.llmStructure) {
            const rule = new LlmRuleModel({
                name: this.form.controls['name'].value,
                value: this.form.controls['value'].value,
                llmRulesetId: this.data.llmStructure.llmRulesetId,
                userId: this.userService.authUser?.userId,
                accountId: this.userService.authUser?.userAccountId,
            });
            this.llmRuleService.create(rule).subscribe(() => {
                console.log('Created llm rule');
                this.dialogRef.close({
                    submitted: true,
                });
            });
        } else {
            this.dialogRef.close({
                error: 'Structure is not defined',
            });
        }
    }

    get nameErrors() {
        const control = this.form.get('name');
        if (!control) {
            return '';
        }
        if (control.hasError('required')) {
            return 'Name is required';
        }
        if (control.hasError('pattern')) {
            // return 'Only alpha-numeric, dot and dash characters are allowed';
            return 'Name can only contain letters, numbers, spaces, dots, or hyphens';
        }
        return '';
    }

    isRequired(control: AbstractControl | null): boolean {
        if (!control || !control.validator) return false;
        const validator = control.validator({} as AbstractControl);
        return validator?.['required'] ?? false;
    }

    isErrorNeededToBeShown(control: AbstractControl | null): boolean {
        return !!control?.invalid && (control?.dirty || control?.touched);
    }
}
