import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../environments/environments';
import { map, Observable } from 'rxjs';
import { BaseF2ApiResponse } from '../interfaces/base-api-response.interface';
import { isApiErrorStatusCode } from '../../shared/utils/http.utils';
import { ChatAiAgentList } from '../interfaces/chat-ai-agent.interface';

@Injectable({
    providedIn: 'root',
})
export class ChatAiAgentService {
    http = inject(HttpClient);

    getList(): Observable<ChatAiAgentList> {
        const url = `${API_URL}/ai-agent-list-integration`;

        return this.http.get<BaseF2ApiResponse>(url).pipe(
            map((res: BaseF2ApiResponse) => {
                try {
                    const { statusCode, body } = res;
                    const parsedBody = JSON.parse(body || '[]');

                    if (isApiErrorStatusCode(statusCode)) {
                        console.error('AiAgentService >> getList:', parsedBody.message || 'Unknown error');
                        return [];
                    }

                    return parsedBody as ChatAiAgentList;
                } catch (e) {
                    console.error('AiAgentService >> getList: JSON parsing error', e);
                    return [];
                }
            })
        );
    }
}
