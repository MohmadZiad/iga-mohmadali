import { Component } from '@angular/core';
import { CxAiAgentsHeaderComponent } from '../cx-ai-agents-header/cx-ai-agents-header.component';
import { CxAiAgentsListComponent } from '../cx-ai-agents-list/cx-ai-agents-list.component';

@Component({
    selector: 'app-cx-ai-agents-container',
    imports: [CxAiAgentsHeaderComponent, CxAiAgentsListComponent],
    templateUrl: './cx-ai-agents-container.component.html',
    styleUrl: './cx-ai-agents-container.component.scss',
})
export class CxAiAgentsContainerComponent {}
