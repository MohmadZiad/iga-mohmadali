import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { API_URL } from '../../../environments/environments';
import { map, Observable } from 'rxjs';
import { CxChat, CxChatDb } from '../interfaces/cx-chat.interface';
import { CxChatModel } from '../models/cx-chat.model';

@Injectable({
    providedIn: 'root',
})
export class CxChatService {
    private http = inject(HttpClient);

    private chat = signal<Partial<CxChat>>({});
    private chats = signal<CxChat[]>([]);

    getChats() {
        return this.chats();
    }

    setChats(chats: CxChat[]) {
        this.chats.set(chats);
    }

    getChatDetails() {
        return this.chat();
    }

    setChatDetails(chat: CxChat) {
        this.chat.set(chat);
    }

    getChatById(id: string) {
        return this.chats().filter((chat) => chat.chatId === id);
    }

    getList(): Observable<CxChat[]> {
        const url = `${API_URL}/cx/chats/list`;

        const options = {
            observe: 'response' as 'body',
            headers: {
                Prefer: 'count=exact',
            },
            params: {},
        };

        return this.http.get<HttpResponse<CxChatDb[]>>(url, options).pipe(
            map((res: HttpResponse<CxChatDb[]>) => {
                const items = res.body || [];
                return items.map((item) => CxChatModel.parseDb(item)) as CxChat[];
            })
        );
    }
}
