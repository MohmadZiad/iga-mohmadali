import { Component, inject, signal, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatSelect } from '@angular/material/select';
import { LlmStructureService } from '../../../data/api-services/llm-structure.service';
import { LlmStructureModel } from '../../../data/models/llm-structure.model';
import { MatCheckbox } from '@angular/material/checkbox';
import { LlmStructure } from '../../../data/interfaces/llm-structure.interface';
import { NgClass } from '@angular/common';
import { numberStepValidator } from '../../../data/form-validators/number-step-validator';
import { arrayValidator } from '../../../data/form-validators/array-validator';

@Component({
    selector: 'app-llm-structure-dialog',
    imports: [
        FormsModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatOption,
        MatSelect,
        ReactiveFormsModule,
        MatCheckbox,
        NgClass,
        MatFormField,
    ],
    templateUrl: './llm-structure-dialog.component.html',
    styleUrl: './llm-structure-dialog.component.scss',
})
export class LlmStructureDialogComponent implements OnInit {
    data?: { llmStructure: LlmStructure; editMode: boolean } = inject(MAT_DIALOG_DATA);
    llmStructureService = inject(LlmStructureService);
    dialogRef = inject(MatDialogRef<LlmStructureDialogComponent>);
    formBuilder = inject(FormBuilder);

    frameworks = ['no-framework'];
    models = [
        'anthropic.claude-instant-v1',
        'anthropic.claude-v2',
        'anthropic.claude-v2:1',
        'anthropic.claude-3-haiku-20240307-v1:0',
        'anthropic.claude-3-sonnet-20240229-v1:0',
        'anthropic.claude-3-opus-20240229-v1:0',
        'anthropic.claude-3-5-haiku-20241022-v1:0',
        'anthropic.claude-3-5-sonnet-20240620-v1:0',
        'anthropic.claude-3-5-sonnet-20241022-v2:0',
    ];
    types = ['RAG', 'General Knowledge', 'Document'];
    ragSourceTypes = [
        // 'BEDROCK_OPENSEARCH', // not supported for no-framework
        'BEDROCK_KNOWLEDGE_BASE',
    ];
    documentSourceTypes = ['BEDROCK_DOCUMENT'];
    sourceTypes: string[] =
        this.data?.llmStructure.type === 'RAG'
            ? this.ragSourceTypes
            : this.data?.llmStructure.type === 'Document'
              ? this.documentSourceTypes
              : [];
    embeddingDrivers = ['BEDROCK_TITAN', 'BEDROCK_COHERE']; // for Bedrock OpenSearch only

    form: FormGroup = this.formBuilder.group({
        name: [this.data?.llmStructure?.name, [Validators.required, Validators.pattern(/^[A-Za-z0-9 .-]+$/)]],
        framework: [this.data?.llmStructure?.framework || 'no-framework', [Validators.required, arrayValidator(this.frameworks)]],
        memorySize: [
            this.data?.llmStructure?.memorySize || 0,
            [Validators.required, Validators.min(0), Validators.max(10), numberStepValidator(1)],
        ],
        model: [this.data?.llmStructure?.model, [Validators.required, arrayValidator(this.models)]],
        temperature: [
            this.data?.llmStructure?.temperature || 0.1,
            [Validators.required, Validators.min(0), Validators.max(1), numberStepValidator(0.1)],
        ],
        topP: [
            this.data?.llmStructure?.topP || 0.2,
            [Validators.required, Validators.min(0), Validators.max(1), numberStepValidator(0.1)],
        ],
        type: [
            {
                value: this.data?.llmStructure?.type || 'General Knowledge',
                disabled: !!this.data?.editMode,
            },
            [Validators.required, arrayValidator(this.types)],
        ],
        embeddingDriver: [this.data?.llmStructure?.embeddingDriver], // required type = RAG and source type = BEDROCK_OPENSEARCH
        sourceType: [this.data?.llmStructure?.sourceType], // required if type = RAG
        sourceId: [this.data?.llmStructure?.sourceId], // required if type = RAG
        isRagApi: [this.data?.llmStructure?.isRagApi || false],
        isHybridSearch: [this.data?.llmStructure?.isHybridSearch || false],
        topN: [this.data?.llmStructure?.topN || 5, [Validators.min(0)]],
        assistantAppendix: [this.data?.llmStructure?.assistantAppendix],
        preamble: [this.data?.llmStructure?.preamble],
    });

    isAdvancedOptionShown$ = signal<boolean>(false);

    ngOnInit() {
        this.form.get('type')?.valueChanges.subscribe((typeValue) => {
            if (typeValue === 'RAG') {
                this.sourceTypes = this.ragSourceTypes;
            } else if (typeValue === 'Document') {
                this.sourceTypes = this.documentSourceTypes;
            }
            const sourceTypeControl = this.form.get('sourceType');
            const sourceIdControl = this.form.get('sourceId');
            const embeddingDriverControl = this.form.get('embeddingDriver');
            if (this.isSourceRequired()) {
                sourceTypeControl?.setValidators([Validators.required, arrayValidator(this.sourceTypes)]);
                sourceIdControl?.setValidators([Validators.required]);
            } else {
                sourceTypeControl?.clearValidators();
                sourceIdControl?.clearValidators();
                embeddingDriverControl?.clearValidators();
            }
            sourceTypeControl?.updateValueAndValidity();
            sourceIdControl?.updateValueAndValidity();
            embeddingDriverControl?.updateValueAndValidity();
        });
        this.form.get('sourceType')?.valueChanges.subscribe((sourceTypeValue) => {
            const embeddingDriverControl = this.form.get('embeddingDriver');
            if (sourceTypeValue === 'BEDROCK_OPENSEARCH') {
                embeddingDriverControl?.setValidators([Validators.required, arrayValidator(this.embeddingDrivers)]);
            } else {
                embeddingDriverControl?.clearValidators();
            }
            embeddingDriverControl?.updateValueAndValidity();
        });
        this.llmStructureService.getModelList().subscribe((res) => {
            this.models = res.modelSummaries?.map((model) => model.modelId) || this.models;
        });
    }

    submit() {
        // Mark all fields as touched to trigger validation messages
        this.form.markAllAsTouched();

        if (!this.form.valid) {
            return;
        }

        const llmStructure = new LlmStructureModel({
            name: this.form.controls['name'].value,
            model: this.form.controls['model'].value,
            framework: this.form.controls['framework'].value,
            memorySize: parseInt(this.form.controls['memorySize'].value || 0),
            temperature: parseFloat(this.form.controls['temperature'].value || 0.1),
            topP: parseFloat(this.form.controls['topP'].value || 0.2),
            type: this.form.controls['type'].value,
            embeddingDriver: this.form.controls['embeddingDriver'].value,
            sourceType: this.form.controls['sourceType'].value,
            sourceId: this.form.controls['sourceId'].value,
            isRagApi: this.form.controls['isRagApi'].value,
            isHybridSearch: this.form.controls['isHybridSearch'].value,
            topN: parseInt(this.form.controls['topN'].value || 5),
            assistantAppendix: this.form.controls['assistantAppendix'].value,
            preamble: this.form.controls['preamble'].value,
        });
        if (this.data?.editMode) {
            llmStructure.type = this.data.llmStructure.type; // Type is NOT allowed to be updated

            // Copy IDs
            llmStructure.llmStructureId = this.data.llmStructure.llmStructureId;
            llmStructure.llmTaskId = this.data.llmStructure.llmTaskId;
            llmStructure.llmQueryEngineId = this.data.llmStructure.llmQueryEngineId;
            llmStructure.llmPromptDriverId = this.data.llmStructure.llmPromptDriverId;
            llmStructure.llmRulesetId = this.data.llmStructure.llmRulesetId;
        }
        this.llmStructureService.creatOrUpdate(llmStructure).subscribe(() => {
            console.log('LLM structure created/updated');
            this.dialogRef.close({
                submitted: true,
            });
        });
    }

    // ragApiCheckboxEvent() {
    //     if (this.form.get('isRagApi')?.value) {
    //         this.form.patchValue({ sourceType: 'BEDROCK_KNOWLEDGE_BASE' });
    //     }
    // }

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

    isSourceRequired(): boolean {
        const type = this.form.get('type')?.value;
        return ['RAG', 'Document'].includes(type);
    }
}
