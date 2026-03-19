export function eventHandler(data, item) {
  data.find((f) => f.name === "IDVEHICLE_CASCO").visible = false;

  const SREGNUM = data.find(({ name }) => name === "SREGNUM");

  const IDVEHICLEPOLICY = data.find(({ name }) => name === "IDVEHICLE_POLICY");

  if (item.name === "IDVEHICLE_POLICY") {
    console.log(SREGNUM, "SREGNUM");
    IDVEHICLEPOLICY.value = item.value;
    SREGNUM.value = null;
  }
  if (
    item.name === "SREGNUM" &&
    SREGNUM.value !== "" &&
    SREGNUM.value !== "N" &&
    (SREGNUM.value?.length === 8 || SREGNUM.value?.length === 9)
  ) {
    IDVEHICLEPOLICY.value = null;
    SREGNUM.value = item.value;
  }

  const IDVEHICLE_CASCO = data.find(({ name }) => name === "IDVEHICLE_CASCO");
  const NLASTPOLICY_RESO = data.find((f) => f.name === "NLASTPOLICY_RESO");

  if (item.name === "NLASTPOLICY_RESO" && item.value === "") {
    NLASTPOLICY_RESO.state = null;
    NLASTPOLICY_RESO.error = null;
  }

  // Поля в случае, когда есть полис в РЕСО
  const fieldBPREVPOLICY = data.find(({ name }) => name === "BPREVPOLICY");
  const fieldIVEHICLECASCO = data.find(({ name }) => name === "IDVEHICLE_CASCO");
  const fieldSCHOOSELASTPOLICY = data.find(({ name }) => name === "SCHOOSELASTPOLICY");

  if (fieldBPREVPOLICY.value == 2) {
    IDVEHICLE_CASCO.visible = true;

    if (
      IDVEHICLE_CASCO?.value === 1 ||
      (IDVEHICLE_CASCO.options?.length === 1 && IDVEHICLE_CASCO.options[0].value === 1)
    ) {
      IDVEHICLE_CASCO.visible = IDVEHICLE_CASCO.options?.length > 1;
      NLASTPOLICY_RESO.visible = true;
    } else {
      NLASTPOLICY_RESO.value = "";
      NLASTPOLICY_RESO.visible = false;
      NLASTPOLICY_RESO.state = null;
      NLASTPOLICY_RESO.error = null;
    }
    data.find((f) => f.name === "SREGNUMTITLE").visible = false;
    data.find((f) => f.name === "IDVEHICLE_POLICY").visible = false;
    data.find((f) => f.name === "IDCURRENT_INSURANCE").visible = false;
    data.find((f) => f.name === "DTO_DATE_LAST").visible = false;
    data.find((f) => f.name === "NLASTPOLICY").visible = false;
    data.find((f) => f.name === "SCHOOSELASTPOLICY").visible = true;
    data.find((f) => f.name === "SREGNUM").visible = false;
    data.find((f) => f.name === "SLASTPOLICY").visible = false;
    data.find((f) => f.name === "SREGNUM_OTHER").visible = false;
    data.find((f) => f.name === "Continue").visible = false;
    data.find((f) => f.name === "Item47600").visible = true;

    if (!fieldIVEHICLECASCO.options || fieldIVEHICLECASCO.options?.length === 0) {
      fieldSCHOOSELASTPOLICY.visible = false;
    }
  }

  if (fieldBPREVPOLICY.value == 3) {
    data.find((f) => f.name === "SREGNUMTITLE").visible = false;
    data.find((f) => f.name === "IDVEHICLE_POLICY").visible = false;
    data.find((f) => f.name === "IDVEHICLE_CASCO").visible = false;
    data.find((f) => f.name === "IDCURRENT_INSURANCE").visible = true;
    data.find((f) => f.name === "DTO_DATE_LAST").visible = true;
    data.find((f) => f.name === "NLASTPOLICY").visible = false;
    data.find((f) => f.name === "NLASTPOLICY_RESO").visible = false;
    data.find((f) => f.name === "SCHOOSELASTPOLICY").visible = false;
    data.find((f) => f.name === "SREGNUM").visible = false;
    data.find((f) => f.name === "SLASTPOLICY").visible = true;
    data.find((f) => f.name === "SREGNUM").visible = false;
    data.find((f) => f.name === "SREGNUM_OTHER").visible = true;
    data.find((f) => f.name === "Continue").visible = true;
    data.find((f) => f.name === "Item47600").visible = false;
  }

  if (fieldBPREVPOLICY.value == 1) {
    data.find((f) => f.name === "SREGNUMTITLE").visible = true;
    data.find((f) => f.name === "IDVEHICLE_POLICY").visible = true;
    data.find((f) => f.name === "IDVEHICLE_CASCO").visible = false;
    data.find((f) => f.name === "SREGNUM").visible = true;
    data.find((f) => f.name === "SLASTPOLICY").visible = false;
    data.find((f) => f.name === "NLASTPOLICY").visible = false;
    data.find((f) => f.name === "NLASTPOLICY_RESO").visible = false;
    data.find((f) => f.name === "IDCURRENT_INSURANCE").visible = false;
    data.find((f) => f.name === "DTO_DATE_LAST").visible = false;
    data.find((f) => f.name === "SCHOOSELASTPOLICY").visible = false;
    data.find((f) => f.name === "SREGNUM_OTHER").visible = false;
    data.find((f) => f.name === "Continue").visible = true;
    data.find((f) => f.name === "Item47600").visible = false;
  }

  return data;
}

export function initHandler(data) {
  const fieldBPREVPOLICY = data.find(({ name }) => name === "BPREVPOLICY");
  const lastpolicy_reso = data.find((f) => f.name === "NLASTPOLICY_RESO");

  if (lastpolicy_reso.value) {
    lastpolicy_reso.state = true;
    lastpolicy_reso.error = null;
  }

  if (fieldBPREVPOLICY.value == 1) {
    data.find((f) => f.name === "Continue").visible = true;
    data.find((f) => f.name === "Item47600").visible = false;
  }

  return data;
}
