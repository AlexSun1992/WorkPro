function eventHandler(data, item, action) {
  console.log("1096");
  return data;
}
function initHandler(data, item, action) {
  console.log("init", "1096");
  return data;
}
export { eventHandler, initHandler };
