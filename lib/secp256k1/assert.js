const toString = Object.prototype.toString

// TypeError
export function isArray(value, message) {
    if (!Array.isArray(value)) throw TypeError(message)
}

export function isBoolean(value, message) {
    if (toString.call(value) !== '[object Boolean]') throw TypeError(message)
}

export function isBuffer(value, message) {
    if (!Buffer.isBuffer(value)) throw TypeError(message)
}

export function isFunction(value, message) {
    if (toString.call(value) !== '[object Function]') throw TypeError(message)
}

export function isNumber(value, message) {
    if (toString.call(value) !== '[object Number]') throw TypeError(message)
}

export function isObject(value, message) {
    if (toString.call(value) !== '[object Object]') throw TypeError(message)
}

// RangeError
export function isBufferLength(buffer, length, message) {
    if (buffer.length !== length) throw RangeError(message)
}

export function isBufferLength2(buffer, length1, length2, message) {
    if (buffer.length !== length1 && buffer.length !== length2) throw RangeError(message)
}

export function isLengthGTZero(value, message) {
    if (value.length === 0) throw RangeError(message)
}

export function isNumberInInterval(number, x, y, message) {
    if (number <= x || number >= y) throw RangeError(message)
}

export default {
    isArray,
    isBoolean,
    isBuffer,
    isFunction,
    isNumber,
    isObject,
    isBufferLength,
    isBufferLength2,
    isLengthGTZero,
    isNumberInInterval,
}
