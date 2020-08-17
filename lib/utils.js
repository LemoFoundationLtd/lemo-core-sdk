/**
 * simple test whether two objects are equal
 * @param {*} obj1
 * @param {*} obj2
 * @return {boolean}
 */
export function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true
    }
    if (typeof obj1 !== typeof obj2 || Array.isArray(obj1) !== Array.isArray(obj2)) {
        return false
    }
    if (obj1 === null || obj2 === null || typeof obj1 !== 'object') {
        return obj1 === obj2
    }

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
        return false
    }
    return keys1.every(key => deepEqual(obj1[key], obj2[key]))
}

export default {
    deepEqual,
}
