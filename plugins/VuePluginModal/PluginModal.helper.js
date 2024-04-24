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
      img: param2?.icon,
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
      msg: "Выполнить действие?",
      img: param1?.icon,
    };
  }

  return {
    msg: "Выполнить действие?",
    img: undefined,
  };
}
