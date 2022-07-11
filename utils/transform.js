/* eslint-disable */
const getErrorMessage = (data) => {
  if (data?.INFO) {
    const isJson =
      data?.INFO.replace(/^\[|\]$/g, "").substring(0, 4) === "JSON";
    if (isJson === true) {
      const JsonData = JSON.parse(
        data?.INFO.replace(/^\[|\]$/g, "")
          .substring(4)
          .replace(/^\[|\]$/g, "")
      );
      return JsonData;
    }
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
