import { scrollToCardHead } from "@/utils/scroll";

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  const idfran = data.find((f) => f.name === "IDFRAN");

  if (idfran.value) {
    idfran.state = true;
    idfran.error = null;
  }

  return data;
}

export function eventHandler(data, item) {
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
  } else {
    bSECFRANField.visible = false;
    bSECFRANField.value = false;
    BVARIANTField.readonly = false;
  }

  if (bSECFRANField.value == true) {
    BVARIANTField.value = true;
    BVARIANTField.readonly = true;
  } else {
    BVARIANTField.readonly = false;
  }

  return data;
}
