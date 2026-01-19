import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../environments/environments';
import { Page, PageRequest } from '../interfaces/page.interface';
import { camelToSnake } from '../../shared/services/utils';
import { LlmStructureSharedToken, LlmStructureSharedTokenDb } from '../interfaces/llm-structure-shared-token.interface';
import { LlmStructureSharedTokenModel } from '../models/llm-structure-shared-token.model';

export interface LlmStructureSharedTokenFilter {
    llmStructureId: string;
    search: string;
}

@Injectable({
    providedIn: 'root',
})
export class LlmStructureSharedTokenService {
    http = inject(HttpClient);

    getList(
        request: PageRequest<LlmStructureSharedToken>,
        filter: LlmStructureSharedTokenFilter
    ): Observable<Page<LlmStructureSharedToken>> {
        const url = `${API_URL}/llm-structure/shared-token/list`;

        // Build filter params for request
        const filterParams: {
            description?: string;
            llm_structure_id?: string;
        } = {};
        if (filter.search) {
            filterParams.description = `ilike.%${filter.search}%`;
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
        return this.http.get<HttpResponse<LlmStructureSharedTokenDb[]>>(url, options).pipe(
            map((res: HttpResponse<LlmStructureSharedTokenDb[]>) => {
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
                    content: items.map((item) => LlmStructureSharedTokenModel.parseDb(item)),
                    totalItems: total,
                } as Page<LlmStructureSharedToken>;
            })
        );
    }

    get(id: string): Observable<LlmStructureSharedToken> {
        const options = {
            params: {
                llm_structure_shared_token_id: `eq.${id}`,
            },
        };
        const url = `${API_URL}/llm-structure/shared-token`;
        return this.http
            .get<LlmStructureSharedTokenDb[]>(url, options)
            .pipe(map((res: LlmStructureSharedTokenDb[]) => LlmStructureSharedTokenModel.parseDb(res[0])));
    }

    create(body: LlmStructureSharedTokenModel) {
        const url = `${API_URL}/llm-structure/shared-token`;
        return this.http.post(url, body.formatDb());
    }

    update(llmStructureSharedTokenId: string, body: LlmStructureSharedTokenModel) {
        const url = `${API_URL}/llm-structure/shared-token`;
        return this.http.patch(url, body.formatDb(), {
            params: {
                llm_structure_shared_token_id: `eq.${llmStructureSharedTokenId}`,
            },
        });
    }

    delete(llmStructureSharedTokenId: string) {
        const url = `${API_URL}/llm-structure/shared-token`;
        const options = {
            params: {
                llm_structure_shared_token_id: `eq.${llmStructureSharedTokenId}`,
            },
        };
        return this.http.delete(url, options);
    }
}
