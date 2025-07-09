export function getSameTypeUnitsCount(allItems, target) {
  const sameTypeUnit = allItems.filter((item) => Object.values(item).includes(target));
  return sameTypeUnit.length;
}

export function getFilterUsingCount(allItems, target, propName) {
  return allItems.reduce((acc = 0, item) => {
    try {
      return acc + Number(JSON.parse(item[propName].replaceAll("\\", ""))?.includes(target));
    } catch (err) {
      return acc + Number([item[propName]].includes(target));
    }
  }, 0);
}

export function getFilterValue(filter) {
  if (Array.isArray(filter)) {
    return filter;
  }
  try {
    return JSON.parse(filter);
  } catch (err) {
    return [filter];
  }
}
