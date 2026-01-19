import { FiltersData } from '../../interfaces/filter.interface';

export interface OrderStatisticsDB {
    total: number;
    count_number: number;
    rejected: number;
    cancelled: number;
    completed: number;
    completed_within_sla: number;
    returned: number;
    in_progress: number;
    electronic_count: number;
    in_person_count: number;
    individual_count: number;
    business_owner_count: number;
    approval_dependencies: number;
}

export interface OrderDB {
    service_name: string;
    service_id: string;
    order_status: string;
    order_number: string;
    personal_number_commercial_register: string;
    submission_date: string;
    completion_date: string;
    number_of_days: number;
    submission_channel: string;
    applicant_type: string;
    account_code: string;
    account_name?: string;
    approval_dependencies: boolean;
    approving_entity_code: string;

    account_id?: string;
    service_code: string;

    service_name_ar?: string;
    service_name_en?: string;
}

export interface FiltersOrdersData extends FiltersData {
    selectOrderStatuses?: string[];
}
