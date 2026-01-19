import { Component, inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LlmDataSourceService } from '../../../data/api-services/llm-data-source.service';
import { LlmDataSource } from '../../../data/interfaces/llm-data-source.interface';
import { LlmDataSourceModel } from '../../../data/models/llm-data-source.model';
import { NgClass } from '@angular/common';
import { arrayValidator } from '../../../data/form-validators/array-validator';
import { numberStepValidator } from '../../../data/form-validators/number-step-validator';

@Component({
    selector: 'app-llm-data-source-dialog',
    imports: [
        MatDialogContent,
        MatDialogActions,
        MatDialogTitle,
        MatDialogClose,
        MatSelectModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        NgClass,
    ],
    templateUrl: './llm-data-source-dialog.component.html',
    styleUrl: './llm-data-source-dialog.component.scss',
})
export class LlmDataSourceDialogComponent {
    data?: { llmDataSource: LlmDataSource; editMode: boolean } = inject(MAT_DIALOG_DATA);
    llmDataSourceService = inject(LlmDataSourceService);
    dialogRef = inject(MatDialogRef<LlmDataSourceDialogComponent>);
    formBuilder = inject(FormBuilder);

    chunkingStrategies = ['FIXED_SIZE', 'NONE'];
    embeddingModels = [
        'amazon.titan-embed-text-v1',
        'amazon.titan-embed-text-v2:0',
        'cohere.embed-english-v3',
        'cohere.embed-multilingual-v3',
    ];

    form: FormGroup = this.formBuilder.group({
        name: [this.data?.llmDataSource?.name, [Validators.required, Validators.pattern(/^[A-Za-z0-9 .-]+$/)]],
        chunkingStrategy: [
            {
                value: this.data?.llmDataSource?.chunkingStrategy || 'FIXED_SIZE',
                disabled: !!this.data?.editMode,
            },
            [Validators.required, arrayValidator(this.chunkingStrategies)],
        ],
        chunkSize: [
            {
                value: this.data?.llmDataSource?.chunkSize || 300,
                disabled: !!this.data?.editMode,
            },
            [Validators.required, Validators.min(20), Validators.max(8192), numberStepValidator(1)],
        ],
        embeddingModels: [
            {
                value: this.data?.llmDataSource?.embeddingModels,
                disabled: !!this.data?.editMode,
            },
            [Validators.required, arrayValidator(this.embeddingModels)],
        ],
        s3Folder: [
            {
                value: this.data?.llmDataSource?.s3Folder,
                disabled: !!this.data?.editMode,
            },
            [Validators.required],
        ],
    });

    submit() {
        // Mark all fields as touched to trigger validation messages
        this.form.markAllAsTouched();

        if (!this.form.valid) {
            return;
        }

        if (this.data?.editMode) {
            this.llmDataSourceService
                .updateName(this.data.llmDataSource.llmDataSourceId!, this.form.controls['name'].value)
                .subscribe(() => {
                    console.log('LLM data source updated');
                    this.dialogRef.close({
                        submitted: true,
                    });
                });
        } else {
            const dataSource = new LlmDataSourceModel({
                name: this.form.controls['name'].value,
                embeddingModels: this.form.controls['embeddingModels'].value,
                chunkingStrategy: this.form.controls['chunkingStrategy'].value,
                chunkSize: this.form.controls['chunkSize'].value,
                s3Folder: this.form.controls['s3Folder'].value,
            });
            this.llmDataSourceService.create(dataSource).subscribe(() => {
                console.log('LLM data source created');
                this.dialogRef.close({
                    submitted: true,
                });
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
