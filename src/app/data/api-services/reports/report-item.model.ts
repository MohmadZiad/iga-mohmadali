import { MissedServicesItem } from '../../../pages/kpi/dialogs/missed-services-dialog/missed-services-dialog.component';
import { AccountItem } from '../account/models';
import { ReportItemDB } from './reports.interface';
import { DateTime } from 'luxon';

export default class ReportItem {
    accountId: string;
    reportId: string;
    status: string;
    filename: string;
    createdAt: DateTime;
    userName: string;

    state: string;
    account?: AccountItem;

    comment: string;
    systemNote: string;

    constructor(item?: ReportItemDB) {
        this.reportId = item?.report_id || '';
        this.status = item?.status || '';
        this.filename = item?.filename || '';
        this.createdAt = item?.created_at ? DateTime.fromISO(item.created_at) : DateTime.now();
        this.userName = item?.user_name || '';
        this.accountId = item?.account_id || '';

        this.state = item?.report_id ? 'تم تسليم' : 'لم يتم تسليم';

        this.comment = item?.comment || '';
        this.systemNote = item?.system_note || '';
    }

    setAccount(account?: AccountItem) {
        this.account = account;
    }

    setSystemNoteAboutMissedServices(notes: MissedServicesItem[]) {
        this.systemNote = JSON.stringify(notes);
    }

    prepareNewReport() {
        return {
            filename: this.filename,
            account_id: this.accountId,
            comment: this.comment || null,
            system_note: this.systemNote || null,
        };
    }

    get entityName(): string {
        return this.account?.accountName || 'Unknown';
    }

    get dateString() {
        return this.reportId ? this.createdAt.toLocaleString() : '';
    }

    get monthString() {
        return this.createdAt.toFormat('MMM');
    }

    get listMissedServices() {
        return this.systemNote ? JSON.parse(this.systemNote) : [];
    }

    get existsSystemNote() {
        return this.systemNote ? 'Yes' : 'No';
    }
}
