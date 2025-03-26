export function isnull(value) {
    return value === null || value === undefined;
}

export function notnull(value) {
    return !isnull(value);
}

export function isempty(value) {
    return !value || (Array.isArray(value) && value.length === 0);
}

export function notempty(value) {
    return !isempty(value);
}
