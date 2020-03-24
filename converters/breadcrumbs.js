const breadcrumbs = {}
const bcItem = {}

breadcrumbs.getData = (data, params) => {
  let arr = [{text: `Главная`, href: '/'}]
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === parseInt(params.idModule)) {
      arr.push(bcItem.getData(data[i]))
      let item = data[i].children
      for (let j = 0; j < item.length; j++) {
        if (item[j].idParent === parseInt(params.idParent)) {
          if (item[j].idItem === parseInt(params.idItem)) {
            arr.push(bcItem.getData(item[j]))
          }
        } else {
          if (item[j].children.length) {
            let folder = item[j].children
            for (let i = 0; i < folder.length; i++) {
              if (folder[i].idParent === parseInt(params.idParent)) {
                if (folder[i].idItem === parseInt(params.idItem)) {
                  arr.push(bcItem.getData(item[j]))
                  arr.push(bcItem.getData(folder[i]))
                }
              }
            }
          }
        }
      }
    }
  }
  return arr
}

bcItem.getData = (data) => {
  let obj = {}
  obj.text = data.name
  obj.active = true
  obj.compType = data.compType
  obj.recordLoad = data.recordLoad
  obj.filters = data.filters
  obj.actions = data.actions
  obj.tabs = data.tabs
  obj.add = data.add
  obj.edit = data.edit
  obj.delete = data.delete
  obj.cols = data.cols
  return obj
}

export default breadcrumbs
