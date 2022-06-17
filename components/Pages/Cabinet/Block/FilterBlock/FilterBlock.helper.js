export function getSameTypeUnitsCount(allItems, target) {
  const sameTypeUnit = allItems.filter((item) =>
    Object.values(item).includes(target)
  );
  return sameTypeUnit.length;
}
