const converter = {}

converter.action = (data) => {
  const arr = []
  const items = data
  for (let i = 0; i < items.length; i++) {
    const obj = {}
    obj.label = items[i].SNAME
    obj.id = items[i].ID
    obj.type = items[i].NTYPE
    obj.command = items[i].SCONST
    arr.push(obj)
  }
  return arr
}

export default converter
