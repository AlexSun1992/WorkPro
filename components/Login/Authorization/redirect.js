export const redirectWithRef = (path) => {
  const url = new URL(path, window.location.origin);
  const DEFAULT_SUCCESS_REF = "/cabinet";
  const currentUrl = new URL(window.location.href);
  url.searchParams.set("ref", currentUrl.searchParams.get("ref") || DEFAULT_SUCCESS_REF);
  window.location.href = url.href;
};
