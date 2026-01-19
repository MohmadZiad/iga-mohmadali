import { Component } from '@angular/core';
import { CxChatsHeaderComponent } from '../cx-chats-header/cx-chats-header.component';
import { CxChatsListComponent } from '../cx-chats-list/cx-chats-list.component';

@Component({
    selector: 'app-cx-chats-container',
    imports: [CxChatsHeaderComponent, CxChatsListComponent],
    templateUrl: './cx-chats-container.component.html',
    styleUrl: './cx-chats-container.component.scss',
})
export class CxChatsContainerComponent {}
