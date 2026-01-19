import { Component, inject, OnInit, signal } from '@angular/core';
import { CxAiAgentService } from '../../../../data/api-services/cx-ai-agent.service';
import { CxAiAgentItem } from '../../../../data/interfaces/cx-ai-agent.interface';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-cx-ai-agents-details',
    imports: [DatePipe],
    templateUrl: './cx-ai-agents-details.component.html',
    styleUrl: './cx-ai-agents-details.component.scss',
})
export class CxAiAgentsDetailsComponent implements OnInit {
    aiAgentService = inject(CxAiAgentService);
    aiAgentDetails = signal<CxAiAgentItem | null>(null);

    ngOnInit() {
        const details = this.aiAgentService.getAiAgentDetails();
        if (details) {
            this.aiAgentDetails.set(details);
        } else {
            // TODO: do request and get details from api
        }
    }
}
