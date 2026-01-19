import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_URL, ROOT_ACCOUNT } from '../../../../environments/environments';
import { from, map, tap } from 'rxjs';
import { UserService } from '../user/user.service';

import * as Interfaces from './account.interface';
export * from './account.interface';

import * as Models from './models';
import { TranslateService } from '../../translate/translate.service';
export * from './models';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private selectedLocale = inject(TranslateService).selectedLocale;

    constructor(
        private http: HttpClient,
        private userService: UserService
    ) {}

    accountsList = signal<Models.AccountItem[]>([]);

    getList() {
        if (this.accountsList().length) {
            return from([this.accountsList()]);
        }

        const url = API_URL + '/account/list';
        let params = new HttpParams({
            fromObject: {
                select: '*',
            },
        });

        if (!this.userService.isRootAccountUser) {
            params = params.append('account_id', 'eq.' + this.userService.authUser?.userAccountId);
        } else {
            params = params.append('account_id', 'neq.' + this.userService.authUser?.userAccountId);
        }

        return this.http.get<Interfaces.AccountItemDB[]>(url, { params: params }).pipe(
            map((res): Models.AccountItem[] => res.map((item) => new Models.AccountItem(item, this.selectedLocale()))),
            tap((res) => this.accountsList.set(res))
        );
    }

    getListWithStatistics(filterDate: Interfaces.FilterAccountData) {
        const url = API_URL + '/entity/list/statistics';

        return this.http
            .post<Interfaces.AccountListStatisticsDB>(url, {
                start_date: filterDate.startDate,
                end_date: filterDate.endDate,
                page: filterDate.page * filterDate.pageSize || 0,
                page_size: filterDate.pageSize || 10,
                search: filterDate.search || '',
                selected_accounts: filterDate.selectAccounts,
            })
            .pipe(
                map(
                    (res): Interfaces.AccountListStatistics<Models.AccountItemStatistics> => ({
                        totalItems: res.total_items,
                        items: (res.items || [])
                            .filter((item) => item.account_id !== ROOT_ACCOUNT)
                            .map((item): Models.AccountItemStatistics => {
                                const accountItemStatistics = new Models.AccountItemStatistics(item);
                                const account = this.getAccountById(accountItemStatistics.accountId);
                                accountItemStatistics.setAccount(account);

                                return accountItemStatistics;
                            }),
                    })
                )
            );
    }

    getAccountById(accountId: string) {
        return this.accountsList().find((account) => account.accountId === accountId);
    }
}
