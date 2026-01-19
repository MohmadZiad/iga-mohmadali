import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../../environments/environments';
import { map } from 'rxjs';

import { UserService } from '../user/user.service';

import * as Interfaces from './order.interface';
export * from './order.interface';

import * as OrderModels from './models';
import { Page } from '../../interfaces/page.interface';
export * from './models';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    constructor(
        private http: HttpClient,
        private userService: UserService
    ) {}

    getStatistics(filterData: Interfaces.FiltersOrdersData) {
        const url = API_URL + '/order/list/statistics';

        return this.http
            .post<Interfaces.OrderStatisticsDB>(url, {
                start_date: filterData.startDate,
                end_date: filterData.endDate,
                previous_start_date: filterData.previousStartDate,
                previous_end_date: filterData.previousEndDate,

                selected_accounts: filterData.selectAccounts || (filterData.selectAccount && [filterData.selectAccount]) || [],
                selected_services: filterData.selectServices || [],
            })
            .pipe(map((res): OrderModels.OrderStatistics => new OrderModels.OrderStatistics(res)));
    }

    searchOrders(filterData: Interfaces.FiltersOrdersData) {
        const url = API_URL + '/order/list';
        const limit = filterData.pageSize || 10;
        let params = new HttpParams()
            .set(
                'select',
                'order_status, order_number, personal_number_commercial_register, submission_date, completion_date, number_of_days, submission_channel, applicant_type, approval_dependencies, approving_entity_code, service_code, ...services(service_name_ar)'
            )
            .append('submission_date', 'gte.' + filterData.startDate)
            .append('submission_date', 'lte.' + filterData.endDate)
            .append('limit', limit)
            .append('offset', (filterData.page || 0) * limit);

        if (filterData.selectAccount) {
            params = params.append('account_id', 'eq.' + filterData.selectAccount);
        }

        if (filterData.selectServices && filterData.selectServices.length > 0) {
            params = params.append('service_code', `in.(${filterData.selectServices.join(',')})`);
        }

        if (filterData.selectOrderStatuses && filterData.selectOrderStatuses.length > 0) {
            params = params.append('order_status', `in.(${filterData.selectOrderStatuses.join(',')})`);
        }

        return this.http
            .get<HttpResponse<Interfaces.OrderDB[]>>(url, {
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
                        number: filterData.page,
                        size: filterData.pageSize,
                        content: items.map((item): OrderModels.Order => new OrderModels.Order(item)),
                        totalItems: total,
                    } as Page<OrderModels.Order>;
                })
            );
    }

    insertOrders(orders: Interfaces.OrderDB[]) {
        const url = API_URL + '/order';
        orders = orders.map((order) => {
            return {
                ...order,
                account_id: this.userService.authUser?.userAccountId || '',
            };
        });
        return this.http.post<Interfaces.OrderDB[]>(url, orders, { headers: { Prefer: 'resolution=merge-duplicates' } }).pipe();
    }
}
