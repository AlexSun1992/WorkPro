import { scrollToCardHead } from "@/utils/scroll";

import { findField } from "@/components/EventHandler/helpers";

function toggleField(field, state) {
  if (!field) {
    console.error(`fieldsOff. Поле ${field} не найдено в данных`);
    return;
  }
  if (state) {
    field.visible = true;
  } else {
    field.visible = false;
    field.value = false;
  }
}

export async function eventHandler(data, item) {
  let policyVariantFieldValue;
  try {
    policyVariantFieldValue = JSON.parse(findField(data, "IDPOLICYVARIANT_NEW").value);
  } catch (e) {
    policyVariantFieldValue = {};
    console.log("неверный формат поля IDPOLICYVARIANT_NEW", findField(data, "IDPOLICYVARIANT_NEW")?.value);
  }
  const sFRANField = findField(data, "SFRAN");
  const bSECFRANField = findField(data, "BSECFRAN");

  const field = data.find((f) => f.fieldId === item?.fieldId);

  if (policyVariantFieldValue?.IDFRNANCHISE != null && sFRANField?.value === "Y") {
    toggleField(bSECFRANField, true);
  } else {
    toggleField(bSECFRANField, false);
  }

  if (field?.name === "SADDRESS") {
    if (item.value?.data?.fias_level?.substring(0, 1) === null) {
      field.error = "Необходимо выбрать адрес из выпадающего списка";
      field.state = false;
    } else if (item.value?.data?.flat === null) {
      field.error = "Адрес следует указать с точностью до квартиры";
      field.state = false;
    } else {
      field.state = true;
      field.error = null;
    }
  }

  return data;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  const guid = findField(data, "SGUID");

  if (guid?.value) {
    sessionStorage.setItem("PHONE_VERIFICATED_GUID", guid.value);
  }

  let policyVariantFieldValue;
  try {
    policyVariantFieldValue = JSON.parse(findField(data, "IDPOLICYVARIANT_NEW").value);
  } catch (e) {
    policyVariantFieldValue = {};
    console.log("неверный формат поля IDPOLICYVARIANT_NEW", findField(data, "IDPOLICYVARIANT_NEW")?.value);
  }
  const sFRANField = findField(data, "SFRAN");
  const bSECFRANField = findField(data, "BSECFRAN");

  if (policyVariantFieldValue.IDFRNANCHISE != null && sFRANField.value === "Y") {
    toggleField(bSECFRANField, true);
  } else {
    toggleField(bSECFRANField, false);
  }

  return data;
}
