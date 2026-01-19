export interface FiltersData {
    startDate: string;
    endDate: string;

    previousStartDate?: string;
    previousEndDate?: string;

    selectServices?: string[];
    selectAccounts?: string[];
    selectAccount?: string;
    pageSize?: number;
    page?: number;
    search?: string;
}
