/**
 * Вычисляет адрес для переадресации
 * @param {string} defaultRedirectUrl значение URL по умолчанию
 * @param {Boolean} isRefNeeded при значении true, добавляет добавляе referer к строке
 * @returns
 */
export function redirectSuccess(defaultRedirectUrl) {
  if (typeof defaultRedirectUrl !== "string") {
    throw new Error("Неправильный формат redirectUrl");
  }

  const url = new URL(window.location.href, "https://f.f");
  const ref = url.searchParams.get("ref");
  const redirectUrl = ref || defaultRedirectUrl;
  return redirectUrl;
}
