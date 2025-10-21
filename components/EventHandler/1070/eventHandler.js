import { scrollToCardHead } from "@/utils/scroll";

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  // console.log(JSON.stringify(data))
  //location.href = location.href + '?forceReload' + Date.now();
  const COLLAPSE_DATA = data.find((f) => f.name === "COLLAPSE_DATA");
  const idfran = data.find((f) => f.name === "IDFRAN");

  if (idfran.value) {
    idfran.state = true;
    idfran.error = null;
  }

  return data;
}

export function eventHandler(data, item, callback) {
  const fieldIDFRAN = data.find(({ name }) => name === "IDFRAN");

  const sFRANField = data.find(({ name }) => name === "SFRAN");
  const bSECFRANField = data.find(({ name }) => name === "BSECFRAN");
  const BVARIANTField = data.find(({ name }) => name === "BVARIANT");

  if (fieldIDFRAN.value == 1) {
    data.find((f) => f.name === "BVARIANT").visible = false;
    data.find((f) => f.name === "BVARIANT").value = false;
  }

  if (fieldIDFRAN.value > 1) {
    data.find((f) => f.name === "BVARIANT").visible = true;
  }

  if (fieldIDFRAN.value > 1 && sFRANField.value == "Y") {
    bSECFRANField.visible = true;
    // if  bSECFRANField.value = true {
    // BVARIANTField.value = true;
    // BVARIANTField.readonly = true;

    // } else {
    // BVARIANTField.readonly = false;
    // }

    // bSECFRANField.value = undefined;
    // bSECFRANField.state = null;
  } else {
    bSECFRANField.visible = false;
    bSECFRANField.value = false;
    BVARIANTField.readonly = false;

    // BVARIANTField.readonly = false;

    // BVARIANTField.value = true;
    // bSECFRANField.state = null;
  }

  if (bSECFRANField.value == true) {
    BVARIANTField.value = true;
    BVARIANTField.readonly = true;
  } else {
    BVARIANTField.readonly = false;
  }

  const field = data.find((f) => f.fieldId === item.fieldId);
  const fieldNCOST = data.find(({ name }) => name === "NCOST");
  //const NCOST = fieldNCOST.options[0];
  //console.log(NCOST.value);
  //const INFO_PERIOD = data.find(({ name }) => name === "INFO_PERIOD");
  //console.log(INFO_PERIOD);

  //if (NCOST.value == 0) {
  //data.find((f) => f.name === "SWARNING_INFO").visible = true;
  //}

  // if (NCOST.value > 0) {
  // data.find((f) => f.name === "SWARNING_INFO").visible = false;
  // }

  // fetch('/api/dicwf?timestamp=${Date.now()}', {cache: 'no-store'});
  return data;
}
