import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { UserService } from '../user/user.service';
import { AccountService } from '../account/account.service';
import { FiltersData } from '../../interfaces/filter.interface';
import { Page } from '../../interfaces/page.interface';
import { API_URL } from '../../../../environments/environments';

import * as ServiceModels from './models';
export * from './models';

import * as Interfaces from './service.interface';
export * from './service.interface';

@Injectable({
    providedIn: 'root',
})
export class ServiceApiService {
    constructor(
        private http: HttpClient,
        private userService: UserService,
        private accountService: AccountService
    ) {}

    getSelfServices() {
        return this.getListServices({
            selectAccounts: [this.userService.authUser?.userAccountId],
            startDate: '',
            endDate: '',
        });
    }

    getServicesByPage(filterData?: FiltersData) {
        return this.getServicesRequest(filterData);
    }

    getListServices(filterData?: FiltersData) {
        return this.getServicesRequest(filterData).pipe(map((res: Page<ServiceModels.ServiceItem>) => res.content));
    }

    private getServicesRequest(filterData?: FiltersData) {
        const url = API_URL + '/service/list';
        let params = new HttpParams()
            .set('select', 'service_id,service_code,service_name_en,service_name_ar,account_id,sla')
            .set('is_deleted', 'eq.false') // TODO: Workaround to get only active services
            .append('limit', filterData?.pageSize || 5000)
            .append('offset', (filterData?.page || 0) * (filterData?.pageSize || 5000));

        if (filterData?.selectAccounts?.length) {
            params = params.append('account_id', `in.(${filterData.selectAccounts.join(',')})`);
        }
        if (filterData?.search) {
            params = params.append(
                'or',
                `(service_code.ilike.*${filterData.search}*,service_name_en.ilike.*${filterData.search}*,service_name_ar.ilike.*${filterData.search}*)`
            );
        }
        console.log('filterData :>> ', filterData);
        return this.http
            .get<HttpResponse<Interfaces.ServiceItemDB[]>>(url, {
                observe: 'response' as 'body', // TODO: option to return full response (body + headers), found on StackOverflow
                params,
                headers: {
                    Prefer: 'count=exact',
                },
            })
            .pipe(
                map((res) => {
                    const items = res.body || [];

                    // determine total based on response
                    // format: 0-9/22
                    const range = res.headers.get('content-range');
                    const contentRangeRegexp = /(\d+)\s?-\s?(\d+)?\s?\/?\s?(\d+|\*)?/;
                    const groups = range?.match(contentRangeRegexp) || [];
                    const total = groups[3] === '*' ? items.length : Number(groups[3]) || 0;

                    return {
                        number: filterData?.page,
                        size: filterData?.pageSize,
                        content: items.map((item) => new ServiceModels.ServiceItem(item)),
                        totalItems: total,
                    } as unknown as Page<ServiceModels.ServiceItem>;
                })
            );
    }

    getServiceStatistics(filterData: FiltersData) {
        const url = API_URL + '/service/list/statistics';

        return this.http
            .post<Interfaces.ServiceStatisticsDB[]>(url, {
                start_date: filterData.startDate,
                end_date: filterData.endDate,
                selected_accounts: filterData.selectAccounts || (filterData.selectAccount && [filterData.selectAccount]) || [],
                selected_services: filterData.selectServices || [],

                //TODO: follow pagination params not used at the moment
                page: 0,
                page_size: 0,
            })
            .pipe(
                map((res): Interfaces.ServiceStatisticsDB[] => res || []),
                map((res): ServiceModels.ServiceStatistics[] =>
                    res.map((item) => {
                        const account = this.accountService.getAccountById(item.account_id);
                        const serviceStatistics = new ServiceModels.ServiceStatistics(item);
                        serviceStatistics.setAccount(account);
                        return serviceStatistics;
                    })
                )
            );
    }

    insertService(service: ServiceModels.ServiceItem) {
        const url = API_URL + '/service';
        return this.http.post<Interfaces.ServiceItemDB>(url, [service.toDbFormat()], {
            headers: { Prefer: 'resolution=merge-duplicates' },
        });
    }

    deleteService(id: string) {
        const url = API_URL + '/service';
        return this.http.delete<Interfaces.ServiceItemDB>(url, { params: { service_code: `eq.${id}` } });
    }
}
