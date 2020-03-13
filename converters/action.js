const converter = {}

converter.action = (data) => {
  let arr = []
  let items = data
  for (let i = 0; i < items.length; i++) {
    let obj = {}
    obj.label = items[i].SNAME
    obj.id = items[i].ID
    obj.type = items[i].NTYPE
    obj.command = items[i].SCONST
    arr.push(obj)
  }
  return arr
}

export default converter
