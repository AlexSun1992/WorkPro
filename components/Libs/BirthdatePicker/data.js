const data = {};

data.days = () => {
  const arr = [{ value: null, text: "День" }];
  for (let i = 1; i <= 31; i++) {
    arr.push({ value: i, text: `${i}` });
  }
  return arr;
};

data.month = () => {
  const arr = [
    { value: null, text: "Месяц" },
    { value: 1, text: "Январь" },
    { value: 2, text: "Февраль" },
    { value: 3, text: "Март" },
    { value: 4, text: "Апрель" },
    { value: 5, text: "Май" },
    { value: 6, text: "Июнь" },
    { value: 7, text: "Июль" },
    { value: 8, text: "Август" },
    { value: 9, text: "Сентябрь" },
    { value: 10, text: "Октябрь" },
    { value: 11, text: "Ноябрь" },
    { value: 12, text: "Декабрь" },
  ];
  return arr;
};

data.years = () => {
  const arr = [{ value: null, text: "Год" }];
  for (let i = 1920; i <= 2002; i++) {
    arr.push({ value: i, text: `${i}` });
  }
  return arr;
};

export default data;
