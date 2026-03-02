function eventHandler(data, item) {
  const field = data.find((f) => f.fieldId === item.fieldId);
  if (field.name === "BPH_INS") {
    data.find((f) => f.name === "ITEM_Devider_insured").visible = !item.value;
    data.find((f) => f.name === "FKIDINSURED").visible = !item.value;
    data.find((f) => f.name === "SINSURED_SECONDNAME").visible = !item.value;
    data.find((f) => f.name === "SINSURED_FIRSTNAME").visible = !item.value;
    data.find((f) => f.name === "SINSURED_THIRDNAME").visible = !item.value;
    data.find((f) => f.name === "DINSURED_BIRTHDATE").visible = !item.value;
    data.find((f) => f.name === "BINSURED_SEX").visible = !item.value;
    data.find((f) => f.name === "IDINSURED_COUNTRY").visible = !item.value;
    data.find((f) => f.name === "IDINSURED_DOCTYPE").visible = !item.value;
    data.find((f) => f.name === "SINSURED_SERIES").visible = !item.value;
    data.find((f) => f.name === "SINSURED_PNUMBER").visible = !item.value;
    data.find((f) => f.name === "DINSURED_ISSUED_WHEN").visible = !item.value;
    data.find((f) => f.name === "SINSURED_ISSUED_WHERE").visible = !item.value;
    data.find((f) => f.name === "SINSURED_DOCDEP").visible = !item.value;
    data.find((f) => f.name === "SFULLINSURED_ADDRESS").visible = !item.value;
    data.find((f) => f.name === "SINSURED_BORNPLACE").visible = !item.value;
    data.find((f) => f.name === "SINSURED_PHONE").visible = !item.value;
    data.find((f) => f.name === "SINSURED_EMAIL").visible = !item.value;
    return data;
  }
}
