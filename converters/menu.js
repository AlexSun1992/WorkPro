import filterConverter from '../converters/filter'
import actionConverter from '../converters/action'
import tabConverter from '../converters/tab'
import iconConverter from '../converters/icon'
import wizardConverter from '../converters/wizard'
const converter = {}

converter.modules = (data, id) => {
  let arr = []
  let _data = []
  if(data){
    if(data.length){
      if(data[0]._data){
        _data = data[0]._data
      }
      else {
        _data = data
      }
    }
  }
  for (let i = 0; i < _data.length; i++) {
    if (_data[i][`SNAME`]) {
      if (id) {
        _data[i].idModule = id
      }
      if (!_data[i][`IDITEM`]) {
        arr.push(converter.menuObject(_data[i]))
      } else {
        if (_data[i][`LSHOW`]) {
          arr.push(converter.menuObject(_data[i]))
        }
      }
    }
  }
  return arr
}

converter.toTree = (data) => {
  let list = data
  let map = {}
  let node
  let roots = []
  for (let i = 0; i < list.length; i += 1) {
    map[list[i].id] = i
  }
  for (let i = 0; i < list.length; i += 1) {
    node = list[i]
    if (node.idParent !== 0) {
      if(!list[map[node.idParent]].children){
        list[map[node.idParent]].children = []
      }
      if(list[map[node.idParent]].children){
        list[map[node.idParent]].children.push(node)
      }
    } else {
      roots.push(node)
    }
  }
  return roots
}

converter.sidebar = (modules, menu) => {
  try {
    for (let i = 0; i < modules.length; i++) {
      let children = converter.toTree(converter.modules(menu[i].data, modules[i].id))
      modules[i].children = children
    }
    return modules
  }
  catch (e) {
   console.log(e)
  }
}

converter.menuObject = (data) => {
  let obj = {}
  obj.name = data.SNAME
  if (data.IDITEM === -1) {
    obj.url = `/cabinet/${data.idModule}/${data.ID}`
  } else {
    obj.url = data.IDITEM ? `/cabinet/${data.idModule}/${data.IDPARENT}/${data.IDITEM}` : `/${data.ID}`
  }
  obj.id = data.ID
  obj.icon = iconConverter.icon(data.SLOGO)
  obj.iconFileName = data.SICONFILENAME
  obj.idItem = data.IDITEM
  obj.idParent = data.IDPARENT
  obj.compType = data.IDADMMENUTYPE
  obj.recordLoad = data.LFIRSTLOADRECORD
  obj.newRecord = data.IDADMMENUTYPE === 10
  obj.filters = data.FILTERCUR ? filterConverter.filter(data.FILTERCUR) : []
  obj.actions = data.ACTIONSCUR ? actionConverter.action(data.ACTIONSCUR) : []
  obj.tabs = data.ONETOMANYCUR ? tabConverter.tab(data.ONETOMANYCUR) : []
  obj.add = data.LNEW
  obj.edit = data.LEDIT
  obj.delete = data.LDELETE
  obj.cols = data.NCOLCOUNT
  obj.isCard = data.IDADMMENUTYPE === 3
  obj.wizard =  wizardConverter.wizard(data.WIZARDCUR)
  obj.portalgrid = data.SVJPORTALGRID || null
  obj.cardgrid = data.SVJCARDGRID || null
  obj.cardtemplate = data.SVJCARDTEMPLATE || null
  obj.isModal = data.LMODALFORMSTYLE
  return obj
}

export default converter
