export default {
  parseFilterField(filter) {
    let filterAsArray;

    if (Array.isArray(filter)) {
      filterAsArray = filter;
    } else {
      try {
        filterAsArray = JSON.parse(filter.replaceAll("\\", ""));
      } catch (err) {
        filterAsArray = [filter];
      }
    }
    return filterAsArray;
  },

  unionFilter(items, filter) {
    const filterAsArray = this.parseFilterField(filter);
    return items.some((item) => filterAsArray.includes(item));
  },

  intersectionFilter(items, filter) {
    const filterAsArray = this.parseFilterField(filter);
    return items.every((item) => filterAsArray.includes(item));
  },

  getUniqueItemsFromHeal(items) {
    const result = new Set();

    items.forEach((item) => {
      try {
        const arr = JSON.parse(item.replaceAll("\\", ""));

        arr.forEach((elm) => result.add(elm));
      } catch (err) {
        result.add(item);
      }
    });

    return Array.from(result);
  },
};
