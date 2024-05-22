export function dataFromVueComponent(component, property) {
  if (Object.prototype.hasOwnProperty.call(component, property)) {
    if (component[property].slots) {
      const { template } = component[property].slots;
      return { temp: template };
    }
  }
  return false;
}

export function getOptions(param1, param2) {
  if (typeof param1 === "string" && typeof param2 === "object") {
    return {
      msg: param1,
      title: param2?.title,
      img: param2?.icon,
      btnOk: param2?.btnOk,
    };
  }

  if (typeof param1 === "string") {
    return {
      msg: param1,
      img: undefined,
    };
  }

  if (typeof param1 === "object") {
    const component = typeof param1 === "object" ? param1 : param2;
    const template = dataFromVueComponent(component, "$options");
    if (template) {
      return template;
    }
    return {
      msg: param1?.msg ? param1?.msg : "Выполнить действие?",
      img: param1?.icon,
      title: param1?.title,
      btnOk: param1?.btnOk,
    };
  }

  return {
    msg: "Выполнить действие?",
    img: undefined,
  };
}
