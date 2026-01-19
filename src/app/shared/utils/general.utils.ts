export const calculatePercentage = (value: number, total: number) => {
    return total ? Math.round((value / total) * 100) : 0;
};

export const camelToSnake = (str: string) => {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

export const snakeToCamel = (str: string) => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const getDaysDifference = (dateOne: string, dateTwo: string) => {
    const timeDifference = Math.abs(new Date(dateTwo).getTime() - new Date(dateOne).getTime());
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
};

export const hexToRgb = (hex: string, opacity?: number) => {
    hex = hex.replace(/^#/, '');

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return opacity ? `rgba(${r}, ${g}, ${b}, ${opacity})` : `rgb(${r}, ${g}, ${b})`;
};

export const getColorByStatus = (status: string) => {
    switch (status) {
        case 'executed/complete':
            return '#6CCA2D';
        case 'rejected':
            return '#E1251B';
        case 'cancelled':
            return '#424496ff';
        case 'in_progress':
            return '#308099';
        case 'returned':
        default:
            return '#999999';
    }
};

export const chunkArray = <T>(arr: T[], size: number) => {
    return arr.reduce((acc: T[][], e: T, i) => {
        if (i % size === 0) acc.push([e]);
        else acc[acc.length - 1].push(e);
        return acc;
    }, []);
};
