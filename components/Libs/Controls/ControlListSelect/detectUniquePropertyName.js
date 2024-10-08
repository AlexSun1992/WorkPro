export function detectUniquePropertyName(list) {
  const arraySize = list.length;
  if (arraySize === 0) {
    return "ID";
  }
  return (
    Object.keys(list[0])
      // Наиболее короткие названия сверху
      .sort((a, b) => b.length - a.length)
      // Начинающиеся с ID сверху
      .sort((a) => (a.startsWith("ID") ? -1 : 1))
      .find((propertyName) => {
        const allUniqueValues = new Set(
          list
            .map((item) => item[propertyName])
            .filter((value) => value !== undefined && value !== null)
        );
        return arraySize === allUniqueValues.size;
      })
  );
}
