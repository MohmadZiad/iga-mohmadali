import { UserService } from './../../api-services/user/user.service';
import * as ExcelJS from 'exceljs';
import { BooleanField, DateField, EnumsStringField, FieldTypes, NumberField, StringField } from '../fields';
import { OrderDB } from '../../api-services/order/order.interface';
import { inject, Injectable } from '@angular/core';
import { ServiceItem } from '../../api-services/service/models';

@Injectable({
    providedIn: 'root',
})
export class KpiExcelParser {
    private dbColumns: FieldTypes[] = [
        new StringField('service_code', 'Service Code'),
        new StringField('service_name', 'Service Name'),

        // new StringField('account_name', 'Entity Name'),
        new StringField('account_code', 'Entity Code'),

        new StringField('order_number', 'Order Number'),
        new StringField('personal_number_commercial_register', 'Personal Number/Commercial Register'),

        new DateField('submission_date', 'Submission Date'),
        new DateField('completion_date', 'Application Completion Date'),
        new EnumsStringField(
            // TODO: Need approve and new design for new status order
            // ['Executed/Complete', 'In Progress', 'Returned', 'Rejected', 'Cancelled'],
            ['Executed/Complete', 'In Progress', 'Returned', 'Rejected'],
            'order_status',
            'Order Status'
        ),
        new NumberField('number_of_days', 'Number of Days', 0),

        new EnumsStringField(['Electronic', 'In-person'], 'submission_channel', 'Application Submission Channel'),
        new EnumsStringField(['Individual/Citizen', 'Individual/Resident', 'Business Owner'], 'applicant_type', 'Applicant Type'),

        new BooleanField('approval_dependencies', 'Approval Dependencies'),
        // new StringField('approving_entity_code', 'Approving Entity Code'),
    ];

    private userService = inject(UserService);

    private orderNumbersList = new Set<string>();

    private availableService: ServiceItem[] = [];

    fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    setServiceCodes(codes: ServiceItem[]) {
        this.availableService = codes;
    }

    getMissedServices(orders: OrderDB[]) {
        return Array.from(
            orders.reduce((acc, order) => {
                const service = this.availableService.find((item) => item.serviceId === order.service_code);
                if (service) {
                    acc.delete(service);
                }
                return acc;
            }, new Set<ServiceItem>(this.availableService)),
            (item) => ({
                code: item.serviceId,
                name: item.serviceName,
            })
        );
    }

    async getExampleFileURL() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1', { views: [{ state: 'frozen', ySplit: 1 }] });

        worksheet.columns = this.dbColumns.map((column) => ({
            header: column.label,
            key: column.key,
            values: [column.label],
            width: 15,
        }));

        worksheet.addRow(
            this.dbColumns.map((column) => {
                return column.toGetExampleData();
            })
        );

        this.dbColumns.forEach((column) => {
            const enumCeil = worksheet.getColumn(column.key);
            enumCeil.eachCell({ includeEmpty: true }, (_cell, _rowNumber) => {
                if (column instanceof EnumsStringField && _rowNumber !== 1) {
                    _cell.dataValidation = {
                        type: 'list',
                        allowBlank: true,
                        formulae: [`"${column.enums.join(',')}"`],
                    };
                }
                _cell.alignment = {
                    wrapText: true,
                    vertical: 'middle',
                    horizontal: 'center',
                };
            });
        });

        const bufferFile = await workbook.xlsx.writeBuffer();
        const blob = new Blob([bufferFile], { type: this.fileType });

        return window.URL.createObjectURL(blob);
    }

    async parse(fileContent: ArrayBuffer): Promise<OrderDB[]> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileContent);
        const [worksheet] = workbook.worksheets;
        if (!worksheet) throw new Error('Worksheet not found in file');

        const response: OrderDB[] = [];
        const errorsList: string[][] = [['cell', 'Value', 'Error message']];

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber === 1 || row.values.length === 0) return;

            const record = this.dbColumns.reduce((acc, field, index) => {
                const cell = row.getCell(index + 1);
                try {
                    const value = field.parseData(cell?.value?.toString() || '');
                    acc = { ...acc, [field.key]: value };
                    this.validateRecord(acc, field.key);
                } catch (error) {
                    if (error instanceof Error) {
                        errorsList.push([cell?.address, error.cause as string, error.message]);
                    } else {
                        console.error(error);
                    }
                }
                return acc;
            }, {} as OrderDB);

            response.push(record);
        });

        this.orderNumbersList.clear();
        if (response.length === 0) throw new Error('No data found in file');

        if (errorsList.length > 1) {
            const fileURL = await this.prepareErrorsList(errorsList, workbook);
            throw new ParseError(
                'Errors were found while parsing the provided file. Please check the details on sheet "Errors" in the file from downloads.',
                fileURL
            );
        }

        return response;
    }

    private async prepareErrorsList(errorsList: string[][], workbook: ExcelJS.Workbook) {
        const worksheet = workbook.getWorksheet('Errors');
        if (worksheet) {
            workbook.removeWorksheet(worksheet.id);
        }

        const worksheetErrors = workbook.addWorksheet('Errors', { views: [{ state: 'frozen', ySplit: 1 }] });
        worksheetErrors.addRows(errorsList);

        const bufferFile = await workbook.xlsx.writeBuffer();
        const blob = new Blob([bufferFile], { type: this.fileType });

        return window.URL.createObjectURL(blob);
    }

    private validateRecord(record: OrderDB, key: string) {
        switch (key) {
            case 'order_number':
                if (!record.order_number) {
                    throw new Error('Order number is required.', { cause: record.order_number });
                } else if (this.orderNumbersList.has(record.order_number)) {
                    throw new Error(`Order number "${record.order_number}" occurs more than 1 time in file`, {
                        cause: record.order_number,
                    });
                }
                this.orderNumbersList.add(record.order_number);
                break;
            case 'service_code':
                if (!record.service_code) {
                    throw new Error('Service code is required', { cause: record.service_code });
                } else if (!this.availableService.some((service) => service.serviceId === record.service_code)) {
                    throw new Error(
                        'The provided service code is invalid, not registered in the system, or belongs to another Entity account.',
                        { cause: record.service_code }
                    );
                }
                break;
            case 'submission_date':
                if (!record.submission_date) {
                    throw new Error('Submission date is required', { cause: record.submission_date });
                } else if (Date.now() < new Date(record.submission_date).getTime()) {
                    throw new Error(
                        'Submission date cannot be in the future. Also, please check format date should be dd/MM/yyyy or change format cell on date.',
                        { cause: record.submission_date }
                    );
                }
                break;
            case 'completion_date':
                if (
                    record.completion_date &&
                    new Date(record.completion_date).getTime() < new Date(record.submission_date).getTime()
                ) {
                    throw new Error('Completion date must be greater or equal than submission date.', {
                        cause: record.completion_date,
                    });
                } else if (record.completion_date && Date.now() < new Date(record.completion_date).getTime()) {
                    throw new Error(
                        'Completion date cannot be in the future. Also, please check format date should be dd/MM/yyyy or change format cell on date.',
                        {
                            cause: record.completion_date,
                        }
                    );
                }
                break;
            case 'number_of_days':
                if (record.number_of_days !== null && record.number_of_days < 0) {
                    throw new Error("Number of days can't be negative", { cause: record.number_of_days });
                }
                break;
            case 'account_code':
                if (!record.account_code) {
                    throw new Error('Entity code is required', { cause: record.account_code });
                } else if (!record.account_code.includes(this.userService.authUser?.accountCode || '')) {
                    throw new Error('You cannot insert orders for other entity account.', { cause: record.account_code });
                }
                break;
            default:
                break;
        }
    }
}

export class ParseError extends Error {
    fileURL: string;

    constructor(message: string, fileURL: string) {
        super(message);
        this.fileURL = fileURL;
    }
}
