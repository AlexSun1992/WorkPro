import moment from 'moment/moment'
import controlConverter from '../converters/control'

const converter = {}

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

converter.form = (data) => {
  let arr = []
  let item = data[0]._data.length ? data[0]._data[0] : {}
  let fields = data[0]._struct
  let meta = converter.meta(data[0]._meta)
  fields.sort(converter.compare)
  for (let i = 0; i < fields.length; i++) {
    let obj = {}
    obj.label = fields[i].CAPTION ? fields[i].CAPTION : fields[i].FIELD
    obj.value = item[fields[i].FIELD] || meta[fields[i].FIELD]
    obj.type = fields[i].TYPE
    obj.maxlength = fields[i].PRECISION
    obj.name = fields[i].FIELD
    obj.visible = fields[i].VISIBLE
    obj.required = fields[i].REQUIRED
    obj.control = null
    obj.state = null
    arr.push(obj)
  }
  return converter.type(arr)
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
    if (data[i].name.substring(0, 2) === `FK`) {
      for (let j = 0; j < data.length; j++) {
        if (data[i].name.substring(2) === data[j].name) {
          copy[i].type = `enum`
          copy[i].label = copy[j].label
          copy[i].required = copy[j].required
          copy[i].dic = data[j].name
          copy[i].value = {text: copy[i].value, value: copy[j].value}
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
