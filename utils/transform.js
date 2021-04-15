/* eslint-disable */
const getErrorMessage = (data) => {
  if (data?.INFO) {
    return data?.INFO.replace(/^\[|\]$/g, "");
  }
  if (data?.MESSAGE) {
    return data?.MESSAGE;
  }
  return null;
};
export { getErrorMessage };
