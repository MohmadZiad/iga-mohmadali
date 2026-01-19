import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../environments/environments';
import { BaseF2ApiResponse } from '../interfaces/base-api-response.interface';
import { CxBotList } from '../interfaces/cx-bot.interface';
import { isApiErrorStatusCode } from '../../shared/utils/http.utils';

@Injectable({
    providedIn: 'root',
})
export class CxBotService {
    http = inject(HttpClient);

    getList(): Observable<CxBotList> {
        const url = `${API_URL}/cx/bots/list`;

        return this.http.get<BaseF2ApiResponse>(url).pipe(
            map((res: BaseF2ApiResponse) => {
                try {
                    const { body, statusCode } = res;
                    const parsedBody = JSON.parse(body || '[]');

                    if (isApiErrorStatusCode(statusCode)) {
                        console.error('ChatBotService >> getList:', parsedBody.message || 'Unknown error');
                        return [];
                    }

                    return parsedBody as CxBotList;
                } catch (e) {
                    console.error('ChatBotService >> getList: JSON parsing error', e);
                    return [];
                }
            })
        );
    }
}
