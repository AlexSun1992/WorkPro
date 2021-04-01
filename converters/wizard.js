const converter = {};

converter.compare = (a, b) => {
  if (a.NORDER < b.NORDER) {
    return -1;
  }
  if (a.NORDER > b.NORDER) {
    return 1;
  }
  return 0;
};

converter.wizard = (data) => {
  const arr = [];
  if (data) {
    data.sort(converter.compare);
    for (let i = 0; i < data.length; i++) {
      const obj = {};
      obj.name = data[i].SNAME;
      obj.idItem = data[i].NITEM;
      obj.id = data[i].ID;
      obj.list = data[i].LOPENLIST;
      obj.order = data[i].NORDER;
      arr.push(obj);
    }
  }

  return arr;
};

export default converter;
