import { Component, inject, OnInit, signal } from '@angular/core';
import { ChatAiAgentService } from '../../../../data/api-services/chat-ai-agent.service';
import { ChatAiAgentList } from '../../../../data/interfaces/chat-ai-agent.interface';

@Component({
    selector: 'app-chat-ai-agents-list',
    imports: [],
    templateUrl: './chat-ai-agents-list.component.html',
    styleUrl: './chat-ai-agents-list.component.scss',
})
export class ChatAiAgentsListComponent implements OnInit {
    private chatAiAgentService = inject(ChatAiAgentService);
    chatAiAgentList = signal<ChatAiAgentList>([]);

    ngOnInit() {
        this.chatAiAgentService.getList().subscribe({
            next: (data) => this.chatAiAgentList.set(data),
            error: (error) => console.error(error),
        });
    }
}
