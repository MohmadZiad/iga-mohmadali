import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../environments/environments';
import { Page, PageRequest } from '../interfaces/page.interface';
import { camelToSnake } from '../../shared/services/utils';
import { LlmLog, LlmLogDb } from '../interfaces/llm-log.interface';
import { LlmLogModel } from '../models/llm-log.model';
import { DateTime } from 'luxon';

export interface LlmLogFilter {
    llmStructureId: string;
    search: string;
    startDate: DateTime;
    endDate: DateTime;
}

@Injectable({
    providedIn: 'root',
})
export class LlmLogService {
    http = inject(HttpClient);

    getList(request: PageRequest<LlmLog>, filter: LlmLogFilter): Observable<Page<LlmLog>> {
        const url = `${API_URL}/llm-log/list`;

        // Build filter params for request
        const filterParams: {
            or?: string;
            llm_structure_id?: string;
            and?: string;
        } = {};
        if (filter.search) {
            const questionSearch = `question.ilike.%${filter.search}%`;
            const answerSearch = `answer.ilike.%${filter.search}%`;
            filterParams.or = `(${questionSearch},${answerSearch})`;
        }
        if (filter.startDate || filter.endDate) {
            const startDateFilter = filter.startDate ? `created_at.gte.${filter.startDate.toISO()}` : null;
            const endDateFilter = filter.endDate ? `created_at.lte.${filter.endDate.toISO()}` : null;
            filterParams.and = `(${[startDateFilter, endDateFilter].filter(Boolean).join()})`;
        }
        if (filter.llmStructureId) {
            filterParams.llm_structure_id = `eq.${filter.llmStructureId}`;
        }

        const options = {
            observe: 'response' as 'body', // TODO: option to return full response (body + headers), found on StackOverflow
            headers: {
                Prefer: 'count=exact',
            },
            params: {
                select: '*',
                order: [request.sort?.property ? camelToSnake(request.sort.property) : null, request.sort?.order]
                    .filter(Boolean)
                    .join('.'),
                offset: request.page * request.size,
                limit: request.size,
                ...filterParams,
            },
        };
        return this.http.get<HttpResponse<LlmLogDb[]>>(url, options).pipe(
            map((res: HttpResponse<LlmLogDb[]>) => {
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
                    content: items.map((item) => LlmLogModel.parseDb(item)),
                    totalItems: total,
                } as Page<LlmLog>;
            })
        );
    }
}
