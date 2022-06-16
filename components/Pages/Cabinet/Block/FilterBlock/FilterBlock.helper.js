export default function getSameTypeUnitsCount(allItems, target) {
  const sameTypeUnitLength = allItems.filter((item) =>
    Object.values(item).includes(target)
  );
  return sameTypeUnitLength.length;
}
