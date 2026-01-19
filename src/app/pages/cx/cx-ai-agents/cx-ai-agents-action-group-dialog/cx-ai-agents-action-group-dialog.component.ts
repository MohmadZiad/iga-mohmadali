import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogTitle } from '@angular/material/dialog';
import { CxActionGroup } from '../../../../data/interfaces/cx-ai-agent.interface';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-cx-ai-agents-action-group-dialog',
    imports: [MatDialogTitle, MatFormField, MatInput, MatButton, MatDialogClose, MatLabel],
    templateUrl: './cx-ai-agents-action-group-dialog.component.html',
    styleUrl: './cx-ai-agents-action-group-dialog.component.scss',
})
export class CxAiAgentsActionGroupDialogComponent implements OnInit {
    data: { editMode: boolean; actionGroup: CxActionGroup } = inject(MAT_DIALOG_DATA);

    ngOnInit(): void {
        console.log(this.data);
    }
}
