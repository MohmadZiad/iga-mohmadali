import { ServiceItemDB } from '../service.interface';

type Language = 'ar' | 'en';

export class ServiceItem {
    static SERVICE_CODE_PATTERN = /^[EW]\.\d+\.[BR]\.\d+$/;

    accountId: string;
    sla: number;

    private _serviceNameAr: string;
    private _serviceNameEn: string;
    private _serviceId: string;
    private _accountNameEn: string;
    private _accountNameAr: string;

    private selectLanguage: Language = 'ar';

    constructor(item?: ServiceItemDB) {
        this._serviceNameAr = item?.service_name_ar || '';
        this._serviceNameEn = item?.service_name_en || '';
        this._serviceId = item?.service_code || '';
        this.accountId = item?.account_id || '';
        this._accountNameEn = item?.account_name_ar || '';
        this._accountNameAr = item?.account_name_en || '';
        this.sla = item?.sla || 0;
    }

    setLanguage(lang: Language) {
        this.selectLanguage = lang;
    }

    get serviceId(): string {
        return this._serviceId;
    }

    set serviceId(id: string) {
        if (ServiceItem.SERVICE_CODE_PATTERN.test(id)) {
            throw new Error('Invalid format service id');
        }
        this._serviceId = id;
    }

    get serviceName(): string {
        switch (this.selectLanguage) {
            case 'ar':
                return this._serviceNameAr;
            case 'en':
                return this._serviceNameEn;
            default:
                return this._serviceNameAr;
        }
    }

    set serviceName(name: string) {
        switch (this.selectLanguage) {
            case 'ar':
                this._serviceNameAr = name;
                break;
            case 'en':
                this._serviceNameEn = name;
                break;
            default:
                this._serviceNameAr = name;
                break;
        }
    }

    get accountName(): string {
        switch (this.selectLanguage) {
            case 'ar':
                return this._accountNameEn;
            case 'en':
                return this._accountNameAr;
            default:
                return this._accountNameEn;
        }
    }

    toDbFormat(): ServiceItemDB {
        const [accountCode, service_channel, service_type, beneficiary, service_external_id] = this._serviceId.split('.');

        console.log('accountCode :>> ', accountCode);
        return {
            service_name_ar: this._serviceNameAr,
            service_name_en: this._serviceNameEn,
            service_code: this.serviceId,
            account_id: this.accountId,
            service_channel,
            service_type,
            beneficiary,
            service_external_id,
            sla: this.sla,
            is_deleted: false,
        };
    }
}
