import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../environments/environments';
import { Page, PageRequest } from '../interfaces/page.interface';
import { LlmRule, LlmRuleDb } from '../interfaces/llm-rule.interface';
import { LlmRuleModel } from '../models/llm-rule.model';
import { camelToSnake } from '../../shared/utils/general.utils';

export interface LlmRuleFilter {
    llmRulesetId: string;
    search: string;
}

@Injectable({
    providedIn: 'root',
})
export class LlmRuleService {
    http = inject(HttpClient);

    getList(request: PageRequest<LlmRule>, filter: LlmRuleFilter): Observable<Page<LlmRule>> {
        const url = `${API_URL}/llm-rule/list`;

        // Build filter params for request
        const filterParams: {
            name?: string;
            llm_ruleset_id?: string;
        } = {};
        if (filter.search) {
            filterParams.name = `ilike.%${filter.search}%`;
        }
        if (filter.llmRulesetId) {
            filterParams.llm_ruleset_id = `eq.${filter.llmRulesetId}`;
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
        return this.http.get<HttpResponse<LlmRuleDb[]>>(url, options).pipe(
            map((res: HttpResponse<LlmRuleDb[]>) => {
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
                    content: items.map((item) => LlmRuleModel.parseDb(item)),
                    totalItems: total,
                } as Page<LlmRule>;
            })
        );
    }

    get(id: string): Observable<LlmRule> {
        const options = {
            params: {
                llm_rule_id: `eq.${id}`,
            },
        };
        const url = `${API_URL}/llm-rule`;
        return this.http.get<LlmRuleDb[]>(url, options).pipe(map((res: LlmRuleDb[]) => LlmRuleModel.parseDb(res[0])));
    }

    create(body: LlmRuleModel) {
        const url = `${API_URL}/llm-rule`;
        return this.http.post(url, body.formatDb());
    }

    update(llmRuleId: string, body: LlmRuleModel) {
        const url = `${API_URL}/llm-rule`;
        return this.http.patch(url, body.formatDb(), {
            params: {
                llm_rule_id: `eq.${llmRuleId}`,
            },
        });
    }

    delete(llmRuleId: string) {
        const url = `${API_URL}/llm-rule`;
        const options = {
            params: {
                llm_rule_id: `eq.${llmRuleId}`,
            },
        };
        return this.http.delete(url, options);
    }
}
