export function findField(data, name) {
  const field = data.find((item) => item.name === name);

  if (field) {
    return field;
  }
  console.error(`findField. Поле ${name} не найдено в данных`);

  return {};
}
