import { calculatePercentage } from '../../../../shared/utils/general.utils';
import { AccountItem } from '../../account/models';
import { ServiceStatisticsDB } from '../service.interface';

export class ServiceStatistics {
    accountId: string;
    serviceCode: string;
    account?: AccountItem;
    serviceNameAr: string;
    serviceNameEn: string;
    accountNameEn: string;
    accountNameAr: string;

    averageDays: number;
    fewestDays: number;
    mostDays: number;
    sla: number;

    countCompletedOrders: number;
    countExceedSLA: number;
    countMeetSLA: number;
    countReturnedOrders: number;
    countRejectedOrders: number;
    countCancelledOrders: number;
    countInProgressOrders: number;
    countApprovalDependencies: number;
    totalOrders: number;

    selectLanguage = 'ar';

    constructor(item: ServiceStatisticsDB) {
        this.accountId = item.account_id;
        this.serviceCode = item.service_code;

        this.averageDays = isNaN(item.average_days) ? 0 : Number(item.average_days);
        this.fewestDays = isNaN(item.fewest_days) ? 0 : Number(item.fewest_days);
        this.mostDays = isNaN(item.most_days) ? 0 : Number(item.most_days);

        this.sla = isNaN(item.sla) ? 0 : Number(item.sla);

        this.serviceNameAr = item.service_name_ar;
        this.serviceNameEn = item.service_name_en;

        this.accountNameAr = item.account_name_ar;
        this.accountNameEn = item.account_name_en;

        this.totalOrders = isNaN(item.total_orders) ? 0 : Number(item.total_orders);
        this.countCompletedOrders = isNaN(item.count_completed_orders) ? 0 : Number(item.count_completed_orders);
        this.countExceedSLA = isNaN(item.count_exceeded_completed_orders) ? 0 : Number(item.count_exceeded_completed_orders);
        this.countMeetSLA = this.countCompletedOrders - this.countExceedSLA;
        this.countReturnedOrders = isNaN(item.count_returned_orders) ? 0 : Number(item.count_returned_orders);
        this.countRejectedOrders = isNaN(item.count_rejected_orders) ? 0 : Number(item.count_rejected_orders);
        this.countCancelledOrders = isNaN(item.count_cancelled_orders) ? 0 : Number(item.count_cancelled_orders);
        this.countInProgressOrders = isNaN(item.count_in_progress_orders) ? 0 : Number(item.count_in_progress_orders);
        this.countApprovalDependencies = isNaN(item.count_approval_dependencies) ? 0 : Number(item.count_approval_dependencies);
    }

    get isExistsApprovalDependencies() {
        return this.countApprovalDependencies > 0 ? 'Yes' : 'No';
    }

    get rangeDays(): string {
        return `${this.fewestDays} - ${this.mostDays}`;
    }

    get rateExceedSLA(): number {
        return this.countCompletedOrders > 0 ? calculatePercentage(this.countExceedSLA, this.countCompletedOrders) : 0;
    }

    get rateMeetSLA(): number {
        return this.countCompletedOrders > 0 ? calculatePercentage(this.countMeetSLA, this.countCompletedOrders) : 0;
    }

    getStatisticsByStatus(status: string) {
        switch (status) {
            case 'executed/complete':
                return {
                    count: this.countCompletedOrders,
                    rate: calculatePercentage(this.countCompletedOrders, this.totalOrders),
                };
            case 'rejected':
                return {
                    count: this.countRejectedOrders,
                    rate: calculatePercentage(this.countRejectedOrders, this.totalOrders),
                };
            case 'cancelled':
                return {
                    count: this.countCancelledOrders,
                    rate: calculatePercentage(this.countCancelledOrders, this.totalOrders),
                };
            case 'in_progress':
                return {
                    count: this.countInProgressOrders,
                    rate: calculatePercentage(this.countInProgressOrders, this.totalOrders),
                };
            case 'returned':
            default:
                return {
                    count: this.countReturnedOrders,
                    rate: calculatePercentage(this.countReturnedOrders, this.totalOrders),
                };
        }
    }

    setAccount(account?: AccountItem) {
        this.account = account;
    }

    get serviceName(): string {
        switch (this.selectLanguage) {
            case 'ar':
                return this.serviceNameAr;
            case 'en':
                return this.serviceNameEn;
            default:
                return this.serviceNameAr;
        }
    }

    get entityName(): string {
        return this.account?.accountName || 'Unknown';
    }
}
