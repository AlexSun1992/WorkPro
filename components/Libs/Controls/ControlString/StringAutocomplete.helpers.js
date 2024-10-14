// eslint-disable-next-line import/prefer-default-export
export function isFieldNameBelogToAutocomplete(compareName) {
  if (compareName?.includes("ADDRESS")) {
    return true;
  }
  const data = [
    // @TODO перенести поддержку полей в ControlDadataSelect
    // "SFIRSTNAME",
    // "SSECONDNAME",
    // "STHIRDNAME",
    "ADDRESS",
    "SISSUED_WHERE",
    "SDOCDEP",
    "SNEWPHONE",
    "SCODEFIELD",
    "SNEWEMAIL",
  ];

  if (data.includes(compareName)) {
    return true;
  }

  return false;
}
