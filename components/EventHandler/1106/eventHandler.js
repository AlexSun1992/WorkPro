async function eventHandler(data, item, callback) {
  console.log(item);
  function findField(name) {
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }
  const SREG_NUMBER = findField("SREG_NUMBER");

  if (item.name === "IDVEHDOCTYPE" && item.value === 31) {
    SREG_NUMBER.required = true;
    if (!SREG_NUMBER.value) {
      SREG_NUMBER.state = false;
    }
    if (SREG_NUMBER.value) {
      SREG_NUMBER.state = true;
    }
  } else {
    SREG_NUMBER.required = false;
    SREG_NUMBER.state = null;
  }

  return data;
}
function initHandler(data) {
  const IDVEHDOCTYPE = data.find((field) => field.name === "IDVEHDOCTYPE");
  const SREG_NUMBER = data.find((field) => field.name === "SREG_NUMBER");
  if (IDVEHDOCTYPE.value !== 31) {
    SREG_NUMBER.required = false;
  }
  return data;
}
export { eventHandler, initHandler };
