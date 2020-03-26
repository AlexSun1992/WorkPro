import moment from 'moment'
const converter = {}

converter.compare = (a, b) => {
  if (a.ORDER < b.ORDER) { return -1 }
  if (a.ORDER > b.ORDER) { return 1 }
  return 0
}

converter.list = (data) => {
  let arr = []
  let obj = {}
  let fields = data[0]._struct
  fields.sort(converter.compare)
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].VISIBLE) {
      let obj = {}
      obj.label = fields[i].CAPTION ? fields[i].CAPTION : fields[i].FIELD
      obj.key = fields[i].FIELD
      obj.type = fields[i].TYPE
      obj.tdClass = 'text-col'
      obj.sortable = true
      obj.formatter = (value) => { return converter.formatter(obj.type, value) }
      arr.push(obj)
    }
  }
  obj.fields = arr
  obj.items = data[0]._data
  obj.total = obj.items.length
  return obj
}

converter.formatter = (type, value) => {
  let res = converter.formatByType(type, value)
  return `<span title="${type !== 'boolean' ? res : ''}">${res}</span>`
}

converter.formatByType = (type, value) => {
  switch (type) {
    case 'timestamp':
      return value ? moment(value).format('DD.MM.YYYY HH:mm:ss') : ''
    case 'boolean':
      return `<input onclick="return false"  type="checkbox" ${value ? 'checked' : ''}>`
    case 'double':
      return value ? value.toLocaleString('ru') : ''
    case 'long':
      return value ? value.toLocaleString('ru') : ''
    default:
      return value || ''
  }
}

export default converter
