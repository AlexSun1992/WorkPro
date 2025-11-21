export function validateAlphanumeric(input) {
  // Проверяем, что входное значение - строка и содержит только буквы и цифры
  return typeof input === "string" && /^[a-zA-Zа-яА-ЯёЁ0-9]+$/.test(input);
}

export function validateNumeric(input) {
  // Проверяем, что входное значение - строка и содержит только  цифры
  return typeof input === "string" && /^[0-9]+$/.test(input);
}
