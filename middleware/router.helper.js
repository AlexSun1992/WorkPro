const BLACK_LIST_ROUTES = [
  { idModule: 55, idItem: 913 },
  { idModule: 55, idItem: 914 },
  { idModule: 55, idItem: 915 },
  { idModule: 55, idItem: 916 },
  { idModule: 55, idItem: 917 },
  { idModule: 55, idItem: 918 },
  { idModule: 55, idItem: 723 },
  { idModule: 55, idItem: 733 },
  { idModule: 55, idItem: 734 },
  { idModule: 55, idItem: 735 },
  { idModule: 55, idItem: 736 },
  { idModule: 55, idItem: 737 },
  { idModule: 55, idItem: 757 },
  { idModule: 55, idItem: 739 },
];

const WHITE_LIST_MODULES = [55];

export function isBlackListOfRoute(idModule, idParent, idItem) {
  const blackListRoutes = BLACK_LIST_ROUTES.find((blackList) => {
    if (
      parseInt(idModule, 10) === blackList.idModule &&
      parseInt(idItem, 10) === blackList.idItem
    ) {
      return true;
    }
    return false;
  });
  if (blackListRoutes) {
    return true;
  }
  if (!/^\d+$/.test(idModule)) {
    return false;
  }
  if (Number.parseInt(idParent, 10) !== 0) {
    return true;
  }
  if (!WHITE_LIST_MODULES.includes(parseInt(idModule, 10))) {
    return true;
  }
  return false;
}
