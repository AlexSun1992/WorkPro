/* eslint-disable */
const getErrorMessage = (data) => {
  if (data?.INFO) {
    return data?.INFO.replace(/^\[|\]$/g, "");
  }
  if (data?.MESSAGE) {
    return data?.MESSAGE;
  }
  if (Array.isArray(data)) {
    return JSON.stringify(data);
  }
  return null;
};
export { getErrorMessage };
