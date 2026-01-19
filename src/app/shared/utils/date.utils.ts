import { DateTime } from 'luxon';

export const getDateFromString = (date: string, format?: string) => {
    if (format) {
        const response = DateTime.fromFormat(date, format);
        if (response.isValid) {
            return response;
        }
    }
    return DateTime.fromJSDate(new Date(date));
};

export const formatDate = (date: DateTime, format: string) => {
    return date.toFormat(format);
};

export const getStartAndEndDateCurrentMonth = () => {
    return {
        start: DateTime.now().startOf('month'),
        end: DateTime.now().endOf('month'),
    };
};

export const getPreviousDatesRange = (start: Date, end: Date) => {
    const startCurrent = DateTime.fromJSDate(start);
    const endCurrent = DateTime.fromJSDate(end);

    if (!startCurrent.isValid || !endCurrent.isValid) {
        throw new Error('Invalid date');
    } else if (startCurrent > endCurrent) {
        throw new Error('Start date cannot be greater than end date');
    }

    const duration = endCurrent.diff(startCurrent, ['days']).days;

    return {
        start: startCurrent.minus({ days: duration + 1 }).toJSDate(),
        end: endCurrent.minus({ days: duration + 1 }).toJSDate(),
    };
};
