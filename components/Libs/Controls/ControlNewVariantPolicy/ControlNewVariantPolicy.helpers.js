// Проверка наличия свойства value и его значения
export function hasValidValue(obj) {
  // Проверяем существование объекта
  if (!obj || typeof obj !== "object") {
    return false;
  }

  // Проверяем наличие свойства value
  const hasValueProperty = "value" in obj;

  // Проверяем что value не undefined, не null и не пустая строка
  const hasValueContent = obj.value !== undefined && obj.value !== null && obj.value !== "";

  return hasValueProperty && hasValueContent;
}

