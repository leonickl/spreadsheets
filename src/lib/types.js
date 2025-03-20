export function isEmail(str) {
    return /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(str);
}

export function isPhoneNumber(str) {
    return /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str
    );
}

export function isURL(str) {
    return /^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,})(\/[\w.-]*)*\/?$/.test(str);
}

export function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}
