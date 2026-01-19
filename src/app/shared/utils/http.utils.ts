export const isStatusCodeInRange = (statusCode: number, min: number, max: number) => {
    return statusCode >= min && statusCode < max;
};

export const isStatusCodeOk = (statusCode: number) => {
    return isStatusCodeInRange(statusCode, 200, 300);
};

export const isApiErrorStatusCode = (statusCode: number) => {
    return isStatusCodeInRange(statusCode, 400, 600);
};
