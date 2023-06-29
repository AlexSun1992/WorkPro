import moment from "moment/moment";
import controlConverter from "./control";
import selectConverter from "./select";

const converter = {};

converter.setArrayOfObjectFields = (itemId, items, fields) => {
  const arr = [];
  if (Array.isArray(items)) {
    for (let i = 0; i < items.length; i++) {
      arr.push(converter.setFieldsParams(itemId, items[i], fields));
    }
  }
  return arr;
};

converter.setFieldsParams = (itemId, item, fields) => {
  const arr = [];
  fields.sort(converter.compare);
  for (let i = 0; i < fields.length; i++) {
    const obj = {};
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

converter.form = async (data, params, instance) => {
  const promises = [];
  const promisesOfOneToMany = [];
  const webFieldsArr = [];
  const errors = [];

  const itemId = params.idItem;
  const zone = params?.zone;
  const item = data[0]._data.length ? data[0]._data[0] : {};
  const fields = data[0]._struct;
  const meta_value = converter.meta(data[0]?._meta.SNEWRECORD) || {};
  const meta_visible = converter.meta(data[0]?._meta.SVISIBLE) || {};
  const meta_readonly = converter.meta(data[0]?._meta.SREADONLY) || {};
  const meta_addfields = converter.meta(data[0]?._meta.SADDFIELDS) || {};
  const meta_breadcrumbs = converter.breadcrumbs(data[0]?._meta.SNAVIG) || null;
  const arr = converter.setFieldsParams(itemId, item, fields);

  let webFields = data[0]._meta.JSONWEBFIELDS;
  webFields = webFields.sort((a, b) => a.NORDER - b.NORDER);

  for (let i = 0; i < webFields.length; i++) {
    const obj = {};
    obj.label = webFields[i].SCAPTION || webFields[i].SCAPTIONLONG;
    if (
      item[webFields[i].SNAME] ||
      item[webFields[i].SNAME] === 0 ||
      item[webFields[i].SNAME] === false
    ) {
      obj.value = item[webFields[i].SNAME];
    } else if (Object.keys(item).length === 0) {
      obj.value = meta_value[webFields[i].SNAME];
      if (
        webFields[i].STYPE === "Double" ||
        webFields[i].STYPE === "Int64" ||
        webFields[i].STYPE === "Int16"
      ) {
        obj.value = parseInt(meta_value[webFields[i].SNAME], 10);
      }
      if (webFields[i].IDCONTROL === 16) {
        obj.value = meta_value[webFields[i].SNAME] === "Y";
        if (webFields[i].STYPE === "boolrus") {
          obj.value = meta_value[webFields[i].SNAME] === "Д";
        }
        if (meta_value[webFields[i].SNAME] === "Д") {
          obj.value = true;
        }
        if (meta_value[webFields[i].SNAME] === "Н") {
          obj.value = false;
        }
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
          instance.get(
            `/am/${zone === "free" ? "free" : "main"}/v2/dicwf/${
              webFields[i].ID
            }`
          )
        );
      }
      if (webFields[i].LDIC === false) {
        promises.push(
          instance.get(
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
    } else if (webFields[i].IDCONTROL == 34) {
      obj.type = "Uploader";
    } else if (webFields[i].IDCONTROL == 35) {
      obj.type = "DadataSelect";
    } else if (webFields[i].IDCONTROL == 381) {
      obj.type = "DadataSelect2";
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
    } else if (webFields[i].IDCONTROL == 401) {
      obj.type = "CollapseGroup";
    } else if (webFields[i].IDCONTROL == 322) {
      obj.type = "PasswordConfirm";
    } else if (webFields[i].IDCONTROL == 44) {
      obj.type = "RadioButton";
      promises.push(
        instance.get(
          `/am/${zone === "free" ? "free" : "main"}/v2/dicwf/${webFields[i].ID}`
        )
      );
    } else if (webFields[i].IDCONTROL == 46) {
      obj.type = "DoctorSchedule";
    } else if (webFields[i].IDCONTROL == 47) {
      if (webFields[i].NITEMDIC) {
        promises.push(
          instance.get(
            `/am/${zone === "free" ? "free" : "main"}/v2/datacard/55/${
              webFields[i].NITEMDIC
            }/0`
          )
        );
      } else {
        obj.value = [];
        obj.schema = [];
      }
      obj.type = "OneToMany";
    } else {
      obj.type = "string";
    }

    obj.id = itemId;
    obj.fieldId = webFields[i].ID;
    obj.cols = webFields[i].NCOLSPAN ? webFields[i].NCOLSPAN : 12;
    obj.colSm = webFields[i].NCOLSM ? webFields[i].NCOLSM : 12;
    obj.colMd = webFields[i].NCOLMD ? webFields[i].NCOLMD : 12;
    obj.colLg = webFields[i].NCOLLG ? webFields[i].NCOLLG : 12;
    obj.width = webFields[i].NWIDTH ? `${webFields[i].NWIDTH}%` : "100%";
    obj.name = webFields[i].SNAME;
    obj.labelCols = webFields[i].SCAPTPOS ? webFields[i].SCAPTPOS : "";
    obj.webId = webFields[i].SWEBID ? webFields[i].SWEBID : "";
    if (
      meta_visible[webFields[i].SNAME.toUpperCase()] === "Y" ||
      meta_visible[webFields[i].SNAME.toUpperCase()] === "N"
    ) {
      obj.visible = meta_visible[webFields[i].SNAME.toUpperCase()] !== "N";
    } else {
      obj.visible = !(
        webFields[i].LVISIBLE === "N" || webFields[i].LVISIBLE === false
      );
    }
    obj.required = !(
      webFields[i].LREQUIRED === "N" || webFields[i].LREQUIRED === false
    );
    obj.page = webFields[i].NPAGE;
    obj.mask = webFields[i].SMASK;
    obj.readonly = !(
      webFields[i].LREADONLY === "N" || webFields[i].LREADONLY === false
    );
    obj.control = null;
    obj.state = (obj.value || obj.value === 0) && obj.required ? true : null;
    obj.checked = obj.value && obj.required ? true : null;
    obj.error = null;
    obj.helpText = webFields[i].SHELPTEXT;
    obj.placeholder = webFields[i].SNULLTEXT;
    obj.isRelation = !(
      webFields[i].LDIC === "N" || webFields[i].LDIC === false
    );
    obj.fieldRelation = webFields[i].SCONNECTFIELD
      ? `FK${webFields[i].SCONNECTFIELD}`
      : null;
    obj.isTab = !!data[0]._meta.SPAGECAPTION;
    if (webFields[i].NITEMDIC) {
      obj.menudic = webFields[i].NITEMDIC;
    }
    promises.push(Promise.resolve(obj));
  }
  try {
    await Promise.allSettled(promises).then((values) => {
      values.forEach(async (item, i) => {
        if (item.status === "rejected") {
          errors.push({
            url: item.reason.response?.config,
            data: item.reason.response?.data,
          });
        }
        if (item.status == "fulfilled" && item.value.data) {
          const { url } = item.value.config;
          const isCardWebFields = url.includes("datacard");
          const isDicwf = url.includes("dicwf");
          if (isCardWebFields) {
            const dataCardSettings = webFields.find((item) => {
              if (item.NITEMDIC) {
                return url.includes(item.NITEMDIC.toString());
              }
              return false;
            });
            if (dataCardSettings?.NITEMDIC) {
              promisesOfOneToMany.push(
                converter.form(
                  item.value.data,
                  { idItem: dataCardSettings.NITEMDIC },
                  instance
                )
              );
            }
          } else {
            const options = selectConverter.select(item.value.data);
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
          }
        } else if (item.status == "fulfilled" && !item.value.data) {
          webFieldsArr.push(item.value);
        }
      });
    });
    await Promise.allSettled(promisesOfOneToMany).then((values) => {
      values.forEach((item) => {
        if (item.status == "fulfilled" && item.value.data) {
          const oneToManyData = webFieldsArr.find(
            (webField) => webField.menudic === item.value.metaData.itemId
          );
          let dataCardValuesArray;
          const dataCardWebFieldsArray = item.value.metaData.data;
          if (Array.isArray(oneToManyData.value)) {
            dataCardValuesArray = oneToManyData.value;
          }
          if (typeof oneToManyData.value === "string") {
            try {
              dataCardValuesArray = JSON.parse(oneToManyData.value);
            } catch (e) {
              dataCardValuesArray = null;
            }
          }
          const resultOneToMany = [];
          if (dataCardValuesArray) {
            dataCardValuesArray.forEach((itemValue) => {
              resultOneToMany.push(
                converter.type(
                  dataCardWebFieldsArray.map((itemWebField) => ({
                    ...itemWebField,
                    value: itemValue[itemWebField.name],
                    state:
                      (itemValue[itemWebField.name] ||
                        itemValue[itemWebField.name] === 0) &&
                      itemWebField.required
                        ? true
                        : null,
                  })),
                  {}
                )
              );
            });
          }
          oneToManyData.value = resultOneToMany;
          oneToManyData.schema = dataCardWebFieldsArray;
        }
      });
    });
  } catch (e) {
    console.error(e);
  }

  // ********
  if (errors.length !== 0) {
    throw { response: { data: errors } };
  }

  return {
    errors,
    // Переход на поля JSONWEBFIELDS
    data: converter.type(arr),
    // Метаданные для отображения JSONWEBFIELDS
    metaData: {
      data: converter.type(webFieldsArr, meta_readonly),
      defaultValues: meta_value,
      captions: data[0]._meta.SPAGECAPTION,
      cardCaption: data[0]._meta.SCARDCAPTION,
      btnSave: meta_visible?.BTNSAVE !== "N",
      btnCancel: meta_visible?.BTNCANCEL !== "N",
      readonly: meta_readonly?.ALL_FIELDS === "Y",
      visible: meta_visible,
      addFields: meta_addfields,
      breadCrumbs: meta_breadcrumbs,
      itemId: params.idItem,
    },
  };
};

converter.type = (data, isReadOnly) => {
  const copy = data;
  const del = [];

  for (let i = 0; i < data.length; i++) {
    if (isReadOnly) {
      Object.keys(isReadOnly).forEach((item) => {
        if (item !== "" && data[i].name === item) {
          if (isReadOnly[item] === "Y") {
            data[i].readonly = true;
          }
          if (isReadOnly[item] === "N") {
            data[i].readonly = false;
          }
        }
      });
    }

    if (data[i].control !== null) {
      data[i].type = controlConverter.getType(data[i].control);
    } else if (data[i].type === `string` && data[i].maxlength > 200) {
      copy[i].type = `text`;
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
            if (data[i].fieldId === 38003) {
              copy[i].type = `doctorSchedule`;
            }
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

converter.getValue = (data) => {
  if (typeof data === "object") {
    if (data.type === "boolean") {
      if (data.name.substring(0, 1) === "B") {
        return data.value ? "Д" : "Н";
      }
      return data.value ? "Y" : "N";
    }
    if (data.type === "timestamp") {
      return data.value
        ? moment(data.value, ["DD-MM-YYYY", "YYYY-MM-DD"]).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        : "NULL";
    }
    if (data.type === "enum") {
      if (typeof data.value?.value === "object") {
        return JSON.stringify(data.value.value);
      }
      return data.value?.value;
    }
    if (data.structType === "boolrus") {
      return data.value === true ? "Д" : "Н";
    }
    if (data.structType === "long") {
      if (data.value !== null) {
        return Number.isNaN(parseInt(data.value, 10))
          ? null
          : parseInt(data.value, 10);
      }
    }
    if (data.structType === "double") {
      if (data.value !== null) {
        return Number.isNaN(parseFloat(data.value))
          ? null
          : parseFloat(data.value);
      }
    }
    return data?.value;
  }
  return null;
};

converter.save = (data) => {
  const res = {};
  let name = ``;
  for (let i = 0; i < data.length; i++) {
    if (
      data[i].type !== "enum" &&
      data[i].type !== "multi" &&
      data[i].type !== "listSelect" &&
      data[i].type !== "doctorSchedule"
    ) {
      if (data[i].type !== "boolean") {
        if (data[i].type !== "timestamp") {
          res[data[i].name] =
            data[i].value !== null && data[i].value !== undefined
              ? data[i].value
              : "NULL";
          if (data[i].type === "Uploader") {
            if (res[data[i].name] !== "NULL") {
              res[data[i].name] =
                data[i].value !== null && data[i].value !== undefined
                  ? Object.values(data[i].value).map(
                      (item) =>
                        (item = new File([item], item.name, {
                          type: "field/blob",
                        }))
                    )
                  : "NULL";
            }
          }
          if (data[i].type === "OneToMany") {
            const resultOneToMany = data[i].value;
            if (Array.isArray(resultOneToMany)) {
              res[data[i].name] = JSON.stringify(
                resultOneToMany.map((item) =>
                  item.reduce(
                    (obj, subItem) =>
                      Object.assign(obj, {
                        [subItem.name]: converter.getValue(subItem) ?? "NULL",
                      }),
                    {}
                  )
                )
              );
            }
          }
          if (data[i].type === "DadataSelect2") {
            res[data[i].name] =
              data[i].value !== null && data[i].value !== undefined
                ? JSON.stringify(data[i].value)
                : "NULL";
          }
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
      } else if (data[i].name.substring(0, 1) === "B") {
        res[data[i].name] = data[i].value ? "Д" : "Н";
      } else {
        res[data[i].name] = data[i].value ? "Y" : "N";
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
      } else {
        res[name] = "NULL";
        const arr = [];
        if (data[i].value) {
          const items = data[i].value;

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
