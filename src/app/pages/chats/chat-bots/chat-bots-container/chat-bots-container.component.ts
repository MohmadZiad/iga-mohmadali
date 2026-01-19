import { Component } from '@angular/core';
import { ChatBotsHeaderComponent } from '../chat-bots-header/chat-bots-header.component';
import { ChatBotsListComponent } from '../chat-bots-list/chat-bots-list.component';

@Component({
    selector: 'app-chat-bots-container',
    imports: [ChatBotsHeaderComponent, ChatBotsListComponent],
    templateUrl: './chat-bots-container.component.html',
    styleUrl: './chat-bots-container.component.scss',
})
export class ChatBotsContainerComponent {}
