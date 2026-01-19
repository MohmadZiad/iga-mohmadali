import { Component } from '@angular/core';
import { ChatAiAgentsHeaderComponent } from '../chat-ai-agents-header/chat-ai-agents-header.component';
import { ChatAiAgentsListComponent } from '../chat-ai-agents-list/chat-ai-agents-list.component';

@Component({
    selector: 'app-chat-ai-agents-container',
    imports: [ChatAiAgentsHeaderComponent, ChatAiAgentsListComponent],
    templateUrl: './chat-ai-agents-container.component.html',
    styleUrl: './chat-ai-agents-container.component.scss',
})
export class ChatAiAgentsContainerComponent {}
