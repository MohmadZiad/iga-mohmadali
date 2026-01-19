import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LlmDataSourceDb, LlmDataSource, LlmDataSourceSyncStatus } from '../interfaces/llm-data-source.interface';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../environments/environments';
import { Page, PageRequest } from '../interfaces/page.interface';
import { LlmDataSourceModel } from '../models/llm-data-source.model';

export interface LlmDataSourceFilter {
    search: string;
}

@Injectable({
    providedIn: 'root',
})
export class LlmDataSourceService {
    http = inject(HttpClient);

    getList(request: PageRequest<LlmDataSource>, filter: LlmDataSourceFilter): Observable<Page<LlmDataSource>> {
        const url = `${API_URL}/llm-data-source/list`;

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
        return this.http.get<HttpResponse<LlmDataSourceDb[]>>(url, options).pipe(
            map((res: HttpResponse<LlmDataSourceDb[]>) => {
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
                    content: items.map((item) => LlmDataSourceModel.parseDb(item)),
                    totalItems: total,
                } as Page<LlmDataSource>;
            })
        );
    }

    get(id: string): Observable<LlmDataSource> {
        const options = {
            params: {
                llm_data_source_id: `eq.${id}`,
            },
        };
        const url = `${API_URL}/llm-data-source`;
        return this.http
            .get<LlmDataSourceDb[]>(url, options)
            .pipe(map((res: LlmDataSourceDb[]) => LlmDataSourceModel.parseDb(res[0])));
    }

    create(body: LlmDataSource) {
        const url = `${API_URL}/llm-data-source`;
        return this.http.post(url, body);
    }

    updateName(llmDataSourceId: string, name: string) {
        const url = `${API_URL}/llm-data-sources`;
        return this.http.patch(
            url,
            {
                name: name,
            },
            {
                params: {
                    llm_data_source_id: `eq.${llmDataSourceId}`,
                },
            }
        );
    }

    updateIngestionJobId(llmDataSourceId: string, ingestionJobId: string) {
        const url = `${API_URL}/llm-data-source`;
        return this.http.patch(
            url,
            {
                ingestion_job_id: ingestionJobId,
            },
            {
                params: {
                    llm_data_source_id: `eq.${llmDataSourceId}`,
                },
            }
        );
    }

    delete(id: string) {
        const url = `${API_URL}/llm-data-source`;
        const options = {
            params: {
                llmDataSourceId: id,
            },
        };
        return this.http.delete(url, options);
    }

    sync(dataSourceId: string, knowledgeBaseId: string): Observable<LlmDataSourceSyncStatus> {
        const url = `${API_URL}/llm-data-source/sync`;
        return this.http.post<LlmDataSourceSyncStatus>(url, {
            dataSourceId,
            knowledgeBaseId,
        });
    }

    getSyncStatus(dataSourceId: string, knowledgeBaseId: string, ingestionJobId: string): Observable<LlmDataSourceSyncStatus> {
        const url = `${API_URL}/llm-data-source/sync/status`;
        const options = {
            params: {
                dataSourceId,
                knowledgeBaseId,
                ingestionJobId,
            },
        };
        return this.http.get<LlmDataSourceSyncStatus>(url, options);
    }
}
