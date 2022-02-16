import moment from "moment/moment";
import controlConverter from "../converters/control";
const axios = require("axios");
import selectConverter from "../converters/select";
axios.defaults.baseURL = "https://mobile2.reso.ru";
const converter = {};

converter.setArrayOfObjectFields = (itemId, items, fields) => {
  let arr = [];
  for (let i = 0; i < items.length; i++) {
    arr.push(converter.setFieldsParams(itemId, items[i], fields));
  }
  return arr;
};

converter.setFieldsParams = (itemId, item, fields) => {
  let arr = [];
  fields.sort(converter.compare);
  for (let i = 0; i < fields.length; i++) {
    let obj = {};
    obj.label = fields[i].CAPTION ? fields[i].CAPTION : fields[i].FIELD;
    obj.value =
      fields[i].TYPE != "resultset"
        ? item[fields[i].FIELD]
        : converter.setArrayOfObjectFields(
            itemId,
            item[fields[i].FIELD],
            fields[i].FIELDS
          );
    obj.id = itemId;
    obj.type = fields[i].TYPE;
    obj.maxlength = fields[i].PRECISION;
    obj.name = fields[i].FIELD;
    obj.visible = fields[i].VISIBLE;
    obj.required = fields[i].REQUIRED;
    obj.readonly = fields[i].READONLY;
    obj.control = null;
    obj.state = null;
    obj.isTab = false;
    arr.push(obj);
  }
  return arr;
};

converter.compare = (a, b) => {
  if (a.ORDER < b.ORDER) {
    return -1;
  }
  if (a.ORDER > b.ORDER) {
    return 1;
  }
  return 0;
};

converter.subcompare = (a, b) => {
  if (a.NVISIBLEINDEX < b.NVISIBLEINDEX) {
    return -1;
  }
  if (a.NVISIBLEINDEX > b.NVISIBLEINDEX) {
    return 1;
  }
  return 0;
};

converter.form = async (data, params) => {
  let itemId = params.idItem;
  let zone = params?.zone;
  let item = data[0]._data.length ? data[0]._data[0] : {};
  let fields = data[0]._struct;
  let meta_value = converter.meta(data[0]?._meta.SNEWRECORD) || {};
  let meta_visible = converter.meta(data[0]?._meta.SVISIBLE) || {};
  let meta_readonly = converter.meta(data[0]?._meta.SREADONLY) || {};
  let arr = converter.setFieldsParams(itemId, item, fields);
  let webFieldsArr = [];
  let webFields = data[0]._meta["JSONWEBFIELDS"];
  webFields = webFields.sort((a, b) => a["NORDER"] - b["NORDER"]);

  let promises = [];

  for (let i = 0; i < webFields.length; i++) {
    let obj = {};
    obj.label = webFields[i].SCAPTION || webFields[i].SCAPTIONLONG;
    if (
      item[webFields[i].SNAME] ||
      item[webFields[i].SNAME] === 0 ||
      item[webFields[i].SNAME] === false
    ) {
      obj.value = item[webFields[i].SNAME];
    } else {
      if (Object.keys(item).length === 0) {
        obj.value = meta_value[webFields[i].SNAME];
      }
    }
    obj.type = webFields[i].STYPE;
    const fieldOfStruct = fields.find((f) => f.FIELD === webFields[i].SNAME);
    if (fieldOfStruct) {
      obj.structType = fieldOfStruct.TYPE;
    }
    if (
      (webFields[i].IDCONTROL == 0 || webFields[i].IDCONTROL == 1) &&
      (webFields[i].STYPE == "Double" ||
        webFields[i].STYPE == "Int64" ||
        webFields[i].STYPE == "Int16")
    ) {
      obj.type = "double";
    } else if (webFields[i].IDCONTROL == 2) {
      obj.type = "text";
    } else if (webFields[i].IDCONTROL == 6) {
      obj.type = "uploader";
    } else if (webFields[i].IDCONTROL == 7) {
      obj.type = "label";
    } else if (webFields[i].IDCONTROL == 8) {
      obj.type = "link";
    } else if (webFields[i].IDCONTROL == 14) {
      obj.type = "timestamp";
    } else if (webFields[i].IDCONTROL == 5) {
      obj.type = "progressbar";
    } else if (webFields[i].IDCONTROL == 15 || webFields[i].IDCONTROL == 37) {
      obj.type = webFields[i].IDCONTROL == 15 ? "combobox" : "customCombobox";
      if (webFields[i].LDIC === true) {
        promises.push(
          axios.get(
            `/am/${zone === "free" ? "free" : "main"}/v2/dicwf/${
              webFields[i].ID
            }`
          )
        );
      }
      if (webFields[i].LDIC === false) {
        promises.push(
          axios.get(
            `/am/${zone === "free" ? "free" : "main"}/v2/dic/${
              webFields[i].IDADMMODULE
            }/${itemId}/${webFields[i].SNAME}`
          )
        );
      }
    } else if (webFields[i].IDCONTROL == 16) {
      obj.type = "boolean";
    } else if (webFields[i].IDCONTROL == 21) {
      obj.type = "button";
    } else if (webFields[i].IDCONTROL == 22) {
      obj.type = "splitter";
    } else if (webFields[i].IDCONTROL == 29) {
      obj.type = "captcha";
      obj.captcha = null;
    } else if (webFields[i].IDCONTROL == 31) {
      obj.type = "phoneChange";
    } else if (webFields[i].IDCONTROL == 32) {
      obj.type = "emailChange";
    } else if (webFields[i].IDCONTROL == 30) {
      obj.type = "empty";
    } else if (webFields[i].IDCONTROL == 33) {
      obj.type = "LabelMoney";
    } else if (webFields[i].IDCONTROL == 35) {
      obj.type = "DadataSelect";
    } else if (webFields[i].IDCONTROL == 40) {
      obj.type = "CustomDouble";
    } else if (webFields[i].IDCONTROL == 39) {
      obj.type = "WizardButton";
    } else if (webFields[i].IDCONTROL == 41) {
      obj.type = "GoogleCaptcha";
    } else if (webFields[i].IDCONTROL == 42) {
      obj.type = "Map";
    } else if (webFields[i].IDCONTROL == 43) {
      obj.type = "RegNumber";
    } else if (webFields[i].IDCONTROL == 44) {
      obj.type = "RadioButton";
      promises.push(
        axios.get(
          `/am/${zone === "free" ? "free" : "main"}/v2/dicwf/${webFields[i].ID}`
        )
      );
    } else {
      obj.type = "string";
    }

    obj.id = itemId;
    obj.fieldId = webFields[i].ID;
    obj.cols = webFields[i].NCOLSPAN ? webFields[i].NCOLSPAN : 12;
    obj.colSm = webFields[i].NCOLSM ? webFields[i].NCOLSM : 12;
    obj.colMd = webFields[i].NCOLMD ? webFields[i].NCOLMD : 12;
    obj.colLg = webFields[i].NCOLLG ? webFields[i].NCOLLG : 12;
    obj.width = webFields[i].NWIDTH ? webFields[i].NWIDTH + "%" : "100%";
    obj.name = webFields[i].SNAME;
    obj.labelCols = webFields[i].SCAPTPOS ? webFields[i].SCAPTPOS : "";
    if (
      meta_visible[webFields[i].SNAME.toUpperCase()] === "Y" ||
      meta_visible[webFields[i].SNAME.toUpperCase()] === "N"
    ) {
      obj.visible =
        meta_visible[webFields[i].SNAME.toUpperCase()] === "N" ? false : true;
    } else {
      obj.visible =
        webFields[i].LVISIBLE === "N" || webFields[i].LVISIBLE === false
          ? false
          : true;
    }
    obj.required =
      webFields[i].LREQUIRED === "N" || webFields[i].LREQUIRED === false
        ? false
        : true;
    obj.page = webFields[i].NPAGE;
    obj.mask = webFields[i].SMASK;
    obj.readonly =
      webFields[i].LREADONLY === "N" || webFields[i].LREADONLY === false
        ? false
        : true;
    obj.control = null;
    obj.state = obj.value && obj.required ? true : null;
    obj.checked = obj.value && obj.required ? true : null;
    obj.error = null;
    obj.helpText = webFields[i].SHELPTEXT;
    obj.placeholder = webFields[i].SNULLTEXT;
    obj.isRelation =
      webFields[i].LDIC === "N" || webFields[i].LDIC === false ? false : true;
    obj.fieldRelation = webFields[i].SCONNECTFIELD
      ? "FK" + webFields[i].SCONNECTFIELD
      : null;
    obj.isTab = data[0]._meta["SPAGECAPTION"] ? true : false;
    if (webFields[i].NITEMDIC) {
      obj.menudic = webFields[i].NITEMDIC;
    }
    promises.push(Promise.resolve(obj));
  }
  try {
    await Promise.allSettled(promises).then((values) => {
      values.forEach((item, i) => {
        if (item.status === "rejected") {
          console.log(item.reason.response.data);
        }
        if (item.status == "fulfilled" && item.value.data) {
          let options = selectConverter.select(item.value.data);
          const url = item.value.config.url;
          const isDicwf = url.includes("dicwf");
          const fieldId = null;
          let fieldName = null;
          let field1 = null;
          if (isDicwf) {
            const fieldId = parseInt(
              item.value.config.url.replace(
                `/am/${zone === "free" ? "free" : "main"}/v2/dicwf/`,
                ""
              )
            );
            if (fieldId) {
              field1 = values.find((b) =>
                b.value ? b.value.fieldId === fieldId : null
              );
            }
          } else {
            fieldName = item.value.config.url.replace(
              `/am/${zone === "free" ? "free" : "main"}/v2/dic/55/${itemId}/`,
              ""
            );
            if (fieldName) {
              field1 = values.find((b) =>
                b.value ? b.value.name === fieldName : null
              );
            }
          }
          if (field1) {
            field1.value.options = options;
          }
        } else if (item.status == "fulfilled" && !item.value.data) {
          webFieldsArr.push(item.value);
        }
      });
    });
  } catch (e) {
    console.error(e);
  }

  // ********
  return {
    // Переход на поля JSONWEBFIELDS
    data: converter.type(arr),
    // Метаданные для отображения JSONWEBFIELDS
    metaData: {
      data: converter.type(webFieldsArr),
      captions: data[0]._meta["SPAGECAPTION"],
      cardCaption: data[0]._meta["SCARDCAPTION"],
      btnSave: meta_visible?.BTNSAVE === "N" ? false : true,
      readonly: meta_readonly?.ALL_FIELDS === "Y" ? true : false,
    },
  };
};

converter.type = (data) => {
  let copy = data;
  let del = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].control !== null) {
      data[i].type = controlConverter.getType(data[i].control);
    } else {
      if (data[i].type === `string` && data[i].maxlength > 200) {
        copy[i].type = `text`;
      }
    }
    if (data[i].type === `timestamp`) {
      if (data[i].value) {
        data[i].value = moment(data[i].value, [
          "DD.MM.YYYY",
          "YYYY-MM-DD",
        ]).format("DD.MM.YYYY");
      } else {
        data[i].value = null;
      }
    }
    if (data[i].name.substring(0, 2) === `FK`) {
      for (let j = 0; j < data.length; j++) {
        if (
          data[i].name.substring(2) === data[j].name &&
          data[j].type !== "combobox" &&
          data[i].type !== "label"
        ) {
          copy[i].type = `enum`;
          if (data[i].menudic) {
            copy[i].type = `listSelect`;
          }
          copy[i].label = copy[j].label;
          copy[i].required = copy[j].required;
          copy[i].dic = data[j].name;
          copy[i].value = { text: copy[i].value, value: copy[j].value };
          copy[i].id = copy[j].id;
          copy[i].isRelation = copy[j].isRelation;
          copy[i].fieldRelation = copy[j].fieldRelation;
          copy[i].fieldId = copy[j].fieldId;
          copy[i].options = null;
          del.push(data[j]);
        }
      }
    }
  }
  return converter.remove(copy, del);
};

converter.remove = (arr, toRemove) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    for (let j = 0; j < toRemove.length; j++) {
      if (arr[i] && arr[i].name === toRemove[j].name) {
        arr.splice(i, 1);
      }
    }
  }
  return arr;
};

converter.meta = (meta) => {
  if (meta) {
    let convert_meta = {};
    let arr_split = meta.split(`\r`);
    for (let i = 0; i < arr_split.length; i++) {
      let field_meta = arr_split[i].split(`=`);
      let value_meta = arr_split[i].replace(field_meta[0] + "=", "");
      convert_meta[field_meta[0].toUpperCase()] = value_meta;
    }
    return convert_meta;
  }
};

converter.save = (data) => {
  let res = {};
  let name = ``;
  for (let i = 0; i < data.length; i++) {
    if (
      data[i].type !== "enum" &&
      data[i].type !== "multi" &&
      data[i].type !== "listSelect"
    ) {
      if (data[i].type !== "boolean") {
        if (data[i].type !== "timestamp") {
          res[data[i].name] =
            data[i].value !== null && data[i].value !== undefined
              ? data[i].value
              : "NULL";
          if (data[i].structType === "boolrus") {
            res[data[i].name] =
              data[i].value === "true" || data[i].value === true ? "Д" : "Н";
          }
          if (data[i].structType === "long") {
            res[data[i].name] =
              data[i].value !== null ? parseInt(data[i].value) : "NULL";
          }
          if (data[i].structType === "double") {
            res[data[i].name] =
              data[i].value !== null ? parseFloat(data[i].value) : "NULL";
          }
        } else {
          res[data[i].name] = data[i].value
            ? moment(data[i].value, ["DD-MM-YYYY", "YYYY-MM-DD"]).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : "NULL";
        }
      } else {
        if (data[i].name.substring(0, 1) === "B") {
          res[data[i].name] = data[i].value ? "Д" : "Н";
        } else {
          res[data[i].name] = data[i].value ? "Y" : "N";
        }
      }
    } else {
      if (data[i].name.substring(0, 2) === `FK`) {
        name = data[i].name.substring(2);
      } else {
        name = data[i].name;
      }
      if (data[i].type !== "multi") {
        if (data[i].value.value) {
          if (
            typeof data[i].value.value === "object" &&
            !Array.isArray(data[i].value.value) &&
            data[i].value.value !== null
          ) {
            res[name] = JSON.stringify(data[i].value.value);
          } else {
            res[name] = data[i].value.value;
          }
        } else if (data[i].value.value == 0) {
          res[name] = 0;
        } else {
          res[name] = "NULL";
        }
        // res[name] = data[i].value.value ? data[i].value.value : "NULL";
      } else {
        res[name] = "NULL";
        let arr = [];
        if (data[i].value) {
          let items = data[i].value;
          for (let j = 0; j < items.length; j++) {
            arr.push(items[j].value);
          }
        }
        res[name] = arr.toString();
      }
    }
  }
  return res;
};

export default converter;
