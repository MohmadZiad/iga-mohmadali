import { Component, inject, OnInit, signal } from '@angular/core';
import { CxAiAgentService } from '../../../../data/api-services/cx-ai-agent.service';
import { CxAiAgentItem, CxAiAgentList } from '../../../../data/interfaces/cx-ai-agent.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-cx-ai-agents-list',
    imports: [],
    templateUrl: './cx-ai-agents-list.component.html',
    styleUrl: './cx-ai-agents-list.component.scss',
})
export class CxAiAgentsListComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private aiAgentService = inject(CxAiAgentService);
    aiAgentList = signal<CxAiAgentList>([]);

    ngOnInit() {
        this.aiAgentService.getAiAgentList().subscribe({
            next: (data) => this.aiAgentList.set(data),
            error: (error) => console.error(error),
        });
    }

    onAiAgentClick(agent: CxAiAgentItem) {
        this.aiAgentService.setAiAgentDetails(agent);
        this.router.navigate([`${agent.id}/details`], { relativeTo: this.route });
    }
}
