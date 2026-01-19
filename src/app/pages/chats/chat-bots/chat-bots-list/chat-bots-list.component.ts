import { Component, inject, OnInit, signal } from '@angular/core';
import { ChatBotList } from '../../../../data/interfaces/chat-bot.interface';
import { ChatBotService } from '../../../../data/api-services/chat-bot.service';

@Component({
    selector: 'app-chat-bots-list',
    imports: [],
    templateUrl: './chat-bots-list.component.html',
    styleUrl: './chat-bots-list.component.scss',
})
export class ChatBotsListComponent implements OnInit {
    private readonly chatbotService = inject(ChatBotService);
    chatBotList = signal<ChatBotList>([]);

    ngOnInit(): void {
        this.chatbotService.getList().subscribe({
            next: (data) => this.chatBotList.set(data),
            error: (err) => console.error(err),
        });
    }
}
