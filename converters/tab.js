const converter = {}

converter.tab = (data) => {
  const arr = [{ label: 'Общие', active: true, chat: false, form: true, id: null }]
  const items = data
  for (let i = 0; i < items.length; i++) {
    const obj = {}
    obj.label = items[i].SCOMMENT
    obj.chat = !!items[i].LCHAT
    obj.form = false
    obj.id = items[i].ID
    arr.push(obj)
  }
  return arr
}

export default converter
