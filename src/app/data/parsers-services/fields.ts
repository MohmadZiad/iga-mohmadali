import { formatDate, getDateFromString } from '../../shared/utils/date.utils';

class AbstractField {
    key: string;
    label: string;

    constructor(key = '', label = '') {
        this.key = key;
        this.label = label;
    }

    toGetExampleData() {
        return this.label;
    }
}

export class EnumsStringField extends AbstractField {
    enums: string[];

    constructor(enums: string[], key?: string, label?: string) {
        super(key, label);
        this.enums = enums.map((val) => this.prepareRawData(val));
    }

    prepareRawData(data: string) {
        return data
            .toLowerCase()
            .trim()
            .replace(/\s*\/\s*/g, '/')
            .replace(/[^\w\s/-]/gi, '')
            .replace(/\s+/g, '_');
    }

    parseData(data: string) {
        const preparedData = this.prepareRawData(data);
        if (!this.enums.includes(preparedData)) {
            throw new Error('Not a valid value in ' + this.label);
        }
        return preparedData;
    }

    override toGetExampleData() {
        return this.enums[0];
    }
}

export class DateField extends AbstractField {
    constructor(key?: string, label?: string) {
        super(key, label);
    }
    parseData(data: string) {
        const prepareData = getDateFromString(data, 'dd/MM/yyyy');
        if (!data) {
            return null;
        } else if (!prepareData.isValid) {
            throw new Error('Not a valid date format. Should be dd/MM/yyyy');
        } else {
            return formatDate(prepareData.toUTC(), 'yyyy-MM-dd');
        }
    }

    override toGetExampleData() {
        return 'dd/MM/yyyy';
    }
}

export class NumberField extends AbstractField {
    private minimalValue?: number;
    private maxValue?: number;

    constructor(key?: string, label?: string, minimalValue?: number, maxValue?: number) {
        super(key, label);
        this.minimalValue = minimalValue;
        this.maxValue = maxValue;
    }
    parseData(data: string) {
        const value = Number(data);
        if (isNaN(value)) {
            throw new Error('Not a number');
        } else if (this.minimalValue && value < this.minimalValue) {
            throw new Error(`Value must be greater or equal than ${this.minimalValue}`);
        } else if (this.maxValue && value > this.maxValue) {
            throw new Error(`Value must be less than ${this.maxValue}`);
        }
        return value;
    }
    override toGetExampleData() {
        return '0';
    }
}

export class StringField extends AbstractField {
    constructor(key?: string, label?: string) {
        super(key, label);
    }
    parseData(data: string) {
        return data;
    }
}

export class BooleanField extends AbstractField {
    constructor(key?: string, label?: string) {
        super(key, label);
    }
    parseData(data: string) {
        return ['true', 'yes'].includes(data.toLowerCase());
    }

    override toGetExampleData() {
        return 'No';
    }
}

export type FieldTypes = EnumsStringField | DateField | NumberField | StringField | BooleanField;
