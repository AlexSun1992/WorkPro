/* eslint-disable */
import moment from "moment/moment.js";
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

converter.filter = (data, id) => {
  const arr = [];
  const items = data;
  items.sort(converter.compare);
  for (let i = 0; i < items.length; i++) {
    const obj = {};
    obj.label = items[i].SNAMERUS;
    obj.value = items[i].SDEFAULT;
    obj.name = items[i].SNAME;
    obj.required = items[i].LREQUIRED;
    obj.fromDataCard = items[i].LFROMDATASET;
    obj.state = null;
    obj.mask = items[i].SMASK;
    obj.type = converter.type(items[i]);
    if (obj.type === "error") {
      obj.value = "Unknown type " + items[i].STYPE;
    }
    if (obj.type === "enum") {
      obj.value = { text: null, value: null };
      obj.dic = id ? `${items[i].STYPE},idrow=${id}` : items[i].STYPE;
    }
    if (obj.type === "multi") {
      obj.value = null;
      obj.dic = items[i].STYPE;
    }
    if (obj.type === "boolean") {
      obj.value = items[i].SDEFAULT === "Y";
    }
    if (obj.type === "timestamp") {
      obj.value = items[i].SDEFAULT
        ? moment(items[i].SDEFAULT, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD HH:mm:ss")
        : null;
    }
    obj.visible = true;
    arr.push(obj);
  }
  return arr;
};

converter.type = (item) => {
  const type = item.STYPE.toLowerCase();
  if (type.localeCompare("строка") === 0) {
    return "string";
  }
  if (type.localeCompare("логическое") === 0) {
    return "boolean";
  }
  if (type.localeCompare("число") === 0) {
    return "double";
  }
  if (type.localeCompare("дата") === 0) {
    return "timestamp";
  }
  if (type.localeCompare("период") === 0) {
    return "period";
  }
  if (item.LMANYVALUES) {
    return "multi";
  }
  return "error";
};

export default converter;
