function eventHandler(data, item, action) {
  console.log(data, item);
  return data;
}
function initHandler(data, item, action) {
  console.log("init");
  return data;
}
export { eventHandler, initHandler };
