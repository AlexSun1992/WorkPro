export const filters = [
  {
    text: "Офис продаж",
    name: "LREG_CENTER",
    value: false,
    id: "maps-check-office",
  },
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

export const filterData = (data, appliedFilters) => {
  const set = new Set();
  data.forEach((office) => {
    appliedFilters.forEach((filter) => {
      if (office[filter.name] === filter.value) {
        set.add(office);
      }
    });
    if (appliedFilters.length === 0) {
      set.add(office);
    }
  });
  return Array.from(set);
};

export const getFilters = (appliedFilters) => {
  const arr = [];
  const filtersArray = [...appliedFilters];
  filtersArray.forEach((item) => arr.push(item));
  return arr;
};
