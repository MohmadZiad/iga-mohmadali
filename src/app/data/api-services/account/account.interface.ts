export interface AccountItemDB {
    account_id: string;
    account_name_en: string;
    account_name_ar: string;
    account_code: string;
}

export interface AccountItemStatisticsDB {
    account_id: string;
    account_name_en: string;
    account_name_ar: string;
    count_services: number;
    count_completed_orders: number;
    count_exceeded_completed_orders: number;
    count_rejected_orders: number;
    count_cancelled_orders: number;
    count_returned_orders: number;
    count_in_progress_orders: number;
    count_orders: number;
}

export interface AccountListStatisticsDB {
    total_items: number;
    items: AccountItemStatisticsDB[];
}

export interface AccountListStatistics<T> {
    totalItems: number;
    items: T[];
}

export interface FilterAccountData {
    selectAccounts: string[];
    startDate: string;
    endDate: string;
    pageSize: number;
    page: number;
    search?: string;
}
