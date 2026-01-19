import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { API_URL } from '../../../environments/environments';
import { map, Observable } from 'rxjs';
import { CxChannelDb, CxChannelList } from '../interfaces/cx-channel.interface';
import { CxChannelModel } from '../models/cx-channel.model';

@Injectable({
    providedIn: 'root',
})
export class CxChannelService {
    private http = inject(HttpClient);

    getChannelList(): Observable<CxChannelList> {
        const url = `${API_URL}/cx/channels/list`;
        const options = {
            observe: 'response' as 'body',
            headers: {
                Prefer: 'count=exact',
            },
            params: {},
        };

        return this.http.get<HttpResponse<CxChannelDb[]>>(url, options).pipe(
            map((res: HttpResponse<CxChannelDb[]>) => {
                const items = res.body || [];
                return items.map((item) => CxChannelModel.parseDb(item)) as CxChannelList;
            })
        );
    }
}
