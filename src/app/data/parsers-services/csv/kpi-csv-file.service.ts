import { OrderDB } from '../../api-services/order/order.service';
import * as Papa from 'papaparse';

import { FieldTypes, StringField, DateField, NumberField, EnumsStringField, BooleanField } from '../fields';
const HEADERS_CSV: Record<string, string> = {
    'Service Code': 'service_code',
    'Service Name': 'service_name',
    'Order Number': 'order_number',
    'Personal Number/Commercial Register': 'personal_number_commercial_register',
    'Entity Name': 'account_name',
    'Entity Code': 'account_code',
    'Approval Dependencies': 'approval_dependencies',
    'Approving Entity Code': 'approving_entity_code',
    'Submission Date': 'submission_date',
    'Application Completion Date': 'completion_date',
    'Number of Days': 'number_of_days',
    'Order Status': 'order_status',
    'Application Submission Channel': 'submission_channel',
    'Applicant Type': 'applicant_type',
};
//TODO: Need rewrite this service.
export class KpiCsvFileService {
    private dbColumns: Record<string, FieldTypes> = {
        account_name: new StringField(),
        account_code: new StringField(),
        approval_dependencies: new BooleanField(),
        approving_entity_code: new StringField(),

        service_code: new StringField(),
        service_name: new StringField(),
        order_number: new StringField(),
        personal_number_commercial_register: new StringField(),

        submission_date: new DateField(),
        completion_date: new DateField(),

        number_of_days: new NumberField(),

        order_status: new EnumsStringField(['executed/completed', 'in_progress', 'returned', 'rejected']),
        submission_channel: new EnumsStringField(['electronic', 'in-person']),
        applicant_type: new EnumsStringField(['individual/citizen', 'individual/resident', 'business_owner']),
    };

    private fileData: OrderDB[] = [];

    fileType = 'text/csv';

    getExampleFile() {
        const data = Object.entries(HEADERS_CSV).reduce((acc: Record<string, string>, [csvKey, dbKey]) => {
            if (this.dbColumns[dbKey]) {
                acc[csvKey] = this.dbColumns[dbKey].toGetExampleData();
            }
            return acc;
        }, {});

        return [data];
    }

    processFile(fileString: string) {
        const { data, meta }: Papa.ParseResult<OrderDB> = Papa.parse(fileString, {
            header: true,
            delimiter: ',',
            skipEmptyLines: true,

            transformHeader(header) {
                if (HEADERS_CSV[header]) {
                    return HEADERS_CSV[header];
                }
                return header;
            },
            transform: (value, field) => {
                if (this.dbColumns[field]) {
                    return this.dbColumns[field].parseData(value);
                }
                return value;
            },
        });
        if (!Object.keys(this.dbColumns).every((filedName: string) => meta.fields?.includes(filedName))) {
            this.clearFile();
            throw new Error('Invalid file format');
        }
        this.fileData = data;
    }

    getFileData() {
        return this.fileData;
    }

    clearFile() {
        this.fileData = [];
    }
}
