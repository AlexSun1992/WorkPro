export const filters = [
  {
    text: "Офис продаж/Страховой агент",
    name: ["LSALE"],
    id: "maps-check-office",
  },
  {
    text: "Центр выплат",
    name: ["LREG_CENTER", "LSPR"],
    id: "maps-check-center",
  },
  {
    text: "Выдача ОМС",
    name: ["LOMS"],
    id: "maps-check-oms",
  },
];

export const filterData = (data, appliedFilters) => {
  const set = new Set();
  data.forEach((office) => {
    appliedFilters.forEach((filter) => {
      filter.name.forEach((name) => {
        if (office[name]) {
          set.add(office);
        }
      });
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
