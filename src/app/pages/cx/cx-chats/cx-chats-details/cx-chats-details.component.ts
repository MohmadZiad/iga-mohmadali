import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CxChat } from '../../../../data/interfaces/cx-chat.interface';
import { CxChatService } from '../../../../data/api-services/cx-chat.service';
import { MatList, MatListItem } from '@angular/material/list';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';

@Component({
    selector: 'app-cx-chats-details',
    imports: [
        MatListItem,
        MatList,
        MatCardContent,
        MatCardSubtitle,
        MatCardTitle,
        MatCardHeader,
        MatCard,
        MatCardActions,
        DatePipe,
        MatButton,
        MatButtonToggle,
        MatButtonToggleGroup,
        MatExpansionPanelTitle,
        MatExpansionPanelHeader,
        MatExpansionPanel,
        MatAccordion,
    ],
    templateUrl: './cx-chats-details.component.html',
    styleUrl: './cx-chats-details.component.scss',
})
export class CxChatsDetailsComponent {
    private router = inject(Router);
    cxChatService = inject(CxChatService);
    chatDetails = signal<Partial<CxChat> | null>({});

    readonly panelOpenState = signal(false);

    constructor() {
        const navigation = this.router.getCurrentNavigation();
        let details = navigation?.extras.state?.['chat'];

        if (!details) {
            details = this.cxChatService.getChatDetails();
        }

        this.chatDetails.set(details);
    }

    goBack() {
        this.router.navigate(['/cx/chats']);
    }
}
