const converter = {};

converter.getType = (data) => {
  switch (data) {
    case 0:
      return "string";
    case 1:
      return "string";
    case 2:
      return "text";
    case 14:
      return "timestamp";
    case 16:
      return "boolean";
    default:
      return "string";
  }
};

export default converter;
