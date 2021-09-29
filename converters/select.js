const converter = {};

converter.compare = (a, b) => {
  if (a.ORDER < b.ORDER) {
    return -1;
  }
  if (a.ORDER > b.ORDER) {
    return 1;
  }
  return 0;
};

converter.select = (data) => {
  const arr = [];
  const items = data[0]._data;
  const fields = data[0]._struct;
  fields.sort(converter.compare);
  for (let i = 0; i < items.length; i++) {
    const obj = {};
    for (let j = 0; j < fields.length; j++) {
      if (fields[j].VISIBLE) {
        if (!data[0]._meta) {
          if (fields[j].FIELD !== "ID" && fields[j].TYPE === "string") {
            obj.text = items[i][fields[j].FIELD];
          }
          if (fields[j].FIELD === "ID") {
            obj.value = items[i][fields[j].FIELD];
          }
        } else {
          obj.text = items[i][data[0]._meta.SNAMEFIELD.toUpperCase()];
          let value = items[i][data[0]._meta.SKEYFIELD]
            ? items[i][data[0]._meta.SKEYFIELD.toUpperCase()]
            : items[i].ID;
          obj.value = value;
        }
      }
    }
    arr.push(obj);
  }
  return arr;
};

export default converter;
