export const filters = [
  {
    text: "Офис продаж",
    name: "LREG_CENTER",
    value: false,
    id: "maps-check-office",
  },
  /*  {
        text: "Работает в выходные",
        name: "WEEKENDS",
        value: true,
      },*/
  {
    text: "Центр выплат",
    name: "LREG_CENTER",
    value: true,
    id: "maps-check-center",
  },
  {
    text: "Выдача ОМС",
    name: "LOMS",
    value: true,
    id: "maps-check-oms",
  },
];

export const filterData = function (data, filters) {
  let candidates = [];
  data.forEach((office) => {
    let counter = 0;
    filters.forEach((filter) => {
      if (
        office[filter.name] === filter.value ||
        (office.hasOwnProperty(filter.name) && filter.value === "")
      ) {
        counter++;
      }
    });
    if (counter == filters.length) {
      candidates.push(office);
    }
  });
  return candidates;
};

export const getFilters = function (filters) {
  let arr = [];
  let name;
  let filtersArray = [...filters];
  filtersArray.reduce((sum, filter) => {
    sum[filter.name] = (sum[filter.name] || 0) + 1;
    if (sum[filter.name] > 1) {
      name = filter.name;
      let obj = { ...filter };
      obj.value = "";
      arr.push(obj);
    }
    return sum;
  }, {});
  if (name) {
    arr.push(...filtersArray.filter((item) => item.name !== name));
  } else {
    filtersArray.forEach((item) => arr.push(item));
  }
  return arr;
};
