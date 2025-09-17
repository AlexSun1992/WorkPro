function findField(name, data) {
  return data.find((f) => f.name === name);
}
function fieldsOff(field) {
  field.visible = false;
  field.value = false;
}
function fieldsOn(field) {
  field.visible = true;
}

export async function eventHandler(data, item, callback) {
  const polisyVariantFieldValue = JSON.parse(findField("IDPOLICYVARIANT", data).value);
  // раскомментировать после переноса франшизы со 2 случая
  // const sFRANField = findField("SFRAN", data);
  // const bSECFRANField = findField("BSECFRAN", data);

  // if (polisyVariantFieldValue.IDFRNANCHISE != null && sFRANField.value === "Y") {
  // fieldsOn(bSECFRANField);
  // } else {
  // fieldsOff(bSECFRANField);
  // }

  return data;
}

export function initHandler(data) {
  //console.log(JSON.stringify(data))
  //const IMSOPTIONS = data.find((f) => f.name === "IMSOPTIONS");
  //console.log(IMSOPTIONS);
  //console.log(IMSOPTIONS.value);

  const polisyVariantFieldValue = JSON.parse(findField("IDPOLICYVARIANT", data).value);
  // раскомментировать после переноса франшизы со 2 случая
  //const sFRANField = findField("SFRAN", data);
  //const bSECFRANField = findField("BSECFRAN", data);

  //if (polisyVariantFieldValue.IDFRNANCHISE != null && sFRANField.value === "Y") {
  //fieldsOn(bSECFRANField);
  //} else {
  //fieldsOff(bSECFRANField);
  //}

  return data;
}
