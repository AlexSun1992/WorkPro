// const ROUTE_BLACK_LIST = [];
// function createRouteBlackListItem(idModule, idParent) {
//   return `/cabinet/${idModule}/${idParent}`;
// }
// export function isBlackListOfRoute(idModule, idParent) {
//   if (
//     (parseInt(idParent) > 912 && parseInt(idParent) < 918) ||
//     (parseInt(idModule) !== 55 && !isNaN(parseInt(idModule)))
//   ) {
//     ROUTE_BLACK_LIST.push(createRouteBlackListItem(idModule, idParent));
//     // return true;
//   }
//   console.log(ROUTE_BLACK_LIST);
//   return ROUTE_BLACK_LIST;
// }
export function isBlackListOfRoute(idModule, idParent) {
  if (
    (parseInt(idParent) > 912 && parseInt(idParent) < 918) ||
    (parseInt(idModule) !== 55 && !isNaN(parseInt(idModule)))
  ) {
    return true;
  }
  return false;
}
