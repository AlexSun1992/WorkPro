const converter = {}

converter.compare = (a, b) => {
  if (a.NORDER < b.NORDER) { return -1 }
  if (a.NORDER > b.NORDER) { return 1 }
  return 0
}

converter.wizard = (data) => {
  let arr = []
  if(data){
    data.sort(converter.compare)
    for (let i = 0; i < data.length; i++) {
      let obj = {}
      obj.name = data[i].SNAME
      obj.idItem = data[i].NITEM
      obj.id = data[i].ID
      arr.push(obj)
    }
  }

  return arr
}

export default converter
