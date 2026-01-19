import { calculatePercentage } from '../../../../shared/utils/general.utils';
import { AccountItemStatisticsDB } from '../account.interface';
import { AccountItem } from './account-item.model';

export class AccountItemStatistics {
    accountId: string;
    account?: AccountItem;

    accountNameEn: string;
    accountNameAr: string;

    countServices: number;

    countCancelledOrders: number;
    countRejectedOrders: number;
    countCompletedOrders: number;
    countReturnedOrders: number;
    countInProgressOrders: number;

    countExceedSLA: number;
    rateExceedSLA: number;

    countOrders: number;

    constructor(item: AccountItemStatisticsDB) {
        this.accountId = item.account_id;
        this.accountNameAr = item.account_name_ar;
        this.accountNameEn = item.account_name_en;

        this.countServices = item.count_services;

        this.countCompletedOrders = item.count_completed_orders;
        this.countRejectedOrders = item.count_rejected_orders;
        this.countCancelledOrders = item.count_cancelled_orders;
        this.countReturnedOrders = item.count_returned_orders;
        this.countInProgressOrders = item.count_in_progress_orders;

        this.countExceedSLA = item.count_exceeded_completed_orders;
        this.countOrders = item.count_orders;

        this.rateExceedSLA = calculatePercentage(item.count_exceeded_completed_orders, item.count_completed_orders);
    }

    setAccount(account?: AccountItem) {
        this.account = account;
    }

    getPercentageOfTotalOrders(count: number) {
        return calculatePercentage(count, this.countOrders);
    }

    get accountName(): string {
        return this.account?.accountName || 'Unknown';
    }

    get countMeetSLA() {
        return this.countCompletedOrders - this.countExceedSLA;
    }

    get rateMeetSLA() {
        return calculatePercentage(this.countMeetSLA, this.countCompletedOrders);
    }

    get rateInProgressOrders() {
        return this.getPercentageOfTotalOrders(this.countInProgressOrders);
    }

    get rateReturnedOrders() {
        return this.getPercentageOfTotalOrders(this.countReturnedOrders);
    }

    get rateRejectedOrders() {
        return this.getPercentageOfTotalOrders(this.countRejectedOrders);
    }

    get rateCancelledOrders() {
        return this.getPercentageOfTotalOrders(this.countRejectedOrders);
    }

    get rateCompletedOrders() {
        return this.getPercentageOfTotalOrders(this.countCompletedOrders);
    }
}
