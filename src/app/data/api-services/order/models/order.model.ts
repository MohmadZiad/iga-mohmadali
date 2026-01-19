import { OrderDB } from '../order.interface';

type Language = 'ar' | 'en';

export class Order {
    orderStatus: string;
    orderNumber: string;
    registrationNumber: string;

    submissionDate: string;
    completionDate: string;

    numberOfDays: number;
    submissionChannel: string;
    applicantType: string;
    accountCode: string;
    approvalDependencies: string;
    approvingEntityCode: string;

    accountId?: string;
    serviceCode: string;

    serviceNameAr?: string;
    serviceNameEn?: string;

    private selectLanguage: Language = 'ar';

    constructor(item: OrderDB) {
        this.serviceNameAr = item.service_name_ar;
        this.serviceNameEn = item.service_name_en;
        this.orderStatus = item.order_status;
        this.serviceCode = item.service_code;
        this.orderNumber = item.order_number;
        this.registrationNumber = item.personal_number_commercial_register;

        this.submissionDate = item.submission_date;
        this.completionDate = item.completion_date;

        this.numberOfDays = item.number_of_days;
        this.submissionChannel = item.submission_channel;
        this.applicantType = item.applicant_type;
        this.accountCode = item.account_code;
        this.approvalDependencies = item.approval_dependencies ? 'Yes' : 'No';
        this.approvingEntityCode = item.approving_entity_code;
        this.accountId = item.account_id;
    }

    setLanguage(lang: Language) {
        this.selectLanguage = lang;
    }

    get serviceName(): string {
        switch (this.selectLanguage) {
            case 'ar':
                return this.serviceNameAr || '';
            case 'en':
                return this.serviceNameEn || '';
            default:
                return this.serviceNameAr || '';
        }
    }
}
