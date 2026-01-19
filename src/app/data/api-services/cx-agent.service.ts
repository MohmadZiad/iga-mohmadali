import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { API_URL } from '../../../environments/environments';
import { Page, PageRequest } from '../interfaces/page.interface';
import { map, Observable } from 'rxjs';
import { CxAgent, CxAgentDb, CxAgentFilter } from '../interfaces/cx-agent.interface';
import { CxAgentModel } from '../models/cx-agent.model';

@Injectable({
    providedIn: 'root',
})
export class CxAgentService {
    private http = inject(HttpClient);

    getList(request: PageRequest<CxAgent>, filter: CxAgentFilter): Observable<Page<CxAgent>> {
        const url = `${API_URL}/cx/agents/list`;

        const filterParams: {
            username?: string;
        } = {};
        if (filter.search) {
            filterParams.username = `ilike.%${filter.search}%`;
        }

        const options = {
            observe: 'response' as 'body', // TODO: option to return full response (body + headers), found on StackOverflow
            headers: {
                Prefer: 'count=exact',
            },
            params: {
                select: '*',
                order: [request.sort?.property, request.sort?.order].filter(Boolean).join('.'),
                offset: request.page * request.size,
                limit: request.size,
                ...filterParams,
            },
        };

        return this.http.get<HttpResponse<CxAgentDb[]>>(url, options).pipe(
            map((res: HttpResponse<CxAgentDb[]>) => {
                const items = res.body || [];

                // determine total based on response
                // format: 0-9/22
                const range = res.headers.get('content-range');
                const contentRangeRegexp = /(\d+)\s?-\s?(\d+)?\s?\/?\s?(\d+|\*)?/;
                const groups = range?.match(contentRangeRegexp) || [];
                const total = groups[3] === '*' ? items.length : Number(groups[3]) || 0;

                return {
                    number: request.page,
                    size: request.size,
                    content: items.map((item) => CxAgentModel.parseDb(item)),
                    totalItems: total,
                } as Page<CxAgent>;
            })
        );
    }
}
