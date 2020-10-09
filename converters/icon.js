const converter = {};

converter.icon = (data) => {
  switch (data) {
    case "AG":
      return "fa fa-user";
    case "ПЛЗ":
      return "fa fa-tasks";
    case "TM":
      return "fa fa-medkit";
    default:
      return "";
  }
};

export default converter;
