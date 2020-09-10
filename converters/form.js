import moment from 'moment/moment'
import controlConverter from '../converters/control'

const converter = {}

converter.setArrayOfObjectFields = (itemId, items, fields) => {
  let arr = [];
  for(let i = 0; i < items.length; i++){
    arr.push(converter.setFieldsParams(itemId, items[i], fields))
  }
  return arr
}

converter.setFieldsParams = (itemId, item, fields) => {
  let arr = [];
  fields.sort(converter.compare)
  for (let i = 0; i < fields.length; i++) {
    let obj = {}
    obj.label = fields[i].CAPTION ? fields[i].CAPTION : fields[i].FIELD
    obj.value = fields[i].TYPE != 'resultset' ? item[fields[i].FIELD] : converter.setArrayOfObjectFields(itemId,item[fields[i].FIELD], fields[i].FIELDS)
    obj.id = itemId
    obj.type = fields[i].TYPE
    obj.maxlength = fields[i].PRECISION
    obj.name = fields[i].FIELD
    obj.visible = fields[i].VISIBLE
    obj.required = fields[i].REQUIRED
    obj.readonly = fields[i].READONLY
    obj.control = null
    obj.state = null
    obj.isTab = false
    arr.push(obj)
  }
  return arr
}

converter.compare = (a, b) => {
  if (a.ORDER < b.ORDER) { return -1 }
  if (a.ORDER > b.ORDER) { return 1 }
  return 0
}

converter.subcompare = (a, b) => {
  if (a.NVISIBLEINDEX < b.NVISIBLEINDEX) { return -1 }
  if (a.NVISIBLEINDEX > b.NVISIBLEINDEX) { return 1 }
  return 0
}

converter.form = (data, itemId) => {
  let item = data[0]._data.length ? data[0]._data[0] : {}
  let fields = data[0]._struct
  let meta = converter.meta(data[0]._meta)
  let arr = converter.setFieldsParams(itemId, item, fields)

  // Собираем объект для JSONWEBFIELDS (сделать единую обработку)
  let webFieldsArr = [];
  let webFields = data[0]._meta['JSONWEBFIELDS']
  webFields = webFields.sort((a, b) => a['NORDER'] - b['NORDER']);

  for (let i = 0; i < webFields.length; i++) {
    let obj = {};
    obj.label = webFields[i].SCAPTION;
    obj.value = item[webFields[i].SNAME];
    obj.type = webFields[i].STYPE;

    if ((webFields[i].IDCONTROL == 0 || webFields[i].IDCONTROL == 1) &&
        (webFields[i].STYPE == 'Double' || webFields[i].STYPE == 'Int64' || webFields[i].STYPE == 'Int16')) {
      obj.type = 'double';
    } else if (webFields[i].IDCONTROL == 2) {
      obj.type = 'text';
    } else if (webFields[i].IDCONTROL == 7) {
      obj.type = 'label';
    } else if (webFields[i].IDCONTROL == 8) {
      obj.type = 'link';
    } else if (webFields[i].IDCONTROL == 14) {
      obj.type = 'timestamp';
    } else if (webFields[i].IDCONTROL == 16) {
      obj.type = 'boolean';
    } else if (webFields[i].IDCONTROL == 21) {
      obj.type = 'button';
    } else {
      obj.type = 'string';
    }

    function setDefaultValues(caption) {
      if (caption) {
        return caption;
      } else {
        obj.cols = 12;
        obj.width = '100%';
        return 'f-l-i col-md-3 col-12';
      }
    }

    obj.id = itemId
    obj.fieldId = webFields[i].ID;
    obj.cols = webFields[i].NCOLSPAN;
    obj.width = webFields[i].NWIDTH + '%';
    obj.name = webFields[i].SNAME;
    obj.labelCols = webFields[i].SCAPTIONPOSITION
    obj.visible = webFields[i].LVISIBLE === 'N' ? false : true;
    obj.required = webFields[i].LREQUIRED === 'N' ? false : true;
    obj.page = webFields[i].NPAGE;
    obj.readonly = webFields[i].LREADONLY === 'N' ? false : true;
    obj.control = null;
    obj.state = null;
    obj.isRelation = webFields[i].LDIC === 'N' ? false : true;
    obj.fieldRelation = webFields[i].SCONNECTFIELD ? 'FK' + webFields[i].SCONNECTFIELD : null
    obj.isTab = data[0]._meta['SPAGECAPTION'] ? true : false
    webFieldsArr.push(obj)
  }
  // ********

  return {
    // Переход на поля JSONWEBFIELDS
    data:  converter.type(arr),
    // Метаданные для отображения JSONWEBFIELDS
    metaData: {
      data: converter.type(webFieldsArr),
      captions: data[0]._meta['SPAGECAPTION']
    }
  }
}

converter.type = (data) => {
  let copy = data
  let del = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].control !== null) {
      data[i].type = controlConverter.getType(data[i].control)
    } else {
      if (data[i].type === `string` && data[i].maxlength > 200) {
        copy[i].type = `text`
      }
    }
    if(data[i].type === `timestamp`){
      if(data[i].value){
        data[i].value = moment(data[i].value, ['DD.MM.YYYY', 'YYYY-MM-DD']).format('DD.MM.YYYY')
      }
      else{
        data[i].value = null
      }
    }
    if (data[i].name.substring(0, 2) === `FK`) {
      for (let j = 0; j < data.length; j++) {
        if (data[i].name.substring(2) === data[j].name) {
          copy[i].type = `enum`
          copy[i].label = copy[j].label
          copy[i].required = copy[j].required
          copy[i].dic = data[j].name
          copy[i].value = {text: copy[i].value, value: copy[j].value}
          copy[i].id = copy[j].id
          copy[i].isRelation = copy[j].isRelation
          copy[i].fieldRelation = copy[j].fieldRelation
          copy[i].fieldId = copy[j].fieldId
          del.push(data[j])
        }
      }
    }
  }
  return converter.remove(copy, del)
}

converter.remove = (arr, toRemove) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    for (let j = 0; j < toRemove.length; j++) {
      if (arr[i] && (arr[i].name === toRemove[j].name)) {
        arr.splice(i, 1)
      }
    }
  }
  return arr
}

converter.meta = (meta) => {
  if(meta.SNEWRECORD){
    let convert_meta = {}
    let arr_split = meta.SNEWRECORD.split(`\r`)
    for(let i = 0; i < arr_split.length; i++ ){
      let field_meta = arr_split[i].split(`=`)
      convert_meta[field_meta[0].toUpperCase()] = field_meta[1]
    }
    return convert_meta
  }
}

converter.save = (data) => {
  let res = {}
  let name = ``
  for (let i = 0; i < data.length; i++) {
    if (data[i].type !== 'enum' && data[i].type !== 'multi') {
      if (data[i].type !== 'boolean') {
        if (data[i].type !== 'timestamp') {
          res[data[i].name] = data[i].value ? data[i].value : 'NULL'
        } else {
          res[data[i].name] = data[i].value ? moment(data[i].value, ['DD-MM-YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD HH:mm:ss') : 'NULL'
        }
      } else {
        res[data[i].name] = data[i].value ? 'Y' : 'N'
      }
    } else {
      if (data[i].name.substring(0, 2) === `FK`) {
        name = data[i].name.substring(2)
      } else {
        name = data[i].name
      }
      if (data[i].type !== 'multi') {
        res[name] = data[i].value.value ? data[i].value.value : 'NULL'
      } else {
        res[name] = 'NULL'
        let arr = []
        if (data[i].value) {
          let items = data[i].value
          for (let j = 0; j < items.length; j++) {
            arr.push(items[j].value)
          }
        }
        res[name] = arr.toString()
      }
    }
  }
  return res
}

export default converter
