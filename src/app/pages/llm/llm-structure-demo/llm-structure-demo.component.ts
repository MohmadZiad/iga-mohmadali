import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { LlmStructureService } from '../../../data/api-services/llm-structure.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: 'app-llm-structure-demo',
    imports: [FormsModule, ReactiveFormsModule, CdkTextareaAutosize, NgClass, MatIconButton],
    templateUrl: './llm-structure-demo.component.html',
    styleUrl: './llm-structure-demo.component.scss',
})
export class LlmStructureDemoComponent {
    formBuilder = inject(FormBuilder);
    llmStructureService = inject(LlmStructureService);
    private readonly route = inject(ActivatedRoute);
    clipboard = inject(Clipboard);
    @ViewChild('messagesContainer') messagesContainer?: ElementRef;

    form: FormGroup = this.formBuilder.group({
        message: ['', [Validators.required]],
    });

    messages: { text: string; sender: string }[] = [];

    sendMessage() {
        if (!this.form.value.message) {
            return;
        }

        this.addMessage({
            text: this.form.value.message,
            sender: 'user',
        });

        const llmStructureId = this.route.parent?.snapshot.paramMap.get('structureId');

        this.llmStructureService
            .processing({
                llmStructureId: llmStructureId!,
                message: this.form.value.message,
            })
            .subscribe((res) => {
                console.log('res = ', res);
                this.addMessage({
                    text: res.text,
                    sender: 'llm',
                });
            });

        this.form.reset();
    }

    copyText(text: string): void {
        console.log('copyText -> text = ', text);
        const copied = this.clipboard.copy(text);
        console.log('copyText -> copied = ', copied);

        // TODO: show message
        // if (copied) {
        //     this._snackbarService.openSuccessSnackBar("Copied to Clipboard");
        // }
    }

    addMessage(message: { text: string; sender: string }) {
        this.messages.push({
            text: message.text,
            sender: message.sender,
        });

        // Scroll down
        const container = this.messagesContainer?.nativeElement;
        if (container) {
            setTimeout(
                () =>
                    container.scroll({
                        top: container.scrollHeight,
                        behavior: 'smooth',
                    }),
                100
            );
        }
    }
}
