import { Injectable } from '@angular/core';
import { API_URL } from '../../../../environments/environments';
import { map } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import * as Interfaces from './reports.interface';
import { Page } from '../../interfaces/page.interface';
import { UserService } from '../user/user.service';
import ReportItem from './report-item.model';
import { AccountService } from '../account/account.service';
import { getStartAndEndDateCurrentMonth } from '../../../shared/utils/date.utils';

export * from './reports.interface';
export { ReportItem };

@Injectable({
    providedIn: 'root',
})
export class ReportsService {
    constructor(
        private http: HttpClient,
        private userService: UserService,
        private accountService: AccountService
    ) {}

    getListWithoutReports(filterData: Interfaces.FilterReportData) {
        const url = API_URL + '/account/list/without-report';

        const datesMonth = getStartAndEndDateCurrentMonth();

        let params = new HttpParams()
            .set('select', 'account_id,reports()')
            .set('reports', 'is.null')
            .append('reports.uploaded_date', `gte.${datesMonth.start}`)
            .append('reports.uploaded_date', `lt.${datesMonth.end}`)
            .set('order', 'account_id.asc');

        if (!this.userService.isRootAccountUser) {
            params = params.set('account_id', 'eq.' + this.userService.authUser?.userAccountId);
        } else if (filterData.selectAccount) {
            params = params.set('account_id', 'eq.' + filterData.selectAccount);
        } else if (filterData.selectAccounts?.length) {
            params = params.set('account_id', `in.(${filterData.selectAccounts.join(',')})`);
        } else {
            params = params.set('account_id', 'neq.' + this.userService.authUser?.userAccountId);
        }

        const options = {
            params: params,
        };

        return this.http.get<Interfaces.ReportItemDB[]>(url, options).pipe(
            map((items: Interfaces.ReportItemDB[]) =>
                items.map((item) => {
                    const account = this.accountService.getAccountById(item.account_id as string);
                    const reportItem = new ReportItem(item);
                    reportItem.setAccount(account);
                    return reportItem;
                })
            )
        );
    }

    getList(filterData: Interfaces.FilterReportData) {
        const url = API_URL + '/report/list';

        // const pageSize = filterData.pageSize || 100000;
        // const pageNumber = filterData.page || 0;
        const pageSize = 100000;
        const pageNumber = 0;

        let params = new HttpParams()
            .set('select', '*,...user_refs(user_name),accounts()')
            .append('uploaded_date', 'gte.' + filterData.startDate)
            .append('uploaded_date', 'lte.' + filterData.endDate)
            .set('order', 'created_at.desc,account_id.asc')
            .set('offset', pageNumber * pageSize)
            .set('limit', pageSize.toString());

        if (!this.userService.isRootAccountUser) {
            params = params.set('account_id', 'eq.' + this.userService.authUser?.userAccountId);
        } else if (filterData.selectAccount) {
            params = params.set('account_id', 'eq.' + filterData.selectAccount);
        } else if (filterData.selectAccounts?.length) {
            params = params.set('account_id', `in.(${filterData.selectAccounts.join(',')})`);
        } else {
            params = params.set('account_id', 'neq.' + this.userService.authUser?.userAccountId);
        }

        if (filterData.searchUserName) {
            params = params.set('user_refs.user_name', `ilike.*${filterData.searchUserName}*`).set('user_refs', 'not.is.null');
        }

        if (filterData.searchEntityName) {
            params = params
                .set('accounts.account_name_en', `ilike.*${filterData.searchEntityName}*`)
                .set('accounts', 'not.is.null');
        }

        const options = {
            // observe: 'body' as const,
            // observe: 'response' as const,
            observe: 'response' as 'body', // TODO: option to return full response (body + headers), found on StackOverflow
            headers: {
                Prefer: 'count=exact',
            },
            params: params,
        };

        return this.http.get<HttpResponse<Interfaces.ReportItemDB[]>>(url, options).pipe(
            map((res: HttpResponse<Interfaces.ReportItemDB[]>): Page<ReportItem> => {
                const items = res.body || [];

                // determine total based on response
                // format: 0-9/22
                const range = res.headers.get('content-range');
                const contentRangeRegexp = /(\d+)\s?-\s?(\d+)?\s?\/?\s?(\d+|\*)?/;
                const groups = range?.match(contentRangeRegexp) || [];
                const total = groups[3] === '*' ? items.length : Number(groups[3]) || 0;
                return {
                    totalItems: total,
                    content: items.map((item) => {
                        const account = this.accountService.getAccountById(item.account_id as string);
                        const reportItem = new ReportItem(item);
                        reportItem.setAccount(account);
                        return reportItem;
                    }),
                };
            })
        );
    }

    insertReport(report: ReportItem) {
        const url = API_URL + '/report';

        const newReport = {
            report_id: report.reportId,
            filename: report.filename,
            account_id: this.userService.authUser?.userAccountId || '',
            comment: report.comment,
            system_note: report.systemNote,
        };

        return this.http.post<any>(url, newReport).pipe();
    }
}
