import { Component, inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LlmStructureSharedTokenService } from '../../../data/api-services/llm-structure-shared-token.service';
import { LlmStructureSharedToken } from '../../../data/interfaces/llm-structure-shared-token.interface';
import { LlmStructureSharedTokenModel } from '../../../data/models/llm-structure-shared-token.model';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-llm-structure-shared-token-dialog',
    imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, ReactiveFormsModule, NgClass],
    templateUrl: './llm-structure-shared-token-dialog.component.html',
    styleUrl: './llm-structure-shared-token-dialog.component.scss',
})
export class LlmStructureSharedTokenDialogComponent {
    llmStructureSharedTokenService = inject(LlmStructureSharedTokenService);
    dialogRef = inject(MatDialogRef<LlmStructureSharedTokenDialogComponent>);
    formBuilder = inject(FormBuilder);
    data?: { llmStructureId: string; llmStructureSharedToken: LlmStructureSharedToken; editMode: boolean } =
        inject(MAT_DIALOG_DATA);

    form: FormGroup = this.formBuilder.group({
        description: [this.data?.llmStructureSharedToken?.description],
    });

    submit() {
        if (this.data?.editMode) {
            const sharedToken = new LlmStructureSharedTokenModel({
                description: this.form.controls['description'].value,
            });
            this.llmStructureSharedTokenService
                .update(this.data.llmStructureSharedToken.llmStructureSharedTokenId!, sharedToken)
                .subscribe(() => {
                    console.log('Updated llm structure shared token');
                    this.dialogRef.close({
                        submitted: true,
                    });
                });
        } else if (this.data?.llmStructureId) {
            const rule = new LlmStructureSharedTokenModel({
                description: this.form.controls['description'].value,
                llmStructureId: this.data.llmStructureId,
            });
            this.llmStructureSharedTokenService.create(rule).subscribe(() => {
                console.log('Created llm structure shared token');
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

    get descriptionErrors() {
        const control = this.form.get('description');
        if (!control) {
            return '';
        }
        if (control.hasError('required')) {
            return 'Description is required';
        }
        if (control.hasError('pattern')) {
            // return 'Only alpha-numeric, dot and dash characters are allowed';
            return 'Description can only contain letters, numbers, spaces, dots, or hyphens';
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
