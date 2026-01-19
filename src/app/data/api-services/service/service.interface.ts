export interface ServiceStatisticsDB {
    account_id: string;
    service_code: string;

    service_name_en: string;
    service_name_ar: string;

    account_name_en: string;
    account_name_ar: string;

    average_days: number;
    fewest_days: number;
    most_days: number;
    sla: number;

    total_orders: number;
    count_rejected_orders: number;
    count_cancelled_orders: number;
    count_returned_orders: number;
    count_in_progress_orders: number;
    count_completed_orders: number;
    count_exceeded_completed_orders: number;
    count_approval_dependencies: number;
}

export interface ServiceItemDB {
    service_name_en?: string;
    service_name_ar?: string;
    service_code: string;
    account_name_en?: string;
    account_name_ar?: string;
    account_id: string;
    sla: number;
    service_channel: string;
    service_type: string;
    beneficiary: string;
    service_external_id: string;
    is_deleted?: boolean;
}
