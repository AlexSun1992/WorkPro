async function eventHandler(data, item, func) {
  function findField(name) {
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }
  const IDCOUNTRYDOC = findField("IDPHOLDER_COUNTRY");
  const IDDOCTYPE = findField("IDPHOLDER_DOCTYPE");
  const BUTTON_NEXT = findField("BUTTON_NEXT");
  const BUTTON_BACK = findField("BUTTON_BACK");
  const svin = findField("SVIN");
  const sModel = findField("SMODEL");
  const model = findField("IDMODEL");
  const IDBRAND = findField("IDBRAND");
  const IDMODEL = findField("IDMODEL");
  const BNO_VIN = findField("BNO_VIN");
  const INFO_TS = findField("INFO_TS");
  const saveBtn = findField("Save");
  const regNum = findField("SREGNUM");
  console.log(item);
  if (item.name === "IDBRAND") {
    if (IDBRAND.value) {
      IDMODEL.visible = true;
    }
  }

  return data;
}
export { eventHandler };
