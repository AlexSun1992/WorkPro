export async function eventHandler(data, item, callback) {
  const id = data.find((f) => f.name === "ID");
  const program = data.find((f) => f.name === "IDVARIANT_LIST");
  const region = data.find((f) => f.name === "IDPHOLDER_REGION");
  const insured = data.find((f) => f.name === "NCOUNT_INSURED");
  const field = data.find((f) => f.fieldId === item.fieldId);

  if (!field) {
    return data;
  }

  if (field.name === "IDPHOLDER_REGION") {
    if ((region.value === 54 || region.value === 24) && program.value === 8) {
      data.find((f) => f.name === "IDVARIANT_LIST").value = 9;
      const varResponse = await $nuxt.$axios(
        `/api/dicwf/15385045/{id.value}?ID={id.value}&IDPHOLDER_REGION={region.value}`
      );
      const costResponce = await $nuxt.$axios(
        `/api/dicwf/15385051/{id.value}?ID={id.value}&NCOUNT_INSURED={insured.value}&IDVARIANT_LIST={program.value}`
      );
    }
  }
  return data;
}
