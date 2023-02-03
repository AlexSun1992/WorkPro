const BLACK_LIST_ROUTES = [
  { idModule: 55, idParent: 913 },
  { idModule: 55, idParent: 914 },
  { idModule: 55, idParent: 915 },
  { idModule: 55, idParent: 916 },
  { idModule: 55, idParent: 917 },
  { idModule: 55, idParent: 918 },
];

const WHITE_LIST_MODULES = [55];

export function isBlackListOfRoute(idModule, idParent) {
  const blackListRoutes = BLACK_LIST_ROUTES.find((blackList) => {
    if (
      parseInt(idModule, 10) === blackList.idModule &&
      parseInt(idParent, 10) === blackList.idParent
    ) {
      return true;
    }
    return false;
  });
  if (blackListRoutes) {
    return true;
  }
  if (WHITE_LIST_MODULES.includes(parseInt(idModule, 10))) {
    return false;
  }
  if (/^\d+$/.test(idModule)) {
    return true;
  }
  return false;
}
