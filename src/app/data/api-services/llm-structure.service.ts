import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LlmStructure, LlmStructureDb } from '../interfaces/llm-structure.interface';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../environments/environments';
import { Page, PageRequest } from '../interfaces/page.interface';
import { LlmStructureModel } from '../models/llm-structure.model';

export interface LlmStructureFilter {
    search: string;
}

@Injectable({
    providedIn: 'root',
})
export class LlmStructureService {
    http = inject(HttpClient);

    getList(request: PageRequest<LlmStructure>, filter: LlmStructureFilter): Observable<Page<LlmStructure>> {
        const url = `${API_URL}/llm-structure/list`;

        // Build filter params for request
        const filterParams: {
            name?: string;
        } = {};
        if (filter.search) {
            filterParams.name = `ilike.%${filter.search}%`;
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
        return this.http.get<HttpResponse<LlmStructureDb[]>>(url, options).pipe(
            map((res: HttpResponse<LlmStructureDb[]>) => {
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
                    content: items.map((item) => LlmStructureModel.parseDb(item)),
                    totalItems: total,
                } as Page<LlmStructure>;
            })
        );
    }

    get(llmStructureId: string): Observable<LlmStructure> {
        const options = {
            params: {
                structure_id: llmStructureId, // TODO: change parameter to llm_structure_id
            },
        };
        const url = `${API_URL}/llm-structure`;
        return this.http.get<LlmStructureDb>(url, options).pipe(map((res: LlmStructureDb) => LlmStructureModel.parseDb(res)));
    }

    creatOrUpdate(body: LlmStructure) {
        const url = `${API_URL}/llm-structure`;
        return this.http.post(url, body);
    }

    delete(llmStructureId: string) {
        const url = `${API_URL}/llm-structure`;
        const options = {
            params: {
                llm_structure_id: `eq.${llmStructureId}`,
            },
        };
        return this.http.delete(url, options);
    }

    getModelList(): Observable<{ modelSummaries: { modelId: string }[] }> {
        const url = `${API_URL}/llm-structure/model/list`;
        const options = {
            params: {
                byProvider: 'Anthropic',
                byOutputModality: 'TEXT',
            },
        };
        return this.http.get<{ modelSummaries: { modelId: string }[] }>(url, options);
    }

    processing({
        llmStructureId,
        message,
    }: {
        llmStructureId: string;
        message: string;
    }): Observable<{ text: string; sessionId: string }> {
        const url = `${API_URL}/llm-structure/processing`;
        return this.http.post<{ text: string; sessionId: string }>(url, {
            llmStructureId,
            message,
        });
    }
}
