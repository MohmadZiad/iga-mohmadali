import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../environments/environments';
import { BaseF2ApiResponse } from '../interfaces/base-api-response.interface';
import { ChatBotList } from '../interfaces/chat-bot.interface';
import { isApiErrorStatusCode } from '../../shared/utils/http.utils';

@Injectable({
    providedIn: 'root',
})
export class ChatBotService {
    http = inject(HttpClient);

    getList(): Observable<ChatBotList> {
        const url = `${API_URL}/chatbot-list-integration`;

        return this.http.get<BaseF2ApiResponse>(url).pipe(
            map((res: BaseF2ApiResponse) => {
                try {
                    const { body, statusCode } = res;
                    const parsedBody = JSON.parse(body || '[]');

                    if (isApiErrorStatusCode(statusCode)) {
                        console.error('ChatBotService >> getList:', parsedBody.message || 'Unknown error');
                        return [];
                    }

                    return parsedBody as ChatBotList;
                } catch (e) {
                    console.error('ChatBotService >> getList: JSON parsing error', e);
                    return [];
                }
            })
        );
    }
}
