const moment = require("moment");

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

converter.list = (data) => {
  const arr = [];
  const obj = {};
  const fields = data[0]._struct;
  const metaAddFields = converter.meta(data[0]?._meta.SADDFIELDS) || {};
  const metaBreadCrumbs = converter.breadcrumbs(data[0]?._meta.SNAVIG) || null;
  const metaListCaption = data[0]?._meta?.SLISTCAPTION || null;
  fields.sort(converter.compare);
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].VISIBLE) {
      const obj = {};
      obj.label = fields[i].CAPTION ? fields[i].CAPTION : fields[i].FIELD;
      obj.key = fields[i].FIELD;
      obj.type = fields[i].TYPE;
      obj.tdClass = "text-col";
      obj.sortable = true;
      obj.formatter = "formatData";
      arr.push(obj);
    }
  }
  obj.fields = arr;
  obj.fields.unshift({ key: "index", label: "Действия" });
  obj.items = data[0]._data;
  obj.total = obj.items.length;
  obj.addFields = metaAddFields;
  obj.breadCrumbs = metaBreadCrumbs;
  obj.listCaption = metaListCaption;
  return obj;
};

converter.formatter = (type, value) => {
  const res = converter.formatByType(type, value);
  return `<span title="${type !== "boolean" ? res : ""}">${res}</span>`;
};

converter.formatByType = (type, value) => {
  switch (type) {
    case "timestamp":
      return value ? moment(value).format("DD.MM.YYYY") : "";
    case "double":
      return value ? value.toLocaleString("ru") : "";
    case "long":
      return value ? value.toLocaleString("ru") : "";
    default:
      return value || "";
  }
};

converter.getFilterParams = (filters) => {
  const obj = {};
  for (const prop in filters) {
    if (filters[prop] !== "NULL") {
      obj[prop] = filters[prop];
    }
  }
  return JSON.stringify(obj);
};

converter.meta = (meta) => {
  if (meta) {
    const convert_meta = {};
    const arr_split = meta.split(`\r`);
    for (let i = 0; i < arr_split.length; i++) {
      const field_meta = arr_split[i].split(`=`);
      const value_meta = arr_split[i].replace(`${field_meta[0]}=`, "");
      convert_meta[field_meta[0].toUpperCase()] = value_meta;
    }
    return convert_meta;
  }
};
converter.breadcrumbs = (meta) => {
  if (Array.isArray(meta)) {
    return meta.map((item, index) => {
      if (index === 0) {
        return { text: item?.SNAME, href: item?.SURL };
      }
      return { text: item?.SNAME, to: item?.SURL };
    });
  }
  return null;
};

module.exports = converter;
