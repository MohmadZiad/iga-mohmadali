import { AccountItemDB } from '../account.interface';

export class AccountItem {
    accountId: string;
    accountNameEn: string;
    accountNameAr: string;
    accountCode: string;

    logo = '';
    accountName: string;

    constructor(item: AccountItemDB, selectedLocale: 'ar' | 'en' = 'ar') {
        this.accountId = item.account_id;
        this.accountNameAr = item.account_name_ar;
        this.accountNameEn = item.account_name_en;
        this.accountCode = item.account_code;
        this.accountName = this.getAccountName(selectedLocale);
    }

    getAccountName(locale: string) {
        switch (locale) {
            case 'en':
                return this.accountNameEn;
            case 'ar':
            default:
                return this.accountNameAr;
        }
    }
}
