export function isFieldNameBelogToAutocomplete(fieldsNameHub, compareName) {
  const isAutocompleteField = fieldsNameHub.find((item) =>
    item.includes(compareName)
  );

  return Boolean(isAutocompleteField);
}
