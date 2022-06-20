export function isFieldNameBelogToAutocomplete(compareName) {
  const data = [
    "SFIRSTNAME",
    "SSECONDNAME",
    "STHIRDNAME",
    "ADDRESS",
    "SISSUED_WHERE",
    "SDOCDEP",
    "SNEWPHONE",
    "SCODEFIELD",
    "SNEWEMAIL",
  ];
  const isAutocompleteField = data.find((item) => item === compareName);

  return Boolean(isAutocompleteField);
}
