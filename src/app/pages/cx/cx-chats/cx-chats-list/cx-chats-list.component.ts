import { Component, computed, inject, OnInit } from '@angular/core';
import { CxChatService } from '../../../../data/api-services/cx-chat.service';
import { DatePipe } from '@angular/common';
import { CxChat } from '../../../../data/interfaces/cx-chat.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-cx-chats-list',
    imports: [DatePipe],
    templateUrl: './cx-chats-list.component.html',
    styleUrl: './cx-chats-list.component.scss',
})
export class CxChatsListComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private cxChatService = inject(CxChatService);
    chatList = computed(() => this.cxChatService.getChats());

    ngOnInit() {
        this.cxChatService.getList().subscribe({
            next: (data) => this.cxChatService.setChats(data),
            error: (err) => console.error(err),
        });
    }

    onChatClick(chat: CxChat) {
        this.cxChatService.setChatDetails(chat);
        this.router.navigate([`${chat.chatId}/details`], { relativeTo: this.route, state: { chatDetails: chat } });
    }
}
