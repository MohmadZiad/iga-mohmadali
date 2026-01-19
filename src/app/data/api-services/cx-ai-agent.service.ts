import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../environments/environments';
import { map, Observable } from 'rxjs';
import { BaseF2ApiResponse } from '../interfaces/base-api-response.interface';
import { isApiErrorStatusCode } from '../../shared/utils/http.utils';
import {
    CxActionGroupListRequest,
    CxActionGroupListResponse,
    CxActionGroupRequest,
    CxActionGroupResponse,
    CxActionGroupSummary,
    CxActionGroupFilter,
    CxAiAgentItem,
    CxAiAgentList,
} from '../interfaces/cx-ai-agent.interface';
import { Page, PageRequest } from '../interfaces/page.interface';

@Injectable({
    providedIn: 'root',
})
export class CxAiAgentService {
    private http = inject(HttpClient);

    private aiAgentDetails = signal<CxAiAgentItem | null>(null);

    getAiAgentDetails() {
        return this.aiAgentDetails();
    }

    setAiAgentDetails(aiAgentDetails: CxAiAgentItem) {
        this.aiAgentDetails.set(aiAgentDetails);
    }

    getAiAgentList(): Observable<CxAiAgentList> {
        const url = `${API_URL}/cx/ai-agents/list`;

        return this.http.get<BaseF2ApiResponse>(url).pipe(
            map((res: BaseF2ApiResponse) => {
                try {
                    const { statusCode, body } = res;
                    const parsedBody = JSON.parse(body || '[]');

                    if (isApiErrorStatusCode(statusCode)) {
                        console.error('AiAgentService >> getList:', parsedBody.message || 'Unknown error');
                        return [];
                    }

                    return parsedBody as CxAiAgentList;
                } catch (e) {
                    console.error('AiAgentService >> getList: JSON parsing error', e);
                    return [];
                }
            })
        );
    }

    getActionGroup(req: CxActionGroupRequest): Observable<CxActionGroupResponse> {
        const url = `${API_URL}/cx/ai-agents/action-groups`;
        const options = {
            params: {
                agentId: req.agentId,
                agentVersion: req.agentVersion,
                actionGroupId: req.actionGroupId,
            },
        };

        return this.http.get<CxActionGroupResponse>(url, options);
    }

    getActionGroupList(
        request: PageRequest<CxActionGroupSummary>,
        _filter: CxActionGroupFilter,
        params: CxActionGroupListRequest
    ): Observable<Page<CxActionGroupSummary>> {
        const url = `${API_URL}/cx/ai-agents/action-groups/list`;
        const options = {
            params: {
                agentId: params.agentId,
                agentVersion: params.agentVersion,
            },
        };

        return this.http.get<CxActionGroupListResponse>(url, options).pipe(
            map((response: CxActionGroupListResponse) => {
                const items = response.actionGroupSummaries || [];

                return {
                    number: request.page,
                    size: request.size,
                    content: items,
                    totalItems: items.length,
                } as Page<CxActionGroupSummary>;
            })
        );
    }
}
