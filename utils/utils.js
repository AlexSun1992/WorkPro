
const isFieldExists = function isFieldExists(name, data = undefined) {
    return Boolean(getField(name, data));
}
const getField = function getField(name, data) {
    return data.find((item) => item.name === name);
}
const getFieldValue = function getFieldValue(name, data = undefined) {
    return getField(name, data).value;
}

export { isFieldExists, getField, getFieldValue }


