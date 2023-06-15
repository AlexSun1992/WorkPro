const breadcrumbs = {};
const bcItem = {};

breadcrumbs.getData = (data, params) => {
  const arr = [{ text: "Главная", href: "/" }];
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === parseInt(params.idModule)) {
      arr.push(bcItem.getData(data[i]));
      const item = data[i].children;
      for (let j = 0; j < item.length; j++) {
        if (item[j].idParent === parseInt(params.idParent)) {
          if (item[j].idItem === parseInt(params.idItem)) {
            arr.push(bcItem.getData(item[j]));
          }
        } else if (item[j].children) {
          if (item[j].children.length) {
            const folder = item[j].children;
            for (let i = 0; i < folder.length; i++) {
              if (folder[i].idParent === parseInt(params.idParent)) {
                if (folder[i].idItem === parseInt(params.idItem)) {
                  arr.push(bcItem.getData(item[j]));
                  arr.push(bcItem.getData(folder[i]));
                }
              }
            }
          }
        }
      }
    }
  }
  return arr;
};

bcItem.getData = (data) => {
  const obj = {};
  obj.text = data.name;
  obj.active = true;
  obj.compType = data.compType;
  obj.recordLoad = data.recordLoad;
  obj.newRecord = data.newRecord;
  obj.filters = data.filters;
  obj.actions = data.actions;
  obj.tabs = data.tabs;
  obj.add = data.add;
  obj.edit = data.edit;
  obj.delete = data.delete;
  obj.cols = data.cols;
  obj.wizard = data.wizard;
  obj.isCard = data.isCard;
  obj.isForm = data.isForm;
  obj.isWizard = data.isWizard;
  obj.isUploader = data.isUploader;
  obj.isPortal = data.isPortal;
  obj.portalgrid = data.portalgrid;
  obj.cardgrid = data.cardgrid;
  obj.cardtemplate = data.cardtemplate;
  obj.isModal = data.isModal;
  obj.parentMenu = data.parentMenu;
  obj.groupmenu = data.groupmenu;
  obj.isVisible = data.isVisible;
  obj.idItem = data.idItem;
  obj.idParent = data.idParent;
  obj.parentMenu = data.parentMenu;
  obj.newCount = data.newCount;
  return obj;
};

export default breadcrumbs;
