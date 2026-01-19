import { FiltersData } from '../../interfaces/filter.interface';

export interface ReportItemDB {
    report_id?: string;
    account_id?: string;
    status?: string;
    filename?: string;
    created_at: string;
    user_name?: string;
    user_id?: string;
    state?: string;

    comment?: string;
    system_note?: string;
}

export interface FilterReportData extends FiltersData {
    searchUserName?: string;
    searchEntityName?: string; // accountName;
}
