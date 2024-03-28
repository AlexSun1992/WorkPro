const converter = {};

converter.tab = (data) => {
  const arr = [];
  const items = data;
  for (let i = 0; i < items.length; i++) {
    const obj = {};
    obj.label = items[i].SCOMMENT;
    obj.id = items[i].ID;
    arr.push(obj);
  }
  return arr;
};

export default converter;
