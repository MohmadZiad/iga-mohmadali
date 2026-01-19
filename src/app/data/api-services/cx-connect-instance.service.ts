import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../environments/environments';
import { BaseF2ApiResponse } from '../interfaces/base-api-response.interface';
import { isApiErrorStatusCode } from '../../shared/utils/http.utils';
import { CxConnectInstance, CxConnectInstanceList } from '../interfaces/cx-connect-instance.interface';

@Injectable({
    providedIn: 'root',
})
export class CxConnectInstanceService {
    private http = inject(HttpClient);

    private instanceDetails = signal<CxConnectInstance | null>(null);

    getInstanceDetails() {
        return this.instanceDetails();
    }

    setInstanceDetails(instance: CxConnectInstance) {
        this.instanceDetails.set(instance);
    }

    getList(): Observable<CxConnectInstanceList> {
        const url = `${API_URL}/cx/connect-instances/list`;

        return this.http.get<BaseF2ApiResponse>(url).pipe(
            map((res: BaseF2ApiResponse) => {
                try {
                    const { body, statusCode } = res;
                    const parsedBody = JSON.parse(body || '[]');

                    if (isApiErrorStatusCode(statusCode)) {
                        console.error('ConnectInstanceService >> getList:', parsedBody.message || 'Unknown error');
                        return [];
                    }

                    return parsedBody as CxConnectInstanceList;
                } catch (e) {
                    console.error('ConnectInstanceService >> getList: JSON parsing error', e);
                    return [];
                }
            })
        );
    }
}
