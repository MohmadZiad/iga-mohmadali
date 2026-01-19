import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { API_URL } from '../../../environments/environments';
import { map, Observable } from 'rxjs';
import { CxProviderList } from '../interfaces/cx-provider.interface';

@Injectable({
    providedIn: 'root',
})
export class CxProviderService {
    private http = inject(HttpClient);

    getProviderList(): Observable<CxProviderList> {
        const url = `${API_URL}/cx/providers/list`;
        const options = {
            observe: 'response' as 'body',
            headers: {
                Prefer: 'count=exact',
            },
            params: {},
        };

        return this.http.get<any>(url, options).pipe(
            map((res: HttpResponse<CxProviderList>) => {
                return res.body || [];
            })
        );
    }
}
