/* eslint-disable */
import moment from "moment/moment";
import controlConverter from "./control";
import selectConverter from "./select";
import consts from "../api/urls";

const converter = {};

async function attachWithRelationFields(schemaField, oneToManyResult, itemValue, instance, zone) {
  const relatedFieldNames = schemaField.fieldRelation.split(";");
  const dicParams = { ID: 0 };

  relatedFieldNames.forEach((relName) => {
    const relValue = itemValue[relName];

    if (relValue !== undefined && relValue !== null) {
      dicParams[relName] = relValue;
    }
  });

  const dicParamsStr = new URLSearchParams(dicParams).toString();
  const oneToManyItemId = oneToManyResult.value.metaData.itemId ?? 0;
  let url = `/lk/${zone === "free" ? "free" : "main"}/v2`;

  if (schemaField.isRelation) {
    url = `${url}/dicwf/${schemaField.fieldId}/0?${dicParamsStr}`;
  } else {
    url = `${url}/dic/55/${oneToManyItemId}/${schemaField.name}/0?${dicParamsStr}`;
  }

  const res = await instance.get(url);

  if (res.status === 200) {
    return {
      fieldId: schemaField.fieldId,
      options: selectConverter.select(res.data),
    };
  }

  return {
    fieldId: schemaField.fieldId,
    options: [],
  };
}

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
      fields[i].TYPE !== "resultset"
        ? item[fields[i].FIELD]
        : converter.setArrayOfObjectFields(itemId, item[fields[i].FIELD], fields[i].FIELDS);
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
  const metaValue = converter.meta(data[0]?._meta.SNEWRECORD) || {};
  const metaVisible = converter.meta(data[0]?._meta.SVISIBLE) || {};
  const metaReadonly = converter.meta(data[0]?._meta.SREADONLY) || {};
  const metaAddfields = converter.meta(data[0]?._meta.SADDFIELDS) || {};
  const metaBreadcrumbs = converter.breadcrumbs(data[0]?._meta.SNAVIG) || null;
  const arr = converter.setFieldsParams(itemId, item, fields);

  let webFields = data[0]._meta.JSONWEBFIELDS;
  webFields = webFields.sort((a, b) => a.NORDER - b.NORDER).filter((item) => item.SNAME !== "FKIDVARIANT_LIST");

  if (item?.NACTION) {
    const menu = await instance.get(
      `${params.zone === "free" ? consts.CLIENTFREEMENU : consts.CLIENTMENU}/${params.idModule}/${params.idItem}`
    );
    const data = params.zone === "free" ? menu.data[0]._data[0] : menu.data[0];
    const action = data.ACTIONSCUR.find((a) => a.ID === item.NACTION);
    await instance.post(
      `${params.zone === "free" ? consts.FREEACTIONEXEC : consts.ACTIONEXEC}/${params.id}/${item.NACTION}${
        params.idRel !== "undefined" ? `?rel=${params.idRel}&` : "?"
      }${action.REL !== "undefined" ? `relaction=${action.REL}` : ""}`,
      converter.queryParams(item)
    );
  }

  for (let i = 0; i < webFields.length; i++) {
    const obj = {};
    obj.label = webFields[i].SCAPTION || webFields[i].SCAPTIONLONG;
    if (item[webFields[i].SNAME] || item[webFields[i].SNAME] === 0 || item[webFields[i].SNAME] === false) {
      obj.value = item[webFields[i].SNAME];
    } else {
      obj.value = metaValue[webFields[i].SNAME];
      if (
        (webFields[i].STYPE === "Double" || webFields[i].STYPE === "Int64" || webFields[i].STYPE === "Int16") &&
        metaValue[webFields[i].SNAME] !== undefined
      ) {
        obj.value = parseInt(metaValue[webFields[i].SNAME], 10);
      }
      if (webFields[i].IDCONTROL === 16) {
        obj.value = metaValue[webFields[i].SNAME] === "Y";
        if (webFields[i].STYPE === "boolrus") {
          obj.value = metaValue[webFields[i].SNAME] === "Д";
        }
        if (metaValue[webFields[i].SNAME] === "Д") {
          obj.value = true;
        }
        if (metaValue[webFields[i].SNAME] === "Н") {
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
      (webFields[i].IDCONTROL === 0 || webFields[i].IDCONTROL === 1) &&
      (webFields[i].STYPE === "Double" || webFields[i].STYPE === "Int64" || webFields[i].STYPE === "Int16")
    ) {
      obj.type = "double";
    } else if (webFields[i].IDCONTROL === 2) {
      obj.type = "text";
    } else if (webFields[i].IDCONTROL === 6) {
      obj.fileSettings = arr.filter(
        (field) => field.label === "FILE_TYPES" || field.label === "FORM_SETTINGS" || field.label === "FILES"
      );
      obj.type = "uploadFiles";
    } else if (webFields[i].IDCONTROL === 7) {
      obj.type = "label";
    } else if (webFields[i].IDCONTROL === 8) {
      obj.type = "link";
    } else if (webFields[i].IDCONTROL === 14) {
      obj.type = "timestamp";
    } else if (webFields[i].IDCONTROL === 5) {
      obj.type = "progressbar";
    } else if (webFields[i].IDCONTROL === 9) {
      obj.type = "TimePicker";
    } else if (
      webFields[i].IDCONTROL === 15 ||
      webFields[i].IDCONTROL === 37 ||
      webFields[i].IDCONTROL === 441 ||
      webFields[i].IDCONTROL === 56 ||
      webFields[i].IDCONTROL === 55 ||
      webFields[i].IDCONTROL === 53 ||
      webFields[i].IDCONTROL === 57 ||
      webFields[i].IDCONTROL === 58 ||
      webFields[i].IDCONTROL === 76 ||
      webFields[i].IDCONTROL === 12 ||
      webFields[i].IDCONTROL === 74 ||
      webFields[i].IDCONTROL === 76
    ) {
      if (webFields[i].IDCONTROL !== 441 && webFields[i].IDCONTROL !== 53) {
        obj.type = webFields[i].IDCONTROL === 15 ? "combobox" : "customCombobox";
      }
      if (webFields[i].IDCONTROL === 53) {
        obj.type = "RegNumberAuto";
      }
      if (webFields[i].IDCONTROL === 12) {
        obj.type = "TokenBox";
        obj.options = [];
      }
      if (webFields[i].IDCONTROL === 58) {
        obj.type = "SelectButton";
      }
      if (webFields[i].IDCONTROL === 76) {
        obj.type = "ChipsCard";
      }
      if (webFields[i].IDCONTROL === 64) {
        obj.type = "YMap";
      }
      if (webFields[i].IDCONTROL === 663) {
        obj.type = "MultiSelect";
      }
      if (webFields[i].IDCONTROL === 66) {
        obj.type = "DynamicList";
      }

      if (webFields[i].IDCONTROL === 60) {
        obj.type = "Collapse";
      }
      if (webFields[i].IDCONTROL === 664) {
        obj.type = "VariantPolicy";
        if (Array.isArray(obj.value)) {
          obj.value = JSON.stringify(obj.value[0]);
        }
      }

      webFields.forEach((field) => {
        if (
          (field.SCONNECTFIELD && field.SCONNECTFIELD.split(";").some((item2) => webFields[i].SNAME === item2)) ||
          webFields[i].SCONNECTFIELD
        ) {
          obj.options = [];
          obj.type = webFields[i].IDCONTROL === 441 ? "InsuredBox" : "searchSelect";
          obj.isLoading = false;
        }
      });
      if (webFields[i].IDCONTROL === 64) {
        obj.type = "YMap";
      }
      if (webFields[i].IDCONTROL === 53) {
        obj.type = "RegNumberAuto";
      }
      if (webFields[i].IDCONTROL === 57) {
        obj.type = "DynamicDepend";
      }
      if (webFields[i].IDCONTROL === 58) {
        obj.type = "SelectButton";
      }

      if (webFields[i].IDCONTROL === 56) {
        obj.type = "MultiSelect";
      }
      if (webFields[i].IDCONTROL === 66) {
        obj.type = "DynamicList";
      }
      if ([78, 81].includes(webFields[i].IDCONTROL)) {
        obj.type = "SelectObjectFromMap";
      }
      if (webFields[i].IDCONTROL === 55) {
        obj.type = "VariantPolicy";
        if (Array.isArray(obj.value)) {
          obj.value = JSON.stringify(obj.value[0]);
        }
      }
      if (webFields[i].IDCONTROL === 74) {
        obj.type = "NewVariantPolicy";
        if (Array.isArray(obj.value)) {
          obj.value = JSON.stringify(obj.value[0]);
        }
      }
      if (webFields[i].SCONNECTFIELD) {
        const dicParams = webFields
          .filter(
            (field) =>
              webFields[i].LVISIBLE && webFields[i].SCONNECTFIELD.split(";").includes(field.SNAME) && field.LVISIBLE
          )
          .reduce(
            (obj, field) => {
              const value = converter.queryParams(item)[field.SNAME] ?? metaValue[field.SNAME];
              if (value) {
                return Object.assign(obj, { [field.SNAME]: value });
              }
              return obj;
            },
            { ID: params.id ?? 0 }
          );
        if (webFields[i].LDIC === false && webFields[i].LVISIBLE === true) {
          promises.push(() =>
            instance.get(
              `/lk/${zone === "free" ? "free" : "main"}/v2/dic/55/${params.idItem ?? 0}/${webFields[i].SNAME}/${
                params.id ?? 0
              }?${Object.values(dicParams).length ? new URLSearchParams(dicParams).toString() : ``}`
            )
          );
        }
        if (webFields[i].LDIC === true && webFields[i].LVISIBLE === true) {
          promises.push(() =>
            instance.get(
              `/lk/${zone === "free" ? "free" : "main"}/v2/dicwf/${webFields[i].ID}/${params.id ?? 0}?${
                Object.values(dicParams).length ? new URLSearchParams(dicParams).toString() : ``
              }`
            )
          );
        }
      }

      if (webFields[i].LDIC === true && !webFields[i].SCONNECTFIELD) {
        promises.push(() => instance.get(`/lk/${zone === "free" ? "free" : "main"}/v2/dicwf/${webFields[i].ID}`));
      }
      if (webFields[i].LDIC === false && !webFields[i].SCONNECTFIELD) {
        if (webFields[i].SNAME === "IDVARIANT_LIST") {
          obj.type = "InsuredBox";
        }
        if (webFields[i].SNAME !== "IDVARIANT_LIST") {
          promises.push(() =>
            instance.get(
              `/lk/${zone === "free" ? "free" : "main"}/v2/dic/${webFields[i].IDADMMODULE}/${itemId}/${
                webFields[i].SNAME
              }/${params.idList ?? 0}/null/${params.id ?? 0}`
            )
          );
        }
      }
    } else if (webFields[i].IDCONTROL === 16) {
      obj.type = "boolean";
    } else if (webFields[i].IDCONTROL === 21) {
      obj.type = "button";
    } else if (webFields[i].IDCONTROL === 22) {
      obj.type = "splitter";
    } else if (webFields[i].IDCONTROL === 29) {
      obj.type = "captcha";
      obj.captcha = null;
    } else if (webFields[i].IDCONTROL === 31) {
      obj.type = "phoneChange";
    } else if (webFields[i].IDCONTROL === 32) {
      obj.type = "emailChange";
    } else if (webFields[i].IDCONTROL === 30) {
      obj.type = "empty";
    } else if (webFields[i].IDCONTROL === 33) {
      obj.type = "LabelMoney";
    } else if (webFields[i].IDCONTROL === 34) {
      obj.type = "Uploader";
    } else if (webFields[i].IDCONTROL === 35) {
      obj.type = "DadataSelect";
    } else if (webFields[i].IDCONTROL === 62) {
      obj.type = "LoadingOverlay";
    } else if (webFields[i].IDCONTROL === 381) {
      obj.type = "DadataSelect2";
    } else if (webFields[i].IDCONTROL === 40) {
      obj.type = "CustomDouble";
    } else if (webFields[i].IDCONTROL === 39) {
      obj.type = "WizardButton";
    } /*else if (webFields[i].IDCONTROL === 41) {
      obj.type = "GoogleCaptcha";
    }*/ else if (webFields[i].IDCONTROL === 42) {
      obj.type = "Map";
    } else if (webFields[i].IDCONTROL === 43) {
      obj.type = "RegNumber";
    } else if (webFields[i].IDCONTROL === 45) {
      obj.type = "Gallery";
    } else if (webFields[i].IDCONTROL === 53) {
      obj.type = "RegNumberAuto";
    } else if (webFields[i].IDCONTROL === 401) {
      obj.type = "CollapseGroup";
    } else if (webFields[i].IDCONTROL === 441) {
      obj.type = "InsuredBox";
    } else if (webFields[i].IDCONTROL === 55) {
      obj.type = "VariantPolicy";
    } else if (webFields[i].IDCONTROL === 82) {
      obj.type = "FileDownload";
    } else if (webFields[i].IDCONTROL === 502) {
      obj.type = "button";
      obj.isDownloadControl = true;
    } else if (webFields[i].IDCONTROL === 501) {
      obj.type = "VueComponent";
    } else if (webFields[i].IDCONTROL === 56) {
      obj.type = "MultiSelect";
    } else if (webFields[i].IDCONTROL === 66) {
      obj.type = "DynamicList";
    } else if ([78, 81].includes(webFields[i].IDCONTROL)) {
      obj.type = "SelectObjectFromMap";
    } else if (webFields[i].IDCONTROL === 60) {
      obj.type = "Collapse";
    } else if (webFields[i].IDCONTROL === 13) {
      obj.type = "Dropdown";
      if (webFields[i].LDIC === true) {
        promises.push(() =>
          instance.get(
            `/lk/${zone === "free" ? "free" : "main"}/v2/dicwf/${webFields[i].ID}/${params.id ?? 0}?ID=${
              params.id ?? 0
            }`
          )
        );
      }
      if (webFields[i].LDIC === false) {
        promises.push(() =>
          instance.get(
            `/lk/${zone === "free" ? "free" : "main"}/v2/dic/${webFields[i].IDADMMODULE}/${itemId}/${
              webFields[i].SNAME
            }/0/null/${params.id ?? 0}`
          )
        );
      }
    } else if (webFields[i].IDCONTROL === 481) {
      obj.type = "RangeInput";
      if (webFields[i].LDIC === true) {
        promises.push(() =>
          instance.get(
            `/lk/${zone === "free" ? "free" : "main"}/v2/dicwf/${webFields[i].ID}/${params.id ?? 0}?ID=${
              params.id ?? 0
            }`
          )
        );
      }
      if (webFields[i].LDIC === false) {
        promises.push(() =>
          instance.get(
            `/lk/${zone === "free" ? "free" : "main"}/v2/dic/${webFields[i].IDADMMODULE}/${itemId}/${
              webFields[i].SNAME
            }/0/null/${params.id ?? 0}`
          )
        );
      }
    } else if (webFields[i].IDCONTROL === 421) {
      obj.type = "Range";
      if (webFields[i].LDIC === true) {
        promises.push(() =>
          instance.get(
            `/lk/${zone === "free" ? "free" : "main"}/v2/dicwf/${webFields[i].ID}/${params.id ?? 0}?ID=${
              params.id ?? 0
            }`
          )
        );
      }
      if (webFields[i].LDIC === false) {
        promises.push(() =>
          instance.get(
            `/lk/${zone === "free" ? "free" : "main"}/v2/dic/${webFields[i].IDADMMODULE}/${itemId}/${
              webFields[i].SNAME
            }/0/null/${params.id ?? 0}`
          )
        );
      }
    } else if (webFields[i].IDCONTROL === 322) {
      obj.type = "PasswordConfirm";
    } else if (webFields[i].IDCONTROL === 44) {
      obj.type = "RadioButton";
      promises.push(() => instance.get(`/lk/${zone === "free" ? "free" : "main"}/v2/dicwf/${webFields[i].ID}`));
    } else if (webFields[i].IDCONTROL === 46) {
      obj.type = "DoctorSchedule";
    } else if (webFields[i].IDCONTROL === 47) {
      if (webFields[i].NITEMDIC) {
        promises.push(() =>
          instance.get(`/lk/${zone === "free" ? "free" : "main"}/v2/datacard/55/${webFields[i].NITEMDIC}/0`)
        );
      } else {
        obj.value = [];
        obj.schema = [];
      }
      obj.type = "OneToMany";
    } else if (webFields[i].IDCONTROL === 665) {
      obj.type = "Separator";
    } else if (webFields[i].IDCONTROL === 661) {
      obj.type = "Pencil";
    } else if (webFields[i].IDCONTROL === 58) {
      obj.type = "SelectButton";
    } else if (webFields[i].IDCONTROL === 64) {
      obj.type = "YMap";
    } else if (webFields[i].IDCONTROL === 59) {
      obj.type = "Informer";
    } else if (webFields[i].IDCONTROL === 65) {
      obj.type = "Authorization";
    } else if (webFields[i].IDCONTROL === 68) {
      obj.type = "AsyncModal";
    } else if (webFields[i].IDCONTROL === 76) {
      obj.type = "ChipsCard";
    } else if (webFields[i].IDCONTROL === 69) {
      obj.type = "CardList";
    } else if (webFields[i].IDCONTROL === 79) {
      obj.type = "CustomComboboxJSON";
      obj.value = obj.value ?? null;
      obj.options = [];
    } else if (webFields[i].IDCONTROL === 41) {
      obj.type = "YandexCaptcha";
    } else {
      obj.type = "string";
    }
    obj.id = itemId;
    obj.fieldId = webFields[i].ID;
    obj.cols = webFields[i].NCOLSPAN ? webFields[i].NCOLSPAN : 12;
    obj.colSm = webFields[i].NCOLSM ? webFields[i].NCOLSM : 12;
    obj.colMd = webFields[i].NCOLMD ? webFields[i].NCOLMD : 12;
    obj.isMask = webFields[i].LMASKINCLITTERALS ? webFields[i].LMASKINCLITTERALS : false;
    obj.colLg = webFields[i].NCOLLG ? webFields[i].NCOLLG : 12;
    obj.width = webFields[i].NWIDTH ? `${webFields[i].NWIDTH}%` : "100%";
    obj.name = webFields[i].SNAME;
    obj.cssClass = webFields[i].SCSSCLASS ? webFields[i].SCSSCLASS : "";
    obj.webId = webFields[i].SWEBID ? webFields[i].SWEBID : "";
    if (
      metaVisible[webFields[i].SNAME.toUpperCase()] === "Y" ||
      metaVisible[webFields[i].SNAME.toUpperCase()] === "N"
    ) {
      obj.visible = metaVisible[webFields[i].SNAME.toUpperCase()] !== "N";
    } else {
      obj.visible = !(webFields[i].LVISIBLE === "N" || webFields[i].LVISIBLE === false);
    }
    obj.required = !(webFields[i].LREQUIRED === "N" || webFields[i].LREQUIRED === false);
    obj.page = webFields[i].NPAGE;
    obj.mask = webFields[i].SMASK;
    obj.regex = webFields[i].SREGEXP;
    obj.readonly = !(webFields[i].LREADONLY === "N" || webFields[i].LREADONLY === false);
    obj.control = null;
    obj.state = (obj.value || obj.value === 0) && obj.required ? true : null;
    obj.checked = obj.value && obj.required ? true : null;
    obj.error = null;
    obj.helpText = webFields[i].SHELPTEXT;
    obj.placeholder = webFields[i].SNULLTEXT;
    obj.isRelation = !(webFields[i].LDIC === "N" || webFields[i].LDIC === false);
    obj.fieldRelation = webFields[i].SCONNECTFIELD ?? null;
    obj.isTab = !!data[0]._meta.SPAGECAPTION;
    if (webFields[i].NITEMDIC) {
      obj.menudic = webFields[i].NITEMDIC;
    }
    promises.push(() => Promise.resolve(obj));
  }
  try {
    Promise.sequenceAllSettled = async (promiseFactories) => {
      const results = [];
      for (const factory of promiseFactories) {
        try {
          const value = await factory();
          results.push({ status: "fulfilled", value });
        } catch (reason) {
          results.push({ status: "rejected", reason });
        }
      }
      return results;
    };
    const isSync = item.LSYNC;
    const methodPromise = isSync ? "sequenceAllSettled" : "allSettled";
    const dataPromises = isSync ? promises : promises.map((f) => f());
    await Promise[methodPromise](dataPromises).then((values) => {
      values.forEach((item) => {
        if (item.status === "rejected") {
          errors.push({
            url: item.reason.response?.config,
            data: item.reason.response?.data,
          });
        }
        if (item.status === "fulfilled" && item.value.data) {
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
                converter.form(item.value.data, { idItem: dataCardSettings.NITEMDIC, id: null, zone }, instance)
              );
            }
          } else {
            const options = selectConverter.select(item.value.data);
            let fieldName = null;
            let field1 = null;
            if (isDicwf) {
              const fieldId = parseInt(
                item.value.config.url.replace(`/lk/${zone === "free" ? "free" : "main"}/v2/dicwf/`, "")
              );
              if (fieldId) {
                field1 = values.find((b) => (b.value ? b.value.fieldId === fieldId : null));
              }
            } else {
              fieldName = item.value.config.url
                .replace(`/lk/${zone === "free" ? "free" : "main"}/v2/dic/55/${itemId}/`, "")
                .split("/", 1)[0];
              if (fieldName) {
                field1 = values.find((b) => (b.value ? b.value.name === fieldName : null));
              }
            }
            if (field1) {
              field1.value.options = options;
            }
          }
        } else if (item.status === "fulfilled" && !item.value.data) {
          webFieldsArr.push(item.value);
        }
      });
    });
    await Promise.allSettled(promisesOfOneToMany).then(async (values) => {
      for (const oneToManyResult of values) {
        if (oneToManyResult.status === "rejected") {
          errors.push({
            url: oneToManyResult.reason.response?.config,
            data: oneToManyResult.reason.response?.data,
          });
        }
        if (oneToManyResult.status === "fulfilled" && oneToManyResult.value.data) {
          const oneToManyData = webFieldsArr.find(
            (webField) => webField.menudic === oneToManyResult.value.metaData.itemId
          );
          let dataCardValuesArray;
          const dataCardWebFieldsArray = oneToManyResult.value.metaData.data;

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
            const fieldsNeedingPerRowOptions = dataCardWebFieldsArray.filter(
              (f) => f.type === "searchSelect" && f.fieldRelation
            );

            for (const itemValue of dataCardValuesArray) {
              const rowFields = dataCardWebFieldsArray.map((itemWebField) => ({
                ...itemWebField,
                value: itemValue[itemWebField.name],
                state:
                  (itemValue[itemWebField.name] || itemValue[itemWebField.name] === 0) && itemWebField.required
                    ? true
                    : null,
              }));

              if (fieldsNeedingPerRowOptions.length > 0) {
                const optionPromises = fieldsNeedingPerRowOptions.map((schemaField) =>
                  attachWithRelationFields(schemaField, oneToManyResult, itemValue, instance, zone)
                );

                const optionResults = await Promise.all(optionPromises);
                optionResults.forEach((result) => {
                  const targetField = rowFields.find((f) => f.fieldId === result.fieldId);
                  if (targetField) {
                    targetField.options = result.options;
                  }
                });
              }

              resultOneToMany.push(converter.type(rowFields, {}));
            }
          }

          oneToManyData.value = resultOneToMany;
          oneToManyData.schema = dataCardWebFieldsArray;
        }
      }
    });
  } catch (e) {
    console.error(e);
  }

  console.log(`\n\n\n\n-----\n ${JSON.stringify(errors)}\n\n`);
  if (errors.length !== 0) {
    throw new Error({ response: { data: JSON.stringify(errors) } });
  }

  return {
    errors,
    // Переход на поля JSONWEBFIELDS
    data: converter.type(arr),
    // Метаданные для отображения JSONWEBFIELDS
    metaData: {
      data: converter.type(webFieldsArr, metaReadonly),
      defaultValues: metaValue,
      captions: data[0]._meta.SPAGECAPTION,
      cardCaption: data[0]._meta.SCARDCAPTION,
      btnSave: metaVisible?.BTNSAVE !== "N",
      btnCancel: metaVisible?.BTNCANCEL !== "N",
      readonly: metaReadonly?.ALL_FIELDS === "Y",
      visible: metaVisible,
      addFields: metaAddfields,
      breadCrumbs: metaBreadcrumbs,
      itemId: params.idItem,
      sync: Boolean(item?.LSYNC),
      actionId: item.NACTION,
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

    if (data[i].type === "CustomComboboxJSON") {
      copy[i].value = data[i].value ?? null;
    }

    if (data[i].control !== null) {
      data[i].type = controlConverter.getType(data[i].control);
    } else if (data[i].type === `string` && data[i].maxlength > 200) {
      copy[i].type = `text`;
    }
    if (data[i].type === `timestamp`) {
      if (data[i].value) {
        data[i].value = moment(data[i].value, ["DD.MM.YYYY", "YYYY-MM-DD"]).format("DD.MM.YYYY");
      } else {
        data[i].value = null;
      }
    }

    if (data[i].name.substring(0, 2) === `FK`) {
      for (let j = 0; j < data.length; j++) {
        if (
          data[i].name.substring(2) === data[j].name &&
          data[j].type !== "combobox" &&
          data[i].type !== "SelectObjectFromMap" &&
          data[i].type !== "label" &&
          data[i].type !== "InsuredBox"
        ) {
          if (data[j].type === "InsuredBox") {
            copy[i].type = "InsuredBox";
          } else {
            copy[i].type = `enum`;
            if (data[i].menudic) {
              copy[i].type = `listSelect`;
              if (data[i].fieldId === 38003) {
                copy[i].type = `doctorSchedule`;
              }
              if ([84684, 82521, 59720, 60679].includes(data[i].fieldId)) {
                copy[i].type = `newDoctorSchedule`;
              }
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
      return data.value === true || data.value === "Y" ? "Y" : "N";
    }
    if (data.type === "timestamp") {
      return data.value ? moment(data.value, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD HH:mm:ss") : null;
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
        return Number.isNaN(parseInt(data.value, 10)) ? null : parseInt(data.value, 10);
      }
    }
    if (data.structType === "double") {
      if (data.value !== null) {
        return Number.isNaN(parseFloat(data.value)) ? null : parseFloat(data.value);
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
      data[i].type !== "doctorSchedule" &&
      data[i].type !== "newDoctorSchedule" &&
      data[i].type !== "Collapse"
    ) {
      if (data[i].type !== "boolean") {
        if (data[i].type !== "timestamp") {
          res[data[i].name] = data[i].value !== null && data[i].value !== undefined ? data[i].value : null;
          if (typeof data[i].value === "string") {
            if (data[i].value !== "") {
              // TODO: replace
              res[data[i].name] = data[i].value.replace(/(<([^>]+)>)/gi, "");
            } else {
              res[data[i].name] = null;
            }
          }
          if (data[i].type === "Uploader") {
            if (res[data[i].name] !== null) {
              res[data[i].name] =
                data[i].value !== null && data[i].value !== undefined
                  ? Object.values(data[i].value).map(
                      // eslint-disable-next-line no-return-assign
                      (item) =>
                        (item = new File([item], item.name, {
                          type: "field/blob",
                        }))
                    )
                  : null;
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
                        [subItem.name]: converter.getValue(subItem) ?? null,
                      }),
                    {}
                  )
                )
              );
            }
          }
          if (data[i].type === "DadataSelect2") {
            res[data[i].name] =
              data[i].value !== null && data[i].value !== undefined && typeof data[i].value === "object"
                ? JSON.stringify(data[i].value)
                : data[i].value || null;
          }
          if (data[i].structType === "boolrus") {
            res[data[i].name] = data[i].value === "true" || data[i].value === true ? "Д" : "Н";
          }

          if (data[i].structType === "long") {
            res[data[i].name] = data[i].value !== null ? parseInt(data[i].value) : null;
          }
          if (data[i].structType === "double") {
            res[data[i].name] = data[i].value !== null ? parseFloat(data[i].value) : null;
          }
        } else {
          res[data[i].name] = data[i].value
            ? moment(data[i].value, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD HH:mm:ss")
            : null;
        }
      } else if (data[i].name.substring(0, 1) === "B") {
        res[data[i].name] = data[i].value ? "Д" : "Н";
      } else if (data[i].structType === "boolrus") {
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
        if (data[i].value?.value) {
          if (
            typeof data[i].value?.value === "object" &&
            !Array.isArray(data[i].value?.value) &&
            data[i].value?.value !== null
          ) {
            res[name] = JSON.stringify(data[i].value?.value);
          } else {
            res[name] = data[i].value?.value;
          }
        } else if (data[i].value?.value == 0) {
          res[name] = 0;
        } else {
          res[name] = null;
        }
      } else {
        res[name] = null;
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

converter.queryParams = (data) => {
  function getVal(key, val) {
    if (typeof val === "boolean") {
      if (data.structType === "boolrus") {
        return val === true ? "Д" : "Н";
      }

      if (key.startsWith("B")) {
        return val === true ? "Д" : "Н";
      }
      if (key.startsWith("L")) {
        return val === true ? "Y" : "N";
      }
      return val;
    }
    if (typeof val === "object") {
      return JSON.stringify(val);
    }
    return val;
  }

  return Object.fromEntries(Object.entries(data).map(([key, val]) => [key, getVal(key, val)]));
};

converter.cutHTMLFromQueryParams = (data) =>
  Object.fromEntries(
    Object.entries(data).map(([key, val]) => [
      key,
      typeof val === "string" && val !== "" ? val.replace(/(<([^>]+)>)/gi, "") : val,
    ])
  );

export default converter;
